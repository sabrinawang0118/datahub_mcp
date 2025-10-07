# Deployment Guide for DataHub MCP Server on Render

This guide walks you through deploying the DataHub MCP Server to Render.

## Prerequisites

1. A [Render account](https://render.com) (free tier available)
2. A GitHub account with this repository
3. A running DataHub instance with:
   - GMS URL (e.g., `http://localhost:8080` or `https://your-tenant.acryl.io`)
   - Personal Access Token

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. Push this code to your GitHub repository:
```bash
git init
git add .
git commit -m "Initial commit: DataHub MCP Server"
git remote add origin https://github.com/yourusername/datahub-mcp-server.git
git push -u origin main
```

### Step 2: Create a Render Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button in the top right
3. Select **"Web Service"**

### Step 3: Connect Your Repository

1. Click **"Connect a repository"**
2. Authorize Render to access your GitHub account if needed
3. Select your `datahub-mcp-server` repository
4. Click **"Connect"**

### Step 4: Configure Your Service

Fill in the following settings:

**Basic Settings:**
- **Name**: `datahub-mcp-server` (or your preferred name)
- **Region**: Choose the region closest to your DataHub instance
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (unless your code is in a subdirectory)

**Important:** Render auto-detects Node.js from your `package.json`. If you don't see build command fields:

1. **Look for "Build Command" and "Start Command" fields** - they might be:
   - In an "Advanced" section (click to expand)
   - Under a "Commands" section
   - Below the basic settings (scroll down)

2. **If you see them**, enter:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **If you DON'T see them**, Render may be using your `package.json` scripts automatically:
   - It will run `npm install` and `npm run build` automatically
   - It will use the `start` script from your `package.json`
   - This is fine! Just proceed to the next step.

**Plan:**
- Select **"Free"** for testing (or choose a paid plan for production)

### Step 5: Set Environment Variables

In the **Environment Variables** section, add the following:

| Key | Value | Notes |
|-----|-------|-------|
| `DATAHUB_GMS_URL` | `http://your-datahub-url:8080` | Your DataHub GMS endpoint |
| `DATAHUB_GMS_TOKEN` | `your_token_here` | Your DataHub personal access token |
| `PORT` | `10000` | Render's default port (auto-set) |
| `NODE_ENV` | `production` | Optional, for production optimizations |

**Important:** Mark `DATAHUB_GMS_TOKEN` as a secret by clicking the lock icon.

### Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your service
3. Wait for the deployment to complete (usually 2-5 minutes)
4. You'll see "Live" status when deployment is successful

### Step 7: Verify Deployment

Once deployed, your service will be available at:
```
https://datahub-mcp-server-xxxx.onrender.com
```

Test the health endpoint:
```bash
curl https://your-service-name.onrender.com/health
```

You should see:
```json
{
  "status": "healthy",
  "service": "datahub-mcp-server",
  "timestamp": "2025-10-07T12:00:00.000Z"
}
```

## Using the Deployed Server

### With Claude Desktop

Update your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "datahub": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/client", "https://your-service-name.onrender.com"]
    }
  }
}
```

### With Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "datahub": {
      "url": "https://your-service-name.onrender.com"
    }
  }
}
```

## Monitoring and Logs

### View Logs

1. Go to your service in Render Dashboard
2. Click on the **"Logs"** tab
3. You can see real-time logs and filter by type

### Monitor Health

Render automatically monitors your `/health` endpoint:
- If it returns 200 OK, the service is considered healthy
- If it fails, Render will attempt to restart the service

### Metrics

In the Render Dashboard, you can view:
- CPU usage
- Memory usage
- Request count
- Response times

## Troubleshooting

### Service Won't Start

**Check Logs:**
1. Go to Render Dashboard → Your Service → Logs
2. Look for error messages in the build or deploy logs

**Common Issues:**
- Missing environment variables → Add them in the Environment tab
- Invalid DataHub token → Generate a new token
- Wrong Node.js version → Ensure `package.json` specifies `"engines": { "node": ">=18.0.0" }`

### Health Check Failing

**Symptoms:**
- Service shows as "Unhealthy" in Render
- Automatic restarts

**Solutions:**
1. Check that PORT environment variable is set to `10000`
2. Verify the health endpoint is responding:
   ```bash
   curl https://your-service-name.onrender.com/health
   ```
3. Check logs for errors in the health server startup

### Can't Connect to DataHub

**Verify Configuration:**
1. Check `DATAHUB_GMS_URL` is correct
2. Test DataHub connectivity from your local machine:
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        https://your-datahub-url/api/v2/graphql
   ```
3. Ensure your DataHub instance is publicly accessible (or use Render's Private Services)

### Memory Issues (Free Tier)

Render's free tier has 512MB RAM limit:
- Monitor memory usage in Dashboard
- Consider upgrading to a paid plan if needed
- Optimize your code to reduce memory footprint

## Updating Your Deployment

### Automatic Deploys

Render automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update server"
git push origin main
```

### Manual Deploy

In Render Dashboard:
1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback

If a deployment fails:
1. Go to **"Events"** tab
2. Find a previous successful deployment
3. Click **"Rollback to this version"**

## Advanced Configuration

### Custom Domain

1. In Render Dashboard, go to **"Settings"** → **"Custom Domain"**
2. Add your domain (e.g., `datahub-mcp.yourdomain.com`)
3. Update your DNS records as instructed
4. Render provides free SSL certificates

### Environment-Specific Configs

Create multiple services for different environments:
- `datahub-mcp-dev` → Development
- `datahub-mcp-staging` → Staging
- `datahub-mcp-prod` → Production

Each with different environment variables.

### Scaling

For production use:
1. Upgrade from Free tier to Starter or higher
2. Enable **"Auto-Scaling"** in service settings
3. Configure min/max instances based on load

## Cost Optimization

### Free Tier Limitations

- 750 hours/month free (enough for 1 service running 24/7)
- Service spins down after 15 minutes of inactivity
- Cold starts take 30-60 seconds

### Keeping Service Active

To prevent spin-down (requires paid plan):
1. Upgrade to Starter plan ($7/month)
2. Service stays active 24/7
3. No cold starts

### Alternative: Scheduled Pings

For free tier, use a service like [UptimeRobot](https://uptimerobot.com) to ping your health endpoint every 5 minutes.

## Security Best Practices

1. **Never commit secrets**: Use environment variables for tokens
2. **Rotate tokens regularly**: Generate new DataHub tokens periodically
3. **Use HTTPS**: Render provides SSL by default
4. **Restrict access**: Consider adding authentication if exposing publicly
5. **Monitor logs**: Regularly check for suspicious activity

## Support

- **Render Support**: https://render.com/docs
- **DataHub Docs**: https://datahubproject.io/docs
- **MCP Docs**: https://modelcontextprotocol.io
- **Issues**: Open an issue in this repository
