import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: import.meta.env.VITE_BLINK_PROJECT_ID || 'giftgenie-ai-agent-al0j6wfi',
  publishableKey: import.meta.env.VITE_BLINK_PUBLISHABLE_KEY || 'blnk_pk_a83144cf',
  auth: {
    mode: 'headless',
    authRequired: false
  }
})
