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
3. **Analytics:** Click 📊 icon to view team analytics
4. **Export:** Click download icon to save team as JSON
5. **Import:** Click "Import" to load team from JSON
6. **Duplicate:** Click copy icon to duplicate team
7. **Delete:** Click trash icon twice to confirm deletion

### Pokemon Customization
1. Click ⚙️ (Settings) icon on any Pokemon
2. Set nickname (max 12 characters)
3. Choose ability from available options
4. Select nature (affects stats)
5. Assign held item
6. Pick up to 4 moves
7. Click "Save Changes"

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
- Team sharing with community
- Battle simulator
- Damage calculator
- EV/IV calculator
- Competitive format validation
- Pokemon detail pages

## 📝 License

MIT

## 🙏 Credits

- Pokemon data from [PokeAPI](https://pokeapi.co/)
- Built with Next.js and Vercel

---

**Made with ⚡ by PokeStrategist Team**
