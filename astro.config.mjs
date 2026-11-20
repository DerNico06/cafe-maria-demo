// @ts-check
import { defineConfig, envField, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  // Pages stay static; only /kontakt opts out of prerendering for the reservation action.
  adapter: vercel(),
  env: {
    schema: {
      // Secrets are read at runtime on the server and can never be imported into client code.
      RESEND_API_KEY: envField.string({ context: 'server', access: 'secret' }),
      RESERVATION_TO: envField.string({ context: 'server', access: 'secret' }),
      // Resend's shared sender works without a verified domain, but only delivers to the account owner.
      RESERVATION_FROM: envField.string({ context: 'server', access: 'secret', default: 'Café Maria Demo <onboarding@resend.dev>' }),
    },
  },
  // Fonts are downloaded at build time and served from our own domain (no Google request from the visitor).
  fonts: [
    {
      name: 'Young Serif',
      cssVariable: '--font-serif',
      provider: fontProviders.fontsource(),
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      name: 'Hanken Grotesk',
      cssVariable: '--font-sans',
      provider: fontProviders.fontsource(),
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
