# 🎯 Skyjo Buddy

A modern, lightweight score tracking application for the Skyjo board game, built with vanilla TypeScript and Web Components.
Totally free, 0 ads, no trackers, no dependencies.

![Bundle Size](https://img.shields.io/badge/bundle-9.4KB%20gzipped-success)
![Build Time](https://img.shields.io/badge/build-375ms-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Framework](https://img.shields.io/badge/framework-none-green)
![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### Creating a Game

1. Click "Create new game"
2. Enter game name and score limit
3. Add at least 2 players
4. Click "Create game"

### Playing

1. Click on a game to view details
2. Click "Finish a round" to add scores
3. Enter each player's score for the round
4. View leaderboard and stats
5. Check history for round-by-round breakdown

### Settings

- **Language**: Switch between English and French
- **Export**: Download game data as JSON
- **Import**: Restore from JSON backup
- **Reset**: Clear all data

## 🌍 Internationalization

The app supports English and French with automatic language detection.

## 🔧 Development

### Available commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Performance

- Bundle: 7.4KB (gzipped)
- Build time: 70ms
- No runtime dependencies
- Pure vanilla JavaScript/TypeScript

## 🚢 Deployment

### Build

```bash
npm run build
```

Output in `dist/` directory.

### Hosting

Deploy the `dist/` folder to any static hosting

### Environment

No environment variables needed. All data stored client-side in LocalStorage.
