# Hush Music Social Promo — V1 for Google AI Studio

Single-file web app. No build step, no backend, no API keys.

## What V1 does

- Compose once, select Facebook, Instagram, TikTok, YouTube, Threads, Snapchat, X, and Bluesky accounts
- Per-network options (YouTube title/visibility/Video vs Shorts/made-for-kids/thumbnail/tags, Threads topic/spoiler, Facebook/Instagram Post/Story/Reel, TikTok disclose/AI label, Snapchat Story/Spotlight)
- Description tools: Generate, Shorten, Expand, More Casual, Hook, CTA, Hashtags
- Media upload, photo + video carousel, multi-post threads for X / Bluesky / Threads
- Cross-posting, Post Now, Schedule, Drafts, Ideas, repeat (daily capped at 20), timeslots, require approval
- Queue filters: Scheduled Posts, Published, Drafts, Ideas, Awaiting Approval, Not Approved, Expired Approval, Failed — plus bulk duplicate, delete, and pause
- Media Gallery, Timeslots, Link-In-Bio placeholder, and local-only Analytics (counts from this app only, not platform likes/views)

Honest V1 limit, also shown in the app: this version queues and prepares posts. Post Now moves a post to Published in the local queue and gives Copy text / Share buttons for manual publishing. Live direct posting needs platform API connections in phase 2.

Seeded with the user's two real Street Legends examples from his screenshots. No other accounts, links, or Play URLs were invented.

## Use it in Google AI Studio

1. Go to aistudio.google.com
2. Create a new app (tap + / New app, or the new-app button in AI Studio)
3. Import / pull this code into the new app: upload `index.html` as the app's main file, or paste its contents into the app's code view if your AI Studio project starts empty. Keep the file name `index.html`.
4. Preview it in AI Studio: check Dashboard, Create Post, Queue filters, and the two seeded Street Legends posts.
5. Publish it from AI Studio to get its *.ai.studio link, the same way his other hubs were published.
6. Share that published link with testers. Other people open the link and use their own copy in their browser; posts, drafts, and media metadata save in each person's browser localStorage in V1 — there is no shared backend yet.

## Notes for phase 2

- Shared accounts, team approvals, real analytics, Social Inbox, and direct posting to Meta, TikTok, YouTube, X, and others all need a backend and each platform's API approval. Do not claim direct posting until those connections are built and tested.
- If a platform API is added later, keep the manual Copy / Share path as a fallback.
