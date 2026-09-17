const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const { initDb } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const machineryRoutes = require('./routes/machineryRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'YieldRent Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Root route for friendly browser navigation
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>YieldRent Backend API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; padding: 40px; max-width: 540px; width: 100%; text-align: center; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .badge { background: #064e3b; color: #34d399; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; display: inline-block; margin-bottom: 16px; border: 1px solid #059669; }
        h1 { font-size: 28px; margin: 0 0 10px; color: #ffffff; }
        p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
        .btn { display: inline-block; background: #059669; color: #ffffff; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 14px; font-size: 15px; transition: 0.2s; box-shadow: 0 10px 15px -3px rgba(5,150,105,0.4); }
        .btn:hover { background: #10b981; transform: translateY(-2px); }
        .links { margin-top: 30px; padding-top: 20px; border-top: 1px solid #334155; font-size: 13px; color: #64748b; }
        .links a { color: #38bdf8; text-decoration: none; margin: 0 8px; }
        .links a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="badge">● API SERVER ONLINE</div>
        <h1>YieldRent Backend</h1>
        <p>You are viewing the backend REST API server running on port <b>5000</b>. The interactive React frontend application is running on port <b>3000</b>.</p>
        <a href="http://localhost:3000" class="btn">🚀 Open YieldRent Web App</a>
        <div class="links">
          <span>API Endpoints:</span>
          <a href="/api/health" target="_blank">Health</a> &bull;
          <a href="/api/machinery" target="_blank">Machinery</a> &bull;
          <a href="/api/weather?city=pune" target="_blank">Weather Advisory</a>
        </div>
      </div>
    </body>
    </html>
  `);
});


// Start Server
async function startServer() {
  try {
    await initDb();
    const server = app.listen(PORT, () => {
      console.log(`🚀 YieldRent Server is running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`\n❌ [PORT CONFLICT] Port ${PORT} is already in use by another running instance of YieldRent.`);
        console.error(`👉 Close any open terminals running Node.js or run: npx kill-port ${PORT}\n`);
      } else {
        console.error('Server error:', err.message);
      }
      process.exit(1);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err);
    process.exit(1);
  }
}

startServer();
