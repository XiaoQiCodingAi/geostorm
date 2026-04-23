// effects.js - 粒子特效
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateFloatingTexts() {
  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].y -= 0.5;
    floatingTexts[i].life--;
    if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
  }
}

function updatePulses() {
  for (let i = pulses.length - 1; i >= 0; i--) {
    pulses[i].radius += pulses[i].speed;
    if (pulses[i].radius > pulses[i].maxRadius + 50) pulses.splice(i, 1);
  }
}

function updateBullets() {
  // Player bullets
  for (let i = playerBullets.length - 1; i >= 0; i--) {
    const b = playerBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.x < -20 || b.x > GAME_WIDTH + 20 || b.y < -20 || b.y > GAME_HEIGHT + 20) {
      playerBullets.splice(i, 1);
    }
  }
  
  // Enemy bullets
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.x < -20 || b.x > GAME_WIDTH + 20 || b.y < -20 || b.y > GAME_HEIGHT + 20) {
      enemyBullets.splice(i, 1);
    }
  }
}
