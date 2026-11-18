const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../database/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const assignedRole = role === 'owner' ? 'owner' : 'farmer';

    // Check if user exists
    const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=15803d&color=fff`;

    const result = await query(
      'INSERT INTO users (name, email, password, role, phone, location, avatar) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashedPassword, assignedRole, phone || '', location || 'Maharashtra, India', avatarUrl]
    );

    const userId = result.insertId;
    const token = jwt.sign(
      { id: userId, email: email.toLowerCase().trim(), name, role: assignedRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      token,
      user: {
        id: userId,
        name,
        email: email.toLowerCase().trim(),
        role: assignedRole,
        phone: phone || '',
        location: location || 'Maharashtra, India',
        avatar: avatarUrl
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

exports.me = async (req, res) => {
  try {
    const users = await query('SELECT id, name, email, role, phone, location, avatar, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: users[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Error retrieving user data.' });
  }
};

exports.demoLogin = async (req, res) => {
  try {
    const { role } = req.params; // 'farmer' or 'owner'
    const targetEmail = role === 'owner' ? 'owner@yieldrent.com' : 'farmer@yieldrent.com';

    const users = await query('SELECT * FROM users WHERE email = ?', [targetEmail]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'Demo user not found. Please run database seed.' });
    }

    const user = users[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: `Signed in as Demo ${user.role === 'owner' ? 'Machinery Owner' : 'Farmer'}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    return res.status(500).json({ success: false, message: 'Demo login error.' });
  }
};
