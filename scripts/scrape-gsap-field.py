#!/usr/bin/env python3
"""
Web scraper to analyze GSAP motion patterns from the-gsap-field.webflow.io
This script will extract HTML structure, CSS, and JavaScript to understand
the actual motion implementation rather than guessing.
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import os
from urllib.parse import urljoin, urlparse
import time

class GSAPFieldScraper:
    def __init__(self, base_url="https://the-gsap-field.webflow.io/"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.analysis = {
            'html_structure': {},
            'css_animations': {},
            'javascript_code': {},
            'gsap_patterns': {},
            'motion_analysis': {},
            'assets': []
        }
    
    def scrape_main_page(self):
        """Scrape the main page HTML and extract key information"""
        print("🔍 Scraping main page...")
        
        try:
            response = self.session.get(self.base_url)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract HTML structure
            self.analysis['html_structure'] = {
                'title': soup.title.string if soup.title else '',
                'sections': [],
                'animations_elements': [],
                'data_attributes': []
            }
            
            # Find sections and key structural elements
            sections = soup.find_all(['section', 'div'], class_=re.compile(r'section|container|wrapper'))
            for section in sections:
                section_info = {
                    'tag': section.name,
                    'classes': section.get('class', []),
                    'id': section.get('id', ''),
                    'data_attributes': {k: v for k, v in section.attrs.items() if k.startswith('data-')},
                    'children_count': len(section.find_all())
                }
                self.analysis['html_structure']['sections'].append(section_info)
            
            # Find elements that likely have animations
            animated_elements = soup.find_all(attrs={'data-w-tab': True}) + \
                              soup.find_all(attrs={'data-animation': True}) + \
                              soup.find_all(class_=re.compile(r'animate|motion|gsap|scroll'))
            
            for elem in animated_elements:
                elem_info = {
                    'tag': elem.name,
                    'classes': elem.get('class', []),
                    'id': elem.get('id', ''),
                    'data_attributes': {k: v for k, v in elem.attrs.items() if k.startswith('data-')},
                    'text_content': elem.get_text()[:100] + '...' if len(elem.get_text()) > 100 else elem.get_text()
                }
                self.analysis['html_structure']['animations_elements'].append(elem_info)
            
            print(f"✅ Found {len(sections)} sections and {len(animated_elements)} potential animation elements")
            return soup
            
        except Exception as e:
            print(f"❌ Error scraping main page: {e}")
            return None
    
    def extract_javascript(self, soup):
        """Extract and analyze JavaScript code, focusing on GSAP"""
        print("🔍 Extracting JavaScript code...")
        
        # Find all script tags
        scripts = soup.find_all('script')
        
        gsap_patterns = []
        webflow_patterns = []
        custom_animations = []
        
        for script in scripts:
            if script.src:
                # External script
                script_url = urljoin(self.base_url, script.src)
                script_info = {
                    'type': 'external',
                    'src': script_url,
                    'is_gsap': 'gsap' in script_url.lower(),
                    'is_webflow': 'webflow' in script_url.lower()
                }
                
                # Try to fetch external scripts
                try:
                    if script_info['is_gsap'] or script_info['is_webflow']:
                        time.sleep(0.5)  # Be respectful
                        js_response = self.session.get(script_url, timeout=10)
                        if js_response.status_code == 200:
                            script_info['content'] = js_response.text
                            
                            # Look for GSAP patterns
                            gsap_matches = re.findall(r'gsap\.[^;]+;|ScrollTrigger\.[^;]+;|timeline\.[^;]+;', js_response.text, re.IGNORECASE)
                            if gsap_matches:
                                gsap_patterns.extend(gsap_matches)
                                
                except Exception as e:
                    print(f"⚠️  Could not fetch external script {script_url}: {e}")
                    script_info['content'] = f"Could not fetch: {e}"
                
                self.analysis['javascript_code'][f'external_{len(self.analysis["javascript_code"])}'] = script_info
                
            elif script.string:
                # Inline script
                script_content = script.string
                
                # Look for GSAP patterns in inline scripts
                gsap_matches = re.findall(r'gsap\.[^;]+;|ScrollTrigger\.[^;]+;|timeline\.[^;]+;', script_content, re.IGNORECASE)
                if gsap_matches:
                    gsap_patterns.extend(gsap_matches)
                
                # Look for animation-related functions
                animation_matches = re.findall(r'function\s+\w*[Aa]nimat\w*[^{]*{[^}]+}', script_content, re.DOTALL)
                if animation_matches:
                    custom_animations.extend(animation_matches)
                
                script_info = {
                    'type': 'inline',
                    'content': script_content,
                    'has_gsap': bool(gsap_matches),
                    'has_animations': bool(animation_matches),
                    'length': len(script_content)
                }
                
                self.analysis['javascript_code'][f'inline_{len(self.analysis["javascript_code"])}'] = script_info
        
        # Store patterns for analysis
        self.analysis['gsap_patterns'] = {
            'gsap_calls': list(set(gsap_patterns)),
            'custom_animations': list(set(custom_animations)),
            'total_gsap_calls': len(gsap_patterns)
        }
        
        print(f"✅ Found {len(gsap_patterns)} GSAP calls and {len(custom_animations)} custom animations")
    
    def extract_css(self, soup):
        """Extract CSS that might contain animation-related styles"""
        print("🔍 Extracting CSS...")
        
        # Find all style tags and link tags
        styles = soup.find_all('style')
        links = soup.find_all('link', rel='stylesheet')
        
        css_animations = {}
        
        # Process inline styles
        for i, style in enumerate(styles):
            if style.string:
                content = style.string
                
                # Look for animation-related CSS
                animation_patterns = re.findall(r'@keyframes[^{]+{[^}]+}|animation:[^;]+;|transform:[^;]+;|transition:[^;]+;', content, re.IGNORECASE)
                
                css_animations[f'inline_style_{i}'] = {
                    'type': 'inline',
                    'content': content,
                    'animations': animation_patterns,
                    'length': len(content)
                }
        
        # Process external stylesheets (just log them, don't fetch all)
        for i, link in enumerate(links):
            href = link.get('href')
            if href:
                css_url = urljoin(self.base_url, href)
                css_animations[f'external_css_{i}'] = {
                    'type': 'external',
                    'href': css_url,
                    'is_webflow': 'webflow' in css_url.lower()
                }
        
        self.analysis['css_animations'] = css_animations
        print(f"✅ Found {len(styles)} inline styles and {len(links)} external stylesheets")
    
    def analyze_motion_patterns(self):
        """Analyze the extracted data to identify motion patterns"""
        print("🔍 Analyzing motion patterns...")
        
        motion_analysis = {
            'loading_animations': [],
            'scroll_triggers': [],
            'hover_effects': [],
            'timeline_animations': [],
            'layout_patterns': [],
            'key_findings': []
        }
        
        # Analyze GSAP patterns
        gsap_calls = self.analysis['gsap_patterns']['gsap_calls']
        
        for call in gsap_calls:
            call_lower = call.lower()
            
            if 'scrolltrigger' in call_lower:
                motion_analysis['scroll_triggers'].append(call)
            elif 'timeline' in call_lower:
                motion_analysis['timeline_animations'].append(call)
            elif 'hover' in call_lower or 'mouseenter' in call_lower:
                motion_analysis['hover_effects'].append(call)
            elif 'load' in call_lower or 'ready' in call_lower:
                motion_analysis['loading_animations'].append(call)
        
        # Analyze HTML structure for layout patterns
        sections = self.analysis['html_structure']['sections']
        
        layout_patterns = {
            'circular_layouts': 0,
            'grid_layouts': 0,
            'scroll_sections': 0,
            'tab_systems': 0
        }
        
        for section in sections:
            classes = ' '.join(section['classes']).lower()
            
            if 'circle' in classes or 'radial' in classes:
                layout_patterns['circular_layouts'] += 1
            if 'grid' in classes:
                layout_patterns['grid_layouts'] += 1
            if 'scroll' in classes or 'section' in classes:
                layout_patterns['scroll_sections'] += 1
            if 'tab' in classes or section.get('data_attributes', {}).get('data-w-tab'):
                layout_patterns['tab_systems'] += 1
        
        motion_analysis['layout_patterns'] = layout_patterns
        
        # Key findings
        key_findings = []
        
        if motion_analysis['scroll_triggers']:
            key_findings.append(f"Uses {len(motion_analysis['scroll_triggers'])} ScrollTrigger animations")
        
        if motion_analysis['timeline_animations']:
            key_findings.append(f"Uses {len(motion_analysis['timeline_animations'])} timeline animations")
        
        if layout_patterns['circular_layouts'] > 0:
            key_findings.append(f"Has {layout_patterns['circular_layouts']} circular/radial layouts")
        
        if layout_patterns['tab_systems'] > 0:
            key_findings.append(f"Uses {layout_patterns['tab_systems']} tab systems")
        
        motion_analysis['key_findings'] = key_findings
        
        self.analysis['motion_analysis'] = motion_analysis
        print(f"✅ Identified {len(key_findings)} key motion patterns")
    
    def save_analysis(self, filename='gsap_field_analysis.json'):
        """Save the complete analysis to a JSON file"""
        output_path = os.path.join(os.path.dirname(__file__), filename)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(self.analysis, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Analysis saved to {output_path}")
            return output_path
            
        except Exception as e:
            print(f"❌ Error saving analysis: {e}")
            return None
    
    def print_summary(self):
        """Print a summary of findings"""
        print("\n" + "="*60)
        print("🎯 GSAP FIELD SITE ANALYSIS SUMMARY")
        print("="*60)
        
        # HTML Structure
        html = self.analysis['html_structure']
        print(f"\n📋 HTML Structure:")
        print(f"   • Sections: {len(html['sections'])}")
        print(f"   • Animation elements: {len(html['animations_elements'])}")
        
        # JavaScript
        js = self.analysis['javascript_code']
        gsap = self.analysis['gsap_patterns']
        print(f"\n🔧 JavaScript:")
        print(f"   • Script tags: {len(js)}")
        print(f"   • GSAP calls: {gsap['total_gsap_calls']}")
        print(f"   • Custom animations: {len(gsap['custom_animations'])}")
        
        # Motion Analysis
        motion = self.analysis['motion_analysis']
        print(f"\n🎬 Motion Patterns:")
        for finding in motion['key_findings']:
            print(f"   • {finding}")
        
        print(f"\n📊 Layout Patterns:")
        for pattern, count in motion['layout_patterns'].items():
            if count > 0:
                print(f"   • {pattern.replace('_', ' ').title()}: {count}")
        
        print(f"\n🎯 Key GSAP Calls (first 5):")
        for i, call in enumerate(gsap['gsap_calls'][:5]):
            print(f"   {i+1}. {call[:80]}{'...' if len(call) > 80 else ''}")
        
        print("\n" + "="*60)

def main():
    print("🚀 Starting GSAP Field Site Analysis...")
    
    scraper = GSAPFieldScraper()
    
    # Step 1: Scrape main page
    soup = scraper.scrape_main_page()
    if not soup:
        print("❌ Failed to scrape main page. Exiting.")
        return
    
    # Step 2: Extract JavaScript
    scraper.extract_javascript(soup)
    
    # Step 3: Extract CSS
    scraper.extract_css(soup)
    
    # Step 4: Analyze patterns
    scraper.analyze_motion_patterns()
    
    # Step 5: Save and summarize
    scraper.save_analysis()
    scraper.print_summary()
    
    print("\n✅ Analysis complete! Check gsap_field_analysis.json for full details.")

if __name__ == "__main__":
    main()