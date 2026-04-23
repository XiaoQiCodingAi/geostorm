// ============================================
// weapons.js - 武器系统
// ============================================

function createBullet(angle, options = {}) {
  const damageLvl = progressData.upgrades.basicDamage || 0;
  const fireRateLvl = progressData.upgrades.basicFireRate || 0;
  const baseDamage = DAMAGE * (1 + damageLvl * 0.25);
  const bulletSpeedMod = 1 + damageLvl * 0.10;
  
  return {
    x: player.x,
    y: player.y,
    vx: Math.cos(angle) * BULLET_SPEED * bulletSpeedMod,
    vy: Math.sin(angle) * BULLET_SPEED * bulletSpeedMod,
    radius: BULLET_RADIUS,
    damage: baseDamage,
    target: null,
    pierce: 0,
    hitTargets: [],
    ...options
  };
}

function fireWeapon() {
  const damageLvl = progressData.upgrades.basicDamage || 0;
  const fireRateLvl = progressData.upgrades.basicFireRate || 0;
  const effectiveFireRate = Math.max(5, Math.floor(FIRE_RATE * (1 - fireRateLvl * 0.15)));
  const baseDamage = DAMAGE * (1 + damageLvl * 0.25);
  
  if (player.fireTimer < effectiveFireRate) return;
  player.fireTimer = 0;
  
  let target = null, minDist = Infinity;
  enemies.forEach(e => { if (e.hp > 0) { const d = Math.hypot(e.x - player.x, e.y - player.y); if (d < minDist) { minDist = d; target = e; } } });
  if (boss && boss.hp > 0) { const d = Math.hypot(boss.x - player.x, boss.y - player.y); if (d < minDist || !target) target = boss; }
  if (!target) return;
  
  let angle = Math.atan2(target.y - player.y, target.x - player.x);
  angle += (Math.random() - 0.5) * AIM_ANGLE;
  
  // 穿透模式
  if (weaponMode === 'pierce') {
    const pierceLevel = getSkillLevel('pierce');
    playerBullets.push(createBullet(angle, {
      radius: 5, damage: baseDamage, pierce: 1 + pierceLevel, hitTargets: []
    }));
    return;
  }
  
  // 散弹模式
  if (weaponMode === 'scatter') {
    const scatterLevel = getSkillLevel('scatter');
    const bulletCount = 1 + scatterLevel;
    const spreadAngle = Math.PI / 4;
    for (let i = 0; i < bulletCount; i++) {
      const offsetAngle = (bulletCount > 1) ? spreadAngle * (i / (bulletCount - 1) - 0.5) : 0;
      playerBullets.push(createBullet(angle + offsetAngle, { radius: 5, damage: baseDamage * 0.7 }));
    }
    return;
  }
  
  playerBullets.push(createBullet(angle, { target }));
}

function updateChargeBullet() {
  const chargeLvl = getSkillLevel('charge');
  if (chargeLvl === 0) return;
  
  chargeTimer++;
  const chargeInterval = chargeLvl >= 3 ? 80 : 120;
  const chargeDmgMult = chargeLvl >= 2 ? 1.5 : 1;
  
  if (chargeTimer < chargeInterval) return;
  chargeTimer = 0;
  
  let tgt = null, minDist = Infinity;
  enemies.forEach(e => { if (e.hp > 0) { const d = Math.hypot(e.x - player.x, e.y - player.y); if (d < minDist) { minDist = d; tgt = e; } } });
  if (boss && boss.hp > 0) { const d = Math.hypot(boss.x - player.x, boss.y - player.y); if (d < minDist || !tgt) tgt = boss; }
  if (!tgt) return;
  
  const angle = Math.atan2(tgt.y - player.y, tgt.x - player.x);
  const damageLvl = progressData.upgrades.basicDamage || 0;
  const chargeDamage = DAMAGE * 5 * (1 + damageLvl * 0.25) * chargeDmgMult;
  
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    particles.push({ x: player.x, y: player.y, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3, life: 20, color: '#ffff00', size: 6 });
  }
  
  playerBullets.push(createBullet(angle, { radius: 10, damage: chargeDamage, isCharge: true }));
}
