// waves.js - 波次管理
function setupWave(waveIndex) {
  const wave = currentUser === 'test' ? TEST_ROGUE_WAVES[waveIndex] : ROGUE_WAVES[waveIndex];
  waveEnemiesTotal = 0;
  waveSpawnQueue = [];
  waveEnemiesKilled = 0;
  waveSpawnTimer = 0;
  
  for (const e of wave.enemies) {
    const count = e.count || 0;
    for (let i = 0; i < count; i++) {
      waveSpawnQueue.push({
        type: e.type === 'elite' ? getRandomEnemyType() : e.type,
        isElite: e.type === 'elite' || (Math.random() < wave.eliteChance),
        spawned: false
      });
      waveEnemiesTotal++;
    }
  }
  
  if (wave.isBoss) spawnBoss();
}

function showWaveSelect() {
  gameState = 'waveSelect';
  const wave = (currentUser === 'test' ? TEST_ROGUE_WAVES : ROGUE_WAVES)[currentWave];
  document.getElementById('waveSelectTitle').textContent = '第 ' + (currentWave + 1) + ' 波';
  
  let html = '<div style="margin:20px 0;">可用武器:</div>';
  for (const w of ['basic', 'pierce', 'scatter']) {
    const locked = w !== 'basic' && !progressData.unlockedWeapons.includes(w);
    html += `<button onclick="startWaveFromSelect('${w}')" ${locked ? 'disabled style="opacity:0.5"' : ''}>${w === 'basic' ? '基础' : w === 'pierce' ? '穿透弹' : '散弹'}${locked ? ' (未解锁)' : ''}</button>`;
  }
  html += '<div style="margin-top:20px;color:#888;">按 1/2/3 选择武器</div>';
  document.getElementById('waveSelectContent').innerHTML = html;
  document.getElementById('unlockedWeaponsDisplay').textContent = '已解锁: ' + progressData.unlockedWeapons.join(', ');
  showScreen('waveSelectScreen');
}

function startWaveFromSelect(weapon) {
  weaponMode = weapon;
  weaponBuffTimer = 0;
  gameState = 'playing';
  setupWave(currentWave);
  showScreen(null);
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
}

function updateWaveSpawning() {
  if (gameState !== 'playing') return;
  if (waveSpawnQueue.length === 0) return;
  
  waveSpawnTimer++;
  if (waveSpawnTimer < 30) return;
  waveSpawnTimer = 0;
  
  const toSpawn = waveSpawnQueue.filter(e => !e.spawned);
  if (toSpawn.length > 0) {
    const idx = Math.floor(Math.random() * toSpawn.length);
    const enemy = toSpawn[idx];
    enemy.spawned = true;
    spawnEnemy(enemy.type, null, null, enemy.isElite);
    if (enemy.isElite) activeEliteCount++;
  }
}

function checkWaveComplete() {
  if (gameState !== 'playing') return;
  
  const wave = currentUser === 'test' ? TEST_ROGUE_WAVES[currentWave] : ROGUE_WAVES[currentWave];
  
  if (wave.isBoss && boss && boss.hp > 0) return;
  if (enemies.length > 0) return;
  if (waveSpawnQueue.some(e => !e.spawned)) return;
  
  // Wave complete
  if (wave.isBoss || currentWave >= 9) {
    gameWin();
    return;
  }
  
  currentWave++;
  progressData.bestWave = Math.max(progressData.bestWave, currentWave);
  saveProgress();
  showSkillSelect();
}

function showSkillSelect() {
  gameState = 'skillSelect';
  const choices = getSkillChoices();
  pendingSkillChoices = choices;
  
  let html = '<div style="font-size:24px;margin:20px;">选择技能强化</div>';
  html += '<div class="skill-cards">';
  choices.forEach((skill, i) => {
    html += `<div class="skill-card" onclick="selectSkill(${i})">
      <div class="name">${skill.name}</div>
      <div class="desc">${skill.desc}</div>
      <div class="叠加">${skill.maxStack > 1 ? '可叠加 ' + skill.maxStack + '次' : ''}</div>
    </div>`;
  });
  html += '</div>';
  html += '<div style="color:#888;margin-top:20px;">按 1/2/3 选择</div>';
  document.getElementById('waveSelectContent').innerHTML = html;
  document.getElementById('waveSelectTitle').textContent = '波次完成！选择技能';
  showScreen('waveSelectScreen');
}

function selectSkill(index) {
  if (!pendingSkillChoices || index >= pendingSkillChoices.length) return;
  
  const skill = pendingSkillChoices[index];
  const level = skillStacks[skill.id] || 0;
  if (level < skill.maxStack) {
    skillStacks[skill.id] = level + 1;
    activeSkills.push(skill.id);
  }
  
  pendingSkillChoices = null;
  currentWave++;
  progressData.bestWave = Math.max(progressData.bestWave, currentWave);
  saveProgress();
  showWaveSelect();
}

function getSkillChoices() {
  const available = ALL_SKILLS.filter(s => {
    const level = skillStacks[s.id] || 0;
    return level < s.maxStack;
  });
  
  const shuffled = available.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}
