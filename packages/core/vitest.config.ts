import { resolve } from 'path'

import { defineConfig } from 'vitest/config'

export default defineConfig({
  // plugins: [tsconfigPaths()],
  test: {
    globals: true
  },
  resolve: {
    alias: {
      core: resolve(__dirname, 'src')
    }
  }
})
