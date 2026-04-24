const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'geostorm_secret_key_2024';
const MAX_USER_SCORES = 20;

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'geostorm.db'));

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    clear_time REAL NOT NULL,
    damage_reduction INTEGER DEFAULT 0,
    graze_count INTEGER DEFAULT 0,
    wave_reached INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
  
  // 新增：用户进度表
  db.run(`CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER PRIMARY KEY,
    geo_fragments INTEGER DEFAULT 0,
    upgrades TEXT DEFAULT '{"armor":0,"engine":0,"core":0,"ammo":0,"fireRate":0}',
    unlocked_weapons TEXT DEFAULT '["basic"]',
    best_wave INTEGER DEFAULT 0,
    total_games_played INTEGER DEFAULT 0,
    total_wins INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// Auth middleware
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (e) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Promisify db methods
function dbGet(sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbRun(sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function dbAll(sql, params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// ============ AUTH ROUTES ============

// Register
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  try {
    const existing = await dbGet('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await dbRun('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    
    // 初始化用户进度
    await dbRun('INSERT INTO user_progress (user_id) VALUES (?)', [result.lastID]);
    
    const token = jwt.sign({ userId: result.lastID, username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, userId: result.lastID, username });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  try {
    const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, userId: user.id, username: user.username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Verify token
app.get('/api/auth/verify', authMiddleware, (req, res) => {
  res.json({ valid: true, userId: req.userId, username: req.username });
});

// ============ PROGRESS ROUTES ============

// Get user progress
app.get('/api/progress', authMiddleware, async (req, res) => {
  try {
    const row = await dbGet('SELECT * FROM user_progress WHERE user_id = ?', [req.userId]);
    if (!row) {
      // 如果没有记录，创建一个
      await dbRun('INSERT INTO user_progress (user_id) VALUES (?)', [req.userId]);
      return res.json({
        geoFragments: 0,
        upgrades: { armor: 0, engine: 0, core: 0, ammo: 0, fireRate: 0 },
        unlockedWeapons: ['basic'],
        bestWave: 0,
        totalGamesPlayed: 0,
        totalWins: 0
      });
    }
    const savedUpgrades = JSON.parse(row.upgrades);
    // 标准化升级数据，确保包含所有客户端期望的字段
    const upgrades = {
      laserDamage: savedUpgrades.laserDamage || savedUpgrades.armor || 0,
      emWaveDamage: savedUpgrades.emWaveDamage || savedUpgrades.engine || 0,
      basicDamage: savedUpgrades.basicDamage || savedUpgrades.core || 0,
      basicFireRate: savedUpgrades.basicFireRate || savedUpgrades.fireRate || 0,
      moveSpeed: savedUpgrades.moveSpeed || 0
    };
    res.json({
      geoFragments: row.geo_fragments,
      upgrades: upgrades,
      unlockedWeapons: JSON.parse(row.unlocked_weapons),
      bestWave: row.best_wave,
      totalGamesPlayed: row.total_games_played,
      totalWins: row.total_wins
    });
  } catch (err) {
    console.error('Get progress error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Update user progress
app.post('/api/progress', authMiddleware, async (req, res) => {
  const { geoFragments, upgrades, unlockedWeapons, bestWave, totalGamesPlayed, totalWins } = req.body;
  
  try {
    const existing = await dbGet('SELECT user_id FROM user_progress WHERE user_id = ?', [req.userId]);
    
    const upgradesStr = JSON.stringify(upgrades || { armor: 0, engine: 0, core: 0, ammo: 0, fireRate: 0 });
    const weaponsStr = JSON.stringify(unlockedWeapons || ['basic']);
    
    if (existing) {
      await dbRun(`
        UPDATE user_progress SET 
          geo_fragments = ?,
          upgrades = ?,
          unlocked_weapons = ?,
          best_wave = ?,
          total_games_played = ?,
          total_wins = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
      `, [geoFragments, upgradesStr, weaponsStr, bestWave, totalGamesPlayed, totalWins, req.userId]);
    } else {
      await dbRun(`
        INSERT INTO user_progress (user_id, geo_fragments, upgrades, unlocked_weapons, best_wave, total_games_played, total_wins)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [req.userId, geoFragments || 0, upgradesStr, weaponsStr, bestWave || 0, totalGamesPlayed || 0, totalWins || 0]);
    }
    
    res.json({ message: 'Progress saved' });
  } catch (err) {
    console.error('Update progress error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ============ SCORE ROUTES ============

// Save score
app.post('/api/scores', authMiddleware, async (req, res) => {
  const { score, clear_time, damageReduction, grazeCount, waveReached } = req.body;
  
  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Invalid score' });
  }
  
  try {
    const result = await dbRun(
      'INSERT INTO scores (user_id, score, clear_time, damage_reduction, graze_count, wave_reached, played_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, score, clear_time || 0, damageReduction ? 1 : 0, grazeCount || 0, waveReached || 0, req.body.played_at || null]
    );
    res.json({ id: result.lastID, message: 'Score saved' });
  } catch (err) {
    console.error('Save score error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get user's recent scores
app.get('/api/scores/me', authMiddleware, async (req, res) => {
  try {
    const rows = await dbAll(
      'SELECT * FROM scores WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [req.userId, MAX_USER_SCORES]
    );
    res.json(rows);
  } catch (err) {
    console.error('Get scores error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get leaderboard (global top - one entry per user, highest score)
app.get('/api/leaderboard', async (req, res) => {
  try {
    const rows = await dbAll(`
      SELECT s.*, u.username 
      FROM scores s 
      JOIN users u ON s.user_id = u.id 
      WHERE u.username NOT IN ('xiaoqi', 'test')
      AND s.id = (
        SELECT s2.id FROM scores s2 
        JOIN users u2 ON s2.user_id = u2.id
        WHERE s2.user_id = s.user_id AND u2.username NOT IN ('xiaoqi', 'test')
        ORDER BY s2.score DESC, s2.clear_time ASC 
        LIMIT 1
      )
      ORDER BY s.score DESC, s.clear_time ASC 
      LIMIT 20
    `);
    res.json(rows);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get user's best score
app.get('/api/scores/best', authMiddleware, async (req, res) => {
  try {
    const row = await dbGet('SELECT MAX(score) as best FROM scores WHERE user_id = ?', [req.userId]);
    res.json({ best: row.best || 0 });
  } catch (err) {
    console.error('Best score error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`GeoStorm server running on port ${PORT}`);
});
