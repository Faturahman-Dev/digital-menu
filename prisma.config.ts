import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  // Kasih tau Prisma letak file schema lu
  schema: "prisma/schema.prisma",

  // Ganti env bawaan pakai process.env bawaan Node
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
