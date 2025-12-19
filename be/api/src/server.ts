// /music-store/be/api/src/server.ts
import express from 'express';
import cors from 'cors';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.ALLOWED_ORIGINS?.split(',') || [];
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

// Sui Client Setup
type SuiNetwork = 'mainnet' | 'testnet' | 'devnet' | 'localnet';

const network = (process.env.SUI_NETWORK ?? 'testnet') as SuiNetwork;

const suiClient = new SuiClient({
  url: getFullnodeUrl(network),
});


// PostgreSQL Setup
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING,
  ssl: {
    rejectUnauthorized: false
  }
});

// Contract addresses (update after deployment)
const PACKAGE_ID = process.env.SUI_PACKAGE_ID || '';
const PLATFORM_ID = process.env.SUI_PLATFORM_ID || '';

// =================== Helper Functions ===================

function tierToNumber(tier: string): number {
  const tiers: { [key: string]: number } = {
    'free': 0,
    'premium': 1,
    'vip': 2
  };
  return tiers[tier.toLowerCase()] || 0;
}

function numberToTier(num: number): string {
  const tiers = ['free', 'premium', 'vip'];
  return tiers[num] || 'free';
}

function getTierPrice(tier: number): string {
  const prices = {
    0: '0',
    1: '5000000000', // 5 SUI in MIST
    2: '15000000000' // 15 SUI in MIST
  };
  return prices[tier as keyof typeof prices] || '0';
}

// =================== API Routes ===================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Get all songs
app.get('/api/songs', async (req, res) => {
  try {
    const { tier } = req.query;
    
    let query = 'SELECT * FROM songs ORDER BY created_at DESC';
    const params: any[] = [];
    
    if (tier) {
      const tierNum = tierToNumber(tier as string);
      query = 'SELECT * FROM songs WHERE tier_required <= $1 ORDER BY created_at DESC';
      params.push(tierNum);
    }
    
    const result = await pool.query(query, params);
    
    const songs = result.rows.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      genre: song.genre,
      tier: numberToTier(song.tier_required),
      cover: song.cover_url,
      audioUrl: song.audio_url,
      plays: parseInt(song.plays)
    }));
    
    res.json({ songs });
  } catch (error) {
    console.error('Error fetching songs:', error);
    res.status(500).json({ error: 'Failed to fetch songs' });
  }
});

// Get song by ID
app.get('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    const song = result.rows[0];
    res.json({
      id: song.id,
      title: song.title,
      artist: song.artist,
      album: song.album,
      duration: song.duration,
      genre: song.genre,
      tier: numberToTier(song.tier_required),
      cover: song.cover_url,
      audioUrl: song.audio_url,
      plays: parseInt(song.plays)
    });
  } catch (error) {
    console.error('Error fetching song:', error);
    res.status(500).json({ error: 'Failed to fetch song' });
  }
});

