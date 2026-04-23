// constants.js - 游戏常量（window.* 赋值，加载在 inline script 之前）
(function() {
  window.API_BASE = '/api/geostorm';
  window.GAME_WIDTH = 800;
  window.GAME_HEIGHT = 600;
  window.PLAYER_RADIUS = 10;
  window.PLAYER_SPEED = 5;
  window.PLAYER_HIT_RADIUS = 8;
  window.GRAZE_RADIUS = 25;
  window.INVINCIBLE_FRAMES = 90;
  window.BULLET_SPEED = 12;
  window.BULLET_RADIUS = 6;
  window.FIRE_RATE = 14;
  window.DAMAGE = 15;
  window.AIM_ANGLE = 5 * Math.PI / 180;
  window.MAX_BULLETS = 150;
  window.BOSS_HP = 3000;
  window.BOSS_RADIUS = 40;
  window.MAX_ENERGY = 200;
  window.MAX_ELITE = 2;
  window.ENERGY_PER_KILL = 10;
  window.K_SKILL_COST = 200;
  window.J_SKILL_SPEED_BONUS = 2;
  window.J_SKILL_DAMAGE = 2;
  window.ENERGY_DRAIN_RATE = 100;
  window.K_WAVE_SPEED = 12;
  window.K_WAVE_FIXED_DAMAGE = 20;
  window.K_WAVE_INTERVAL = 15;
  
  window.ENEMY_TYPES = {
    triangle: { hp: 30, speed: 1.2, bulletSpeed: 2.5, radius: 16, score: 150, color: '#ff4444', fireRate: 80, attackType: 'triangle' },
    square: { hp: 60, speed: 1.0, bulletSpeed: 2.0, radius: 18, score: 250, color: '#ffaa22', fireRate: 100, attackType: 'square' },
    circle: { hp: 25, speed: 1.2, bulletSpeed: 0, radius: 15, score: 100, color: '#ff44aa', fireRate: 120, attackType: 'pulse' },
    pentagon: { hp: 80, speed: 0.9, bulletSpeed: 1.8, radius: 20, score: 400, color: '#00ddff', fireRate: 90, attackType: 'pentagon' },
    hexagon: { hp: 100, speed: 0.8, bulletSpeed: 1.5, radius: 22, score: 500, color: '#aa44ff', fireRate: 70, attackType: 'hexagon' },
    chaser: { hp: 40, speed: 2.5, bulletSpeed: 0, radius: 18, score: 300, color: '#44ff88', fireRate: 180, attackType: 'dash' },
    elite: { hp: 150, speed: 1.0, bulletSpeed: 2.0, radius: 25, score: 800, color: '#ffffff', fireRate: 75, attackType: 'combo' }
  };
  
  window.ALL_SKILLS = [
    { id: 'pierce', name: '穿透', desc: '穿透+1', maxStack: 3, effect: { pierceBonus: 1 } },
    { id: 'scatter', name: '散射', desc: '散弹+1路', maxStack: 3, effect: { scatterBonus: 1 } },
    { id: 'charge', name: '蓄力', desc: '充能加速', maxStack: 3, effect: { chargeBonus: 5 } },
    { id: 'blade', name: '光刀', desc: '自动摧毁敌弹', maxStack: 3, effect: { bladeDamage: 10 } },
    { id: 'laser', name: '连锁', desc: '激光连锁+1', maxStack: 3, effect: { laserChainBonus: 1 } },
    { id: 'emWave', name: '电磁波', desc: '电磁波+1波', maxStack: 3, effect: { emWaveBonus: 1 } },
    { id: 'energyCharge', name: '回能', desc: '击杀回能+5', maxStack: 3, effect: { energyBonus: 5 } }
  ];
  
  window.DROP_TABLE = [
    { id: 'energy', name: '⚡', desc: '能量+50', weight: 80 },
    { id: 'shield', name: '🛡️', desc: '护盾', weight: 15 },
    { id: 'heal', name: '💚', desc: '生命+1', weight: 5 }
  ];
  
  window.ROGUE_WAVES = [
    { enemies: [{type:'triangle', count:24}], eliteChance: 0 },
    { enemies: [{type:'triangle',count:20},{type:'square',count:12}], eliteChance: 0 },
    { enemies: [{type:'triangle',count:12},{type:'square',count:10},{type:'circle',count:10},{type:'elite',count:2}], eliteChance: 0 },
    { enemies: [{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:10},{type:'elite',count:2}], eliteChance: 0 },
    { enemies: [{type:'triangle',count:8},{type:'square',count:8},{type:'circle',count:8},{type:'pentagon',count:6},{type:'elite',count:3}], eliteChance: 0, isBoss: true },
    { enemies: [{type:'circle',count:15},{type:'pentagon',count:10},{type:'hexagon',count:8},{type:'elite',count:3}], eliteChance: 0.1 },
    { enemies: [{type:'chaser',count:10},{type:'pentagon',count:10},{type:'hexagon',count:6},{type:'elite',count:4}], eliteChance: 0.15 },
    { enemies: [{type:'hexagon',count:12},{type:'chaser',count:8},{type:'elite',count:5}], eliteChance: 0.2 },
    { enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:10},{type:'hexagon',count:8},{type:'chaser',count:6},{type:'elite',count:6}], eliteChance: 0.25, isBoss: true },
    { enemies: [{type:'elite',count:12},{type:'hexagon',count:10},{type:'chaser',count:10}], eliteChance: 0.3, isBoss: true, isFinal: true }
  ];
  
  window.TEST_ROGUE_WAVES = [
    { enemies: [{type:'triangle', count:2}], eliteChance: 0 },
    { enemies: [{type:'triangle',count:2},{type:'square',count:1}], eliteChance: 0 },
    { enemies: [{type:'triangle',count:2},{type:'square',count:1},{type:'circle',count:1},{type:'elite',count:1}], eliteChance: 0 },
    { enemies: [{type:'square',count:1},{type:'circle',count:1},{type:'pentagon',count:1},{type:'elite',count:1}], eliteChance: 0 },
    { enemies: [{type:'triangle',count:2},{type:'square',count:2},{type:'circle',count:2},{type:'pentagon',count:2},{type:'elite',count:1}], eliteChance: 0, isBoss: true },
    { enemies: [{type:'circle',count:2},{type:'pentagon',count:2},{type:'hexagon',count:1},{type:'elite',count:1}], eliteChance: 0.1 },
    { enemies: [{type:'chaser',count:2},{type:'pentagon',count:2},{type:'hexagon',count:1},{type:'elite',count:1}], eliteChance: 0.15 },
    { enemies: [{type:'hexagon',count:2},{type:'chaser',count:2},{type:'elite',count:1}], eliteChance: 0.2 },
    { enemies: [{type:'triangle',count:2},{type:'square',count:2},{type:'circle',count:2},{type:'pentagon',count:2},{type:'hexagon',count:2},{type:'chaser',count:2},{type:'elite',count:2}], eliteChance: 0.25, isBoss: true },
    { enemies: [{type:'elite',count:2},{type:'hexagon',count:2},{type:'chaser',count:2}], eliteChance: 0.3, isBoss: true, isFinal: true }
  ];
  
  window.UPGRADE_CONFIG = {
    laserDamage: { name: '🔫 激光伤害', base: 2, perLevel: 0.4, unit: '伤害/帧', maxLevel: 3, baseCost: 50, costInc: 30 },
    emWaveDamage: { name: '⚡ 电磁波伤害', base: 100, perLevel: 50, unit: '伤害', maxLevel: 3, baseCost: 50, costInc: 30 },
    basicDamage: { name: '💥 基础伤害', base: 15, perLevel: 0.25, unit: '伤害', maxLevel: 3, baseCost: 50, costInc: 30 },
    basicFireRate: { name: '🚀 基础射速', base: 14, perLevel: -0.15, unit: '帧间隔', maxLevel: 3, baseCost: 50, costInc: 30 }
  };
})();
