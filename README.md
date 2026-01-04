# Arafat Chat

A modern, full-featured AI chat application powered by Claude and Gemini models through Antigravity Proxy.

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
- **Offline Capable**: Static files, no server required

## Deployment

### Option 1: Vercel (Recommended)

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (no configuration needed)

Or use Vercel CLI:
```bash
npm i -g vercel
cd arafatchatapp
vercel
```

### Option 2: Netlify

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `arafatchatapp` folder
3. Done!

Or use Netlify CLI:
```bash
npm i -g netlify-cli
cd arafatchatapp
netlify deploy --prod
```

### Option 3: GitHub Pages

1. Push to GitHub
2. Go to repository Settings > Pages
3. Select source branch and `/` (root)
4. Access at `https://yourusername.github.io/repo-name`

### Option 4: Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your GitHub repository
3. Build command: (leave empty)
4. Output directory: `/`
5. Deploy

### Option 5: Any Static Hosting

Just upload the files to any web server or CDN:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Blob Storage
- Firebase Hosting
- Surge.sh

## Usage

1. **Deploy the app** using any method above
2. **Run your Antigravity Proxy** locally:
   ```bash
   cd antigravity-claude-proxy
   npm start
   ```
3. **Expose with ngrok**:
   ```bash
   ngrok http 8080
   ```
4. **Configure the app**:
   - Open the deployed chat app
   - Click Settings (gear icon)
   - Enter your ngrok URL (e.g., `https://abc123.ngrok-free.app`)
   - Save settings

Now anyone with the deployed URL can chat using your local proxy!

## File Structure

```
arafatchatapp/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styles (dark/light themes)
├── js/
│   └── app.js          # Application logic
├── assets/             # (Optional) Custom assets
└── README.md           # This file
```

## Configuration

All settings are stored in browser localStorage:

| Setting | Description | Default |
|---------|-------------|---------|
| API URL | Your ngrok proxy URL | (empty) |
| Default Model | Model to use for new chats | claude-sonnet-4-5-thinking |
| Max Tokens | Maximum response length | 8192 |
| Show Thinking | Display AI thinking blocks | true |
| Auto Scroll | Auto-scroll to new messages | true |
| Theme | dark or light | dark |

## API Requirements

The app expects an Anthropic-compatible API at the configured URL:

- `POST /v1/messages` - Chat completions (streaming)
- `GET /health` - Health check (optional)

Required headers are automatically included:
- `Content-Type: application/json`
- `anthropic-version: 2023-06-01`
- `ngrok-skip-browser-warning: true`

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - Feel free to modify and distribute.

## Credits

Built for use with [Antigravity Claude Proxy](https://github.com/your-repo/antigravity-claude-proxy)
