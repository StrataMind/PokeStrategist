# 🤖 LLM Context Guide - PokeStrategist

> **Purpose:** This document provides everything an LLM needs to understand and work on this project.

---

## 📍 Repository Information

- **Git Repository:** https://github.com/StrataMind/PokeStrategist.git
- **Local Path:** `/Users/leo/Desktop/pokestrategist`
- **Live Production URL:** https://pokestrategist.vercel.app
- **Deployment Platform:** Vercel
- **Project Type:** Pokemon Team Builder Web Application

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 15.5.12** (App Router)
- **React 19.0.0**
- **TypeScript 5**
- **Node.js** (latest LTS)

### Styling & UI
- **Tailwind CSS 3.4.1** (utility-first CSS)
- **Lucide React 0.468.0** (icon library)
- **Custom vintage/manuscript design system** (see Design System section)

### State Management
- **Zustand 5.0.2** (lightweight state management)
- **localStorage** (client-side persistence)
- **Prisma + Supabase** (database sync for authenticated users)

### Authentication & Database
- **NextAuth 5.0.0-beta.25** (authentication)
- **Prisma 6.1.0** (ORM)
- **Supabase** (PostgreSQL database)
- **@auth/supabase-adapter** (Supabase integration)

### External APIs
- **PokeAPI** (https://pokeapi.co/) - Pokemon data source
- **Axios 1.7.9** - HTTP client for API calls

### Development Tools
- **ESLint** (code linting)
- **PostCSS** (CSS processing)
- **Autoprefixer** (CSS vendor prefixes)

---

## 🎨 Design System - CRITICAL

### Theme: **Vintage Manuscript / Ancient Compendium**

This is a **consistent design language** used across the entire app. All new components MUST follow these rules:

#### Color Palette
```typescript
// Primary Colors
cream: '#f5f1e8'      // Main background
parchment: '#e8dcc4'  // Card backgrounds
ink: '#2c1810'        // Primary text
gold: '#d4af37'       // Accents, borders, highlights
umber: '#8b7355'      // Secondary text

// Type Colors (Pokemon types)
fire: '#F08030'
water: '#6890F0'
grass: '#78C850'
electric: '#F8D030'
ice: '#98D8D8'
fighting: '#C03028'
poison: '#A040A0'
ground: '#E0C068'
flying: '#A890F0'
psychic: '#F85888'
bug: '#A8B820'
rock: '#B8A038'
ghost: '#705898'
dragon: '#7038F8'
dark: '#705848'
steel: '#B8B8D0'
fairy: '#EE99AC'
normal: '#A8A878'
```

#### Typography
```css
/* Primary Font - Headings, Titles */
font-family: 'Playfair Display', serif;
font-weight: 400, 700, 900;

/* Monospace Font - Code, Stats, Numbers */
font-family: 'DM Mono', monospace;

/* Alternative Serif - Body Text */
font-family: 'Libre Baskerville', serif;
```

#### UI Components Style Rules
```css
/* Cards */
background: parchment (#e8dcc4)
border: 2px solid gold (#d4af37)
box-shadow: 4px 4px 0px rgba(212, 175, 55, 0.3)
border-radius: 0px (sharp corners, no rounding)

/* Buttons */
background: ink (#2c1810)
color: cream (#f5f1e8)
border: 1px solid gold (#d4af37)
padding: 8px 16px
font-family: 'Playfair Display'
transition: all 0.2s

/* Inputs */
background: cream (#f5f1e8)
border: 1px solid umber (#8b7355)
padding: 8px 12px
font-family: 'DM Mono'

/* Headings */
font-family: 'Playfair Display'
color: ink (#2c1810)
text-transform: uppercase
letter-spacing: 2px

/* Pokemon Type Badges */
background: type color (see colors above)
color: white
padding: 4px 8px
font-size: 12px
font-weight: bold
text-transform: uppercase
border-radius: 4px (only type badges have rounded corners)
```

#### Spacing System
- Base unit: **8px**
- Use multiples: 8px, 16px, 24px, 32px, 48px, 64px
- Tailwind classes: `p-2, p-4, p-6, p-8, p-12, p-16`

#### Layout Patterns
```
Page Layout:
- Full width container
- Cream background (#f5f1e8)
- Parchment cards (#e8dcc4)
- Gold borders (#d4af37)
- 4px shadows with gold tint
```

#### Design Don'ts ❌
- **NO rounded corners** (except type badges which use 4px)
- **NO gradients** (flat colors only)
- **NO modern shadows** (use offset box-shadow only)
- **NO bright colors** (stick to muted vintage palette)
- **NO sans-serif fonts** (except DM Mono for code/stats)

---

## 📁 Project Structure

```
pokestrategist/
├── app/                                # Next.js App Router pages
│   ├── page.tsx                        # Dashboard (My Teams)
│   ├── layout.tsx                      # Root layout with fonts, metadata
│   ├── globals.css                     # Global styles, CSS variables
│   │
│   ├── team/[id]/page.tsx             # Team Editor (main editing UI)
│   ├── pokedex/page.tsx               # Pokedex List (all Pokemon)
│   ├── pokedex/[id]/page.tsx          # Pokemon Detail Page (NEW - Phase 2)
│   │
│   ├── analytics/[id]/page.tsx        # Team Analytics Dashboard
│   ├── battle/[id]/page.tsx           # Battle Simulator
│   ├── formats/[id]/page.tsx          # Format Validator
│   ├── share/[id]/page.tsx            # Team Sharing Page
│   ├── compare/page.tsx               # Team Comparison Tool
│   │
│   ├── calculator/page.tsx            # Damage Calculator
│   ├── ev-iv/page.tsx                 # EV/IV Calculator
│   │
│   ├── templates/page.tsx             # Pre-built Team Templates
│   ├── showdown/page.tsx              # Showdown Import/Export
│   ├── fakemon/page.tsx               # Fakemon Creator
│   │
│   ├── auth/signin/page.tsx           # Sign In Page
│   ├── privacy/page.tsx               # Privacy Policy
│   ├── terms/page.tsx                 # Terms of Service
│   │
│   └── api/                           # API Routes
│       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│       ├── teams/route.ts              # Team sync API
│       └── drive/route.ts              # Google Drive backup
│
├── components/                        # Reusable React components
│   ├── Sidebar.tsx                   # Left navigation sidebar
│   ├── TeamCard.tsx                  # Team card on dashboard
│   ├── CommandPalette.tsx            # Ctrl+K command palette
│   ├── PokemonHoverPreview.tsx       # Hover preview with stats
│   ├── KeyboardShortcuts.tsx         # ? shortcut help modal
│   ├── AutoSaveIndicator.tsx         # "Saving..." feedback
│   ├── SyncStatus.tsx                # DB sync status (NEW - Phase 1)
│   ├── Toast.tsx                     # Toast notifications
│   ├── StorageWarning.tsx            # localStorage limit warning
│   ├── AuthProvider.tsx              # Auth context provider
│   ├── StructuredData.tsx            # SEO structured data
│   └── ErrorBoundary.tsx             # Error boundary wrapper
│
├── lib/                              # Business logic and utilities
│   ├── api/
│   │   └── pokeapi.ts               # PokeAPI integration functions
│   │
│   ├── store/
│   │   └── teamStore.ts             # Zustand store (main state)
│   │
│   ├── data/
│   │   ├── gameData.ts              # Natures, items, abilities
│   │   └── templates.ts             # Team template data
│   │
│   ├── utils/
│   │   ├── typeEffectiveness.ts     # Type chart calculations
│   │   ├── showdown.ts              # Showdown format parser
│   │   ├── validator.ts             # Format validation (OU/VGC)
│   │   ├── teamStats.ts             # Team analytics calculations
│   │   ├── exportImage.ts           # Export team as PNG
│   │   └── utils.ts                 # Helper functions
│   │
│   └── hooks/
│       └── useIsMobile.ts           # Mobile detection hook (NEW - Phase 3)
│
├── types/                            # TypeScript type definitions
│   ├── pokemon.ts                   # Pokemon, PokemonSpecies types
│   └── team.ts                      # Team, TeamPokemon types
│
├── prisma/
│   └── schema.prisma                # Database schema
│
├── public/                           # Static assets
│   ├── favicon.svg                  # Site favicon
│   ├── icon-192.png                 # PWA icon (NEW - Phase 1)
│   ├── icon-512.png                 # PWA icon (NEW - Phase 1)
│   └── manifest.json                # PWA manifest
│
├── middleware.ts                     # Next.js middleware (CSP headers)
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
│
├── README.md                        # User-facing README
├── FEATURES.md                      # Complete feature list
├── AUTH_SETUP.md                    # Authentication setup guide
├── SECURITY.md                      # Security best practices
├── VERCEL_ENV.md                    # Vercel environment variables
└── LLM_CONTEXT.md                   # This file (LLM guide)
```

---

## 🗄️ Database Schema (Prisma + Supabase)

```prisma
// prisma/schema.prisma

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  teams         Team[]
}

model Team {
  id          String   @id @default(cuid())
  userId      String
  name        String
  teamSize    Int
  pokemon     Json     // Array of PokemonInTeam objects
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Account {
  // NextAuth account model
}

model Session {
  // NextAuth session model
}
```

### Data Flow
1. **Unauthenticated users:** All data in `localStorage` only
2. **Authenticated users:** Data syncs between `localStorage` and Supabase
3. **Sync events:** CustomEvent API triggers SyncStatus component updates

---

## 🔑 Key Files Explained

### 1. `lib/store/teamStore.ts` (Zustand Store)
**The heart of the application** - manages all state:

```typescript
interface TeamStore {
  // State
  teams: Team[]
  userId: string | null
  
  // Team operations
  addTeam: (team: Team) => void
  updateTeam: (id: string, updates: Partial<Team>) => void
  deleteTeam: (id: string) => void
  
  // Pokemon operations
  addPokemonToTeam: (teamId: string, pokemon: PokemonInTeam, position: number) => void
  removePokemonFromTeam: (teamId: string, position: number) => void
  updatePokemonInTeam: (teamId: string, position: number, updates: Partial<PokemonInTeam>) => void
  
  // Sync
  loadFromDatabase: (userId: string) => Promise<void>
  scheduleDbSync: () => void  // Debounced sync
  manualSync: () => Promise<void>  // Manual trigger
}
```

**Critical Behaviors:**
- **Dual persistence:** localStorage (instant) + database (debounced 2s)
- **Sync events:** Dispatches CustomEvents for sync status
- **Optimistic updates:** UI updates immediately, DB syncs async

### 2. `lib/api/pokeapi.ts` (PokeAPI Integration)
Handles all Pokemon data fetching:

```typescript
// Key functions
export async function searchPokemon(query: string): Promise<Pokemon>
export async function getPokemonById(id: number | string): Promise<Pokemon>
export async function getAllPokemon(): Promise<BasicPokemon[]>
export function getPokemonSprite(id: number | string): string
export function getPokemonRegion(id: number | string): string
```

**Important Notes:**
- PokeAPI returns lowercase names: `pikachu`, `charizard-mega-x`
- Pokemon IDs can be numbers (25 for Pikachu) or strings ('charizard-mega-x')
- Regional forms: `meowth-alola`, `darmanitan-galar-zen`
- Sprite URLs: Prefer official artwork over default sprites

### 3. `app/team/[id]/page.tsx` (Team Editor)
**Most complex page** - full drag-and-drop team builder:

**Features:**
- **View modes:** Region view (desktop) vs Grid view (mobile)
- **Drag-and-drop:** HTML5 Drag API for reordering Pokemon
- **Pokemon search:** Modal with autocomplete
- **Pokemon settings:** Nickname, ability, nature, item, moves
- **Type filtering:** Filter Pokemon by type
- **Real-time sync:** Auto-saves to localStorage + database

**Critical Code Sections:**
- Lines 35-60: Mobile detection and view mode state
- Lines 175-198: View mode toggle buttons
- Lines 204-325: Region view rendering (groups by Pokemon region)
- Lines 327-398: Grid view rendering (simple responsive grid)

### 4. `components/SyncStatus.tsx` (Database Sync Indicator)
Shows real-time sync status for authenticated users:

**States:**
- **syncing:** Yellow spinner + "Syncing..."
- **synced:** Green check + "Synced"
- **error:** Red X + "Sync Error"
- **offline:** Gray slash + "Offline"

**Event Listeners:**
```typescript
window.addEventListener('sync:start', () => setSyncStatus('syncing'))
window.addEventListener('sync:success', () => setSyncStatus('synced'))
window.addEventListener('sync:error', () => setSyncStatus('error'))
```

### 5. `app/pokedex/[id]/page.tsx` (Pokemon Detail Page)
**NEW in Phase 2** - comprehensive Pokemon information:

**Features:**
- Full Pokemon stats with color-coded bars
- Evolution chain with arrows and requirements
- Tabbed interface: Stats / Moves / Evolution / Breeding
- Artwork + sprite display
- Type, abilities, genus, height, weight
- Move list with level learned

**Evolution Chain Logic:**
```typescript
// Recursively walks PokeAPI evolution chain
// Extracts: level, item, trigger, min_happiness, time_of_day
// Example: Eevee → Vaporeon (Water Stone)
```

---

## 🎯 Core Features Summary

### Team Management
- Create/edit/delete teams (1-6 Pokemon per team, configurable)
- Drag-and-drop reordering
- Favorite/star teams
- Bulk operations (delete, export, favorite)
- Import/export JSON
- Import/export Showdown format
- Duplicate teams
- Search teams by name or Pokemon
- Sort teams (Latest, Name, Favorites)
- Undo/Redo (Ctrl+Z/Y, last 10 actions)

### Pokemon Customization
- Nickname (max 12 characters)
- Ability selection
- Nature selection (25 natures with stat modifiers)
- Held item
- Moveset (up to 4 moves)
- EV/IV configuration (in calculator)

### Battle Tools
- **Damage Calculator:** Attack/Defense stats, STAB, type effectiveness
- **EV/IV Calculator:** Calculate final stats with IVs, EVs, nature
- **Battle Simulator:** Turn-based combat with HP tracking

### Competitive Tools
- **Format Validator:** OU, UU, VGC, Ubers, LC compliance checking
- **Team Analytics:** Type coverage, weaknesses, stat averages
- **Team Comparison:** Side-by-side comparison of multiple teams

### Power User Features
- **Command Palette (Ctrl+K):** Quick access to all actions
- **Keyboard Navigation:** Full keyboard support
- **Hover Preview:** See Pokemon stats on hover
- **Auto-save:** Instant localStorage updates
- **Sync Status:** Real-time database sync indicator

### Pokedex
- **List View:** All 1350+ Pokemon with sprites
- **Detail Pages:** Comprehensive Pokemon information
- **Evolution Chains:** Visual evolution paths
- **Type Filtering:** Filter by Pokemon type
- **Region Grouping:** Group by Kanto, Johto, etc.
- **Forms Support:** Mega, Regional, Gigantamax variants

---

## 🔄 State Management Flow

### User Flow: Adding a Pokemon to a Team

```
1. User clicks "+" on empty slot in team editor
   ↓
2. TeamEditor calls setSearchModalOpen(true)
   ↓
3. Search modal appears, user types "pikachu"
   ↓
4. Modal calls searchPokemon("pikachu") from pokeapi.ts
   ↓
5. PokeAPI returns Pokemon data
   ↓
6. User clicks Pokemon in results
   ↓
7. Modal calls teamStore.addPokemonToTeam(teamId, pokemon, position)
   ↓
8. Zustand store:
   - Updates teams array (immutable update)
   - Saves to localStorage (instant)
   - Calls scheduleDbSync() (debounced 2s)
   - Dispatches 'sync:start' CustomEvent
   ↓
9. React re-renders with new Pokemon
   ↓
10. After 2s, sync to Supabase (if authenticated)
    ↓
11. On success: Dispatch 'sync:success' CustomEvent
    ↓
12. SyncStatus component updates UI to "Synced"
```

---

## 📝 Code Conventions

### File Naming
- **React components:** PascalCase (e.g., `TeamCard.tsx`)
- **Utilities:** camelCase (e.g., `typeEffectiveness.ts`)
- **API routes:** lowercase (e.g., `route.ts`)
- **Pages:** lowercase (e.g., `page.tsx`)

### Component Structure
```typescript
'use client'  // If using hooks/browser APIs

import { useState } from 'react'
import { OtherComponent } from '@/components/OtherComponent'

interface Props {
  teamId: string
  onClose: () => void
}

export default function MyComponent({ teamId, onClose }: Props) {
  // 1. Hooks
  const [state, setState] = useState(false)
  
  // 2. Handlers
  const handleClick = () => {
    // logic
  }
  
  // 3. Render
  return (
    <div className="bg-parchment border-2 border-gold">
      {/* JSX */}
    </div>
  )
}
```

### Styling Conventions
- **Use Tailwind utility classes** (not inline styles)
- **Vintage design system colors:** `bg-cream`, `bg-parchment`, `text-ink`, `border-gold`
- **NO rounded corners:** Use `rounded-none` or no `rounded-` class
- **Type badges:** `bg-fire`, `bg-water`, etc.
- **Spacing:** `p-4, p-6, p-8, gap-4, space-y-4`

### TypeScript Best Practices
- **Always define interfaces** for props and data structures
- **Use strict typing** (no `any` unless absolutely necessary)
- **Export types** from `types/` folder
- **Use optional chaining** for PokeAPI data: `pokemon?.stats`

---

## 🐛 Common Issues & Solutions

### Issue: Pokemon not found in PokeAPI
**Solution:** PokeAPI uses lowercase hyphenated names:
- ✅ `pikachu`
- ✅ `charizard-mega-x`
- ❌ `Pikachu`
- ❌ `Charizard Mega X`

### Issue: Sync not working
**Check:**
1. User authenticated? (`teamStore.userId` should be set)
2. Database credentials in `.env.local`?
3. Prisma schema generated? (`npx prisma generate`)
4. Check browser console for sync events

### Issue: Type colors not showing
**Solution:** Tailwind config includes type colors. Use:
```tsx
<div className="bg-fire">Fire type</div>
<div className="bg-water">Water type</div>
```

### Issue: Drag-and-drop not working
**Check:**
1. `draggable={true}` on draggable element
2. `onDragStart`, `onDragOver`, `onDrop` handlers defined
3. `e.preventDefault()` in `onDragOver`

### Issue: Mobile layout breaking
**Solution:** Use `useIsMobile` hook:
```typescript
const isMobile = useIsMobile()

return isMobile ? <GridView /> : <RegionView />
```

---

## 🚀 Development Commands

```bash
# Install dependencies
npm install

# Run development server (localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Generate Prisma client
npx prisma generate

# Push Prisma schema to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 🔐 Environment Variables

Create `.env.local` file:

```bash
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="random-secret-string"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

See `VERCEL_ENV.md` for production environment setup.

---

## 📊 Important Context for LLMs

### When Working on This Project:

1. **ALWAYS follow the vintage design system**
   - Use Playfair Display for headings
   - Use DM Mono for stats/numbers
   - Use parchment backgrounds (#e8dcc4)
   - Use gold borders (#d4af37)
   - NO rounded corners (except type badges)

2. **Understand the dual persistence model**
   - localStorage = instant, client-side
   - Supabase = synced, server-side (authenticated users only)
   - Changes save to localStorage first, then sync to DB after 2s

3. **Pokemon data comes from PokeAPI**
   - Lowercase names: `pikachu`, `charizard-mega-x`
   - IDs can be numbers or strings
   - Always handle null/undefined data gracefully
   - Cache data when possible to avoid rate limits

4. **Mobile-first responsive design**
   - Use `useIsMobile` hook for mobile detection
   - Grid view for mobile, region view for desktop
   - Touch-friendly targets (min 44px × 44px)

5. **Authentication is optional**
   - App works without auth (localStorage only)
   - Auth enables cloud sync + cross-device
   - Check `teamStore.userId` before DB operations

6. **Type safety is critical**
   - All Pokemon data should be typed
   - Use interfaces from `types/` folder
   - Handle optional properties with `?.` operator

7. **Performance considerations**
   - PokeAPI has rate limits (avoid excessive requests)
   - Cache Pokemon data in store/localStorage
   - Debounce database syncs (2s delay)
   - Use React.memo for expensive components

8. **SEO & PWA**
   - Structured data in `StructuredData.tsx`
   - PWA manifest with icons
   - Metadata in `layout.tsx`
   - Sitemap at `/sitemap.ts`

---

## 🎯 Recent Updates (Phase 1-3)

### Phase 1: Critical Bug Fixes ✅
- Fixed PWA icon 404 errors (added icon-192.png, icon-512.png)
- Fixed Google Analytics CSP violations (updated middleware.ts)
- Added database sync status indicator (SyncStatus.tsx)
- Added manual sync button for authenticated users

### Phase 2: Enhanced Pokedex ✅
- Created detailed Pokemon pages (`/pokedex/[id]`)
- Added evolution chain visualization
- Added tabbed interface (Stats/Moves/Evolution/Breeding)
- Linked Pokedex list to detail pages

### Phase 3: Mobile Optimization ✅
- Added view mode toggle (Region view vs Grid view)
- Implemented `useIsMobile` hook
- Auto-selects grid view on mobile devices
- Made all layouts responsive

### Current Status
- **7 features completed** (58%)
- **5 features pending** (Phase 4)
- **All builds passing** ✅
- **Deployed to production** ✅

---

## 🎨 Design Assets

### Fonts (Google Fonts)
- Playfair Display (400, 700, 900)
- DM Mono (400, 500)
- Libre Baskerville (400, 700)

### Icons
- Lucide React icon library
- Pokemon sprites from PokeAPI

### Images
- Pokemon artwork from PokeAPI CDN
- Fallback to default sprites

---

## 📚 External Resources

- **PokeAPI Docs:** https://pokeapi.co/docs/v2
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Zustand Docs:** https://zustand-demo.pmnd.rs/
- **Prisma Docs:** https://www.prisma.io/docs

---

## 🤝 Contributing Guidelines

When making changes:

1. **Read this document first** to understand the project
2. **Follow the design system** (vintage manuscript theme)
3. **Test on mobile** (use Chrome DevTools mobile view)
4. **Run TypeScript checks** (`npm run build`)
5. **Test authentication** (both logged in and logged out states)
6. **Update documentation** if adding new features
7. **Commit with clear messages** following conventional commits

---

## 🎓 Learning Resources

### Understanding the Codebase
- **Start with:** `app/page.tsx` (dashboard)
- **Then:** `lib/store/teamStore.ts` (state management)
- **Then:** `app/team/[id]/page.tsx` (team editor)
- **API:** `lib/api/pokeapi.ts` (Pokemon data)
- **Utilities:** `lib/utils/` (helper functions)

### Key Concepts
- **Next.js App Router:** File-based routing in `app/` folder
- **Zustand:** Simple state management (like Redux but lighter)
- **Tailwind CSS:** Utility-first CSS framework
- **PokeAPI:** RESTful Pokemon data API
- **Prisma:** Type-safe database ORM

---

## ✅ Quick Reference Checklist

Before submitting code changes, ensure:

- [ ] Follows vintage design system (colors, fonts, borders)
- [ ] Works on mobile (< 768px viewport)
- [ ] Works for unauthenticated users (localStorage only)
- [ ] Works for authenticated users (syncs to database)
- [ ] TypeScript compiles without errors
- [ ] No console errors in browser
- [ ] Tested drag-and-drop (if applicable)
- [ ] Tested with real PokeAPI data
- [ ] Updated relevant documentation
- [ ] Follows file naming conventions

---

## 🚨 Critical Rules (DO NOT VIOLATE)

1. **NEVER break the vintage design system**
   - No rounded corners (except type badges)
   - No modern gradients or shadows
   - Stick to cream/parchment/gold color palette

2. **NEVER assume user is authenticated**
   - Always check `teamStore.userId`
   - App must work without database

3. **NEVER make excessive PokeAPI requests**
   - Cache data in store or localStorage
   - Debounce search inputs
   - Use stored data when possible

4. **NEVER break TypeScript compilation**
   - All code must type-check
   - No `any` types without good reason
   - Handle null/undefined properly

5. **NEVER commit sensitive data**
   - No API keys in code
   - No database credentials
   - Use environment variables

---

## 📞 Need Help?

If you're an LLM working on this project and encounter issues:

1. **Check this document** for context
2. **Read the relevant source file** mentioned above
3. **Check existing similar features** for patterns
4. **Test your changes locally** before committing
5. **Ask for clarification** if requirements are unclear

---

**Last Updated:** 2026-04-01  
**Version:** 1.0  
**Maintained By:** PokeStrategist Team

---

*This document is designed to give LLMs (and humans) complete context about the PokeStrategist project. Keep it updated as the project evolves.*
