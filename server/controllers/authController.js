const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ValidationError, UnauthorizedError, ConflictError } = require('../utils/errors');
const { sendSuccess } = require('../utils/apiResponse');
const logger = require('../utils/logger');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'imovies_default_jwt_secret',
    { expiresIn: '7d' }
  );
};

/**
 * Register a new user (or upgrade existing user to ADMIN if valid secret provided)
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword, phone, adminSecretKey } = req.body;

    if (!username || !email || !password) {
      throw new ValidationError('Username, email, and password are required');
    }

    if (confirmPassword && password !== confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    if (password.length < 6) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanAdminKey = typeof adminSecretKey === 'string' ? adminSecretKey.trim() : '';
    const validAdminSecret = process.env.ADMIN_REGISTRATION_SECRET || 'imovies_admin_secure_secret_2026';

    // Check if email already registered
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      // If user is registering as admin with the correct admin authorization key
      if (req.body.role === 'ADMIN') {
        if (cleanAdminKey === validAdminSecret) {
          // Verify password to ensure the legitimate owner is upgrading the account
          const isMatch = await existingUser.comparePassword(password);
          if (!isMatch) {
            throw new ConflictError(
              'An account with this email already exists. Please enter your existing account password to upgrade it to Administrator, or use a different email.'
            );
          }

          existingUser.role = 'ADMIN';
          if (username) existingUser.username = username.trim();
          if (phone) existingUser.phone = phone.trim();
          existingUser.isActive = true;
          await existingUser.save();

          const token = signToken(existingUser);
          logger.info(`[Auth] Existing account ${cleanEmail} successfully upgraded to ADMIN`);

          return sendSuccess(
            res,
            {
              user: existingUser,
              token,
            },
            'Account upgraded to Administrator successfully',
            200
          );
        } else {
          logger.warn(`[Auth] Attempted unauthorized admin upgrade for ${cleanEmail}`);
          throw new ValidationError('Invalid admin authorization credentials');
        }
      }

      throw new ConflictError('An account with this email address already exists. Please log in or use a different email.');
    }

    // Check admin creation security: Never allow public users to set admin role without secret key or seed script
    let role = 'USER';
    // If user attempts to register as admin (as shown in UI "Register as an Admin" link):
    if (req.body.role === 'ADMIN') {
      if (cleanAdminKey === validAdminSecret) {
        role = 'ADMIN';
        logger.info(`[Auth] Admin account provisioned for ${cleanEmail}`);
      } else {
        logger.warn(`[Auth] Attempted unauthorized admin registration for ${cleanEmail}`);
        throw new ValidationError('Invalid admin authorization credentials');
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username: username.trim(),
      email: cleanEmail,
      passwordHash,
      phone: phone ? phone.trim() : '',
      role,
    });

    const token = signToken(newUser);

    logger.info(`[Auth] User registered successfully: ${newUser.email} (${newUser.role})`);

    return sendSuccess(
      res,
      {
        user: newUser,
        token,
      },
      'Registration successful',
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Login user (supports both email and username)
 */
const login = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const identifier = (email || username || '').trim();

    if (!identifier || !password) {
      throw new ValidationError('Email or username and password are required');
    }

    // Escape regex characters safely
    const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Allow login by email or username (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: new RegExp(`^${escaped}$`, 'i') },
      ],
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email, username, or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account has been deactivated. Please contact support.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email, username, or password');
    }

    const token = signToken(user);
    logger.info(`[Auth] User logged in successfully: ${user.email} (${user.role})`);

    return sendSuccess(
      res,
      {
        user,
        token,
      },
      'Login successful'
    );
  } catch (err) {
    next(err);
  }
};

/**
 * Get current authenticated user
 */
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user }, 'User profile retrieved');
  } catch (err) {
    next(err);
  }
};

/**
 * Logout
 */
const logout = async (req, res, next) => {
  try {
    return sendSuccess(res, {}, 'Logged out successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
