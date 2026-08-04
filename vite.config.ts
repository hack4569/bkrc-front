import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/aladin/search': {
          target: 'https://www.aladin.co.kr',
          changeOrigin: true,
          rewrite(path) {
            const requestUrl = new URL(path, 'http://localhost')
            const params = new URLSearchParams({
              ttbkey: env.ALADIN_TTB_KEY ?? '',
              Query: requestUrl.searchParams.get('Query') ?? '',
              QueryType: 'Keyword',
              SearchTarget: 'Book',
              MaxResults: '10',
              start: '1',
              Cover: 'MidBig',
              output: 'JS',
              Version: '20131101',
            })
            return `/ttb/api/ItemSearch.aspx?${params}`
          },
        },
      },
    },
  }
})
