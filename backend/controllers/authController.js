import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserWithPasswordById,
  updateUser,
} from '../services/dataStore.js';

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'festivo_super_secret_jwt_key_2026_college_events',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, department, collegeId, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Assign requested role (student or organizer). Admin role creation can be restricted or seeded.
    const assignedRole = role === 'organizer' ? 'organizer' : 'student';

    const newUser = await createUser({
      name,
      email,
      password,
      role: assignedRole,
      department: department || 'General Studies',
      collegeId: collegeId || `FST-2026-${Math.floor(100 + Math.random() * 900)}`,
      phone: phone || '',
    });

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      success: true,
      message: 'Account successfully registered!',
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        collegeId: newUser.collegeId,
        phone: newUser.phone,
        avatar: newUser.avatar,
        bio: newUser.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password.',
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact an administrator.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Welcome back to Festivo!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        collegeId: user.collegeId,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, department, collegeId, phone, bio, avatar } = req.body;

    const updatedUser = await updateUser(req.user._id, {
      name: name !== undefined ? name : req.user.name,
      department: department !== undefined ? department : req.user.department,
      collegeId: collegeId !== undefined ? collegeId : req.user.collegeId,
      phone: phone !== undefined ? phone : req.user.phone,
      bio: bio !== undefined ? bio : req.user.bio,
      avatar: avatar !== undefined ? avatar : req.user.avatar,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both your current password and a new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters.',
      });
    }

    const userWithPw = await findUserWithPasswordById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, userWithPw.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Incorrect current password.',
      });
    }

    await updateUser(req.user._id, { password: newPassword });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully! Please keep it secure.',
    });
  } catch (error) {
    next(error);
  }
};
