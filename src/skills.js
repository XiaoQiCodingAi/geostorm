// ============================================
// skills.js - 技能系统
// ============================================

function updateBlade() {
  const bladeLvl = getSkillLevel('blade');
  if (bladeLvl === 0) return;
  
  meleeAngle += 0.08;
  const bladeRadius = 100;
  const bladeAngleSpan = bladeLvl === 1 ? Math.PI / 2 : bladeLvl === 2 ? Math.PI * 0.75 : Math.PI * 1.25;
  const bladeHalf = bladeAngleSpan / 2;
  const damageLvl = progressData.upgrades.basicDamage || 0;
  const bladeDamage = DAMAGE * 1.5 * (1 + damageLvl * 0.25) * (1 + bladeLvl * 0.25);
  
  let bladeStart = meleeAngle - bladeHalf;
  let bladeEnd = meleeAngle + bladeHalf;
  
  // 销毁敌弹
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    const dist = Math.hypot(eb.x - player.x, eb.y - player.y);
    if (dist < bladeRadius + eb.radius && dist > bladeRadius * 0.3) {
      const ang = Math.atan2(eb.y - player.y, eb.x - player.x);
      let normAng = ang, ns = bladeStart, ne = bladeEnd;
      while (normAng < 0) normAng += Math.PI * 2;
      while (ns < 0) ns += Math.PI * 2;
      while (ne < 0) ne += Math.PI * 2;
      let inArc = (bladeAngleSpan >= Math.PI * 2) || (ns <= ne ? (normAng >= ns && normAng <= ne) : (normAng >= ns || normAng <= ne));
      if (inArc) {
        enemyBullets.splice(i, 1);
        grazeCount++;
      }
    }
  }
  
  // 伤害敌人
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (e.hp <= 0) continue;
    const dist = Math.hypot(e.x - player.x, e.y - player.y);
    if (dist < bladeRadius + e.radius && dist > bladeRadius * 0.3) {
      const ang = Math.atan2(e.y - player.y, e.x - player.x);
      let normAng = ang, ns = bladeStart, ne = bladeEnd;
      while (normAng < 0) normAng += Math.PI * 2;
      while (ns < 0) ns += Math.PI * 2;
      while (ne < 0) ne += Math.PI * 2;
      let inArc = (bladeAngleSpan >= Math.PI * 2) || (ns <= ne ? (normAng >= ns && normAng <= ne) : (normAng >= ns || normAng <= ne));
      if (inArc) {
        e.hp -= bladeDamage;
        floatingTexts.push({ x: e.x, y: e.y - 20, text: Math.floor(bladeDamage).toString(), life: 30, color: '#00ffff' });
      }
    }
  }
  
  // Boss伤害
  if (boss && boss.hp > 0) {
    const dist = Math.hypot(boss.x - player.x, boss.y - player.y);
    if (dist < bladeRadius + boss.radius && dist > bladeRadius * 0.3) {
      const ang = Math.atan2(boss.y - player.y, boss.x - player.x);
      let normAng = ang, ns = bladeStart, ne = bladeEnd;
      while (normAng < 0) normAng += Math.PI * 2;
      while (ns < 0) ns += Math.PI * 2;
      while (ne < 0) ne += Math.PI * 2;
      let inArc = (bladeAngleSpan >= Math.PI * 2) || (ns <= ne ? (normAng >= ns && normAng <= ne) : (normAng >= ns || normAng <= ne));
      if (inArc) {
        boss.hp -= bladeDamage;
        floatingTexts.push({ x: boss.x, y: boss.y - 40, text: Math.floor(bladeDamage).toString(), life: 30, color: '#ff66aa' });
      }
    }
  }
}

