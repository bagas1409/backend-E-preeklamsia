const express = require("express");
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validator.middleware");
const { protect, restrictTo } = require("../middlewares/auth.middleware");
const { userIdParamSchema, updateUserSchema } = require("../validators/user.validator");

const router = express.Router();

// Semua route di file ini dilindungi oleh token JWT
router.use(protect);

// GET /users (Hanya Admin yang bisa melihat semua user)
router.get("/", restrictTo("ADMIN"), userController.getAllUsers);

// GET /users/me (Melihat data profil login sendiri)
router.get("/me", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Berhasil mengambil data profile login.",
    data: {
      user: req.user,
    },
  });
});

// GET /users/:id (Melihat detail data user)
router.get("/:id", validate(userIdParamSchema), userController.getUserById);

// PUT /users/:id (Update data user - Hanya Admin atau user pemilik data itu sendiri yang bisa)
// Catatan: Untuk kesederhanaan template, Admin & User terproteksi divalidasi disini.
router.put("/:id", validate(updateUserSchema), userController.updateUser);

// DELETE /users/:id (Hanya Admin yang bisa menghapus user)
router.delete("/:id", validate(userIdParamSchema), restrictTo("ADMIN"), userController.deleteUser);

module.exports = router;
