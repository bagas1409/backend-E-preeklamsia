const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding database...");

  // Hapus data lama jika ada
  await prisma.user.deleteMany({});

  // Buat password terenkripsi
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash("123456789", salt);
  const userPassword = await bcrypt.hash("123456789", salt);

  // Buat Admin
  const admin = await prisma.user.create({
    data: {
      name: "Bagas permana",
      email: "bagaspermana@gmail.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Seeding Admin berhasil: ${admin.email}`);

  // Buat User biasa
  const user = await prisma.user.create({
    data: {
      name: "bagas permana",
      email: "bagaspermana1@gmail.com",
      password: userPassword,
      role: "USER",
    },
  });
  console.log(`Seeding User biasa berhasil: ${user.email}`);

  console.log("Proses seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("Proses seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