function updateLaser() {
  if (!jPressed || player.energy <= 0) {
    player.jSkillActive = false;
    jLaserTarget = null;
    return;
  }
  
  player.jSkillActive = true;
  
  if (!jLaserTarget || jLaserTarget.hp <= 0 || (jLaserTarget === boss && (!boss || boss.hp <= 0))) {
    let minDist = Infinity, newTarget = null;
    enemies.forEach(e => { if (e.hp > 0) { const d = Math.hypot(e.x - player.x, e.y - player.y); if (d < minDist) { minDist = d; newTarget = e; } } });
    if (boss && boss.hp > 0) { const d = Math.hypot(boss.x - player.x, boss.y - player.y); if (d < minDist || !newTarget) newTarget = boss; }
    jLaserTarget = newTarget;
  }
  
  if (!jLaserTarget || jLaserTarget.hp <= 0) return;
  
  const laserDamageLvl = progressData.upgrades.laserDamage || 0;
  const laserChainLevel = getSkillLevel('laser');
  const laserDamage = J_SKILL_DAMAGE * (1 + laserDamageLvl * 0.40);
  
  laserHitTargets = [jLaserTarget];
  
  // 连锁攻击
  const chainRange = 150;
  for (let chain = 0; chain < laserChainLevel + 1; chain++) {
    let nearest = null, nearestDist = Infinity;
    const lastTarget = laserHitTargets[laserHitTargets.length - 1];
    enemies.forEach(e => {
      if (e.hp <= 0 || laserHitTargets.includes(e)) return;
      const d = Math.hypot(e.x - lastTarget.x, e.y - lastTarget.y);
      if (d < nearestDist && d <= chainRange) { nearestDist = d; nearest = e; }
    });
    if (nearest) {
      laserHitTargets.push(nearest);
      nearest.hp -= laserDamage;
      floatingTexts.push({ x: nearest.x, y: nearest.y - 20, text: laserDamage.toFixed(0), life: 30, color: '#ff8800' });
    }
  }
}

function tryScreenClear() {
  if (player.energy < K_SKILL_COST) return;
  player.energy = 0;
  
  const maxRadius = Math.hypot(GAME_WIDTH, GAME_HEIGHT);
  const emWaveLvl = getSkillLevel('emWave');
  const waveCount = 1 + emWaveLvl;
  
  kWaves = [];
  for (let i = 0; i < waveCount; i++) {
    kWaves.push({
      x: player.x, y: player.y, radius: 0, maxRadius: maxRadius,
      hit: new Set(), delay: i * K_WAVE_INTERVAL,
      dmgMultiplier: i === 0 ? 1.0 : 0.2, frame: -i * K_WAVE_INTERVAL
    });
  }
  screenFlash = 15;
}

function updateKWave() {
  for (const kw of kWaves) {
    kw.frame++;
    if (kw.frame < 0) continue;
    kw.radius += K_WAVE_SPEED;
    if (kw.radius >= kw.maxRadius) continue;
    
    const emWaveUpgradeLvl = progressData.upgrades.emWaveDamage || 0;
    const waveBaseDmg = K_WAVE_FIXED_DAMAGE * (1 + emWaveUpgradeLvl * 0.50);
    
    const aliveEnemies = enemies.filter(e => e.hp > 0);
    for (const e of aliveEnemies) {
      if (kw.hit.has(e)) continue;
      const dist = Math.hypot(e.x - kw.x, e.y - kw.y);
      if (dist <= kw.radius + e.radius + 5) {
        kw.hit.add(e);
        e.hp -= waveBaseDmg * kw.dmgMultiplier;
      }
    }
    
    if (boss && boss.hp > 0 && !kw.hit.has(boss)) {
      const dist = Math.hypot(boss.x - kw.x, boss.y - kw.y);
      if (dist <= kw.radius + boss.radius + 5) {
        kw.hit.add(boss);
        boss.hp -= waveBaseDmg * kw.dmgMultiplier;
      }
    }
  }
  
  if (kWaves.length > 0 && kWaves.every(kw => kw.radius >= kw.maxRadius)) {
    kWaves = [];
  }
}
