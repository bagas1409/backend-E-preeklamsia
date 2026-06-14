const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");
const { NotFoundError, ConflictError } = require("../utils/custom-error.util");

/**
 * Mendapatkan Semua User
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

/**
 * Mendapatkan Detail User berdasarkan ID
 */
const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User tidak ditemukan.");
  }

  return user;
};

/**
 * Mengupdate Data User
 */
const updateUser = async (id, updateData) => {
  // Cek apakah user ada
  await getUserById(id);

  const { name, email, password, role } = updateData;
  const updatePayload = {};

  if (name) updatePayload.name = name;

  if (email) {
    // Cek apakah email bentrok dengan user lain
    const emailCheck = await prisma.user.findFirst({
      where: {
        email,
        id: { not: id },
      },
    });

    if (emailCheck) {
      throw new ConflictError("Email ini sudah digunakan oleh akun lain.");
    }
    updatePayload.email = email;
  }

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updatePayload.password = await bcrypt.hash(password, salt);
  }

  if (role) {
    updatePayload.role = role;
  }

  // Lakukan update
  return await prisma.user.update({
    where: { id },
    data: updatePayload,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Menghapus User berdasarkan ID
 */
const deleteUser = async (id) => {
  // Cek apakah user ada
  await getUserById(id);

  // Lakukan delete
  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
