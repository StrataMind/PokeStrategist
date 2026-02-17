# ⚡ PokeStrategist

A comprehensive Pokemon team building platform - **All Phases Complete!**

🔗 **Live Demo:** https://pokestrategist.vercel.app

## ✨ Features

### Phase 1: Core Team Builder
✅ Create unlimited teams with custom names  
✅ Set team size (1-6 Pokemon, configurable)  
✅ Drag-and-drop Pokemon organization  
✅ Quick add/remove Pokemon  
✅ Team color themes (based on primary type)  
✅ Duplicate team functionality  
✅ Delete team with confirmation  
✅ Pokemon search integration with PokeAPI  
✅ Local storage persistence  

### Phase 2: Advanced Team Building
✅ Nickname system (12 char limit)  
✅ Ability selector (from Pokemon's abilities)  
✅ Nature selector (25 natures with stat modifiers)  
✅ Held item selector (popular competitive items)  
✅ Move selector (up to 4 moves per Pokemon)  
✅ All customizations saved to localStorage  

### Phase 3: Analytics & Sharing
✅ Team Export/Import (JSON)  
✅ Team Analytics Dashboard:  
  - Offensive type coverage  
  - Defensive weaknesses  
  - Average team stats  
  - Type diversity analysis  
  - Physical vs Special balance  
  - Speed tier insights  

### Phase 4: Additional Features
✅ **Team Management:**
  - Rename teams inline
  - Favorite/star teams
  - Sort teams (Latest, Name, Favorites)
  - Export all teams at once
  - Average stats display on cards

✅ **Pokemon Features:**
  - Autocomplete search suggestions
  - Random Pokemon generator
  - Type filter in team editor
  - Pokemon detail modal with full stats

✅ **Battle Tools:**
  - Damage Calculator (STAB, type effectiveness)
  - EV/IV Calculator (stat calculation)
  - Battle Simulator (turn-based combat)

✅ **Competitive Features:**
  - Format Validator (OU, UU, VGC, Ubers, LC)
  - Team Sharing (shareable links)
  - Species Clause validation
  - Item Clause validation  

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
│   ├── page.tsx                    # Home page with team list
│   ├── team/[id]/page.tsx          # Team editor
│   ├── analytics/[id]/page.tsx     # Team analytics
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
└── components/                     # Future components
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

- User authentication
- Cloud storage
- Multiplayer battles
- Advanced damage calculator with items/weather
- Breeding calculator
- Shiny tracker

## 📝 License

MIT

## 🙏 Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Built with Next.js and Vercel

---

**Made with ⚡ by PokeStrategist Team**
