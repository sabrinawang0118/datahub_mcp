# Getting Started with DataHub MCP Server

Welcome! This guide will help you get your DataHub MCP Server up and running quickly.

## 🎯 What You're Building

A **Model Context Protocol (MCP) server** that connects AI assistants (like Claude and Cursor) to your DataHub instance, enabling them to:

- 🔍 Search for datasets
- 📊 Retrieve metadata and schema information
- 🔗 Explore data lineage
- 🌐 Query any DataHub entity

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **npm** (comes with Node.js)
- [ ] **A DataHub instance** (self-hosted or DataHub Cloud)
- [ ] **DataHub Personal Access Token** (see below for how to get one)
- [ ] **Git** (optional, for version control)

## 🚀 Installation (3 Steps)

### Step 1: Run Setup Script

The easiest way to get started:

```bash
./setup.sh
```

This will:
- Check your Node.js version
- Install all dependencies
- Create a `.env` file
- Build the TypeScript code

### Step 2: Configure Your Environment

Edit the `.env` file with your DataHub credentials:

```bash
nano .env  # or use your favorite editor
```

Update these values:

```env
DATAHUB_GMS_URL=http://localhost:8080  # Your DataHub URL
DATAHUB_GMS_TOKEN=eyJhbGc...           # Your token (see below)
PORT=3000                               # Port for health checks
```

### Step 3: Start the Server

```bash
npm start
```

You should see:

```
Health check server listening on port 3000
DataHub MCP Server running on stdio
```

✅ **Success!** Your server is now running.

## 🔑 Getting Your DataHub Token

### Option A: Self-Hosted DataHub

