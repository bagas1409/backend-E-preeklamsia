const authService = require("../services/auth.service");
const { sendSuccess } = require("../utils/response.util");

/**
 * Handle Register User Baru
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return sendSuccess(res, "Registrasi berhasil.", result, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Login User
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    return sendSuccess(res, "Login berhasil.", result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Verify Reset Identity
 */
const verifyReset = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const result = await authService.verifyReset(name, email);
    return sendSuccess(res, "Verifikasi berhasil.", result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Reset Password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { reset_token, new_password } = req.body;
    await authService.resetPassword(reset_token, new_password);
    return sendSuccess(res, "Password berhasil diperbarui.", null, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyReset,
  resetPassword,
};
