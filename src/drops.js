// drops.js - 掉落系统
function spawnDrop(x, y) {
  const totalWeight = DROP_TABLE.reduce((sum, d) => sum + d.weight, 0);
  let rand = Math.random() * totalWeight;
  let selected = DROP_TABLE[0];
  
  for (const drop of DROP_TABLE) {
    rand -= drop.weight;
    if (rand <= 0) { selected = drop; break; }
  }
  
  activeDrops.push({ x, y, ...selected, timer: 180 });
  pendingDrop = { ...selected, timer: 180 };
}

function applyDrop(drop) {
  if (drop.id === 'energy') {
    player.energy = Math.min(getMaxEnergy(), player.energy + 50);
  } else if (drop.id === 'shield') {
    shieldActive = true;
    setTimeout(() => { shieldActive = false; }, 3000);
  } else if (drop.id === 'heal') {
    player.lives = Math.min(5, player.lives + 1);
  }
  pendingDrop = null;
}

function updateDrops() {
  for (let i = activeDrops.length - 1; i >= 0; i--) {
    activeDrops[i].timer--;
    if (activeDrops[i].timer <= 0) {
      activeDrops.splice(i, 1);
    }
  }
  if (pendingDrop) {
    pendingDrop.timer--;
    if (pendingDrop.timer <= 0) pendingDrop = null;
  }
}
