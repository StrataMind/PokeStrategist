import { Team } from '@/types/team';

export async function exportTeamAsImage(team: Team): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = '#F5F0E8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#C9A84C';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  // Title
  ctx.fillStyle = '#1A1612';
  ctx.font = 'bold 48px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(team.name, canvas.width / 2, 100);

  // Subtitle
  ctx.font = '20px "DM Mono", monospace';
  ctx.fillStyle = '#6B6560';
  ctx.fillText(`${team.pokemon.length}/6 POKÉMON`, canvas.width / 2, 140);

  // Pokemon grid
  const startY = 200;
  const cols = 3;
  const cellWidth = 350;
  const cellHeight = 180;
  const startX = (canvas.width - (cols * cellWidth)) / 2;

  for (let i = 0; i < team.pokemon.length; i++) {
    const pokemon = team.pokemon[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * cellWidth;
    const y = startY + row * cellHeight;

    // Pokemon card background
    ctx.fillStyle = '#EDE7D3';
    ctx.fillRect(x, y, cellWidth - 20, cellHeight - 20);
    ctx.strokeStyle = '#D4C9B0';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cellWidth - 20, cellHeight - 20);

    // Load and draw sprite
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = pokemon.sprite;
    await new Promise(resolve => {
      img.onload = () => {
        ctx.drawImage(img, x + 20, y + 20, 96, 96);
        resolve(null);
      };
      img.onerror = () => resolve(null);
    });

    // Pokemon name
    ctx.fillStyle = '#1A1612';
    ctx.font = 'bold 24px "Playfair Display", serif';
    ctx.textAlign = 'left';
    ctx.fillText(pokemon.nickname || pokemon.name, x + 130, y + 50);

    // Types
    ctx.font = '14px "DM Mono", monospace';
    pokemon.types.forEach((type, ti) => {
      ctx.fillStyle = getTypeColorHex(type);
      ctx.fillRect(x + 130 + ti * 80, y + 65, 70, 24);
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(type.toUpperCase(), x + 165 + ti * 80, y + 82);
    });

    // Stats
    const stats = Object.entries(pokemon.stats);
    ctx.font = '12px "DM Mono", monospace';
    ctx.textAlign = 'left';
    stats.slice(0, 3).forEach(([stat, value], si) => {
      ctx.fillStyle = '#6B6560';
      ctx.fillText(stat.replace(/([A-Z])/g, ' $1').toUpperCase(), x + 130, y + 105 + si * 18);
      ctx.fillStyle = '#1A1612';
      ctx.textAlign = 'right';
      ctx.fillText(String(value), x + cellWidth - 40, y + 105 + si * 18);
      ctx.textAlign = 'left';
    });
  }

  // Footer
  ctx.fillStyle = '#6B6560';
  ctx.font = '16px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⚡ POKESTRATEGIST', canvas.width / 2, canvas.height - 40);

  // Download
  canvas.toBlob(blob => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${team.name.replace(/\s+/g, '-')}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}

function getTypeColorHex(type: string): string {
  const colors: Record<string, string> = {
    normal: '#A8A878', fire: '#F08030', water: '#6890F0', electric: '#F8D030',
    grass: '#78C850', ice: '#98D8D8', fighting: '#C03028', poison: '#A040A0',
    ground: '#E0C068', flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
    rock: '#B8A038', ghost: '#705898', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', fairy: '#EE99AC'
  };
  return colors[type.toLowerCase()] || '#A8A878';
}
