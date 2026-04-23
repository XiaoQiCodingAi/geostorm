with open('/root/.openclaw/workspace/games/geo-storm/index.html', 'r') as f:
    content = f.read()

# 1. Replace setupWave function
old_setup = '''function setupWave(waveIndex) {
  const wave = (currentUser === 'test') ? TEST_ROGUE_WAVES[waveIndex] : ROGUE_WAVES[waveIndex];
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
  boss = null;
}'''

new_setup = '''function setupWave(waveIndex) {
  const wave = (currentUser === 'test') ? TEST_ROGUE_WAVES[waveIndex] : ROGUE_WAVES[waveIndex];
  waveEnemiesTotal = 0;
  waveSpawnQueue = [];
  waveEnemiesKilled = 0;
  waveSpawnTimer = 0;
  currentGroupIndex = 0;
  currentGroupSpawnTimer = 0;
  
  // Check if new groups format or old enemies format
  if (wave.groups) {
    // New groups format: build queue from groups
    for (let g = 0; g < wave.groups.length; g++) {
      const group = wave.groups[g];
      for (let i = 0; i < group.count; i++) {
        const type = group.mixed 
          ? group.types[Math.floor(Math.random() * group.types.length)]
          : group.types[0];
        waveSpawnQueue.push({
          type: type === 'elite' ? getRandomEnemyType() : type,
          isElite: type === 'elite' || (Math.random() < wave.eliteChance),
          spawned: false,
          groupIndex: g,
          groupInterval: group.interval || 30
        });
        waveEnemiesTotal++;
      }
    }
  } else if (wave.enemies) {
    // Old format for backward compatibility
    for (const e of wave.enemies) {
      const count = e.count || 0;
      for (let i = 0; i < count; i++) {
        waveSpawnQueue.push({
          type: e.type === 'elite' ? getRandomEnemyType() : e.type,
          isElite: e.type === 'elite' || (Math.random() < wave.eliteChance),
          spawned: false,
          groupIndex: 0,
          groupInterval: 45
        });
        waveEnemiesTotal++;
      }
    }
  }
  boss = null;
}'''

if old_setup in content:
    content = content.replace(old_setup, new_setup)
    print('1. setupWave OK')
else:
    print('1. setupWave ERROR')

# 2. Add currentGroupIndex and currentGroupSpawnTimer variables
old_vars = '''let waveSpawnQueue = [];
let waveSpawnTimer = 0;'''
new_vars = '''let waveSpawnQueue = [];
let waveSpawnTimer = 0;
let currentGroupIndex = 0;
let currentGroupSpawnTimer = 0;'''

if old_vars in content:
    content = content.replace(old_vars, new_vars)
    print('2. vars OK')
else:
    print('2. vars ERROR')

# 3. Replace the spawn interval logic
old_spawn = '''  // Spawn enemies from queue
  waveSpawnTimer++;
  const spawnInterval = 45; // 每45帧生成一个
  
  if (waveSpawnTimer >= spawnInterval) {
    waveSpawnTimer = 0;
    
    // Find next unspawned enemy
    for (let i = 0; i < waveSpawnQueue.length; i++) {'''

new_spawn = '''  // Spawn enemies from queue (group-based)
  waveSpawnTimer++;
  
  // Find current group's interval
  let currentInterval = 45;
  for (const item of waveSpawnQueue) {
    if (!item.spawned) {
      currentInterval = item.groupInterval || 45;
      break;
    }
  }
  
  if (waveSpawnTimer >= currentInterval) {
    waveSpawnTimer = 0;
    
    // Find next unspawned enemy
    for (let i = 0; i < waveSpawnQueue.length; i++) {'''

if old_spawn in content:
    content = content.replace(old_spawn, new_spawn)
    print('3. spawn logic OK')
else:
    print('3. spawn logic ERROR')

with open('/root/.openclaw/workspace/games/geo-storm/index.html', 'w') as f:
    f.write(content)