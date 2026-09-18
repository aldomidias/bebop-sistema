import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Necessário para a imagem Docker: gera um servidor autocontido em
  // .next/standalone, sem precisar copiar node_modules inteiro.
  output: "standalone",
};

export default nextConfig;
