# Arafat Pro GPT

A sleek, modern AI chat interface that connects to multiple AI models including Claude and Gemini through a unified API proxy.

![Arafat Pro GPT](https://img.shields.io/badge/AI-Chat-6366f1?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                         ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────────┐         ┌──────────────┐         ┌────────────┐  │
│   │              │  HTTP   │              │  API    │            │  │
│   │   Browser    │────────▶│  Your API    │────────▶│  Claude /  │  │
│   │  (This App)  │◀────────│   Proxy      │◀────────│  Gemini    │  │
│   │              │ Stream  │              │         │            │  │
│   └──────────────┘         └──────────────┘         └────────────┘  │
│                                                                      │
│   Frontend (Vite)           Backend Proxy            AI Providers   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User sends a message** → Frontend captures input and any attached images
2. **Message is formatted** → Converted to Anthropic API format with proper content structure
3. **Request sent to proxy** → POST to `/v1/messages` with model selection and conversation history
4. **Streaming response** → Server-Sent Events (SSE) stream the AI response in real-time
5. **UI updates live** → Thinking blocks and text content render as they arrive

### Message Format

The app normalizes all messages for API compatibility:

```javascript
// User messages (can include images)
{
  role: "user",
  content: [
    { type: "image", source: { type: "base64", media_type: "image/png", data: "..." } },
    { type: "text", text: "What's in this image?" }
  ]
}

// Assistant messages (always string)
{
  role: "assistant",
  content: "I can see a beautiful sunset..."
}
```

## Features

| Feature | Description |
|---------|-------------|
| **Multi-Model Support** | Switch between Claude and Gemini models on-the-fly |
| **Real-time Streaming** | Responses stream in as they're generated |
| **Thinking Display** | View AI's reasoning process (collapsible) |
| **Image Analysis** | Upload, paste, or drag-drop images for vision models |
| **Conversation History** | Persistent storage in localStorage |
| **Dark/Light Theme** | Toggle between themes |
| **Markdown Rendering** | Full markdown with syntax highlighting |
| **Code Copy** | One-click code block copying |
| **Mobile Responsive** | Works on all screen sizes |

## Available Models

### Claude Models
- `claude-sonnet-4-5` - Claude Sonnet 4.5
- `claude-sonnet-4-5-thinking` - Claude Sonnet 4.5 with extended thinking
- `claude-opus-4-5-thinking` - Claude Opus 4.5 with extended thinking

### Gemini Models
- `gemini-3-pro-low` - Gemini 3 Pro (standard)
- `gemini-3-pro-high` - Gemini 3 Pro (high quality)
- `gemini-3-flash` - Gemini 3 Flash (fast)
- `gemini-2.5-pro` - Gemini 2.5 Pro
- `gemini-2.5-flash` - Gemini 2.5 Flash
- `gemini-2.5-flash-thinking` - Gemini 2.5 Flash with thinking
- `gemini-2.5-flash-lite` - Gemini 2.5 Flash Lite
- `gemini-3-pro-image` - Gemini 3 Pro for image generation

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/mrx-arafat/arafatProGPT.git
cd arafatProGPT
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Login credentials
VITE_APP_USERNAME=your_username
VITE_APP_PASSWORD=your_password

# Your API proxy endpoint
VITE_API_URL=http://your-api-server:port
```

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173`

## API Requirements

Your backend proxy must implement these endpoints:

### POST `/v1/messages`

Chat completions with streaming support.

**Request:**
```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 16384,
  "stream": true,
  "messages": [
    { "role": "user", "content": "Hello!" }
  ]
}
```

**Response:** Server-Sent Events stream with Anthropic API format:
```
data: {"type":"message_start","message":{...}}
data: {"type":"content_block_start","content_block":{"type":"text"}}
data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}
data: {"type":"message_stop"}
```

### GET `/v1/models`

List available models.

**Response:**
```json
{
  "object": "list",
  "data": [
    { "id": "claude-sonnet-4-5", "object": "model", "description": "Claude Sonnet 4.5" }
  ]
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "summary": "2 total, 2 available",
  "counts": { "total": 2, "available": 2 }
}
```

## Project Structure

```
arafatProGPT/
├── index.html          # Main HTML with login & chat UI
├── src/
│   ├── main.js         # Application logic (auth, chat, API)
│   └── styles.css      # Styles (themes, components, animations)
├── public/
│   └── robot_mascot.png
├── .env.example        # Environment template
├── .env                # Your config (gitignored)
├── vite.config.js      # Vite configuration
├── vercel.json         # Vercel deployment config
├── netlify.toml        # Netlify deployment config
└── package.json
```

## Deployment

### Vercel

```bash
npm i -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_APP_USERNAME`
- `VITE_APP_PASSWORD`
- `VITE_API_URL`

### Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

Add environment variables in Netlify dashboard.

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

## Configuration Options

Settings are stored in browser localStorage:

| Setting | Description | Default |
|---------|-------------|---------|
| API URL | Backend endpoint | From `.env` |
| Default Model | Model for new chats | `claude-sonnet-4-5` |
| Max Tokens | Response length limit | 16384 |
| Show Thinking | Display AI thinking blocks | `true` |
| Auto Scroll | Scroll to new messages | `true` |
| Theme | `dark` or `light` | `dark` |

## Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Build Tool:** Vite 7
- **Markdown:** marked.js
- **Syntax Highlighting:** highlight.js
- **Fonts:** Outfit (Google Fonts)

## License

MIT License

## Author

**Arafat** - [GitHub](https://github.com/mrx-arafat)
