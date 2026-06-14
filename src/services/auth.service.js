const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const { jwt: jwtConfig } = require("../config/env.config");
const { ConflictError, BadRequestError } = require("../utils/custom-error.util");

/**
 * Membuat Token JWT untuk User
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

/**
 * Registrasi User Baru
 */
const register = async (userData) => {
  const { name, email, password, role } = userData;

  // Cek apakah email sudah terdaftar
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError("Email ini sudah digunakan oleh akun lain.");
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Simpan ke Database
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  // Generate Token
  const token = generateToken(newUser.id);

  return { user: newUser, token };
};

/**
 * Login User
 */
const login = async (email, password) => {
  // Cari user berdasarkan email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new BadRequestError("Email atau password Anda salah.");
  }

  // Validasi Password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new BadRequestError("Email atau password Anda salah.");
  }

  // Format data user (hilangkan password hash)
  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  // Generate Token
  const token = generateToken(user.id);

  return { user: userResponse, token };
};

/**
 * Verifikasi Nama & Email untuk Lupa Password
 */
const verifyReset = async (name, email) => {
  // Cari berdasarkan email (unique index)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Security: Pesan error disamakan agar tidak membocorkan apakah email terdaftar
  if (!user) {
    throw new BadRequestError("Data tidak ditemukan atau tidak cocok.");
  }

  // Validasi Nama (Case Insensitive & Hilangkan spasi berlebih)
  const dbName = user.name.trim().toLowerCase();
  const inputName = name.trim().toLowerCase();

  if (dbName !== inputName) {
    throw new BadRequestError("Data tidak ditemukan atau tidak cocok.");
  }

  // Generate Token Reset Khusus (Berlaku 15 menit)
  const resetToken = jwt.sign(
    { id: user.id, purpose: "reset_password" }, 
    jwtConfig.secret, 
    { expiresIn: "15m" }
  );

  return { resetToken };
};

/**
 * Ganti Password Baru
 */
const resetPassword = async (resetToken, newPassword) => {
  try {
    // Verifikasi validitas token reset
    const decoded = jwt.verify(resetToken, jwtConfig.secret);
    
    if (decoded.purpose !== "reset_password") {
      throw new BadRequestError("Token reset password tidak valid.");
    }
    
    // Hash Password Baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update di Database
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword },
    });

    return true;
  } catch (err) {
    throw new BadRequestError("Token reset password kedaluwarsa atau tidak valid.");
  }
};

module.exports = {
  register,
  login,
  generateToken,
  verifyReset,
  resetPassword,
};
