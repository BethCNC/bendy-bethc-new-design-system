# Keyword Research Script for Health Journey Website

This script automates seed-based keyword research for your health journey website, targeting EDS, MCAS, POTS, and chronic illness content optimization.

## Features

- **Multi-API Support**: Keywords Everywhere API (primary) with SerpAPI fallback
- **Comprehensive Data**: Search volume, CPC, keyword difficulty, related keywords, People Also Ask
- **Smart Clustering**: Automatically groups keywords by intent (diagnosis, symptoms, treatment, etc.)
- **Error Handling**: Robust retry logic and rate limiting
- **Flexible Input**: Use custom seed keywords or built-in defaults
- **Detailed Output**: CSV export with summary statistics and cluster analysis

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements_keyword_research.txt
```

### 2. Get API Keys

**Keywords Everywhere API** (Recommended):
- Sign up at [keywordseverywhere.com](https://keywordseverywhere.com)
- Get your API key from the dashboard
- Set environment variable: `export KEYWORDS_EVERYWHERE_API_KEY='your_key_here'`

**SerpAPI** (Fallback):
- Sign up at [serpapi.com](https://serpapi.com)
- Get your API key from the dashboard
- Set environment variable: `export SERPAPI_KEY='your_key_here'`

### 3. Customize Seed Keywords (Optional)

Edit `seed_keywords.txt` to add your own seed keywords, one per line:

```txt
Ehlers-Danlos Syndrome
living with EDS
EDS symptoms
# Add your custom keywords here
```

## Usage

### Basic Usage

```bash
python keyword_research.py
```

### With Custom Seed Keywords

```bash
# The script will automatically use seed_keywords.txt if it exists
python keyword_research.py
```

### Environment Setup

```bash
# Set your API key
export KEYWORDS_EVERYWHERE_API_KEY='your_key_here'

# Run the script
python keyword_research.py
```

## Output Files

The script generates several output files:

1. **`keyword_research_YYYYMMDD_HHMMSS.csv`** - Main keyword data
   - Columns: seed_keyword, related_keyword, volume, difficulty, cpc, keyword_type, source

2. **`keyword_clusters_YYYYMMDD_HHMMSS.json`** - Clustered keywords by intent
   - Groups: diagnosis, symptoms, treatment, management, support, resources, journey

3. **`keyword_research.log`** - Detailed execution log

## Output Analysis

### CSV Structure
```csv
seed_keyword,related_keyword,volume,difficulty,cpc,keyword_type,source
"EDS symptoms","EDS joint pain",1200,45,2.50,related,keywords_everywhere
"EDS symptoms","EDS fatigue",800,32,1.80,related,keywords_everywhere
"EDS symptoms","What causes EDS pain?",500,28,2.10,paa,keywords_everywhere
```

### Cluster Categories
- **Diagnosis**: Testing, genetic, specialist, doctor-related keywords
- **Symptoms**: Pain, fatigue, flare, signs-related keywords  
- **Treatment**: Medication, therapy, cure-related keywords
- **Management**: Coping, tips, strategies, lifestyle keywords
- **Support**: Community, group, help, advocacy keywords
- **Resources**: Information, guide, blog, website keywords
- **Journey**: Story, experience, "living with" keywords

## Advanced Usage

### Custom API Configuration

```python
# Use SerpAPI instead of Keywords Everywhere
api_client = SerpAPI(os.getenv('SERPAPI_KEY'))
```

### Batch Processing

```python
# Process keywords in batches to avoid rate limits
for batch in chunks(seed_keywords, 10):
    for keyword in batch:
        data = api_client.get_keyword_data(keyword)
        # Process data
    time.sleep(60)  # Wait between batches
```

### Google Sheets Integration

To save results to Google Sheets, add this to the script:

```python
import gspread
from google.oauth2.service_account import Credentials

def save_to_sheets(data, sheet_name="Keyword Research"):
    scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
    creds = Credentials.from_service_account_file('credentials.json', scopes=scope)
    client = gspread.authorize(creds)
    
    # Create or open sheet
    try:
        sheet = client.open(sheet_name).sheet1
    except:
        sheet = client.create(sheet_name).sheet1
    
    # Convert data to list format
    rows = [['seed_keyword', 'related_keyword', 'volume', 'difficulty', 'cpc', 'keyword_type', 'source']]
    for item in data:
        rows.append([item.seed_keyword, item.related_keyword, item.volume, 
                    item.difficulty, item.cpc, item.keyword_type, item.source])
    
    # Update sheet
    sheet.update(rows)
```

## SEO Strategy Integration

### Content Planning

1. **High-Volume Keywords** (>1000 searches/month):
   - Create comprehensive pillar content
   - Target featured snippets
   - Build internal linking structure

2. **Low-Competition Opportunities**:
   - Focus on long-tail variations
   - Create specific condition guides
   - Target local/regional keywords

3. **People Also Ask Questions**:
   - Create FAQ sections
   - Develop Q&A content
   - Target voice search optimization

### Content Clusters

Use the cluster analysis to create content themes:

```python
# Example content cluster structure
content_clusters = {
    'diagnosis': {
        'pillar': 'Complete Guide to EDS Diagnosis',
        'subtopics': ['genetic testing', 'specialist referral', 'diagnostic criteria']
    },
    'symptoms': {
        'pillar': 'EDS Symptoms and Management',
        'subtopics': ['joint pain', 'fatigue', 'skin issues', 'gastrointestinal']
    },
    'treatment': {
        'pillar': 'EDS Treatment Options',
        'subtopics': ['physical therapy', 'medication', 'lifestyle changes']
    }
}
```

## Troubleshooting

### Common Issues

1. **API Rate Limits**:
   - Script automatically handles rate limiting
   - Increase sleep time between requests if needed
   - Consider upgrading API plan for higher limits

2. **No Data Returned**:
   - Check API key validity
   - Verify seed keywords are valid
   - Check API service status

3. **Memory Issues**:
   - Process keywords in smaller batches
   - Clear data between batches
   - Use generator functions for large datasets

### Error Logs

Check `keyword_research.log` for detailed error information:

```bash
tail -f keyword_research.log
```

## Next Steps

### Expand Functionality

1. **Competitor Analysis**:
   - Add competitor keyword research
   - Analyze competitor content gaps
   - Track competitor ranking changes

2. **Content Gap Analysis**:
   - Compare your content vs. keyword opportunities
   - Identify missing content topics
   - Prioritize content creation

3. **Ranking Tracking**:
   - Monitor keyword rankings over time
   - Track content performance
   - Measure SEO impact

4. **Local SEO**:
   - Add location-based keyword research
   - Target local medical specialists
   - Optimize for local search

### Advanced Clustering

Implement more sophisticated clustering:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans

def advanced_clustering(keywords, n_clusters=7):
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform(keywords)
    
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    clusters = kmeans.fit_predict(vectors)
    
    return clusters
```

## Support

For issues or questions:
1. Check the log file for detailed error messages
2. Verify API credentials and limits
3. Test with a small set of seed keywords first
4. Ensure all dependencies are installed correctly

## License

This script is provided as-is for educational and research purposes. Please respect API terms of service and rate limits. 