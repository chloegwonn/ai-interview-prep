# AI Interview Prep

An AI-powered interview preparation platform that generates personalized questions and feedback based on your resume.

**Live Demo:** [https://ai-interview-prep-puce-ten.vercel.app](https://ai-interview-prep-puce-ten.vercel.app)

## Features

- Resume analysis with AI-powered insights
- Dynamic question generation tailored to your role and experience
- Voice recording with real-time timer
- Performance tracking and personalized feedback
- Supports multiple roles: Engineering, Design, Product, Marketing, Data Science, Operations, and more

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Google Gemini API (gemini-flash-latest)
- pdfjs-dist for PDF parsing
- Vercel deployment

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- Yarn package manager
- Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/app/apikey))

### Installation
```bash
# Clone the repository
git clone https://github.com/chloegwonn/ai-interview-prep.git
cd ai-interview-prep

# Install dependencies
yarn install

# Create .env.local and add your API key
NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Setup** - Select your role, experience level, and upload your resume (PDF)
2. **Analysis** - AI analyzes your resume and provides strategic insights
3. **Practice** - Answer AI-generated questions with voice recording
4. **Feedback** - Receive personalized feedback and improvement tips

## Deployment

### Vercel

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variable: `NEXT_PUBLIC_GEMINI_API_KEY`
4. Deploy

## Environment Variables

Create a `.env.local` file:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## API Usage

- Rate limit: 10 requests/minute (client-side)
- Responses are cached in sessionStorage
- Gemini API free tier: 15 requests/minute

## License

MIT

## Author

Chloe - [GitHub](https://github.com/chloegwonn)
