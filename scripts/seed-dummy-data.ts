/**
 * Seed script to create dummy data for testing enhanced RAG system
 */

import { db } from '../lib/db/queries';
import {
  user,
  company,
  companyQuestions,
  answers,
  tickets,
  resources,
  resourceCategories,
  embeddings,
  chat,
  message,
  document
} from '../lib/db/schema';
import { generateEmbedding } from '../lib/ai/embedding';

// Sample data
const companies = [
  {
    name: "TechCorp Solutions",
    type: "enterprise",
    industry: "technology", 
    website: "https://techcorp.com",
    email: "contact@techcorp.com",
    description: "Leading enterprise software solutions provider specializing in AI and machine learning platforms"
  },
  {
    name: "FinanceFlow Inc",
    type: "startup",
    industry: "finance",
    website: "https://financeflow.io", 
    email: "hello@financeflow.io",
    description: "Innovative fintech startup building next-generation payment processing and financial analytics tools"
  },
  {
    name: "HealthTech Innovations",
    type: "growth_equity", 
    industry: "healthcare",
    website: "https://healthtech.med",
    email: "info@healthtech.med", 
    description: "Healthcare technology company developing AI-powered diagnostic tools and patient management systems"
  }
];

const sampleTickets = [
  {
    title: "Unable to login to dashboard",
    type: "website",
    priority: "high", 
    fromName: "John Smith",
    fromEmail: "john@techcorp.com",
    description: "Users are reporting they cannot access the main dashboard. Getting 500 error when trying to authenticate.",
    tags: ["authentication", "dashboard", "urgent"]
  },
  {
    title: "API rate limiting issues",
    type: "email",
    priority: "medium",
    fromName: "Sarah Wilson", 
    fromEmail: "sarah@financeflow.io",
    description: "Our application is hitting rate limits when making API calls during peak hours. Need to increase limits or optimize calls.",
    tags: ["api", "performance", "rate-limiting"]
  },
  {
    title: "Data export functionality not working",
    type: "website", 
    priority: "low",
    fromName: "Mike Johnson",
    fromEmail: "mike@healthtech.med",
    description: "The CSV export feature is producing empty files. Affects reports generated from the analytics dashboard.",
    tags: ["export", "csv", "analytics"]
  }
];

const sampleQuestions = [
  {
    title: "What are the security features of your platform?",
    answer: "Our platform includes enterprise-grade security with end-to-end encryption, multi-factor authentication, role-based access controls, and SOC 2 compliance. We also provide audit logs and data residency options."
  },
  {
    title: "How does the pricing model work?", 
    answer: "We offer tiered pricing based on usage volume. Starter plan at $99/month for up to 10,000 API calls, Professional at $299/month for 100,000 calls, and Enterprise with custom pricing for unlimited usage."
  },
  {
    title: "What integrations are available?",
    answer: "We support integrations with Slack, Microsoft Teams, Salesforce, HubSpot, Zapier, and offer REST API and webhooks for custom integrations. New integrations are added monthly based on customer requests."
  }
];

const sampleResources = [
  {
    name: "API Documentation", 
    description: "Complete guide to using our REST API",
    content: "This comprehensive API documentation covers authentication, endpoints, rate limits, and examples. Authentication requires API key in header. Rate limit is 1000 requests per hour. Main endpoints include /users, /companies, /analytics.",
    kind: "pdf"
  },
  {
    name: "Security Whitepaper",
    description: "Detailed security architecture and compliance information", 
    content: "Our security framework includes AES-256 encryption, TLS 1.3 for transport, and zero-trust architecture. We maintain SOC 2 Type II, ISO 27001, and GDPR compliance. Data is encrypted at rest and in transit.",
    kind: "pdf"
  },
  {
    name: "Integration Guide",
    description: "Step-by-step integration instructions",
    content: "Follow these steps to integrate: 1) Generate API key from dashboard 2) Install SDK via npm install our-sdk 3) Configure authentication 4) Test connection with health endpoint 5) Implement webhooks for real-time updates.",
    kind: "doc"
  }
];

