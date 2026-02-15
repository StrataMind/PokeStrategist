# ⚡ PokeStrategist

A comprehensive Pokemon team building platform - Phase 1 MVP

## Features (Phase 1)

✅ Create unlimited teams with custom names  
✅ Set team size (1-6 Pokemon, configurable)  
✅ Drag-and-drop Pokemon organization  
✅ Quick add/remove Pokemon  
✅ Team color themes (based on primary type)  
✅ Duplicate team functionality  
✅ Delete team with confirmation  
✅ Pokemon search integration with PokeAPI  
✅ Local storage persistence  

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (state management)
- PokeAPI integration
- Lucide React (icons)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
PokeStrategist/
├── app/
│   ├── page.tsx              # Home page with team list
│   ├── team/[id]/page.tsx    # Team editor
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── api/pokeapi.ts        # PokeAPI integration
│   ├── store/teamStore.ts    # Zustand store
│   └── utils.ts
├── types/
│   ├── pokemon.ts
│   └── team.ts
└── components/               # Future components
```

## Usage

1. **Create a Team**: Click "New Team" button, enter name and size
2. **Add Pokemon**: Click "+" in empty slots, search for Pokemon
3. **Reorder**: Drag and drop Pokemon to reorder
4. **Remove**: Click X button on Pokemon card
5. **Duplicate**: Click copy icon on team card
6. **Delete**: Click trash icon twice to confirm deletion

## Next Steps (Phase 2)

- User authentication
- Advanced team building (moves, abilities, natures)
- Team validation
- Pokemon detail pages
