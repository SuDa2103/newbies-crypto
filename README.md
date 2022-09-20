# Notion-Paywall Quickstart

- Duplicate `.env.example`, rename it to `.env`, and replace the env variables with your own.

  _If you're using the vercel CLI, run `vercel pull --env .env.local`_

- Adapt the `line_items` in `/pages/api/checkout_sessions/index.ts` as works best for whatever you're selling.
- Run `npm install`
- Open http://localhost:3000
- Test the purchase -> slack notification -> signin workflow locally
- Deploy to production - I recommend [Vercel](https://nextjs.org/learn/basics/deploying-nextjs-app/platform-details)
- Test the purchase -> slack notification -> signin workflow on production (maybe with a lower price)
- Publish your website to the internet 🚀

---

Something's not quite right? Contact customer support at hello@notion-paywall.com
