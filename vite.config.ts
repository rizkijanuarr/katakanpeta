import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: './src/presentation/navigation/routes',
      generatedRouteTree: './src/presentation/navigation/routeTree.gen.ts',
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@/components': path.resolve(__dirname, './src/presentation/components'),
      '@/features': path.resolve(__dirname, './src/presentation/features'),
      '@/assets': path.resolve(__dirname, './src/presentation/assets'),
      '@/stores': path.resolve(__dirname, './src/core/store'),
      '@/lib': path.resolve(__dirname, './src/core/utils'),
      '@/hooks': path.resolve(__dirname, './src/core/hooks'),
      '@/context': path.resolve(__dirname, './src/core/context'),
      '@': path.resolve(__dirname, './src'),
    },
  },
})
