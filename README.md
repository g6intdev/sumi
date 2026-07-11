# 4-Panel Manga

A mobile-first communication app for creating expressive 4-panel (4-koma) manga in under a minute.

The goal is to make visual storytelling as effortless as sending a message, while ensuring users feel that **they created the comic**, rather than having AI generate it for them.

---

# Vision

People already communicate using:

- Text
- Emojis
- GIFs
- Stickers
- Memes

This project explores whether **4-panel manga** can become another lightweight communication format.

Instead of typing a prompt and letting AI generate an entire comic, users create comics by arranging characters, expressions, props, backgrounds, and dialogue. The app accelerates creativity rather than replacing it.

---

# Design Principles

- 🎭 User-directed, not AI-directed.
- ⚡ Create a comic in under 60 seconds.
- 📱 Native-first interaction.
- 🧩 Compose stories by arranging visual elements.
- 😊 Users should feel "I made this joke."

---

# Current User Flow

```
Home
    ↓
Choose Characters
    ↓
Panel 1
    ↓
Panel 2
    ↓
Panel 3
    ↓
Panel 4
    ↓
Preview
    ↓
Share
```

Each panel is edited individually while the app maintains the context of a complete 4-panel comic.

---

# Editor Philosophy

The editor should feel like directing actors on a small stage.

Users should:

- Place characters
- Move them around
- Change expressions
- Add dialogue
- Add props
- Choose backgrounds

The editor should **never** feel like:

- Filling out a form
- Prompting an AI
- Editing a database

---

# MVP Scope

Current priorities:

- Character selection
- One-panel editor
- Drag-and-drop interaction
- Speech bubbles
- Expressions
- Backgrounds
- Props
- Comic preview
- Image export
- Native sharing

---

# Not Planned for V1

The following are intentionally out of scope:

- AI story generation
- Public social feed
- Authentication
- Cloud storage
- User profiles
- Monetization
- Marketplace
- Custom avatar builder
- Collaborative editing

The focus is validating the core creation experience before expanding the product.

---

# Technology

- Expo
- Expo Router
- TypeScript
- Expo UI
- React Native
- React Native Gesture Handler
- React Native Reanimated

---

# Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npx expo start
```

Run on:

- iOS Simulator
- Android Emulator
- Expo Go (where supported)
- Web

---

# Project Structure

```
app/            # Expo Router routes
components/     # Reusable UI components
theme/          # Semantic design tokens
assets/         # Images and static assets
```

---

# Future Ideas

Ideas that may be explored after validating the core editor:

- AI-assisted expression suggestions
- AI-assisted dialogue suggestions
- Asset packs
- Photo props
- Native social feed
- Community templates
- Creator monetization

---

# Success Metric

The primary success metric is not downloads.

It is whether someone can think:

> "Something funny just happened."

Open the app.

Create a relatable 4-panel manga in under one minute.

Share it with friends.

And feel:

> "I made this."
