// collision.js - 碰撞检测
function checkCollisions() {
  // Player bullets vs enemies
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const b = playerBullets[i];
    
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (e.hp <= 0) continue;
      if (b.hitTargets && b.hitTargets.includes(e.id)) continue;
      
      const dist = Math.hypot(b.x - e.x, b.y - e.y);
      if (dist < b.radius + e.radius) {
        e.hp -= b.damage;
        floatingTexts.push({ x: e.x, y: e.y - 20, text: Math.floor(b.damage).toString(), life: 30, color: '#ffff00' });
        
        if (b.pierce > 0) {
          b.pierce--;
          b.hitTargets.push(e.id);
          // Find next target
          let nearest = null, minDist = Infinity;
          enemies.forEach(ne => {
            if (ne.hp <= 0 || b.hitTargets.includes(ne.id)) return;
            const d = Math.hypot(b.x - ne.x, b.y - ne.y);
            if (d < minDist) { minDist = d; nearest = ne; }
          });
          if (nearest) {
            const angle = Math.atan2(nearest.y - b.y, nearest.x - b.x);
            b.vx = Math.cos(angle) * BULLET_SPEED;
            b.vy = Math.sin(angle) * BULLET_SPEED;
          }
        }
        
        if (b.pierce === 0) {
          playerBullets.splice(i, 1);
          break;
        }
      }
    }
    
    // vs boss
    if (boss && boss.hp > 0 && b.hitTargets && !b.hitTargets.includes(-1)) {
      const dist = Math.hypot(b.x - boss.x, b.y - boss.y);
      if (dist < b.radius + boss.radius) {
        boss.hp -= b.damage;
        floatingTexts.push({ x: boss.x, y: boss.y - 40, text: Math.floor(b.damage).toString(), life: 30, color: '#ff66aa' });
        playerBullets.splice(i, 1);
        continue;
      }
    }
  }
  
  // Enemy bullets vs player
  if (player.invincible === 0) {
    for (let i = enemyBullets.length - 1; i >= 0; i--) {
      const b = enemyBullets[i];
      const dist = Math.hypot(b.x - player.x, b.y - player.y);
      
      if (dist < player.hitRadius + b.radius) {
        if (shieldActive) {
          enemyBullets.splice(i, 1);
          grazeCount++;
          continue;
        }
        playerHit();
        enemyBullets.splice(i, 1);
      } else if (dist < GRAZE_RADIUS) {
        grazeCount++;
      }
    }
  }
  
  // Enemies vs player
  if (player.invincible === 0) {
    for (const e of enemies) {
      if (e.hp <= 0) continue;
      const dist = Math.hypot(e.x - player.x, e.y - player.y);
      if (dist < player.hitRadius + e.radius) {
        playerHit();
        break;
      }
    }
  }
}

function playerHit() {
  player.lives--;
  player.invincible = INVINCIBLE_FRAMES;
  damageReduction = true;
  screenFlash = 20;
  
  if (player.lives <= 0) {
    gameOver();
  }
}

function checkDropPickup() {
  for (let i = activeDrops.length - 1; i >= 0; i--) {
    const drop = activeDrops[i];
    const dist = Math.hypot(drop.x - player.x, drop.y - player.y);
    if (dist < player.radius + 20) {
      applyDrop(drop);
      activeDrops.splice(i, 1);
    }
  }
}
