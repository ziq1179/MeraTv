# CricStream - Cricket Channels App

## Overview
CricStream is a cricket channel browsing and watching application. Users can browse live cricket matches, highlights, news, T20 league content, and test cricket channels. Features include search, category filtering, language filtering, and a favorites system.

## Architecture
- **Frontend**: React + Vite with shadcn/ui components, wouter routing, TanStack Query
- **Backend**: Express.js with session management
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with dark mode support, cricket-themed green color scheme

## Key Pages
- `/` - Home page with all channels, search, filters, and hero banner
- `/category/:category` - Filtered view by category (live, highlights, news, t20, test)
- `/favorites` - User's favorited channels
- `/live-tv` - Live TV page embedding webcric.com with 7 switchable stream options for T20 World Cup 2026

## API Endpoints
- `GET /api/channels` - List channels with optional query params (category, search, language)
- `GET /api/channels/:id` - Get single channel
- `GET /api/favorites` - Get user's favorites (session-based)
- `POST /api/favorites` - Add favorite (body: { channelId })
- `DELETE /api/favorites/:channelId` - Remove favorite

## Database Schema
- `channels` - Cricket channel data (name, description, category, thumbnailUrl, isLive, viewers, language, country, rating)
- `favorites` - User favorites linking channelId to sessionId

## Recent Changes
- Migrated all channel streams from YouTube to Dailymotion embeds (48 channels total)
- Pakistani cricket content: Har Lamha Purjosh (7 episodes with Shoaib Malik), The Pavilion PSL9 analysis (4 episodes), PSL highlights and ceremonies
- Content includes: classic cricket highlights, Ashes Test series, T20 World Cup 2026 coverage, India vs Pakistan rivalry matches, ICC tournament content
- Categories: Highlights (13), Test Cricket (11), News (14), T20 League (10)
- Languages: English (28), Hindi (4), Urdu (15), Telugu (1)
- 21 Pakistan-focused channels, 7 live channels
- Dark mode toggle with theme persistence
- Session-based favorites system
