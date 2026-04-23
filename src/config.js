// ============================================
// 游戏配置常量
// ============================================

// 画布尺寸
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// 玩家属性
const PLAYER_RADIUS = 15;
const PLAYER_SPEED = 5;
const PLAYER_HIT_RADIUS = 12;
const GRAZE_RADIUS = 25;
const INVINCIBLE_FRAMES = 90;

// 子弹属性
const BULLET_SPEED = 12;
const BULLET_RADIUS = 6;
const FIRE_RATE = 18;
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
  // 三角形：三角箭 - 1正中+2侧角±20°
  triangle: { hp: 30, speed: 1.2, bulletSpeed: 2.5, radius: 16, score: 150, color: '#ff4444', fireRate: 80, attackType: 'triangle' },
  // 四边形：四角弹 - 朝四个角发射
  square: { hp: 60, speed: 1.0, bulletSpeed: 2.0, radius: 18, score: 250, color: '#ffaa22', fireRate: 100, attackType: 'square' },
  // 圆形：脉冲型 - 扩散脉冲环
  circle: { hp: 30, speed: 1.6, bulletSpeed: 0, radius: 15, score: 100, color: '#ff44aa', fireRate: 120, attackType: 'pulse' },
  // 五边形：五连星 - 5发间隔0.3秒逐发
  pentagon: { hp: 80, speed: 0.9, bulletSpeed: 1.8, radius: 20, score: 400, color: '#ff8800', fireRate: 45, attackType: 'pentagon' },
  // 六边形：六芒脉冲 - 大脉冲+6发小弹
  hexagon: { hp: 100, speed: 0.8, bulletSpeed: 1.5, radius: 22, score: 500, color: '#aa44ff', fireRate: 70, attackType: 'hexagon' },
  // 追踪者：蓄力冲刺
  chaser: { hp: 40, speed: 2.8, bulletSpeed: 0, radius: 18, score: 300, color: '#44ff88', fireRate: 180, attackType: 'dash' },
  // 精英：组合攻击
  elite: { hp: 50, speed: 1.0, bulletSpeed: 0, radius: 25, score: 800, color: '#ffffff', fireRate: 80, attackType: 'pulse' }
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
  // 第1波：三角形为主，圆形穿插
  { groups: [
    { types: ['triangle'], count: 6, interval: 25 },
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['triangle'], count: 6, interval: 25 },
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['triangle'], count: 6, interval: 25 },
  ], eliteChance: 0.1 },
  // 第2波：方形+圆形
  { groups: [
    { types: ['square'], count: 5, interval: 25 },
    { types: ['circle'], count: 5, interval: 20 },
    { types: ['square'], count: 5, interval: 25 },
    { types: ['circle'], count: 5, interval: 20 },
    { types: ['triangle'], count: 6, interval: 25 },
  ], eliteChance: 0.15 },
  // 第3波：混合型
  { groups: [
    { types: ['circle'], count: 5, interval: 20 },
    { types: ['triangle'], count: 6, interval: 25 },
    { types: ['square'], count: 5, interval: 25 },
    { types: ['circle', 'triangle'], count: 4, mixed: true, interval: 30 },
    { types: ['square', 'circle'], count: 4, mixed: true, interval: 25 },
  ], eliteChance: 0.2 },
  // 第4波：加入追踪者
  { groups: [
    { types: ['triangle'], count: 5, interval: 25 },
    { types: ['chaser'], count: 4, interval: 40 },
    { types: ['square'], count: 5, interval: 25 },
    { types: ['chaser'], count: 4, interval: 40 },
    { types: ['circle', 'triangle'], count: 4, mixed: true, interval: 30 },
  ], eliteChance: 0.25 },
  // 第5波BOSS：多种敌人混合+精英
  { groups: [
    { types: ['triangle'], count: 5, interval: 20 },
    { types: ['square'], count: 5, interval: 20 },
    { types: ['circle'], count: 5, interval: 20 },
    { types: ['chaser'], count: 4, interval: 35 },
    { types: ['triangle', 'square', 'circle'], count: 4, mixed: true, interval: 25 },
  ], eliteChance: 0.2, isBoss: true },
  // 第6波：加入五边形
  { groups: [
    { types: ['triangle'], count: 5, interval: 20 },
    { types: ['pentagon'], count: 4, interval: 40 },
    { types: ['square'], count: 5, interval: 20 },
    { types: ['pentagon'], count: 4, interval: 40 },
    { types: ['circle', 'triangle'], count: 4, mixed: true, interval: 25 },
    { types: ['pentagon'], count: 4, interval: 40 },
  ], eliteChance: 0.3 },
  // 第7波：五边形为主
  { groups: [
    { types: ['pentagon'], count: 5, interval: 35 },
    { types: ['square'], count: 5, interval: 25 },
    { types: ['pentagon'], count: 5, interval: 35 },
    { types: ['circle'], count: 5, interval: 20 },
    { types: ['pentagon', 'triangle'], count: 4, mixed: true, interval: 30 },
  ], eliteChance: 0.25 },
  // 第8波：加入六边形
  { groups: [
    { types: ['hexagon'], count: 4, interval: 45 },
    { types: ['pentagon'], count: 5, interval: 35 },
    { types: ['hexagon'], count: 4, interval: 45 },
    { types: ['chaser'], count: 5, interval: 35 },
    { types: ['hexagon', 'pentagon'], count: 4, mixed: true, interval: 40 },
  ], eliteChance: 0.2 },
  // 第9波：全怪物大混战
  { groups: [
    { types: ['triangle', 'circle'], count: 5, mixed: true, interval: 20 },
    { types: ['square', 'pentagon'], count: 4, mixed: true, interval: 30 },
    { types: ['hexagon', 'chaser'], count: 4, mixed: true, interval: 35 },
    { types: ['triangle', 'square', 'circle'], count: 4, mixed: true, interval: 25 },
    { types: ['pentagon', 'hexagon'], count: 4, mixed: true, interval: 30 },
  ], eliteChance: 0.25 },
  // 第10波最终BOSS：全精英
  { groups: [
    { types: ['elite'], count: 8, interval: 30 },
    { types: ['elite'], count: 8, interval: 25 },
    { types: ['elite'], count: 8, interval: 25 },
    { types: ['elite', 'triangle'], count: 6, mixed: true, interval: 30 },
    { types: ['elite'], count: 6, interval: 20 },
  ], eliteChance: 0, isBoss: true }
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
  { id: 'none', name: '空', icon: '', desc: '无掉落', weight: 80 },
  { id: 'energy', name: '⚡能量', icon: '⚡', desc: '+50能量', weight: 12 },
  { id: 'shield', name: '🛡️护盾', icon: '🛡️', desc: '抵挡1次伤害', weight: 5 },
  { id: 'heal', name: '❤️生命', icon: '❤️', desc: '恢复1条生命', weight: 3 },
];

console.log('config.js loaded');
