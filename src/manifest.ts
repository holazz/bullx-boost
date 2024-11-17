import { defineManifest } from '@crxjs/vite-plugin'
import pkg from '../package.json'

export default defineManifest({
  manifest_version: 3,
  name: pkg.displayName ?? pkg.name,
  version: pkg.version,
  description: pkg.description,
  homepage_url: 'https://github.com/holazz/bullx-boost',
  host_permissions: ['https://bullx.io/pump-vision'],
  action: {
    default_icon: 'src/assets/icon.png',
  },
  content_scripts: [
    {
      all_frames: false,
      matches: ['https://bullx.io/pump-vision'],
      js: ['src/content/index.ts'],
      run_at: 'document_end',
    },
  ],
  web_accessible_resources: [
    {
      resources: ['src/assets/gmgn.png'],
      matches: ['https://bullx.io/*'],
      use_dynamic_url: true,
    },
  ],
  icons: {
    16: 'src/assets/icon.png',
    32: 'src/assets/icon.png',
    48: 'src/assets/icon.png',
    128: 'src/assets/icon.png',
  },
})
