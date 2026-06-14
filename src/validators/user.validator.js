const { z } = require("zod");

const userIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid("Format ID User tidak valid (wajib UUID)."),
  }),
});

const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid("Format ID User tidak valid (wajib UUID)."),
  }),
  body: z.object({
    name: z
      .string()
      .min(2, "Nama minimal harus 2 karakter.")
      .max(100, "Nama maksimal 100 karakter.")
      .optional(),
    email: z
      .string()
      .email("Format email tidak valid.")
      .optional(),
    password: z
      .string()
      .min(6, "Password minimal harus 6 karakter.")
      .optional(),
    role: z.enum(["USER", "ADMIN"]).optional(),
  }),
});

module.exports = {
  userIdParamSchema,
  updateUserSchema,
};
