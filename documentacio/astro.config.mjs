import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import starlightThemeNext from 'starlight-theme-next'
import starlightImageZoom from 'starlight-image-zoom'

export default defineConfig({
  site: 'https://mamadoucirebarry.github.io',
  base: '/ISO_PJ1',
  integrations: [
   starlight({
      title: 'ISO - Sistemes Operatius',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/mamadoucirebarry/ISO_PJ1' }
      ],
      plugins: [starlightThemeNext(), starlightImageZoom()],
  }),
  ],
})
