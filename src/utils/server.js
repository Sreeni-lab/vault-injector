// server.js (CommonJS-style)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

// Configure CORS with options
app.use(cors({
  origin: '*',  // In production, you might want to restrict this to your domain
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Vault-Token', 'X-Vault-Namespace'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Add error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

// Add middleware error handling
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  res.status(500).json({ success: false, error: err.message });
});

app.use(bodyParser.json());

// Add basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Helper function to make Vault requests
async function makeVaultRequest(url, method, path, headers = {}, body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${url}${path}`, options);
    const textResponse = await response.text();
    let data;

    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      console.error('Failed to parse response as JSON:', textResponse);
      throw new Error(`Invalid JSON response: ${textResponse}`);
    }

    if (!response.ok) {
      console.error('Vault error response:', data);
    }

    return {
      success: response.ok,
      data,
      status: response.status
    };
  } catch (error) {
    console.error('Error making Vault request:', error);
    throw error;
  }
}

// Test Vault connection
app.post('/api/vault/test', async (req, res) => {
  try {
    const { url, token } = req.body;

    if (!url || !token) {
      throw new Error('URL and token are required');
    }

    const result = await makeVaultRequest(
      url,
      'GET',
      '/v1/auth/token/lookup-self',
      { 'X-Vault-Token': token }
    );

    res.json({ success: result.success });
  } catch (error) {
    console.error('Error testing Vault connection:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Token authentication
app.post('/api/vault/auth/token', async (req, res) => {
  try {
    const { url, token, namespace } = req.body;

    const headers = { 'X-Vault-Token': token };
    if (namespace) headers['X-Vault-Namespace'] = namespace;

    const result = await makeVaultRequest(
      url,
      'GET',
      '/v1/auth/token/lookup-self',
      headers
    );

    if (result.success) {
      res.json({ success: true, token });
    } else {
      res.status(result.status).json({
        success: false,
        error: result.data?.errors?.[0] || 'Vault auth failed'
      });
    }
  } catch (error) {
    console.error('Token auth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// AppRole authentication
app.post('/api/vault/auth/approle', async (req, res) => {
  try {
    const { url, roleId, secretId, namespace } = req.body;

    const headers = {};
    if (namespace) headers['X-Vault-Namespace'] = namespace;

    const result = await makeVaultRequest(
      url,
      'POST',
      '/v1/auth/approle/login',
      headers,
      {
        role_id: roleId,
        secret_id: secretId
      }
    );

    if (result.success) {
      const token = result.data.auth?.client_token;
      if (token) {
        res.json({ success: true, token });
      } else {
        res.status(400).json({
          success: false,
          error: 'Authentication successful but no token received'
        });
      }
    } else {
      res.status(result.status).json({
        success: false,
        error: result.data?.errors?.[0] || 'AppRole authentication failed'
      });
    }
  } catch (error) {
    console.error('AppRole auth error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload secrets
app.post('/api/vault/secrets', async (req, res) => {
  try {
    const { url, token, namespace, path, secretName, data } = req.body;

    if (!url || !token || !path || !secretName || !data) {
      throw new Error('Missing required parameters');
    }

    const headers = { 'X-Vault-Token': token };
    if (namespace) headers['X-Vault-Namespace'] = namespace;

    // Remove any duplicate 'kv/data' in the path
    const cleanPath = path.replace(/^kv\/data\//, '').replace(/^\//, '');
    const fullPath = `/v1/kv/data/${cleanPath}/${secretName}`;

    const result = await makeVaultRequest(
      url,
      'POST',
      fullPath,
      headers,
      { data }
    );

    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(result.status).json({
        success: false,
        error: result.data?.errors?.[0] || 'Failed to store secret'
      });
    }
  } catch (error) {
    console.error('Secret upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Vault proxy backend running at http://localhost:${PORT}`);
});

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT signal. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
