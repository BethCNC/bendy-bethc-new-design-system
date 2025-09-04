#!/usr/bin/env python3
"""
Demo Keyword Research Script for Health Journey Website
This version runs without API keys to demonstrate functionality
"""

import pandas as pd
import json
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass
from pathlib import Path
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('keyword_research_demo.log'),
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
    source: str = "demo_data"

def load_seed_keywords(file_path: Optional[str] = None) -> List[str]:
    """Load seed keywords from file or return default list"""
    if file_path and Path(file_path).exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            keywords = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        logger.info(f"Loaded {len(keywords)} seed keywords from {file_path}")
        return keywords
    
    # Default seed keywords for EDS, MCAS, and chronic illness
    default_keywords = [
        "Ehlers-Danlos Syndrome",
        "living with EDS", 
        "EDS symptoms",
        "MCAS treatment",
        "POTS syndrome",
        "chronic illness journey"
    ]
    
    logger.info(f"Using {len(default_keywords)} default seed keywords")
    return default_keywords

def generate_mock_keyword_data(seed_keyword: str) -> List[KeywordData]:
    """Generate realistic mock keyword data for demonstration"""
    
    # Mock data patterns based on real keyword research
    mock_patterns = {
        "Ehlers-Danlos Syndrome": [
            ("EDS symptoms", 12000, 45, 2.50),
            ("EDS diagnosis", 8900, 52, 3.20),
            ("hypermobile EDS", 5400, 38, 2.80),
            ("EDS treatment", 7600, 48, 2.90),
            ("EDS pain management", 3200, 35, 2.10),
            ("What is EDS?", 1800, 28, 1.80),
            ("EDS genetic testing", 2100, 42, 3.50),
            ("EDS specialist near me", 1500, 25, 2.20),
        ],
        "living with EDS": [
            ("EDS daily life", 2800, 32, 1.90),
            ("EDS coping strategies", 1900, 29, 1.70),
            ("EDS lifestyle changes", 1600, 31, 1.85),
            ("EDS support groups", 1200, 22, 1.40),
            ("How to live with EDS", 900, 26, 1.60),
            ("EDS quality of life", 1100, 28, 1.75),
        ],
        "EDS symptoms": [
            ("EDS joint pain", 8500, 41, 2.30),
            ("EDS fatigue", 6200, 35, 1.95),
            ("EDS skin problems", 3400, 38, 2.15),
            ("EDS gastrointestinal symptoms", 2800, 42, 2.45),
            ("EDS heart symptoms", 2100, 45, 2.80),
            ("What are the first signs of EDS?", 1800, 32, 2.10),
            ("EDS symptoms checklist", 1200, 28, 1.85),
        ],
        "MCAS treatment": [
            ("MCAS medication", 6800, 48, 3.10),
            ("MCAS diet", 5400, 35, 2.20),
            ("MCAS natural treatment", 3200, 38, 2.45),
            ("MCAS antihistamines", 4100, 42, 2.80),
            ("MCAS treatment options", 2800, 45, 2.90),
            ("How to treat MCAS", 1900, 32, 2.15),
            ("MCAS specialist treatment", 1500, 38, 3.20),
        ],
        "POTS syndrome": [
            ("POTS symptoms", 9800, 44, 2.60),
            ("POTS treatment", 7200, 46, 2.85),
            ("POTS diagnosis", 6100, 49, 3.10),
            ("POTS exercise", 3800, 36, 2.25),
            ("POTS medication", 5200, 45, 2.95),
            ("What is POTS syndrome?", 2400, 31, 2.05),
            ("POTS management strategies", 2100, 33, 2.15),
        ],
        "chronic illness journey": [
            ("chronic illness blog", 5400, 28, 1.75),
            ("chronic illness support", 4200, 25, 1.60),
            ("chronic illness community", 3800, 26, 1.70),
            ("chronic illness tips", 3100, 24, 1.55),
            ("living with chronic illness", 2800, 27, 1.80),
            ("chronic illness resources", 2200, 23, 1.45),
            ("How to cope with chronic illness", 1800, 29, 1.90),
        ]
    }
    
    results = []
    
    # Get mock data for this seed keyword
    if seed_keyword in mock_patterns:
        for keyword, volume, difficulty, cpc in mock_patterns[seed_keyword]:
            # Add some People Also Ask questions
            if "?" in keyword:
                keyword_type = "paa"
            else:
                keyword_type = "related"
            
            keyword_data = KeywordData(
                seed_keyword=seed_keyword,
                related_keyword=keyword,
                volume=volume,
                difficulty=difficulty,
                cpc=cpc,
                keyword_type=keyword_type
            )
            results.append(keyword_data)
    
    # Add some generic related keywords if no specific pattern exists
    if not results:
        generic_keywords = [
            (f"{seed_keyword} symptoms", 5000, 40, 2.20),
            (f"{seed_keyword} treatment", 4500, 45, 2.80),
            (f"{seed_keyword} diagnosis", 3800, 48, 3.10),
            (f"living with {seed_keyword}", 2200, 30, 1.85),
            (f"{seed_keyword} specialist", 1800, 35, 2.40),
        ]
        
        for keyword, volume, difficulty, cpc in generic_keywords:
            keyword_data = KeywordData(
                seed_keyword=seed_keyword,
                related_keyword=keyword,
                volume=volume,
                difficulty=difficulty,
                cpc=cpc,
                keyword_type="related"
            )
            results.append(keyword_data)
    
    return results

