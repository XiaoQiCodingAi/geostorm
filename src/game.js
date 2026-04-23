// game.js - 主循环
// keys defined in index.html
let jPressed = false;
// screenFlash defined in index.html
let gameLoopId = null;
let lastTime = 0;
const FIXED_DT = 1000 / 60;
let accumulator = 0;

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  accumulator += dt;
  
  while (accumulator >= FIXED_DT) {
    if (gameState === 'playing') {
      frameCount++;
      gameTime += FIXED_DT / 1000;
      
      updatePlayer();
      fireWeapon();
      updateChargeBullet();
      updateBlade();
      updateLaser();
      updateWaveSpawning();
      updateEnemies();
      updateBoss();
      updateKWave();
      updatePulses();
      checkDropPickup();
      checkCollisions();
      updateBullets();
      updateParticles();
      updateFloatingTexts();
      updateDrops();
      checkWaveComplete();
      
      if (weaponBuffTimer > 0) {
        weaponBuffTimer--;
        if (weaponBuffTimer === 0) weaponMode = 'basic';
      }
      
      player.energy = Math.min(getMaxEnergy(), player.energy);
      if (player.invincible > 0) player.invincible--;
    }
    accumulator -= FIXED_DT;
  }
  
  render();
  gameLoopId = requestAnimationFrame(gameLoop);
}

function updatePlayer() {
  let dx = 0, dy = 0;
  if (keys['KeyW'] || keys['ArrowUp']) dy -= 1;
  if (keys['KeyS'] || keys['ArrowDown']) dy += 1;
  if (keys['KeyA'] || keys['ArrowLeft']) dx -= 1;
  if (keys['KeyD'] || keys['ArrowRight']) dx += 1;
  if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
  
  let speed = PLAYER_SPEED;
  if (jPressed && player.energy > 0) {
    player.jSkillActive = true;
    speed += J_SKILL_SPEED_BONUS;
    player.energy -= ENERGY_DRAIN_RATE / 60;
    if (player.energy <= 0) { player.energy = 0; player.jSkillActive = false; jLaserTarget = null; }
  } else {
    player.jSkillActive = false;
  }
  
  player.x += dx * speed;
  player.y += dy * speed;
  player.x = Math.max(player.radius, Math.min(GAME_WIDTH - player.radius, player.x));
  player.y = Math.max(player.radius, Math.min(GAME_HEIGHT - player.radius, player.y));
}

function startGame() {
  resetState();
  weaponMode = 'basic';
  weaponBuffTimer = 0;
  gameState = 'waveSelect';
  showWaveSelect();
}

function restartGame() {
  resetState();
  weaponMode = 'basic';
  weaponBuffTimer = 0;
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
  lastTime = 0;
  accumulator = 0;
  gameLoopId = requestAnimationFrame(gameLoop);
}

function gameOver() {
  gameState = 'gameover';
  saveProgress();
  submitScore();
  showScreen('gameoverScreen');
  document.getElementById('finalScoreDisplay').textContent = '最终得分: ' + score;
}

function gameWin() {
  gameState = 'win';
  totalEarnedFragments += 100;
  progressData.totalWins++;
  saveProgress();
  submitScore();
  showScreen('winScreen');
  document.getElementById('winScoreDisplay').textContent = '恭喜通关! 得分: ' + score;
}