1. Open your DataHub UI (usually `http://localhost:9002`)
2. Log in with your credentials
3. Click your profile icon (top right)
4. Navigate to **Settings** → **Access Tokens**
5. Click **"Generate Personal Access Token"**
6. Give it a descriptive name (e.g., "MCP Server")
7. Click **"Create"**
8. **Copy the token immediately** (you won't see it again!)
9. Paste it into your `.env` file

### Option B: DataHub Cloud

1. Go to your DataHub Cloud instance: `https://your-tenant.acryl.io`
2. Log in to your account
3. Click your profile → **Settings**
4. Go to **Access Tokens**
5. Click **"Generate Token"**
6. Copy the token
7. Update your `.env`:
   ```env
   DATAHUB_GMS_URL=https://your-tenant.acryl.io
   DATAHUB_GMS_TOKEN=your_token_here
   ```

## 🧪 Testing Your Server

### Test 1: Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "datahub-mcp-server",
  "timestamp": "2025-10-07T12:00:00.000Z"
}
```

### Test 2: DataHub Connection

The server automatically connects to DataHub on startup. Check the logs for any errors.

### Test 3: With an AI Tool

See the "Connect to AI Tools" section below.

## 🤖 Connect to AI Tools

### Claude Desktop

1. **Find your config file:**
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - Linux: `~/.config/Claude/claude_desktop_config.json`

2. **Add this configuration:**

   ```json
   {
     "mcpServers": {
       "datahub": {
         "command": "node",
         "args": ["/Users/sabrina.wang/cursor_project/external_mcp/dist/index.js"],
         "env": {
           "DATAHUB_GMS_URL": "http://localhost:8080",
           "DATAHUB_GMS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

   **Important:** Replace the path with your actual absolute path!

3. **Restart Claude Desktop**

4. **Test it:**
   - Open a new conversation
   - Ask: "Search for datasets about users in DataHub"
   - Claude should use the MCP server to search DataHub

### Cursor

1. **Open Cursor Settings:**
   - Press `Cmd/Ctrl + ,`
   - Search for "MCP" or "Model Context Protocol"

2. **Add server configuration:**

   ```json
   {
     "mcpServers": {
       "datahub": {
         "command": "node",
         "args": ["/Users/sabrina.wang/cursor_project/external_mcp/dist/index.js"],
         "env": {
           "DATAHUB_GMS_URL": "http://localhost:8080",
           "DATAHUB_GMS_TOKEN": "your_token_here"
         }
       }
     }
   }
   ```

3. **Restart Cursor**

4. **Test it:**
   - Open Cursor's AI chat
   - Ask: "What datasets are available in DataHub?"

## 📝 Example Queries

Once connected, try these queries with your AI assistant:

### Basic Search
```
"Search for datasets containing 'customer' in DataHub"
```

### Get Dataset Info
```
"Show me information about the users dataset"
```

### Schema Exploration
```
"What are the columns in the sales_transactions dataset?"
```

### Lineage Analysis
```
"What are the upstream dependencies of the revenue_report dataset?"
```

### Entity Search
```
"Find all dashboards related to marketing"
```

## 🌐 Deploy to Render (Optional)

Want to make your server accessible from anywhere? Deploy it to Render:

### Quick Deploy (5 minutes)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: DataHub MCP Server"
   git remote add origin https://github.com/yourusername/datahub-mcp-server.git
   git push -u origin main
   ```

2. **Create Render Service:**
   - Go to [render.com](https://render.com)
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repo
   - Configure:
     - Build: `npm install && npm run build`
     - Start: `npm start`
   - Add environment variables (same as your `.env`)
   - Click **"Create Web Service"**

3. **Wait for deployment** (2-3 minutes)

4. **Test:**
   ```bash
   curl https://your-service.onrender.com/health
   ```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## 🛠️ Development Workflow

### Making Changes

1. **Edit source files** in `src/`
2. **Rebuild:**
   ```bash
   npm run build
   ```
3. **Restart the server:**
   ```bash
   npm start
   ```

### Development Mode

For faster iteration with auto-reload:

```bash
npm run dev
```

This uses `tsx` to run TypeScript directly without building.

### Watch Mode

To automatically rebuild on file changes:

```bash
npm run watch
```

In another terminal:
```bash
npm start
```

## 🐛 Troubleshooting

### "Cannot connect to DataHub"

**Symptoms:** Server starts but can't reach DataHub

**Solutions:**
1. Check DataHub is running: `curl http://localhost:8080/health`
2. Verify `DATAHUB_GMS_URL` in `.env`
3. Test token manually:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:8080/api/v2/graphql
   ```

### "Authentication failed"

**Symptoms:** 401 or 403 errors

**Solutions:**
1. Verify token is correct and not expired
2. Generate a new token in DataHub
3. Check token has necessary permissions

### "Port already in use"

**Symptoms:** `EADDRINUSE` error

**Solutions:**
1. Change `PORT` in `.env` to a different value
2. Or kill the process using the port:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

### "Module not found" errors

**Symptoms:** Import errors when starting

**Solutions:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### TypeScript compilation errors

**Symptoms:** Build fails

**Solutions:**
1. Check Node.js version: `node -v` (must be 18+)
2. Update TypeScript: `npm install -g typescript`
3. Clean build: `rm -rf dist && npm run build`

## 📚 Next Steps

Now that you're up and running:

1. **Explore the tools** - Try different queries with your AI assistant
2. **Read the docs** - Check out [README.md](README.md) for detailed information
3. **Deploy to production** - See [DEPLOYMENT.md](DEPLOYMENT.md)
4. **Customize** - Modify the server to fit your needs
5. **Contribute** - Share improvements with the community

## 📖 Documentation

- **[README.md](README.md)** - Complete documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Quick reference guide
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical overview

## 🆘 Getting Help

- **Issues:** Open an issue on GitHub
- **DataHub Docs:** https://datahubproject.io/docs
- **MCP Docs:** https://modelcontextprotocol.io
- **Community:** Join DataHub Slack

## ✅ Success Checklist

Before moving to production, make sure:

- [ ] Server starts without errors
- [ ] Health check endpoint responds
- [ ] Can connect to DataHub
- [ ] AI tool can use the server
- [ ] All 6 tools work correctly
- [ ] Environment variables are secure
- [ ] Documentation is up to date

## 🎉 You're All Set!

Congratulations! You now have a working DataHub MCP Server. Your AI assistants can now interact with your DataHub metadata.

**Happy coding!** 🚀

---

**Need help?** Check the troubleshooting section above or open an issue on GitHub.
