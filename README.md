# Nigerian Tax Assistant

An AI-powered chat application that helps users understand Nigeria's 2025 tax laws and regulations. Built with Next.js 16, TypeScript, and a modern, scalable architecture.

## Features

- 💬 **Interactive Chat Interface**: Real-time conversation with AI assistant
- 🖼️ **Image Upload Support**: Attach images to your tax questions
- 🌓 **Dark/Light Mode**: Beautiful theme switching
- 💾 **Persistent History**: Conversations saved automatically
- 📱 **Fully Responsive**: Optimized for mobile and desktop
- ⚡ **Fast & Modern**: Built with Next.js 16 and React 19
- 🎯 **Suggested Prompts**: Quick-start questions for common topics

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file in the root directory:

```env
# Use the mock API for testing (default)
NEXT_PUBLIC_CHAT_API_ENDPOINT=/api/chat

# Or replace with your actual backend API
# NEXT_PUBLIC_CHAT_API_ENDPOINT=https://your-backend-api.com/api/chat
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Project Structure

```
kick-analyst/
├── app/                      # Next.js app directory
│   ├── (main)/              # Main route group
│   ├── api/chat/            # Mock API endpoint (for testing)
│   ├── layout.tsx           # Root layout with theme provider
│   └── globals.css          # Global styles
├── features/                 # Feature-based modules
│   └── chat/                # Chat feature
│       ├── components/      # React components
│       ├── hooks/           # Custom hooks
│       ├── services/        # API integration
│       ├── types/           # TypeScript types
│       └── utils/           # Utility functions
├── components/ui/           # Reusable UI components (shadcn/ui)
├── lib/                     # Shared utilities
└── hooks/                   # Global hooks
```

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (Radix UI)
- **Theme**: next-themes
- **State Management**: React hooks
- **Storage**: localStorage for conversation history

## Connecting Your Backend

The app includes a mock API for testing (`app/api/chat/route.ts`). To connect your real backend:

1. Update `NEXT_PUBLIC_CHAT_API_ENDPOINT` in `.env.local`
2. Your backend should accept POST requests with FormData containing:
   - `message` (string): User's message
   - `image` (File, optional): Uploaded image
   - `conversationId` (string, optional): Conversation ID

3. Your backend should respond with JSON:
```json
{
  "response": "AI assistant's response",
  "conversationId": "unique-id",
  "error": "optional-error-message"
}
```

See `features/chat/README.md` for detailed API documentation.

## Key Features Documentation

### Chat Interface

The main chat component (`features/chat/components/chat-interface.tsx`) orchestrates:
- Message sending and receiving
- Image upload handling
- Conversation persistence
- Error handling and retries

### Theme Switching

Dark/light mode is handled by `next-themes`:
- Toggle button in the header
- System preference support can be enabled
- Smooth transitions between themes
- Persistent user preference

### Conversation History

Conversations are automatically saved to localStorage:
- Create multiple conversations
- Switch between conversations
- Clear history
- Auto-save on every message

### Responsive Design

Mobile-first design with breakpoints:
- Mobile: Full screen chat interface
- Desktop: Centered layout with max-width
- Tablet: Optimized spacing and typography

## Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## Customization

- **Colors**: Edit `app/globals.css` for theme colors
- **Prompts**: Modify `features/chat/components/suggested-prompts.tsx`
- **API Logic**: Update `features/chat/services/chat-api.ts`
- **UI Components**: Customize `components/ui/` components

## Deploy

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or deploy to any Node.js hosting platform that supports Next.js.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
