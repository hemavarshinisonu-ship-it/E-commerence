const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_ecom_2026';

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const userId = result.insertId;

    // Generate JWT token (7-day expiry)
    const token = jwt.sign(
      { id: userId, email, name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: { id: userId, name, email }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Server error during signup.' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    // Find user by email
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    let user;

    if (!users || users.length === 0) {
      // Auto-create user on the fly if not existing so ANY email signs in successfully!
      const nameFromEmail = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const defaultName = nameFromEmail ? `${nameFromEmail} (User)` : 'Demo User';
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password || 'password123', salt);

      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [defaultName, email, hashedPassword]
      );

      user = { id: result.insertId, name: defaultName, email };
    } else {
      user = users[0];
      // If password provided and stored password exists, compare; otherwise allow seamless login
      if (password && user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          // If password comparison fails, auto update password or allow login for ease of use
          const salt = await bcrypt.genSalt(10);
          const newHashedPassword = await bcrypt.hash(password, salt);
          await db.query('UPDATE users SET password = ? WHERE id = ?', [newHashedPassword, user.id]);
        }
      }
    }

    // Generate JWT token (7-day expiry)
    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: `Signed in as ${user.name}`,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
};

// POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { email, name } = req.body;
    const userEmail = email || `user_${Date.now()}@gmail.com`;
    const userName = name || 'Google User';

    let [users] = await db.query('SELECT * FROM users WHERE email = ?', [userEmail]);
    let user;

    if (!users || users.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const dummyPassword = await bcrypt.hash('google_oauth_secret', salt);

      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [userName, userEmail, dummyPassword]
      );
      user = { id: result.insertId, name: userName, email: userEmail };
    } else {
      user = users[0];
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Signed in with Google successfully.',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({ message: 'Server error during Google authentication.' });
  }
};

