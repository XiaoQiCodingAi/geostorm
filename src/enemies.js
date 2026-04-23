// enemies.js - 敌人系统
function getRandomEnemyType() {
  const types = ['triangle', 'square', 'circle', 'pentagon', 'hexagon', 'chaser'];
  return types[Math.floor(Math.random() * types.length)];
}

function spawnEnemy(type, x, y, isElite = false) {
  const cfg = ENEMY_TYPES[type] || ENEMY_TYPES.triangle;
  const id = enemyIdCounter++;
  const enemy = {
    id, type, x: x || Math.random() * (GAME_WIDTH - 60) + 30,
    y: y || -30, vx: 0, vy: 0,
    radius: cfg.radius, hp: cfg.hp * (isElite ? 2 : 1), maxHp: cfg.hp * (isElite ? 2 : 1),
    speed: cfg.speed, bulletSpeed: cfg.bulletSpeed,
    score: cfg.score * (isElite ? 2 : 1), color: isElite ? '#ffffff' : cfg.color,
    fireRate: cfg.fireRate, attackType: cfg.attackType,
    isElite, movePhase: Math.random() * Math.PI * 2,
    fireTimer: Math.random() * cfg.fireRate,
    dashWarning: 0, isDashing: false, dashVx: 0, dashVy: 0, warningTimer: 0
  };
  enemies.push(enemy);
  return enemy;
}

function spawnBoss() {
  const wave = currentUser === 'test' ? TEST_ROGUE_WAVES[currentWave] : ROGUE_WAVES[currentWave];
  const isFinal = wave && wave.isFinal;
  const bossType = isFinal ? 'final' : 'stage';
  const cfg = isFinal ? BOSS_TYPES.final : BOSS_TYPES.stage;
  boss = {
    x: GAME_WIDTH / 2, y: -60, vx: 0, vy: 0,
    radius: cfg.radius, hp: cfg.hp, maxHp: cfg.hp,
    color: cfg.color, bulletSpeed: cfg.bulletSpeed, fireRate: cfg.fireRate,
    isFinal, phase: 0, moveTimer: 0, attackCount: 0
  };
  bossWarningFlash = 120;
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.hp <= 0) continue;
    
    if (e.warningTimer > 0) e.warningTimer--;
    
    // Movement
    if (e.attackType === 'dash') {
      if (!e.isDashing && e.y > 100) {
        if (e.dashWarning > 0) {
          e.dashWarning--;
        } else {
          const dx = player.x - e.x, dy = player.y - e.y;
          const dist = Math.hypot(dx, dy);
          e.dashVx = (dx / dist) * 8;
          e.dashVy = (dy / dist) * 8;
          e.isDashing = true;
        }
      }
      e.x += e.isDashing ? e.dashVx : 0;
      e.y += e.isDashing ? e.dashVy : e.speed;
      if (e.isDashing && (e.y < -50 || e.y > GAME_HEIGHT + 50 || e.x < -50 || e.x > GAME_WIDTH + 50)) {
        enemies.splice(i, 1);
        continue;
      }
    } else {
      e.movePhase += 0.02;
      e.y += e.speed;
      e.x += Math.sin(e.movePhase) * 0.5;
    }
    
    if (e.y > GAME_HEIGHT + 50) { enemies.splice(i, 1); continue; }
    
    // Attack
    e.fireTimer++;
    if (e.fireTimer >= e.fireRate) {
      e.fireTimer = 0;
      fireEnemyBullet(e);
    }
  }
}

function fireEnemyBullet(e) {
  const bulletColor = e.isElite ? '#ffffff' : '#ff6666';
  
  if (e.attackType === 'pulse') {
    if (e.fireTimer % 60 === 0) {
      pulses.push({ x: e.x, y: e.y, radius: e.radius, maxRadius: 300, speed: 4, color: e.color, isCharge: false });
    }
  } else if (e.attackType === 'triangle') {
    const baseAngle = Math.atan2(player.y - e.y, player.x - e.x);
    for (let i = -1; i <= 1; i++) {
      const angle = baseAngle + i * 0.35;
      enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(angle) * e.bulletSpeed, vy: Math.sin(angle) * e.bulletSpeed, radius: 5, color: bulletColor });
    }
  } else if (e.attackType === 'square') {
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + e.movePhase;
      enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(angle) * e.bulletSpeed, vy: Math.sin(angle) * e.bulletSpeed, radius: 5, color: bulletColor });
    }
  } else if (e.attackType === 'pentagon') {
    const angle = Math.atan2(player.y - e.y, player.x - e.x);
    enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(angle) * e.bulletSpeed, vy: Math.sin(angle) * e.bulletSpeed, radius: 6, color: bulletColor });
  } else if (e.attackType === 'hexagon') {
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + e.movePhase;
      enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(angle) * e.bulletSpeed * 0.8, vy: Math.sin(angle) * e.bulletSpeed * 0.8, radius: 4, color: bulletColor });
    }
    pulses.push({ x: e.x, y: e.y, radius: e.radius, maxRadius: 150, speed: 3, color: e.color, isCharge: false });
  } else if (e.attackType === 'combo') {
    const angle = Math.atan2(player.y - e.y, player.x - e.x);
    enemyBullets.push({ x: e.x, y: e.y, vx: Math.cos(angle) * e.bulletSpeed, vy: Math.sin(angle) * e.bulletSpeed, radius: 6, color: bulletColor });
    if (e.fireTimer % 40 === 0) {
      pulses.push({ x: e.x, y: e.y, radius: e.radius, maxRadius: 200, speed: 3.5, color: '#ff8800', isCharge: false });
    }
  }
  
  if (e.attackType !== 'dash') {
    enemyBullets.push({ x: e.x, y: e.y, vx: 0, vy: e.bulletSpeed, radius: 4, color: bulletColor });
  }
}

function updateBoss() {
  if (!boss) return;
  
  boss.moveTimer++;
  boss.phase = (boss.moveTimer / 300) % 1;
  
  // Movement
  if (boss.y < 100) {
    boss.y += 1;
  } else {
    boss.x += Math.sin(boss.moveTimer * 0.01) * 2;
    boss.y = 100 + Math.sin(boss.moveTimer * 0.02) * 30;
  }
  
  // Attack
  boss.attackCount++;
  if (boss.attackCount >= boss.fireRate) {
    boss.attackCount = 0;
    fireBossBullet();
  }
  
  if (boss.hp <= 0) {
    score += boss.isFinal ? 10000 : 5000;
    boss = null;
    bossDefeated = true;
  }
}

function fireBossBullet() {
  if (!boss) return;
  const bulletColor = boss.isFinal ? '#ff0044' : '#ff8800';
  
  if (boss.isFinal) {
    fireFinalBossBullet();
  } else {
    const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
    for (let i = -2; i <= 2; i++) {
      const a = angle + i * 0.15;
      enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(a) * boss.bulletSpeed, vy: Math.sin(a) * boss.bulletSpeed, radius: 8, color: bulletColor });
    }
  }
}

function fireFinalBossBullet() {
  const bulletColor = '#ff0044';
  // Spiral pattern
  for (let i = 0; i < 8; i++) {
    const angle = (boss.moveTimer * 0.1) + (i / 8) * Math.PI * 2;
    enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 3, vy: Math.sin(angle) * 3, radius: 6, color: bulletColor });
  }
  // Aimed
  const angle = Math.atan2(player.y - boss.y, player.x - boss.x);
  enemyBullets.push({ x: boss.x, y: boss.y, vx: Math.cos(angle) * 5, vy: Math.sin(angle) * 5, radius: 10, color: '#ffff00' });
}
