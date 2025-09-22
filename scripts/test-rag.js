/**
 * Test script for enhanced RAG system
 * Run with: node scripts/test-rag.js
 */

import { enhancedRAGSearch, chatRAGSearch } from '../lib/ai/enhanced-rag.js';

async function testEnhancedRAG() {
  console.log('🧪 Testing Enhanced RAG System\n');

  // Test queries that should match our dummy data
  const testQueries = [
    'authentication issues',
    'API rate limits', 
    'TechCorp company information',
    'fintech startup',
    'dashboard problems'
  ];

  for (const query of testQueries) {
    console.log(`\n🔍 Testing query: "${query}"`);
    console.log('═'.repeat(50));
    
    try {
      // Test the enhanced RAG search
      const result = await enhancedRAGSearch(query, {
        maxResults: 5,
        similarityThreshold: 0.1 // Lower threshold for dummy embeddings
      });

      console.log(`📊 Results found: ${result.searchResults.length}`);
      console.log(`📈 Sources breakdown:`, result.contextSummary.sourcesBreakdown);
      
      if (result.searchResults.length > 0) {
        console.log('\n📋 Top results:');
        result.searchResults.slice(0, 3).forEach((item, index) => {
          console.log(`  ${index + 1}. [${item.type.toUpperCase()}] ${item.title}`);
          console.log(`     ${item.content.substring(0, 100)}...`);
          if (item.similarity) {
            console.log(`     Similarity: ${item.similarity.toFixed(3)}`);
          }
        });
      }

      // Test the chat RAG function
      console.log('\n💬 Chat RAG Response:');
      const chatResult = await chatRAGSearch(query);
      console.log(chatResult.substring(0, 200) + '...');

    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error.message);
    }

    console.log('\n' + '─'.repeat(50));
  }

  // Test with filters
  console.log('\n🎯 Testing with filters...');
  try {
    const filteredResult = await enhancedRAGSearch('authentication', {
      includeEmbeddings: false,
      includeCompanies: true,
      includeTickets: true,
      includeQAs: false,
      includeChats: false,
      includeDocs: false,
      maxResults: 3
    });

    console.log(`🔧 Filtered results: ${filteredResult.searchResults.length}`);
    console.log(`🔧 Sources: ${Object.keys(filteredResult.contextSummary.sourcesBreakdown).join(', ')}`);

  } catch (error) {
    console.error('❌ Error testing filtered search:', error.message);
  }

  console.log('\n✅ Enhanced RAG testing completed!');
}

// Run the test
testEnhancedRAG().catch(console.error);