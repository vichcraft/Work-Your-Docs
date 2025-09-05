# Work Your Docs 📚🤖

**An AI-powered document interaction platform that transforms how you work with documentation through voice and text conversations.**

Work Your Docs is a modern RAG (Retrieval-Augmented Generation) system that combines voice AI, text chat, and document analysis to create an intelligent assistant for your documentation needs.

![Work Your Docs](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge) ![Voice AI](https://img.shields.io/badge/Voice-Enabled-green?style=for-the-badge) ![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)

## ✨ Features

### 🎤 **Voice Conversations**
- **Natural Voice Interaction**: Speak to your AI assistant using Vapi Voice AI
- **Real-time Transcription**: See your conversations transcribed in real-time
- **Seamless Voice-to-Text**: Switch between voice and text seamlessly in the same conversation

### 💬 **Intelligent Text Chat**
- **Streaming Responses**: Get real-time, streaming AI responses
- **Context-Aware**: AI remembers conversation context for better interactions
- **Rich Document Analysis**: Ask questions about your documents and get detailed answers

### 📄 **Document Processing & RAG**
- **Smart Document Indexing**: Process and index documents using Pinecone vector database
- **Semantic Search**: Find relevant information using AI-powered semantic search
- **Source Attribution**: Every answer includes source references from your documents

### 🎨 **Modern User Interface**
- **Beautiful Design**: Gradient-based modern UI with smooth animations
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Admin Dashboard**: Comprehensive admin interface for system management

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **AI & Voice**: Google Gemini AI, Vapi Voice AI
- **Vector Database**: Pinecone
- **Deployment**: Vercel (recommended)
- **Styling**: Tailwind CSS with custom gradients
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

Before you begin, make sure you have:
- Node.js 18+ installed
- API keys for the required services (see setup guide below)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/work-your-docs.git
cd work-your-docs
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```bash
# Pinecone Configuration
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_INDEX_NAME=your_pinecone_index_name_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here

# Google Gemini Configuration
GOOGLE_API_KEY=your_google_gemini_api_key_here

# VAPI Configuration (for voice features)
VAPI_PRIVATE_API_KEY=your_vapi_private_api_key_here
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
NEXT_PUBLIC_VAPI_ASSISTANT_ID=your_assistant_id_here
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 Detailed Setup Guide

### Getting Your API Keys

#### 📌 Pinecone Setup
1. Sign up at [pinecone.io](https://pinecone.io)
2. Create a new index with these settings:
   - **Dimensions**: `768` (for Gemini embedding-001 model)
   - **Metric**: `cosine`
   - **Environment**: Choose your preferred environment
3. Copy your API key from the dashboard

#### 🤖 Google Gemini API
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create and copy your API key

#### 🎤 Vapi Voice AI
1. Sign up at [Vapi Dashboard](https://dashboard.vapi.ai)
2. Navigate to API Keys section
3. Copy both your **Private API Key** (server-side) and **Public API Key** (client-side)
4. Optionally, create an assistant and copy the assistant ID

### Pinecone Index Configuration

Create a Pinecone index with these exact specifications:
- **Name**: Match your `PINECONE_INDEX_NAME` environment variable
- **Dimensions**: `768`
- **Metric**: `cosine`
- **Pod Type**: `s1.x1` (starter tier) or higher

## 📁 Project Structure

```
work-your-docs/
├── backend/                    # Backend utilities and processing
│   ├── docs/                  # Sample documentation files
│   │   ├── api-guide.txt     # API documentation
│   │   ├── user-manual.txt   # User manual
│   │   └── technical-specs.txt # Technical specifications
│   └── lib/                  # Backend libraries
│       ├── document-processor.ts # Document processing utilities
│       ├── gemini.ts         # Google Gemini AI integration
│       ├── pinecone.ts       # Pinecone vector database client
│       └── rag.ts            # RAG system implementation
├── src/
│   ├── app/                  # Next.js app directory
│   │   ├── admin/            # Admin dashboard
│   │   ├── api/              # API routes
│   │   │   ├── index-documents/ # Document indexing endpoint
│   │   │   ├── query/        # RAG query endpoint
│   │   │   └── vapi/         # Voice AI endpoint
│   │   ├── chat/             # Chat interface
│   │   └── page.tsx          # Landing page
│   ├── components/           # React components
│   │   ├── chat/             # Chat-specific components
│   │   ├── Chat.tsx          # Main chat component
│   │   └── LandingPage.tsx   # Landing page component
│   ├── hooks/                # React hooks
│   ├── lib/                  # Frontend utilities
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
└── docs/                    # Documentation files
```

## 🎯 Usage

### 1. **Launch the Application**
- Visit `http://localhost:3000`
- Click "Start Conversation" to begin

### 2. **Admin Setup**
- Navigate to `http://localhost:3000/admin`
- Click "Index Documents" to process sample documentation
- Test queries using the admin interface

### 3. **Voice Conversations**
- Click the microphone button in the chat interface
- Allow microphone permissions when prompted
- Speak naturally - your conversation will be transcribed in real-time

### 4. **Text Chat**
- Type your questions in the chat input
- Get streaming AI responses with source references
- Ask follow-up questions for deeper insights

### 5. **Document Queries**
Try these sample queries:
- "How do I authenticate with the API?"
- "What are the system requirements?"
- "How do I create a new user account?"
- "What security measures are in place?"
- "Explain the rate limiting policy"

## 🔗 API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/index-documents` | `POST` | Index documents into Pinecone vector database |
| `/api/query` | `POST` | Query the RAG system with text |
| `/api/vapi` | `POST` | Voice AI integration with RAG responses |

### Example API Usage

```javascript
// Query the RAG system
const response = await fetch('/api/query', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    query: 'How do I authenticate with the API?',
    topK: 5
  }),
});

const data = await response.json();
console.log(data.response); // AI-generated response
console.log(data.sources);  // Source documents used
```

## 🎨 Customization

### Adding New Documents
1. Place your `.txt` files in the `backend/docs/` directory
2. Visit the admin panel and click "Index Documents"
3. Your new documents will be processed and available for queries

### Styling
The application uses Tailwind CSS with custom gradient designs. Key design elements:
- **Colors**: Blue to emerald gradients for primary elements
- **Typography**: Clean, modern fonts with proper hierarchy
- **Animations**: Smooth hover effects and transitions
- **Responsive**: Mobile-first design approach

## 🔍 Troubleshooting

### Common Issues

**"Missing required environment variables"**
- Ensure all API keys are properly set in `.env.local`
- Restart the development server after adding environment variables

**Voice calls not connecting**
- Verify your VAPI API keys are correct
- Check browser console for error messages
- Ensure microphone permissions are granted

**No responses from queries**
- Check that documents are properly indexed
- Verify your Pinecone index configuration
- Ensure your Google Gemini API key has sufficient quota

**Document indexing fails**
- Verify the `backend/docs/` directory contains `.txt` files
- Check your Pinecone API key and index settings
- Review server logs for detailed error messages

### Development Tips

1. **Environment Variables**: Always restart your development server after changing `.env.local`
2. **API Quotas**: Monitor your usage in Google AI Studio and Pinecone dashboards
3. **Vector Dimensions**: Ensure your Pinecone index uses exactly 768 dimensions
4. **File Formats**: Currently supports `.txt` files in the `backend/docs/` directory

## 📚 Documentation

- **Setup Guide**: See `SETUP.md` for detailed configuration instructions
- **VAPI Setup**: See `VAPI_SETUP.md` for voice AI configuration
- **API Documentation**: Built-in sample API docs in `backend/docs/api-guide.txt`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 🆘 Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Documentation**: Check the `docs/` directory for additional guides
- **Community**: Join discussions in the repository discussions section

## 🚀 Deployment

### Deploy on Vercel

The easiest way to deploy is using the Vercel Platform:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/work-your-docs)

1. Connect your GitHub repository
2. Add your environment variables in the Vercel dashboard
3. Deploy automatically with each push to main

---

**Transform how you work with documents. Start conversing with your docs today! 🚀**