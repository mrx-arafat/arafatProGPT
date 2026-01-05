# Arafat Chat

A modern, full-featured AI chat application powered by Claude and Gemini models through Antigravity Proxy.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           HOW IT WORKS                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│   ┌──────────────┐     ┌───────────────────┐     ┌──────────────────┐   │
│   │              │     │   Cloudflare      │     │                  │   │
│   │   Browser    │────▶│   Tunnel          │────▶│  Local Backend   │   │
│   │  (Frontend)  │     │                   │     │  (Port 8080)     │   │
│   │              │◀────│  chat.arafatops   │◀────│                  │   │
│   └──────────────┘     │      .com         │     └──────────────────┘   │
│                        └───────────────────┘              │              │
│                                                           │              │
│                                                           ▼              │
│                                                  ┌──────────────────┐   │
│                                                  │  Antigravity     │   │
│                                                  │  Claude Proxy    │   │
│                                                  │  (AI API Calls)  │   │
│                                                  └──────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Components

| Component | Description | Location |
|-----------|-------------|----------|
| **Frontend** | Static HTML/CSS/JS chat interface | This repo (deployed anywhere) |
| **Cloudflare Tunnel** | Secure tunnel exposing local server to internet | `cloudflared` on your machine |
| **Backend API** | Antigravity Claude Proxy handling AI requests | `localhost:8080` |

## Quick Start

### 1. Start the Backend API

Make sure your Antigravity Claude Proxy is running on port 8080:

```bash
cd antigravity-claude-proxy
npm start
# or
python main.py
```

### 2. Start the Cloudflare Tunnel

```bash
./start-tunnel.sh
```

This exposes your local backend at `https://chat.arafatops.com`

### 3. Open the App

Open `index.html` in a browser, or visit your deployed URL.

## Tunnel Configuration

The Cloudflare Tunnel is configured at `~/.cloudflared/config.yml`:

```yaml
tunnel: df7eceed-e2cb-4b9c-aa02-dfcf191402f0
credentials-file: /Users/easinarafat/.cloudflared/df7eceed-e2cb-4b9c-aa02-dfcf191402f0.json

ingress:
  - hostname: chat.arafatops.com
    service: http://localhost:8080
  - service: http_status:404
```

### Tunnel Commands

| Command | Description |
|---------|-------------|
| `./start-tunnel.sh` | Start the tunnel (recommended) |
| `cloudflared tunnel run` | Start tunnel manually |
| `pkill cloudflared` | Stop the tunnel |
| `tail -f /tmp/cloudflared.log` | View tunnel logs |
| `cloudflared tunnel info` | Show tunnel status |

## Features

- **Multi-Model Support**: Switch between Claude Sonnet, Claude Opus, and Gemini models
- **Image Upload**: Send images for vision-capable models to analyze
- **Streaming Responses**: Real-time streaming with typing indicators
- **Thinking Display**: View AI's thinking process (collapsible)
- **Markdown Rendering**: Full markdown support with syntax highlighting
- **Code Copy**: One-click code copying from responses
- **Conversation History**: Persistent conversation storage in localStorage
- **Dark/Light Theme**: Toggle between themes
- **Mobile Responsive**: Works great on all devices
- **Authentication**: Login screen with fun error messages

## Deployment Options

### Option 1: Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Option 2: Netlify

```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Option 3: GitHub Pages

1. Push to GitHub
2. Settings > Pages > Select branch
3. Access at `https://yourusername.github.io/repo-name`

### Option 4: Local Only

Just open `index.html` in your browser!

## File Structure

```
arafatProGPT/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles (dark/light themes)
├── js/
│   └── app.js          # Application logic
├── start-tunnel.sh     # Tunnel startup script
├── vercel.json         # Vercel config
├── netlify.toml        # Netlify config
└── README.md           # This file
```

## Configuration

All settings are stored in browser localStorage:

| Setting | Description | Default |
|---------|-------------|---------|
| API URL | Backend proxy URL | `https://chat.arafatops.com` |
| Default Model | Model for new chats | `claude-sonnet-4-5-thinking` |
| Max Tokens | Maximum response length | 8192 |
| Show Thinking | Display AI thinking blocks | true |
| Auto Scroll | Auto-scroll to new messages | true |
| Theme | dark or light | dark |

## API Endpoints

The app expects these endpoints from the backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/messages` | POST | Chat completions (streaming) |
| `/health` | GET | Health check (optional) |

Required headers (automatically included):
- `Content-Type: application/json`
- `anthropic-version: 2023-06-01`
- `ngrok-skip-browser-warning: true`

## Troubleshooting

### "Cloudflare Tunnel error" (Error 1033)

The tunnel is not running. Fix:

```bash
./start-tunnel.sh
```

### "Connection failed" in the app

1. Check if backend is running: `lsof -i :8080`
2. Check if tunnel is running: `pgrep cloudflared`
3. Check tunnel logs: `tail -f /tmp/cloudflared.log`

### "Nothing running on port 8080"

Start your backend API first:

```bash
cd antigravity-claude-proxy
npm start
```

## Authentication

Default credentials (configured in `js/app.js`):
- Username: `arafat`
- Password: `Arafat@123456`

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - Feel free to modify and distribute.
