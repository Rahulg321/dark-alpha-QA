/**
 * Simple test for enhanced RAG system
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testRAGEndpoints() {
  console.log('🧪 Testing Enhanced RAG System via API\n');
  
  const baseUrl = 'http://localhost:3002';
  
  // Wait for server to be ready
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  const testQueries = [
    'TechCorp company information',
    'authentication issues', 
    'API rate limits',
    'fintech startup',
    'dashboard problems'
  ];

  for (const query of testQueries) {
    console.log(`\n🔍 Testing query: "${query}"`);
    console.log('═'.repeat(50));
    
    try {
      // Test via curl to simulate API call
      const curlCommand = `curl -s -X POST "${baseUrl}/api/chat" \\
        -H "Content-Type: application/json" \\
        -d '{"messages":[{"role":"user","content":"${query}"}]}'`;
      
      console.log('📡 Making API request...');
      const { stdout, stderr } = await execAsync(curlCommand);
      
      if (stderr) {
        console.log('⚠️  stderr:', stderr);
      }
      
      if (stdout) {
        console.log('✅ Response received:', stdout.substring(0, 200) + '...');
      } else {
        console.log('❌ No response received');
      }
      
    } catch (error) {
      console.error(`❌ Error testing query "${query}":`, error.message);
    }
    
    console.log('─'.repeat(50));
  }
  
  console.log('\n✅ RAG API testing completed!');
}

// Run the test
testRAGEndpoints().catch(console.error);