"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password || !name) {
    return { error: "Semua kolom harus diisi!" };
  }

  // Cek apakah email sudah terdaftar
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email sudah digunakan, silakan gunakan email lain." };
  }

  // Enkripsi password sebelum disimpan (SANGAT PENTING!)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user baru ke database
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: true };
}