async function seedDummyData() {
  console.log('🌱 Starting to seed dummy data...');

  try {
    // 1. Create test user
    console.log('Creating test user...');
    const testUser = await db.insert(user).values({
      name: "Test User",
      email: "test@example.com", 
      role: "USER"
    }).returning();
    
    const userId = testUser[0].id;
    console.log(`✅ Created user: ${userId}`);

    // 2. Create companies
    console.log('Creating companies...');
    const createdCompanies = await db.insert(company).values(companies).returning();
    console.log(`✅ Created ${createdCompanies.length} companies`);

    // 3. Create resource category
    console.log('Creating resource category...');
    const category = await db.insert(resourceCategories).values({
      name: "Documentation",
      description: "Technical documentation and guides"
    }).returning();
    
    const categoryId = category[0].id;

    // 4. Create resources for each company
    console.log('Creating resources...');
    const allResources = [];
    for (let i = 0; i < createdCompanies.length; i++) {
      const companyId = createdCompanies[i].id;
      for (const resource of sampleResources) {
        const createdResource = await db.insert(resources).values({
          ...resource,
          companyId,
          categoryId
        }).returning();
        allResources.push(createdResource[0]);
      }
    }
    console.log(`✅ Created ${allResources.length} resources`);

    // 5. Create embeddings for resources
    console.log('Creating embeddings...');
    for (const resource of allResources) {
      try {
        // For demo, we'll use dummy embeddings since we might not have OpenAI key
        const embedding = Array(1536).fill(0).map(() => Math.random() - 0.5);
        
        await db.insert(embeddings).values({
          resourceId: resource.id,
          content: resource.content || resource.description,
          embedding: embedding
        });
      } catch (error) {
        console.log(`⚠️  Skipping embedding for ${resource.name} - no OpenAI key`);
      }
    }
    console.log(`✅ Created embeddings for resources`);

    // 6. Create company questions and answers
    console.log('Creating Q&As...');
    for (let i = 0; i < createdCompanies.length; i++) {
      const companyId = createdCompanies[i].id;
      for (const qa of sampleQuestions) {
        const question = await db.insert(companyQuestions).values({
          companyId,
          title: qa.title
        }).returning();
        
        await db.insert(answers).values({
          companyQuestionId: question[0].id,
          answer: qa.answer,
          type: "AI_GENERATED"
        });
      }
    }
    console.log(`✅ Created Q&As for all companies`);

    // 7. Create support tickets
    console.log('Creating support tickets...');
    for (let i = 0; i < sampleTickets.length; i++) {
      await db.insert(tickets).values({
        ...sampleTickets[i],
        userId: i < createdCompanies.length ? userId : null
      });
    }
    console.log(`✅ Created ${sampleTickets.length} support tickets`);

    // 8. Create sample chat and messages
    console.log('Creating sample chat...');
    const sampleChat = await db.insert(chat).values({
      title: "Getting started with API integration",
      userId,
      createdAt: new Date()
    }).returning();

    const chatId = sampleChat[0].id;

    const messages = [
      {
        role: "user",
        parts: [{ type: "text", text: "How do I get started with your API?" }]
      },
      {
        role: "assistant", 
        parts: [{ type: "text", text: "To get started with our API, first generate an API key from your dashboard, then follow our integration guide. The process involves installing our SDK and configuring authentication." }]
      },
      {
        role: "user",
        parts: [{ type: "text", text: "What are the rate limits?" }]
      },
      {
        role: "assistant",
        parts: [{ type: "text", text: "Our API has a rate limit of 1000 requests per hour for standard plans. Enterprise customers can request higher limits." }]
      }
    ];

    for (const msg of messages) {
      await db.insert(message).values({
        chatId,
        role: msg.role,
        parts: msg.parts,
        attachments: [],
        createdAt: new Date()
      });
    }
    console.log(`✅ Created sample chat with messages`);

    // 9. Create sample documents
    console.log('Creating sample documents...');
    const sampleDocs = [
      {
        title: "Project Requirements",
        content: "Requirements for the new customer portal: 1) User authentication 2) Dashboard with analytics 3) File upload capability 4) Real-time notifications 5) Mobile responsive design",
        kind: "text"
      },
      {
        title: "Meeting Notes",
        content: "Team meeting notes: Discussed API rate limiting issues. Need to optimize database queries. Sarah to investigate caching solutions. Mike to update documentation. Next meeting scheduled for Friday.",
        kind: "text"
      }
    ];

    for (const doc of sampleDocs) {
      await db.insert(document).values({
        ...doc,
        userId,
        createdAt: new Date()
      });
    }
    console.log(`✅ Created ${sampleDocs.length} sample documents`);

    console.log('🎉 Dummy data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdCompanies.length} companies`);
    console.log(`- ${allResources.length} resources with embeddings`);
    console.log(`- ${createdCompanies.length * sampleQuestions.length} Q&As`);
    console.log(`- ${sampleTickets.length} support tickets`);
    console.log(`- 1 chat with 4 messages`);
    console.log(`- ${sampleDocs.length} documents`);
    console.log('\n🧪 Ready to test enhanced RAG system!');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDummyData().then(() => {
  console.log('✅ Seeding complete!');
  process.exit(0);
});