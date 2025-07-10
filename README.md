# Dark Alpha QA

A comprehensive ticketing platform for Dark Alpha with AI-powered features, built with Next.js, TypeScript, and modern web technologies.

## Features

- **Advanced Ticketing System** - Create, manage, and track support tickets with full CRUD operations
- **AI-Powered Features** - Intelligent ticket analysis and automated responses using OpenAI and Google Gemini
- **Authentication** - Secure user authentication with Google OAuth
- **Admin Dashboard** - Comprehensive admin panel for managing companies, resources, and categories
- **Real-time Chat** - Interactive chat interface with AI assistance
- **File Management** - Upload and manage various file types (PDF, DOCX, Excel, etc.)
- **Database Management** - PostgreSQL with Redis for caching and session management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: PostgreSQL with Drizzle ORM
- **Caching**: Redis
- **Authentication**: Auth.js (NextAuth)
- **AI**: OpenAI API, Google Gemini AI
- **Email**: Resend
- **File Storage**: Vercel Blob
- **Deployment**: Docker, Vercel

## Prerequisites

Before running this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (recommended package manager)
- [Docker](https://www.docker.com/) and Docker Compose
- [Git](https://git-scm.com/)

## Environment Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dark-alpha-QA
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   # Database
   POSTGRES_URL=postgresql://myuser:mypassword@localhost:5432/mydb

   # Authentication
   AUTH_SECRET=your-auth-secret-here
   AUTH_GOOGLE_ID=your-google-client-id
   AUTH_GOOGLE_SECRET=your-google-client-secret

   # AI Services (optional - for AI features)
   AI_API_KEY=your-openai-api-key
   GOOGLE_GEMINI_AI_KEY=your-gemini-api-key

   # Email (optional)
   RESEND_API_KEY=your-resend-api-key

   # App URLs
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   ```

### Getting API Keys

#### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set the authorized redirect URI to `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

#### OpenAI API Key (Optional)

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and navigate to API Keys
3. Generate a new API key
4. Add it to your `.env.local` file as `AI_API_KEY`

#### Google Gemini API Key (Optional)

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file as `GOOGLE_GEMINI_AI_KEY`

## Database Setup

1. **Start the database services**

   ```bash
   docker-compose up -d
   ```

   This will start PostgreSQL on port 5432 and Redis on port 6379.

2. **Push the database schema**

   ```bash
   pnpm db:push
   ```

   This will create all the necessary tables in your PostgreSQL database.

## Running the Application

1. **Start the development server**

   ```bash
   pnpm dev
   ```

2. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Start the development server
- `pnpm build` - Build the application for production
- `pnpm start` - Start the production server
- `pnpm db:push` - Push database schema changes
- `pnpm db:generate` - Generate new database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio for database management
- `pnpm lint` - Run linting
- `pnpm format` - Format code with Biome

## Project Structure

```
dark-alpha-QA/
├── app/                    # Next.js app directory
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Authentication routes
│   ├── (chat)/            # Chat interface
│   └── (tickets)/         # Ticket management
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
│   ├── db/                # Database configuration
│   ├── ai/                # AI service configurations
│   └── actions/           # Server actions
├── hooks/                  # Custom React hooks
└── tests/                  # Test files
```

This comprehensive README includes:

1. **Project description** - Clear explanation of what Dark Alpha QA is
2. **Tech stack overview** - All the technologies used
3. **Prerequisites** - What needs to be installed
4. **Environment setup** - Step-by-step instructions for setting up environment variables
5. **API key instructions** - How to get Google OAuth, OpenAI, and Gemini keys
6. **Database setup** - Docker commands and schema push instructions
7. **Running instructions** - Simple `pnpm dev` command
8. **Available scripts** - All the npm/pnpm scripts
9. **Project structure** - Overview of the codebase
10. **Docker services** - Information about the database services
11. **Troubleshooting** - Common issues and solutions

The README is now tailored specifically for the Dark Alpha QA ticketing platform and includes all the information you requested about Google OAuth, database setup, AI keys, and the development workflow.

## Docker Services

The `docker-compose.yml` file includes:

- **PostgreSQL 15** - Main database
  - Port: 5432
  - Database: mydb
  - User: myuser
  - Password: mypassword

- **Redis 7** - Caching and session storage
  - Port: 6379

## Troubleshooting

### Database Connection Issues

- Ensure Docker is running
- Check if the containers are up: `docker-compose ps`
- Verify the POSTGRES_URL in your `.env.local` file

### Authentication Issues

- Verify your Google OAuth credentials
- Check that the redirect URI matches exactly
- Ensure AUTH_SECRET is set to a secure random string

### AI Features Not Working

- Verify your API keys are correctly set
- Check the console for any error messages
- Ensure you have sufficient API credits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## License

This project is licensed under the MIT License.
