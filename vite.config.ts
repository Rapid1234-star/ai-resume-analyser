import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  console.log('🔍 Loading environment variables...');
  console.log('VITE_GROQ_API_KEY present:', !!env.VITE_GROQ_API_KEY);
  console.log('Available env vars:', Object.keys(env));

  const apiKey = env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    console.error('❌ VITE_GROQ_API_KEY not found in environment variables');
  } else {
    console.log('✅ VITE_GROQ_API_KEY loaded successfully:', apiKey.substring(0, 20) + '...');
  }

  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],

  };
});
