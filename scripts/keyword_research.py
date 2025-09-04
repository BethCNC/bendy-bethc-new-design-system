#!/usr/bin/env python3
"""
Keyword Research Script for Health Journey Website
Targets EDS, MCAS, and chronic illness content optimization

This script automates seed-based keyword research using Keywords Everywhere API
to identify high-value keywords for content creation and SEO optimization.
"""

import requests
import pandas as pd
import time
import json
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass
from pathlib import Path
import os
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('keyword_research.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class KeywordData:
    """Data class for storing keyword research results"""
    seed_keyword: str
    related_keyword: str
    volume: int
    difficulty: Optional[int] = None
    cpc: Optional[float] = None
    keyword_type: str = "related"
    source: str = "keywords_everywhere"

class KeywordResearchAPI:
    """Base class for keyword research API interactions"""
    
    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def _make_request(self, endpoint: str, params: Dict, max_retries: int = 3) -> Optional[Dict]:
        """Make API request with retry logic and rate limiting"""
        for attempt in range(max_retries):
            try:
                response = self.session.get(
                    f"{self.base_url}{endpoint}",
                    params=params,
                    timeout=30
                )
                response.raise_for_status()
                
                # Rate limiting - wait if needed
                if response.status_code == 429:
                    wait_time = int(response.headers.get('Retry-After', 60))
                    logger.warning(f"Rate limited. Waiting {wait_time} seconds...")
                    time.sleep(wait_time)
                    continue
                
                return response.json()
                
            except requests.exceptions.RequestException as e:
                logger.error(f"Request failed (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt < max_retries - 1:
                    time.sleep(2 ** attempt)  # Exponential backoff
                else:
                    logger.error(f"Max retries exceeded for endpoint: {endpoint}")
                    return None
        
        return None

class KeywordsEverywhereAPI(KeywordResearchAPI):
    """Keywords Everywhere API implementation"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "https://api.keywordseverywhere.com/v1")
    
    def get_keyword_data(self, seed_keyword: str) -> List[KeywordData]:
        """
        Fetch keyword data for a seed keyword including related keywords and PAA
        
        Args:
            seed_keyword: The seed keyword to research
            
        Returns:
            List of KeywordData objects with research results
        """
        results = []
        
        # Get related keywords
        related_data = self._get_related_keywords(seed_keyword)
        if related_data:
            results.extend(related_data)
        
        # Get People Also Ask questions
        paa_data = self._get_people_also_ask(seed_keyword)
        if paa_data:
            results.extend(paa_data)
        
        return results
    
    def _get_related_keywords(self, seed_keyword: str) -> List[KeywordData]:
        """Fetch related keywords for a seed keyword"""
        params = {
            'keyword': seed_keyword,
            'country': 'us',
            'dataSource': 'gkp'
        }
        
        data = self._make_request('/get_related_keywords', params)
        if not data or 'data' not in data:
            logger.warning(f"No related keywords data for: {seed_keyword}")
            return []
        
        results = []
        for item in data['data']:
            try:
                keyword_data = KeywordData(
                    seed_keyword=seed_keyword,
                    related_keyword=item.get('keyword', ''),
                    volume=item.get('vol', 0),
                    difficulty=item.get('difficulty', None),
                    cpc=item.get('cpc', None),
                    keyword_type="related"
                )
                results.append(keyword_data)
            except Exception as e:
                logger.error(f"Error parsing related keyword data: {e}")
        
        logger.info(f"Found {len(results)} related keywords for: {seed_keyword}")
        return results
    
    def _get_people_also_ask(self, seed_keyword: str) -> List[KeywordData]:
        """Fetch People Also Ask questions for a seed keyword"""
        params = {
            'keyword': seed_keyword,
            'country': 'us'
        }
        
        data = self._make_request('/get_questions', params)
        if not data or 'data' not in data:
            logger.warning(f"No PAA data for: {seed_keyword}")
            return []
        
        results = []
        for item in data['data']:
            try:
                keyword_data = KeywordData(
                    seed_keyword=seed_keyword,
                    related_keyword=item.get('question', ''),
                    volume=item.get('vol', 0),
                    difficulty=item.get('difficulty', None),
                    cpc=item.get('cpc', None),
                    keyword_type="paa"
                )
                results.append(keyword_data)
            except Exception as e:
                logger.error(f"Error parsing PAA data: {e}")
        
        logger.info(f"Found {len(results)} PAA questions for: {seed_keyword}")
        return results

class SerpAPI(KeywordResearchAPI):
    """SerpAPI implementation as fallback"""
    
    def __init__(self, api_key: str):
        super().__init__(api_key, "https://serpapi.com/search")
    
    def get_keyword_data(self, seed_keyword: str) -> List[KeywordData]:
        """Fetch keyword data using SerpAPI (limited functionality)"""
        params = {
            'q': seed_keyword,
            'api_key': self.api_key,
            'engine': 'google',
            'num': 100
        }
        
        data = self._make_request('', params)
        if not data:
            return []
        
        results = []
        
        # Extract related searches
        if 'related_searches' in data:
            for item in data['related_searches']:
                keyword_data = KeywordData(
                    seed_keyword=seed_keyword,
                    related_keyword=item.get('query', ''),
                    volume=0,  # SerpAPI doesn't provide volume
                    keyword_type="related",
                    source="serpapi"
                )
                results.append(keyword_data)
        
        # Extract People Also Ask
        if 'related_questions' in data:
            for item in data['related_questions']:
                keyword_data = KeywordData(
                    seed_keyword=seed_keyword,
                    related_keyword=item.get('question', ''),
                    volume=0,
                    keyword_type="paa",
                    source="serpapi"
                )
                results.append(keyword_data)
        
        return results

def load_seed_keywords(file_path: Optional[str] = None) -> List[str]:
    """
    Load seed keywords from file or return default list
    
    Args:
        file_path: Path to text file with seed keywords (one per line)
        
    Returns:
        List of seed keywords
    """
    if file_path and Path(file_path).exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            keywords = [line.strip() for line in f if line.strip()]
        logger.info(f"Loaded {len(keywords)} seed keywords from {file_path}")
        return keywords
    
    # Default seed keywords for EDS, MCAS, and chronic illness
    default_keywords = [
        # EDS Keywords
        "Ehlers-Danlos Syndrome",
        "living with EDS",
        "EDS symptoms",
        "EDS diagnosis",
        "hypermobile EDS",
        "EDS treatment",
        "EDS pain management",
        "EDS physical therapy",
        "EDS genetic testing",
        "EDS specialist",
        
        # MCAS Keywords
        "Mast Cell Activation Syndrome",
        "MCAS symptoms",
        "MCAS treatment",
        "MCAS diagnosis",
        "MCAS diet",
        "MCAS triggers",
        "MCAS medication",
        "MCAS specialist",
        "MCAS testing",
        "MCAS flare",
        
        # POTS Keywords
        "POTS syndrome",
        "POTS symptoms",
        "POTS treatment",
        "POTS diagnosis",
        "POTS exercise",
        "POTS diet",
        "POTS medication",
        "POTS specialist",
        "POTS testing",
        "POTS management",
        
        # Chronic Illness Keywords
        "chronic illness journey",
        "living with chronic illness",
        "chronic pain management",
        "invisible illness",
        "chronic illness support",
        "chronic illness blog",
        "chronic illness community",
        "chronic illness tips",
        "chronic illness resources",
        "chronic illness advocacy",
        
        # Specific Health Journey Keywords
        "health journey blog",
        "medical journey",
        "patient advocacy",
        "healthcare navigation",
        "medical records organization",
        "health timeline",
        "medical history",
        "patient empowerment",
        "health documentation",
        "medical appointment preparation"
    ]
    
    logger.info(f"Using {len(default_keywords)} default seed keywords")
    return default_keywords

def save_to_csv(data: List[KeywordData], output_path: str = "keyword_research.csv") -> None:
    """
    Save keyword research data to CSV file
    
    Args:
        data: List of KeywordData objects
        output_path: Path to output CSV file
    """
    if not data:
        logger.warning("No data to save")
        return
    
    # Convert to DataFrame
    df_data = []
    for item in data:
        df_data.append({
            'seed_keyword': item.seed_keyword,
            'related_keyword': item.related_keyword,
            'volume': item.volume,
            'difficulty': item.difficulty,
            'cpc': item.cpc,
            'keyword_type': item.keyword_type,
            'source': item.source
        })
    
    df = pd.DataFrame(df_data)
    
    # Sort by volume (descending) and seed keyword
    df = df.sort_values(['seed_keyword', 'volume'], ascending=[True, False])
    
    # Save to CSV
    df.to_csv(output_path, index=False, encoding='utf-8')
    logger.info(f"Saved {len(data)} keyword records to {output_path}")
    
    # Print summary statistics
    print(f"\n📊 Keyword Research Summary:")
    print(f"Total keywords analyzed: {len(data)}")
    print(f"Unique seed keywords: {df['seed_keyword'].nunique()}")
    print(f"Average search volume: {df['volume'].mean():.0f}")
    print(f"Keywords with volume > 1000: {len(df[df['volume'] > 1000])}")
    print(f"Keywords with volume > 10000: {len(df[df['volume'] > 10000])}")

def analyze_keyword_clusters(data: List[KeywordData]) -> Dict[str, List[str]]:
    """
    Analyze and cluster keywords by intent and topic
    
    Args:
        data: List of KeywordData objects
        
    Returns:
        Dictionary of clusters with keyword lists
    """
    clusters = {
        'diagnosis': [],
        'symptoms': [],
        'treatment': [],
        'management': [],
        'support': [],
        'resources': [],
        'journey': []
    }
    
    # Define keyword patterns for clustering
    patterns = {
        'diagnosis': ['diagnosis', 'testing', 'genetic', 'specialist', 'doctor'],
        'symptoms': ['symptoms', 'signs', 'flare', 'pain', 'fatigue'],
        'treatment': ['treatment', 'medication', 'therapy', 'cure', 'medication'],
        'management': ['management', 'coping', 'tips', 'strategies', 'lifestyle'],
        'support': ['support', 'community', 'group', 'help', 'advocacy'],
        'resources': ['resources', 'information', 'guide', 'blog', 'website'],
        'journey': ['journey', 'story', 'experience', 'living with', 'my']
    }
    
    for item in data:
        keyword_lower = item.related_keyword.lower()
        
        # Assign to cluster based on keyword content
        assigned = False
        for cluster, pattern_list in patterns.items():
            if any(pattern in keyword_lower for pattern in pattern_list):
                clusters[cluster].append(item.related_keyword)
                assigned = True
                break
        
        # Default to 'resources' if no pattern matches
        if not assigned:
            clusters['resources'].append(item.related_keyword)
    
    return clusters

def print_cluster_analysis(clusters: Dict[str, List[str]]) -> None:
    """Print analysis of keyword clusters"""
    print(f"\n🎯 Keyword Cluster Analysis:")
    for cluster, keywords in clusters.items():
        print(f"\n{cluster.title()} ({len(keywords)} keywords):")
        # Show top 5 keywords by length (proxy for specificity)
        top_keywords = sorted(keywords, key=len, reverse=True)[:5]
        for keyword in top_keywords:
            print(f"  • {keyword}")

def main():
    """Main execution function"""
    print("🔍 Starting Keyword Research for Health Journey Website")
    print("=" * 60)
    
    # Configuration
    api_key = os.getenv('KEYWORDS_EVERYWHERE_API_KEY')
    if not api_key:
        logger.error("KEYWORDS_EVERYWHERE_API_KEY environment variable not set")
        print("Please set your API key: export KEYWORDS_EVERYWHERE_API_KEY='your_key_here'")
        return
    
    # Initialize API client
    try:
        api_client = KeywordsEverywhereAPI(api_key)
        logger.info("Initialized Keywords Everywhere API client")
    except Exception as e:
        logger.error(f"Failed to initialize API client: {e}")
        return
    
    # Load seed keywords
    seed_keywords = load_seed_keywords("seed_keywords.txt")
    
    # Collect all keyword data
    all_data = []
    
    for i, seed in enumerate(seed_keywords, 1):
        print(f"\n📝 Processing {i}/{len(seed_keywords)}: {seed}")
        
        try:
            keyword_data = api_client.get_keyword_data(seed)
            all_data.extend(keyword_data)
            
            # Rate limiting - be respectful to the API
            time.sleep(1)
            
        except Exception as e:
            logger.error(f"Error processing seed keyword '{seed}': {e}")
            continue
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"keyword_research_{timestamp}.csv"
    save_to_csv(all_data, output_file)
    
    # Analyze clusters
    clusters = analyze_keyword_clusters(all_data)
    print_cluster_analysis(clusters)
    
    # Save cluster analysis
    cluster_file = f"keyword_clusters_{timestamp}.json"
    with open(cluster_file, 'w', encoding='utf-8') as f:
        json.dump(clusters, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Keyword research complete!")
    print(f"📁 Results saved to: {output_file}")
    print(f"📁 Clusters saved to: {cluster_file}")
    
    # Next steps recommendations
    print(f"\n🚀 Next Steps:")
    print(f"1. Review high-volume keywords (>1000 searches/month)")
    print(f"2. Focus on low-competition, high-volume opportunities")
    print(f"3. Create content clusters around identified topics")
    print(f"4. Use PAA questions for FAQ content")
    print(f"5. Consider long-tail keywords for specific conditions")

if __name__ == "__main__":
    main() 