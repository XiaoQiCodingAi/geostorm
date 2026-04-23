// ============================================
// 游戏配置常量
// ============================================

// 画布尺寸
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// 玩家属性
const PLAYER_RADIUS = 10;
const PLAYER_SPEED = 5;
const PLAYER_HIT_RADIUS = 8;
const GRAZE_RADIUS = 25;
const INVINCIBLE_FRAMES = 90;

// 子弹属性
const BULLET_SPEED = 12;
const BULLET_RADIUS = 6;
const FIRE_RATE = 14;
const DAMAGE = 15;
const MAX_BULLETS = 150;

// 瞄准角度（弧度）
const AIM_ANGLE = 5 * Math.PI / 180;

// Boss 属性
const BOSS_HP = 3000;
const BOSS_RADIUS = 40;

// 能量系统
const MAX_ENERGY = 200;
const ENERGY_PER_KILL = 10;
const K_SKILL_COST = 200;
const J_SKILL_SPEED_BONUS = 2;
const J_SKILL_DAMAGE = 2;
const ENERGY_DRAIN_RATE = 100;

// 精英敌人上限
const MAX_ELITE = 2;

// 敌人类型定义
const ENEMY_TYPES = {
  triangle: { hp: 30, radius: 12, speed: 2, score: 100, color: '#ff6666', shape: 'triangle', dropChance: 0.05 },
  square: { hp: 50, radius: 14, speed: 1.5, score: 150, color: '#ffaa00', shape: 'square', dropChance: 0.08 },
  circle: { hp: 40, radius: 13, speed: 2.5, score: 120, color: '#66ff66', shape: 'circle', dropChance: 0.06 },
  pentagon: { hp: 80, radius: 16, speed: 1.8, score: 200, color: '#6666ff', shape: 'pentagon', dropChance: 0.10 },
  hexagon: { hp: 120, radius: 18, speed: 1.2, score: 300, color: '#ff66ff', shape: 'hexagon', dropChance: 0.12 },
  chaser: { hp: 25, radius: 10, speed: 3, score: 80, color: '#ff9966', shape: 'circle', dropChance: 0.04 }
};

// API 配置
const API_BASE = '/api/geostorm';

// 波次奖励（碎片）
const WAVE_REWARDS = [5, 8, 12, 15, 30, 18, 22, 25, 30, 100];

// 测试波次配置
const TEST_ROGUE_WAVES = [
  { enemies: [{type:'triangle',count:2},{type:'square',count:1}], eliteChance: 0 },
  { enemies: [{type:'triangle',count:3},{type:'square',count:2}], eliteChance: 0.2 },
  { enemies: [{type:'circle',count:2},{type:'pentagon',count:1}], eliteChance: 0.3 },
  { enemies: [{type:'pentagon',count:2},{type:'hexagon',count:1}], eliteChance: 0.4 },
  { enemies: [{type:'hexagon',count:2},{type:'chaser',count:3},{type:'elite',count:1}], eliteChance: 0.5 },
  { enemies: [{type:'triangle',count:2},{type:'square',count:2},{type:'circle',count:2},{type:'pentagon',count:2}], eliteChance: 0, isBoss: true },
  { enemies: [{type:'pentagon',count:2},{type:'hexagon',count:2},{type:'elite',count:1}], eliteChance: 0.6 },
  { enemies: [{type:'hexagon',count:2},{type:'chaser',count:3},{type:'elite',count:1}], eliteChance: 0.7 },
  { enemies: [{type:'pentagon',count:2},{type:'hexagon',count:2},{type:'elite',count:2}], eliteChance: 0.8 },
  { enemies: [{type:'triangle',count:2},{type:'square',count:2},{type:'pentagon',count:2},{type:'hexagon',count:2},{type:'elite',count:2}], eliteChance: 0.9, isBoss: true }
];

// 正式波次配置
const ROGUE_WAVES = [
  { enemies: [{type:'triangle',count:8},{type:'square',count:8}], eliteChance: 0 },
  { enemies: [{type:'square',count:10},{type:'circle',count:8}], eliteChance: 0.1 },
  { enemies: [{type:'circle',count:10},{type:'pentagon',count:6}], eliteChance: 0.15 },
  { enemies: [{type:'pentagon',count:8},{type:'hexagon',count:4}], eliteChance: 0.2 },
  { enemies: [{type:'hexagon',count:6},{type:'chaser',count:10},{type:'elite',count:2}], eliteChance: 0.3 },
  { enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8}], eliteChance: 0, isBoss: true },
  { enemies: [{type:'pentagon',count:10},{type:'hexagon',count:8},{type:'elite',count:3}], eliteChance: 0.4 },
  { enemies: [{type:'hexagon',count:10},{type:'chaser',count:15},{type:'elite',count:4}], eliteChance: 0.5 },
  { enemies: [{type:'pentagon',count:10},{type:'hexagon',count:10},{type:'elite',count:5}], eliteChance: 0.6 },
  { enemies: [{type:'triangle',count:8},{type:'square',count:8},{type:'circle',count:8},{type:'pentagon',count:6},{type:'hexagon',count:4},{type:'elite',count:8}], eliteChance: 0.8, isBoss: true }
];

// 技能定义
const ALL_SKILLS = [
  { id: 'pierce', name: '穿透弹', desc: '穿透+1个敌人', type: 'weapon', stackable: true, maxStack: 3, effect: { pierceBonus: 1 } },
  { id: 'scatter', name: '散弹', desc: '散弹+1路', type: 'weapon', stackable: true, maxStack: 3, effect: { scatterBonus: 1 } },
  { id: 'laser', name: '激光连锁', desc: '激光连锁+1目标', type: 'skill', stackable: true, maxStack: 3, effect: { laserChainBonus: 1 } },
  { id: 'emWave', name: '电磁波', desc: '电磁波+1次波纹', type: 'skill', stackable: true, maxStack: 3, effect: { emWaveBonus: 1 } },
  { id: 'energyCharge', name: '充能加速', desc: '每10伤害+5能量', type: 'energy', stackable: true, maxStack: 3, effect: { energyPerDamageBonus: 5 } },
  { id: 'charge', name: '蓄力弹', desc: '解锁充能炮弹', type: 'weapon', stackable: true, maxStack: 3, effect: { chargeBonus: 1 } },
  { id: 'blade', name: '光刀', desc: '解锁旋转光刀', type: 'skill', stackable: true, maxStack: 3, effect: { bladeBonus: 1 } },
];

// 掉落表
const DROP_TABLE = [
  { id: 'none', name: '空', icon: '', desc: '无掉落', weight: 160 },
  { id: 'energy', name: '⚡能量', icon: '⚡', desc: '+50能量', weight: 20 },
  { id: 'shield', name: '🛡️护盾', icon: '🛡️', desc: '抵挡1次伤害', weight: 10 },
  { id: 'heal', name: '❤️生命', icon: '❤️', desc: '恢复1条生命', weight: 10 },
];

console.log('config.js loaded');
