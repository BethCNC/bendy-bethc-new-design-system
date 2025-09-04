const { Client } = require('@notionhq/client');
require('dotenv').config();

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

async function checkBlogDatabase() {
  try {
    // First, let's list all available databases
    console.log('🔍 Searching for databases...\n');
    
    const searchResponse = await notion.search({
      filter: {
        property: 'object',
        value: 'database'
      }
    });
    
    console.log('📊 Available Databases:');
    console.log('='.repeat(50));
    
    searchResponse.results.forEach((db, index) => {
      const title = db.title[0]?.plain_text || 'Untitled';
      console.log(`${index + 1}. ${title}`);
      console.log(`   ID: ${db.id}`);
      console.log(`   URL: ${db.url}`);
      console.log('');
    });
    
    // Look for a blog database (check common names)
    const blogKeywords = ['blog', 'post', 'article', 'content'];
    const possibleBlogDbs = searchResponse.results.filter(db => {
      const title = (db.title[0]?.plain_text || '').toLowerCase();
      return blogKeywords.some(keyword => title.includes(keyword));
    });
    
    if (possibleBlogDbs.length > 0) {
      console.log('📝 Potential Blog Databases Found:');
      console.log('='.repeat(50));
      
      for (const db of possibleBlogDbs) {
        const title = db.title[0]?.plain_text || 'Untitled';
        console.log(`\n📖 Database: ${title}`);
        console.log(`ID: ${db.id}\n`);
        
        try {
          // Get database schema
          const dbSchema = await notion.databases.retrieve({ database_id: db.id });
          console.log('Properties:');
          
          Object.entries(dbSchema.properties).forEach(([name, prop]) => {
            console.log(`  • ${name}: ${prop.type}`);
          });
          
          console.log('\n' + '-'.repeat(40));
        } catch (error) {
          console.log(`❌ Couldn't access schema: ${error.message}`);
        }
      }
    } else {
      console.log('⚠️  No obvious blog databases found. Please check database names or provide the blog database ID.');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) console.error('Error code:', error.code);
  }
}

checkBlogDatabase();