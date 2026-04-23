// renderer.js - 渲染逻辑
function render() {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  
  // Stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 50; i++) {
    ctx.fillRect((i * 73 + frameCount * 0.1) % GAME_WIDTH, (i * 97 + frameCount * 0.05) % GAME_HEIGHT, 1, 1);
  }
  
  if (screenFlash > 0) {
    ctx.fillStyle = 'rgba(255,255,255,' + (screenFlash / 20 * 0.6) + ')';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    screenFlash--;
  }
  
  if (bossWarningFlash > 0) {
    const flash = Math.sin(bossWarningFlash * 0.3) * 0.3;
    if (flash > 0) { ctx.fillStyle = 'rgba(255,0,0,' + flash + ')'; ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT); }
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('WARNING', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    ctx.font = '24px Courier New';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('BOSS APPROACHING', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40);
    bossWarningFlash--;
  }
  
  if (gameState === 'idle' || gameState === 'waveSelect' || gameState === 'skillSelect') return;
  
  // Particles
  particles.forEach(p => {
    ctx.globalAlpha = p.life / 60;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  
  // Floating damage
  floatingTexts.forEach(ft => {
    ctx.globalAlpha = ft.life / 30;
    ctx.fillStyle = ft.color;
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
  });
  ctx.globalAlpha = 1;
  
  // Enemy bullets
  enemyBullets.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Pulses
  pulses.forEach(p => {
    const alpha = 1 - (p.radius / p.maxRadius);
    ctx.strokeStyle = p.color.replace(')', ',' + alpha + ')').replace('rgb', 'rgba');
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.stroke();
  });
  
  // Player bullets
  playerBullets.forEach(b => {
    ctx.fillStyle = b.isCharge ? '#ffff00' : (player.jSkillActive ? '#ffff00' : '#00ffff');
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
  
  // Enemies
  enemies.forEach(e => {
    if (e.hp <= 0) return;
    ctx.fillStyle = e.isElite ? '#ffffff' : e.color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // HP bar
    const hpRatio = e.hp / e.maxHp;
    ctx.fillStyle = '#333';
    ctx.fillRect(e.x - 15, e.y + e.radius + 5, 30, 3);
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x - 15, e.y + e.radius + 5, 30 * hpRatio, 3);
  });
  
  // Boss
  if (boss) {
    const hpRatio = boss.hp / boss.maxHp;
    ctx.fillStyle = boss.color;
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText(Math.ceil(boss.hp), boss.x, boss.y + 7);
    
    ctx.fillStyle = '#333';
    ctx.fillRect(boss.x - 40, boss.y + boss.radius + 10, 80, 4);
    ctx.fillStyle = boss.color;
    ctx.fillRect(boss.x - 40, boss.y + boss.radius + 10, 80 * hpRatio, 4);
  }
  
  // Player
  if (player.invincible === 0 || frameCount % 4 < 2) {
    ctx.fillStyle = player.jSkillActive ? '#ffff00' : '#00ffff';
    ctx.beginPath();
    ctx.moveTo(player.x + player.radius, player.y);
    ctx.lineTo(player.x - player.radius * 0.7, player.y - player.radius * 0.6);
    ctx.lineTo(player.x - player.radius * 0.7, player.y + player.radius * 0.6);
    ctx.closePath();
    ctx.fill();
    
    // Shield
    if (shieldActive) {
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // Blade
    if (getSkillLevel('blade') > 0) {
      const bladeLvl = getSkillLevel('blade');
      const bladeAngleSpan = bladeLvl === 1 ? Math.PI / 2 : bladeLvl === 2 ? Math.PI * 0.75 : Math.PI * 1.25;
      const halfSpan = bladeAngleSpan / 2;
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(meleeAngle);
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 100, -halfSpan, halfSpan);
      ctx.stroke();
      ctx.restore();
    }
  }
  
  // Laser
  if (player.jSkillActive && jLaserTarget && jLaserTarget.hp > 0) {
    ctx.strokeStyle = 'rgba(255,150,0,0.8)';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(jLaserTarget.x, jLaserTarget.y);
    ctx.stroke();
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(jLaserTarget.x, jLaserTarget.y);
    ctx.stroke();
  }
  
  // EM Waves
  for (const kw of kWaves) {
    if (kw.frame < 0) continue;
    const progress = kw.radius / kw.maxRadius;
    ctx.strokeStyle = 'rgba(0,255,100,' + (0.6 - progress * 0.5) + ')';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(kw.x, kw.y, kw.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // UI
  ctx.fillStyle = '#00ffff';
  ctx.font = '16px Courier New';
  ctx.textAlign = 'left';
  ctx.fillText('得分: ' + score, 10, 25);
  ctx.fillText('波次: ' + (currentWave + 1), 10, 45);
  ctx.fillText('生命: ' + '❤️'.repeat(player.lives), 10, 65);
  ctx.fillStyle = '#ffff00';
  ctx.fillText('能量: ' + Math.floor(player.energy), 10, 85);
  
  // Skills
  let skillX = GAME_WIDTH - 100;
  for (const skillId in skillStacks) {
    const lvl = skillStacks[skillId];
    if (lvl > 0) {
      const skill = ALL_SKILLS.find(s => s.id === skillId);
      ctx.fillStyle = '#ff66aa';
      ctx.font = '12px Courier New';
      ctx.textAlign = 'right';
      ctx.fillText(skill.name + ' Lv.' + lvl, skillX, GAME_HEIGHT - 10);
      skillX -= 80;
    }
  }
}
