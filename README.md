# Hush Music Social Promo — V1 (React + Vite)

A modern React & TypeScript web application rewritten from the original Hush Music Social Promo prototype for Google AI Studio.

## Features Preserved & Ported

- **Multi-Network Compose**: Create posts and select accounts across Facebook, Instagram, TikTok, YouTube, Threads, Snapchat, X, and Bluesky.
- **Cross-Posting**: Post to a designated main account and auto-select all linked accounts with one click.
- **Network Customization**:
  - **YouTube**: Video title, visibility (Public/Private/Unlisted), type (Video vs Shorts), Made-for-kids declaration, thumbnail upload, tags.
  - **Threads**: Topic tagging, spoiler image, and spoiler text options.
  - **Facebook**: Facebook Post, Story, and AI-generated content declaration.
  - **Instagram**: Feed Post, Reel, Story, and AI-generated content declaration.
  - **TikTok**: Promotional content disclosure, AI-generated label, and sound options.
  - **Snapchat**: Story and Spotlight posting options.
- **AI-Style Description Tools**: Generate Post, Shorten, Expand, More Casual, Create Hook, Create CTA, and Add Hashtags with instant prompt assistance.
- **Media Support**: Drag-and-drop / upload photos and videos with in-session previews and carousel support for Instagram & Threads.
- **Multi-Post Threads**: Compose threaded chains for X, Bluesky, and Threads.
- **Scheduling & Repetition**:
  - Post Now (moves to local Published status with 1-click Copy / Share).
  - Schedule Post with exact date and time.
  - Drafts & Ideas status storage.
  - Repetition settings: Day (capped at 20 consecutive times), Week, Month (with day/weekday rules), and Timeslots.
  - Post approval requirement toggle.
- **Queue & Filter Management**:
  - Filter by status: Scheduled Posts, Published, Drafts, Ideas, Awaiting Approval, Not Approved, Expired Approval, Failed.
  - Bulk actions: Select All, Bulk Duplicate Posts, and Delete selected.
  - Card actions: Copy text to clipboard, Share via Web Share API, Duplicate to Drafts, Pause / Resume scheduling, Approve / Reject, and Delete.
- **Media Gallery**: Persistent metadata and preview management for uploaded media files.
- **Timeslots**: Custom daily time schedules for Monday through Sunday.
- **Link-in-Bio Manager**: Add and manage custom profile links.
- **Dashboard & Local Analytics**: Quick-glance counters (Total, Scheduled, Published, Drafts) and recent post review.
- **Settings**: Restore Street Legends seed data and manage local workspace storage.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **Styling**: Responsive custom CSS preserving the Hush Music visual identity
- **Storage**: Browser localStorage with safe failovers

## Development

```bash
npm install
npm run dev
```

Build for production:
```bash
npm run build
```
