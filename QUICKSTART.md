# Quick Start Guide

Get your DataHub MCP Server up and running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your DataHub credentials:

```env
DATAHUB_GMS_URL=http://localhost:8080
DATAHUB_GMS_TOKEN=your_token_here
PORT=3000
```

### 3. Build and Run

```bash
# Build TypeScript
npm run build

# Start the server
npm start
```

Or run in development mode:

```bash
npm run dev
```

## 🧪 Test It Out

Once running, you should see:

```
Health check server listening on port 3000
DataHub MCP Server running on stdio
```

Test the health endpoint:

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

## 🔑 Getting Your DataHub Token

### Self-Hosted DataHub

1. Open DataHub UI: `http://localhost:9002`
2. Click on your profile (top right)
3. Go to **Settings** → **Access Tokens**
4. Click **"Generate Personal Access Token"**
5. Give it a name and click **"Create"**
6. Copy the token (you won't see it again!)

### DataHub Cloud

1. Go to `https://your-tenant.acryl.io`
2. Click on your profile → **Settings**
3. Navigate to **Access Tokens**
4. Generate a new token
5. Use `https://your-tenant.acryl.io` as your `DATAHUB_GMS_URL`

## 🎯 Using with AI Tools

### Claude Desktop

1. Open Claude Desktop config:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add this configuration:

```json
{
  "mcpServers": {
    "datahub": {
      "command": "node",
      "args": ["/absolute/path/to/datahub-mcp-server/dist/index.js"],
      "env": {
        "DATAHUB_GMS_URL": "http://localhost:8080",
        "DATAHUB_GMS_TOKEN": "your_token_here"
      }
    }
  }
}
```

3. Restart Claude Desktop

4. Test it by asking: "Search for datasets about users"

### Cursor

1. Open Cursor settings (Cmd/Ctrl + ,)
2. Search for "MCP"
3. Add server configuration:

```json
{
  "mcpServers": {
    "datahub": {
      "command": "node",
      "args": ["/absolute/path/to/datahub-mcp-server/dist/index.js"],
      "env": {
        "DATAHUB_GMS_URL": "http://localhost:8080",
        "DATAHUB_GMS_TOKEN": "your_token_here"
      }
    }
  }
}
```

4. Restart Cursor

## 📦 Deploy to Render (5 minutes)

### Quick Deploy

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/datahub-mcp-server.git
git push -u origin main
```

2. Go to [Render Dashboard](https://dashboard.render.com)

3. Click **"New +"** → **"Web Service"**

4. Connect your GitHub repo

5. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

6. Add environment variables:
   - `DATAHUB_GMS_URL`
   - `DATAHUB_GMS_TOKEN`

7. Click **"Create Web Service"**

8. Wait 2-3 minutes for deployment

9. Test: `curl https://your-service.onrender.com/health`

Done! 🎉

## 🔍 Example Queries

Once connected to an AI tool, try these:

### Search for Datasets
```
"Search for datasets containing 'user' in DataHub"
```

### Get Dataset Information
```
"Get information about dataset urn:li:dataset:(urn:li:dataPlatform:hive,user_table,PROD)"
```

### Explore Schema
```
"Show me the schema for the users dataset"
```

### Check Lineage
```
"What are the upstream dependencies of the sales dataset?"
```

### Search All Entities
```
"Find all dashboards related to revenue"
```

## 🐛 Troubleshooting

### "Cannot connect to DataHub"

**Check:**
- Is DataHub running? `curl http://localhost:8080/health`
- Is the URL correct in `.env`?
- Is the token valid?

**Fix:**
```bash
# Test connection
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/v2/graphql
```

### "Module not found" errors

**Fix:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Port already in use

**Fix:**
```bash
# Change PORT in .env
PORT=3001
```

Or kill the process:
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### TypeScript errors

**Fix:**
```bash
npm install -g typescript
npm run build
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide
- Explore available tools and their parameters
- Customize the server for your needs

## 💡 Tips

1. **Use environment-specific configs**: Create `.env.development` and `.env.production`
2. **Monitor logs**: Check server output for errors and debugging info
3. **Test locally first**: Always test changes locally before deploying
4. **Keep tokens secure**: Never commit `.env` files to git
5. **Update regularly**: Keep dependencies up to date with `npm update`

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed docs
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Open an issue on GitHub
- Check DataHub docs: https://datahubproject.io/docs
- Check MCP docs: https://modelcontextprotocol.io

Happy coding! 🚀