// Add new song (admin only)
app.post('/api/admin/songs', async (req, res) => {
  try {
    const { 
      title, artist, album, duration, genre, 
      tier, audioUrl, coverUrl, txDigest 
    } = req.body;
    
    // In production, verify admin signature here
    
    const tierNum = tierToNumber(tier);
    
    // Generate song ID (in production, get from blockchain event)
    const songId = `0x${Date.now().toString(16)}`;
    
    await pool.query(
      `INSERT INTO songs (id, title, artist, album, duration, genre, tier_required, audio_url, cover_url, tx_digest)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [songId, title, artist, album, duration, genre, tierNum, audioUrl, coverUrl, txDigest]
    );
    
    res.json({ 
      success: true, 
      songId,
      message: 'Song added successfully' 
    });
  } catch (error) {
    console.error('Error adding song:', error);
    res.status(500).json({ error: 'Failed to add song' });
  }
});

// Delete song (admin only)
app.delete('/api/admin/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In production, verify admin signature here
    
    const result = await pool.query('DELETE FROM songs WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Song deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting song:', error);
    res.status(500).json({ error: 'Failed to delete song' });
  }
});

// Get user subscription
app.get('/api/subscription/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM subscriptions WHERE user_address = $1',
      [address]
    );
    
    if (result.rows.length === 0) {
      return res.json({
        tier: 'free',
        expiresAt: 0,
        active: true
      });
    }
    
    const sub = result.rows[0];
    const now = Date.now();
    
    res.json({
      tier: numberToTier(sub.tier),
      expiresAt: parseInt(sub.expires_at),
      active: parseInt(sub.expires_at) > now
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

// Subscribe to tier
app.post('/api/subscribe', async (req, res) => {
  try {
    const { userAddress, tier, txDigest } = req.body;
    
    // Log request để check input từ frontend
    console.log('Received subscribe request:', {
      userAddress,
      tier,
      txDigest
    });
    
    // Verify transaction on Sui blockchain
    const txResponse = await suiClient.getTransactionBlock({
      digest: txDigest,
      options: {
        showEffects: true,
        showEvents: true
      }
    });
    
    // Log full events để debug (xem chính xác type của từng event)
    console.log('Full txResponse:', JSON.stringify(txResponse, null, 2));  // Log toàn bộ response nếu cần chi tiết
    console.log('Events in tx:', txResponse.events || 'No events found');  // Log events array
    
    // Parse subscription event from transaction
    const events = txResponse.events || [];
    
    // Adjust filter: Dùng endsWith để match chính xác hơn (bỏ qua prefix package/module)
    const subscriptionEvent = events.find((e: any) =>
      e.type.endsWith('::subscription::SubscriptionPurchased')  // Adjust này để match full event name, an toàn hơn includes
    );
    
    // Log nếu không tìm thấy
    if (!subscriptionEvent) {
      console.error('No matching SubscriptionPurchased event found. Available event types:', 
        events.map((e: any) => e.type)  // Log tất cả type để xem event thực tế là gì
      );
      return res.status(400).json({ error: 'Invalid transaction - No SubscriptionPurchased event' });
    }
    
    // Log event found để confirm
    console.log('Found SubscriptionPurchased event:', subscriptionEvent);
    
    const tierNum = tierToNumber(tier);
    const now = Date.now();
    const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days
    
    // Upsert subscription (phần này giữ nguyên, đã ok)
    await pool.query(
      `INSERT INTO subscriptions (user_address, tier, expires_at, started_at, tx_digest)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_address)
       DO UPDATE SET tier = $2, expires_at = $3, tx_digest = $5, updated_at = NOW()`,
      [userAddress, tierNum, expiresAt, now, txDigest]
    );
    
    res.json({
      success: true,
      tier: numberToTier(tierNum),
      expiresAt
    });
  } catch (error) {
    console.error('Error processing subscription:', error);  // Log error chi tiết
    res.status(500).json({ error: 'Failed to process subscription' });
  }
});

// Record song play
app.post('/api/play', async (req, res) => {
  try {
    const { songId, userAddress, txDigest } = req.body;
    
    // Verify user has access
    const subResult = await pool.query(
      'SELECT tier, expires_at FROM subscriptions WHERE user_address = $1',
      [userAddress]
    );
    
    const songResult = await pool.query(
      'SELECT tier_required FROM songs WHERE id = $1',
      [songId]
    );
    
    if (songResult.rows.length === 0) {
      return res.status(404).json({ error: 'Song not found' });
    }
    
    const songTier = songResult.rows[0].tier_required;
    const userTier = subResult.rows.length > 0 ? subResult.rows[0].tier : 0;
    const expiresAt = subResult.rows.length > 0 ? parseInt(subResult.rows[0].expires_at) : 0;
    
    // Check access
    if (songTier > 0 && (userTier < songTier || expiresAt < Date.now())) {
      return res.status(403).json({ error: 'Subscription required' });
    }
    
    // Record play
    await pool.query(
      'INSERT INTO play_history (song_id, user_address, tx_digest) VALUES ($1, $2, $3)',
      [songId, userAddress, txDigest]
    );
    
    // Increment play count
    await pool.query(
      'UPDATE songs SET plays = plays + 1 WHERE id = $1',
      [songId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error recording play:', error);
    res.status(500).json({ error: 'Failed to record play' });
  }
});

// Get user play history
app.get('/api/history/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { limit = 50 } = req.query;
    
    const result = await pool.query(
      `SELECT ph.*, s.title, s.artist, s.cover_url 
       FROM play_history ph
       JOIN songs s ON ph.song_id = s.id
       WHERE ph.user_address = $1
       ORDER BY ph.played_at DESC
       LIMIT $2`,
      [address, limit]
    );
    
    res.json({ 
      history: result.rows.map(row => ({
        songId: row.song_id,
        title: row.title,
        artist: row.artist,
        cover: row.cover_url,
        playedAt: row.played_at
      }))
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Get platform stats (for admin dashboard)
app.get('/api/admin/stats', async (req, res) => {
  try {
    const songsCount = await pool.query('SELECT COUNT(*) FROM songs');
    const subsCount = await pool.query('SELECT COUNT(*) FROM subscriptions WHERE expires_at > $1', [Date.now()]);
    const totalPlays = await pool.query('SELECT SUM(plays) FROM songs');
    const tierCounts = await pool.query(
      'SELECT tier, COUNT(*) FROM subscriptions WHERE expires_at > $1 GROUP BY tier',
      [Date.now()]
    );
    
    res.json({
      totalSongs: parseInt(songsCount.rows[0].count),
      activeSubscribers: parseInt(subsCount.rows[0].count),
      totalPlays: parseInt(totalPlays.rows[0].sum || 0),
      tierDistribution: tierCounts.rows.map(row => ({
        tier: numberToTier(row.tier),
        count: parseInt(row.count)
      }))
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// =================== Start Server ===================

const PORT = process.env.PORT || 3001;

async function start() {
  app.listen(PORT, () => {
    console.log(`Backend API server running on port ${PORT}`);
    console.log(`Sui Network: ${process.env.SUI_NETWORK || 'testnet'}`);
    console.log(`Package ID: ${PACKAGE_ID}`);
    console.log(`Connected to PostgreSQL database: ${process.env.DB_NAME}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});

export default app;