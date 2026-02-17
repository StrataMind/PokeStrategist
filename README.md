# ⚡ PokeStrategist

A professional Pokemon team building platform with enterprise-grade UI/UX design.

🔗 **Live Demo:** https://pokestrategist.vercel.app

## ✨ Features

### Core Team Management
✅ Create unlimited teams with custom names  
✅ Set team size (1-6 Pokemon, configurable)  
✅ Drag-and-drop Pokemon organization  
✅ Rename teams inline with edit icon  
✅ Favorite/star teams for quick access  
✅ Sort teams (Latest, Name, Favorites)  
✅ Duplicate teams instantly  
✅ Export individual or all teams (JSON)  
✅ Import teams from JSON  
✅ Delete with confirmation  
✅ Local storage persistence  

### Pokemon Features
✅ Search with autocomplete suggestions  
✅ Support for 2000+ Pokemon including:  
  - Mega Evolutions (charizard-mega-x, etc.)  
  - Regional Forms (meowth-alola, darmanitan-galar, etc.)  
  - Gigantamax Forms (pikachu-gmax, etc.)  
  - All Gen 1-9 Pokemon  
  - Alternative Forms (rotom-heat, deoxys-attack, etc.)  
✅ Random Pokemon generator  
✅ Type filter in team editor  
✅ Pokemon detail modal with full stats  
✅ Nickname system (12 char limit)  
✅ Ability selector  
✅ Nature selector (25 natures with stat modifiers)  
✅ Held item selector  
✅ Move selector (up to 4 moves)  

### Battle Tools
✅ **Damage Calculator**  
  - Attack/Defense stats  
  - Move power calculation  
  - STAB bonus  
  - Type effectiveness multipliers  

✅ **EV/IV Calculator**  
  - Individual Values (0-31)  
  - Effort Values (0-252)  
  - Nature modifiers  
  - Level-based calculations  

✅ **Battle Simulator**  
  - Turn-based combat  
  - HP tracking  
  - Battle log  
  - Pokemon switching  

### Competitive Features
✅ **Format Validator**  
  - OU, UU, VGC, Ubers, LC formats  
  - Species Clause validation  
  - Item Clause validation  
  - Move limit checking  

✅ **Team Sharing**  
  - Generate shareable links  
  - Copy JSON export  
  - Team preview display  

✅ **Team Analytics**  
  - Offensive type coverage  
  - Defensive weaknesses  
  - Average team stats  
  - Type diversity analysis  
  - Physical vs Special balance  
  - Speed tier insights  

## 🎨 Design System

**Professional Enterprise Dashboard**
- Fixed sidebar navigation (256px width)
- Top header bar (64px height)
- 4px border radius maximum
- Navy blue primary (#1e3a8a)
- Gray-100 background (#f3f4f6)
- White cards with subtle borders
- Inter font family
- 8px spacing grid system
- Minimal shadows
- Clean, structured layout

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** Zustand
- **API:** PokeAPI
- **Icons:** Lucide React
- **Deployment:** Vercel

## 🚀 Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open:** [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Dashboard Navigation
- **My Teams** - View and manage all teams
- **Damage Calculator** - Calculate battle damage
- **EV/IV Calculator** - Calculate final stats
- **Import Team** - Load team from JSON
- **Export All** - Download all teams

### Team Management
1. **Create Team:** Click "New Team", enter name and size (1-6)
2. **Edit Team:** Click "Edit" on any team card
3. **Rename Team:** Hover over team name and click edit icon
4. **Favorite Team:** Click star icon to mark as favorite
5. **Sort Teams:** Use dropdown to sort by Latest, Name, or Favorites
6. **Analytics:** Click 📊 icon to view team analytics
7. **Battle:** Click ⚔️ icon to start battle simulator
8. **Validate:** Click ✓ icon to validate for competitive formats
9. **Share:** Click 🔗 icon to generate shareable link
10. **Export:** Click download icon to save team as JSON
11. **Export All:** Click "Export All" to download all teams
12. **Import:** Click "Import" to load team from JSON
13. **Duplicate:** Click copy icon to duplicate team
14. **Delete:** Click trash icon twice to confirm deletion

### Pokemon Customization
1. Click ⚙️ (Settings) icon on any Pokemon
2. Set nickname (max 12 characters)
3. Choose ability from available options
4. Select nature (affects stats)
5. Assign held item
6. Pick up to 4 moves
7. Click "Save Changes"

### Pokemon Search
1. Click "+" on empty slot
2. Type Pokemon name (autocomplete suggestions appear)
3. Press Enter or click Search
4. Click Pokemon to add to team
5. Or click "Random Pokemon" for surprise addition

### Battle Tools
- **Damage Calculator:** Calculate battle damage with stats and modifiers
- **EV/IV Calculator:** Calculate final stats with IVs, EVs, and nature
- **Battle Simulator:** Simulate turn-based battles with your team

### Competitive Tools
- **Format Validator:** Check team compliance with competitive rules
- **Team Sharing:** Generate shareable links or copy JSON

### Team Analytics
- View offensive type coverage
- Identify defensive weaknesses
- See average team stats
- Check type diversity
- Analyze physical vs special balance
- Review speed tier

## 📁 Project Structure

```
pokestrategist/
├── app/
│   ├── page.tsx                    # Dashboard with sidebar
│   ├── team/[id]/page.tsx          # Team editor
│   ├── analytics/[id]/page.tsx     # Team analytics
│   ├── battle/[id]/page.tsx        # Battle simulator
│   ├── formats/[id]/page.tsx       # Format validator
│   ├── share/[id]/page.tsx         # Team sharing
│   ├── calculator/page.tsx         # Damage calculator
│   ├── ev-iv/page.tsx              # EV/IV calculator
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── api/pokeapi.ts              # PokeAPI integration
│   ├── store/teamStore.ts          # Zustand store
│   ├── data/gameData.ts            # Natures, items
│   ├── utils/
│   │   ├── typeEffectiveness.ts    # Type chart calculations
│   │   └── utils.ts                # Helper functions
├── types/
│   ├── pokemon.ts
│   └── team.ts
└── components/                     # Reusable components
```

## 🎮 Features in Detail

### Type Coverage Analysis
- Shows which types your team can hit super-effectively
- Identifies defensive weaknesses
- Visual bars showing coverage strength

### Team Stats
- Average HP, Attack, Defense, Sp. Atk, Sp. Def, Speed
- Visual stat bars
- Comparison metrics

### Team Insights
- Type diversity score (X/18 types)
- Physical vs Special attacker ratio
- Speed tier classification
- Team balance recommendations

## 🔮 Future Enhancements

- User authentication (NextAuth)
- Cloud storage (PostgreSQL/Supabase)
- Multiplayer battles
- Team sharing community
- Advanced damage calculator with weather/items
- Breeding calculator
- Shiny tracker
- Mobile app (React Native)

## 📝 License

MIT

## 🙏 Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Built with Next.js and Vercel

---

**Made with ⚡ by PokeStrategist Team**
