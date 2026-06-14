const userService = require("../services/user.service");
const { sendSuccess } = require("../utils/response.util");

/**
 * Mendapatkan Semua User
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return sendSuccess(res, "Berhasil mengambil data semua user.", users, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Mendapatkan Detail User berdasarkan ID
 */
const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    return sendSuccess(res, "Berhasil mengambil detail data user.", user, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Mengupdate Data User
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    return sendSuccess(res, "Berhasil memperbarui data user.", updatedUser, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * Menghapus User berdasarkan ID
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.deleteUser(id);
    return sendSuccess(res, "Berhasil menghapus user.", deletedUser, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