def save_to_csv(data: List[KeywordData], output_path: str = "keyword_research_demo.csv") -> None:
    """Save keyword research data to CSV file"""
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
    print(f"\n📊 Demo Keyword Research Summary:")
    print(f"Total keywords analyzed: {len(data)}")
    print(f"Unique seed keywords: {df['seed_keyword'].nunique()}")
    print(f"Average search volume: {df['volume'].mean():.0f}")
    print(f"Keywords with volume > 1000: {len(df[df['volume'] > 1000])}")
    print(f"Keywords with volume > 5000: {len(df[df['volume'] > 5000])}")
    
    # Show top keywords by volume
    print(f"\n🔥 Top Keywords by Search Volume:")
    top_keywords = df.nlargest(10, 'volume')[['related_keyword', 'volume', 'difficulty', 'cpc']]
    for _, row in top_keywords.iterrows():
        print(f"  • {row['related_keyword']} - {row['volume']:,} searches/month (Difficulty: {row['difficulty']}, CPC: ${row['cpc']:.2f})")

def analyze_keyword_clusters(data: List[KeywordData]) -> Dict[str, List[str]]:
    """Analyze and cluster keywords by intent and topic"""
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
    print("🔍 Starting Demo Keyword Research for Health Journey Website")
    print("=" * 60)
    print("⚠️  This is a DEMO version using mock data")
    print("   To get real data, get a Keywords Everywhere API key")
    print("=" * 60)
    
    # Load seed keywords
    seed_keywords = load_seed_keywords("scripts/seed_keywords.txt")
    
    # Collect all keyword data
    all_data = []
    
    for i, seed in enumerate(seed_keywords, 1):
        print(f"\n📝 Processing {i}/{len(seed_keywords)}: {seed}")
        
        try:
            keyword_data = generate_mock_keyword_data(seed)
            all_data.extend(keyword_data)
            print(f"   Generated {len(keyword_data)} related keywords")
            
        except Exception as e:
            logger.error(f"Error processing seed keyword '{seed}': {e}")
            continue
    
    # Save results
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"keyword_research_demo_{timestamp}.csv"
    save_to_csv(all_data, output_file)
    
    # Analyze clusters
    clusters = analyze_keyword_clusters(all_data)
    print_cluster_analysis(clusters)
    
    # Save cluster analysis
    cluster_file = f"keyword_clusters_demo_{timestamp}.json"
    with open(cluster_file, 'w', encoding='utf-8') as f:
        json.dump(clusters, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Demo keyword research complete!")
    print(f"📁 Results saved to: {output_file}")
    print(f"📁 Clusters saved to: {cluster_file}")
    
    # Next steps recommendations
    print(f"\n🚀 Next Steps to Get Real Data:")
    print(f"1. Sign up for Keywords Everywhere API: https://keywordseverywhere.com")
    print(f"2. Get your API key from the dashboard")
    print(f"3. Set environment variable: export KEYWORDS_EVERYWHERE_API_KEY='your_key'")
    print(f"4. Run the full script: python3 scripts/keyword_research.py")
    print(f"\n💡 Alternative APIs:")
    print(f"   • SerpAPI: https://serpapi.com")
    print(f"   • Ahrefs API: https://ahrefs.com/api")
    print(f"   • SEMrush API: https://www.semrush.com/api/")

if __name__ == "__main__":
    main() 