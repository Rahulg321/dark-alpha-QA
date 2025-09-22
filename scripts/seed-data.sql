-- Seed dummy data for testing enhanced RAG system
-- Run with: docker exec local-postgres psql -U myuser -d mydb -f /path/to/seed-data.sql

-- 1. Create test user
INSERT INTO "user" (id, name, email, role, "createdAt", "updatedAt") 
VALUES (gen_random_uuid(), 'Test User', 'test@example.com', 'USER', NOW(), NOW());

-- Get user ID for references
DO $$
DECLARE
    test_user_id UUID;
    techcorp_id UUID;
    financeflow_id UUID;
    healthtech_id UUID;
    category_id UUID;
    resource1_id UUID;
    resource2_id UUID;
    resource3_id UUID;
    chat_id UUID;
    q1_id UUID;
    q2_id UUID;
    q3_id UUID;
BEGIN
    -- Get the test user ID
    SELECT id INTO test_user_id FROM "user" WHERE email = 'test@example.com' LIMIT 1;

    -- 2. Create companies
    INSERT INTO company (id, name, type, industry, website, email, description, created_at, updated_at) 
    VALUES 
        (gen_random_uuid(), 'TechCorp Solutions', 'enterprise', 'technology', 'https://techcorp.com', 'contact@techcorp.com', 'Leading enterprise software solutions provider specializing in AI and machine learning platforms', NOW(), NOW()),
        (gen_random_uuid(), 'FinanceFlow Inc', 'startup', 'finance', 'https://financeflow.io', 'hello@financeflow.io', 'Innovative fintech startup building next-generation payment processing and financial analytics tools', NOW(), NOW()),
        (gen_random_uuid(), 'HealthTech Innovations', 'growth_equity', 'healthcare', 'https://healthtech.med', 'info@healthtech.med', 'Healthcare technology company developing AI-powered diagnostic tools and patient management systems', NOW(), NOW());

    -- Get company IDs
    SELECT id INTO techcorp_id FROM company WHERE name = 'TechCorp Solutions';
    SELECT id INTO financeflow_id FROM company WHERE name = 'FinanceFlow Inc';
    SELECT id INTO healthtech_id FROM company WHERE name = 'HealthTech Innovations';

    -- 3. Create resource category
    INSERT INTO resource_categories (id, name, description, created_at, updated_at)
    VALUES (gen_random_uuid(), 'Documentation', 'Technical documentation and guides', NOW(), NOW());

    SELECT id INTO category_id FROM resource_categories WHERE name = 'Documentation';

    -- 4. Create resources
    INSERT INTO resources (id, company_id, category_id, name, description, content, kind, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), techcorp_id, category_id, 'API Documentation', 'Complete guide to using our REST API', 'This comprehensive API documentation covers authentication, endpoints, rate limits, and examples. Authentication requires API key in header. Rate limit is 1000 requests per hour. Main endpoints include /users, /companies, /analytics.', 'pdf', NOW(), NOW()),
        (gen_random_uuid(), techcorp_id, category_id, 'Security Whitepaper', 'Detailed security architecture and compliance information', 'Our security framework includes AES-256 encryption, TLS 1.3 for transport, and zero-trust architecture. We maintain SOC 2 Type II, ISO 27001, and GDPR compliance. Data is encrypted at rest and in transit.', 'pdf', NOW(), NOW()),
        (gen_random_uuid(), financeflow_id, category_id, 'Integration Guide', 'Step-by-step integration instructions', 'Follow these steps to integrate: 1) Generate API key from dashboard 2) Install SDK via npm install our-sdk 3) Configure authentication 4) Test connection with health endpoint 5) Implement webhooks for real-time updates.', 'doc', NOW(), NOW());

    -- Get resource IDs for embeddings
    SELECT id INTO resource1_id FROM resources WHERE name = 'API Documentation' AND company_id = techcorp_id;
    SELECT id INTO resource2_id FROM resources WHERE name = 'Security Whitepaper' AND company_id = techcorp_id;
    SELECT id INTO resource3_id FROM resources WHERE name = 'Integration Guide' AND company_id = financeflow_id;

    -- 5. Create dummy embeddings (random vectors for testing)
    INSERT INTO embeddings (id, resource_id, content, embedding)
    VALUES 
        (gen_random_uuid(), resource1_id, 'API documentation with authentication and rate limits', (SELECT ARRAY(SELECT random() - 0.5 FROM generate_series(1, 1536)))::vector),
        (gen_random_uuid(), resource2_id, 'Security whitepaper with encryption and compliance details', (SELECT ARRAY(SELECT random() - 0.5 FROM generate_series(1, 1536)))::vector),
        (gen_random_uuid(), resource3_id, 'Integration guide with SDK installation steps', (SELECT ARRAY(SELECT random() - 0.5 FROM generate_series(1, 1536)))::vector);

    -- 6. Create support tickets
    INSERT INTO "Ticket" (id, title, type, priority, from_name, from_email, description, tags, status, "userId", "createdAt")
    VALUES 
        (gen_random_uuid(), 'Unable to login to dashboard', 'website', 'high', 'John Smith', 'john@techcorp.com', 'Users are reporting they cannot access the main dashboard. Getting 500 error when trying to authenticate.', ARRAY['authentication', 'dashboard', 'urgent'], 'open', test_user_id, NOW()),
        (gen_random_uuid(), 'API rate limiting issues', 'email', 'medium', 'Sarah Wilson', 'sarah@financeflow.io', 'Our application is hitting rate limits when making API calls during peak hours. Need to increase limits or optimize calls.', ARRAY['api', 'performance', 'rate-limiting'], 'open', test_user_id, NOW()),
        (gen_random_uuid(), 'Data export functionality not working', 'website', 'low', 'Mike Johnson', 'mike@healthtech.med', 'The CSV export feature is producing empty files. Affects reports generated from the analytics dashboard.', ARRAY['export', 'csv', 'analytics'], 'open', test_user_id, NOW());

    -- 7. Create company questions and answers
    INSERT INTO company_questions (id, company_id, title, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), techcorp_id, 'What are the security features of your platform?', NOW(), NOW()),
        (gen_random_uuid(), financeflow_id, 'How does the pricing model work?', NOW(), NOW()),
        (gen_random_uuid(), healthtech_id, 'What integrations are available?', NOW(), NOW());

    -- Get question IDs for answers
    SELECT id INTO q1_id FROM company_questions WHERE title = 'What are the security features of your platform?';
    SELECT id INTO q2_id FROM company_questions WHERE title = 'How does the pricing model work?';
    SELECT id INTO q3_id FROM company_questions WHERE title = 'What integrations are available?';

    INSERT INTO answers (id, company_question_id, answer, type, created_at, updated_at)
    VALUES 
        (gen_random_uuid(), q1_id, 'Our platform includes enterprise-grade security with end-to-end encryption, multi-factor authentication, role-based access controls, and SOC 2 compliance. We also provide audit logs and data residency options.', 'AI_GENERATED', NOW(), NOW()),
        (gen_random_uuid(), q2_id, 'We offer tiered pricing based on usage volume. Starter plan at $99/month for up to 10,000 API calls, Professional at $299/month for 100,000 calls, and Enterprise with custom pricing for unlimited usage.', 'AI_GENERATED', NOW(), NOW()),
        (gen_random_uuid(), q3_id, 'We support integrations with Slack, Microsoft Teams, Salesforce, HubSpot, Zapier, and offer REST API and webhooks for custom integrations. New integrations are added monthly based on customer requests.', 'AI_GENERATED', NOW(), NOW());

    -- 8. Create sample chat
    INSERT INTO "Chat" (id, title, "userId", "createdAt", visibility)
    VALUES (gen_random_uuid(), 'Getting started with API integration', test_user_id, NOW(), 'private');

    SELECT id INTO chat_id FROM "Chat" WHERE title = 'Getting started with API integration';

    -- 9. Create chat messages
    INSERT INTO "Message_v2" (id, "chatId", role, parts, attachments, "createdAt")
    VALUES 
        (gen_random_uuid(), chat_id, 'user', '[{"type": "text", "text": "How do I get started with your API?"}]'::json, '[]'::json, NOW()),
        (gen_random_uuid(), chat_id, 'assistant', '[{"type": "text", "text": "To get started with our API, first generate an API key from your dashboard, then follow our integration guide. The process involves installing our SDK and configuring authentication."}]'::json, '[]'::json, NOW()),
        (gen_random_uuid(), chat_id, 'user', '[{"type": "text", "text": "What are the rate limits?"}]'::json, '[]'::json, NOW()),
        (gen_random_uuid(), chat_id, 'assistant', '[{"type": "text", "text": "Our API has a rate limit of 1000 requests per hour for standard plans. Enterprise customers can request higher limits."}]'::json, '[]'::json, NOW());

    -- 10. Create sample documents
    INSERT INTO "Document" (id, title, content, kind, "userId", "createdAt")
    VALUES 
        (gen_random_uuid(), 'Project Requirements', 'Requirements for the new customer portal: 1) User authentication 2) Dashboard with analytics 3) File upload capability 4) Real-time notifications 5) Mobile responsive design', 'text', test_user_id, NOW()),
        (gen_random_uuid(), 'Meeting Notes', 'Team meeting notes: Discussed API rate limiting issues. Need to optimize database queries. Sarah to investigate caching solutions. Mike to update documentation. Next meeting scheduled for Friday.', 'text', test_user_id, NOW());

END $$;

-- Display summary
SELECT 
    'Summary of seeded data:' as message,
    (SELECT COUNT(*) FROM company) as companies,
    (SELECT COUNT(*) FROM resources) as resources,
    (SELECT COUNT(*) FROM embeddings) as embeddings,
    (SELECT COUNT(*) FROM company_questions) as questions,
    (SELECT COUNT(*) FROM answers) as answers,
    (SELECT COUNT(*) FROM "Ticket") as tickets,
    (SELECT COUNT(*) FROM "Chat") as chats,
    (SELECT COUNT(*) FROM "Message_v2") as messages,
    (SELECT COUNT(*) FROM "Document") as documents;