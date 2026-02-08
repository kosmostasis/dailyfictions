import type { NextConfig } from "next";
import path from "path";
import { config as loadEnv } from "dotenv";

// Load local.env.local so AI_GATEWAY_API_KEY etc. are available (Next.js only loads .env / .env.local by default)
loadEnv({ path: path.resolve(process.cwd(), "local.env.local") });

const nextConfig: NextConfig = {};

export default nextConfig;
