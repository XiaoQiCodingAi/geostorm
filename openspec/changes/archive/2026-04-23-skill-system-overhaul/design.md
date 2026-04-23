# 技能系统重构设计方案

**变更名称**: skill-system-overhaul  
**日期**: 2026-04-23

---

## 一、概述

本次重构统一7个技能的叠加规则为最大3级，并调整各技能的效果数值。改动涉及：配置变更、技能逻辑修改、UI显示更新。

---

## 二、配置变更

### 2.1 技能 maxStack 统一调整为3

```javascript
const ALL_SKILLS = [
  { id: 'pierce', ..., maxStack: 3, effect: { pierceBonus: 1 } },
  { id: 'scatter', ..., maxStack: 3, effect: { scatterBonus: 1 } },
  { id: 'laser', ..., maxStack: 3, effect: { laserChainBonus: 1 } },
  { id: 'emWave', ..., maxStack: 3, effect: { emWaveBonus: 1 } },
  { id: 'energyCharge', ..., maxStack: 3, effect: { energyPerDamageBonus: 5 } },
  { id: 'charge', ..., maxStack: 3, effect: { chargeDamageBonus: 0.5 } },
  { id: 'blade', ..., maxStack: 3, effect: { bladeAngleBonus: 45 } },
];
```

---

## 三、穿透弹 (Pierce) 设计

### 3.1 现有行为
子弹击中一个敌人后消失

### 3.2 新行为
- 子弹维护一个 `hitTargets` 列表
- 碰撞检测时跳过 `hitTargets` 中的敌人
- 命中后将该敌人加入 `hitTargets`，子弹继续飞行
- 当 `hitTargets.length >= pierceBonus + 1` 时子弹消失

### 3.3 代码结构
```javascript
// 子弹数据结构新增
{
  ...,
  hitTargets: [], // 已命中的目标ID列表
  pierceCount: 0, // 已穿透目标数
}

// 碰撞检测
function checkBulletHit(bullet, enemy) {
  if (bullet.hitTargets.includes(enemy.id)) return false;
  return Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < bullet.radius + enemy.radius;
}

// 命中后处理
function onBulletHit(bullet, enemy) {
  bullet.hitTargets.push(enemy.id);
  bullet.pierceCount++;
  if (bullet.pierceCount > getSkillEffect('pierce')) {
    bullet.dead = true;
  }
}
```

---

## 四、散弹 (Scatter) 设计

### 4.1 现有行为
每级+1路散弹

### 4.2 新行为
- Lv.1: 2路（主子弹+1路散弹）
- Lv.2: 3路（主子弹+2路散弹）
- Lv.3: 4路（主子弹+3路散弹）

### 4.3 代码结构
```javascript
function createScatterBullets(angle) {
  const level = getSkillLevel('scatter'); // 1-3
  const totalBullets = level + 1; // 2/3/4
  const spreadAngle = Math.PI / 6; // 30度散射角
  
  for (let i = 0; i < totalBullets; i++) {
    const offset = (i - (totalBullets - 1) / 2) * spreadAngle;
    createBullet(angle + offset);
  }
}
```

---

## 五、蓄力弹 (Charge) 设计

### 5.1 新增定时发射逻辑
```javascript
let chargeTimer = 0;
const CHARGE_INTERVAL = 120; // 帧

function updateCharge() {
  if (getSkillLevel('charge') < 1) return;
  
  chargeTimer++;
  const interval = getSkillLevel('charge') >= 3 ? 80 : 120;
  
  if (chargeTimer >= interval) {
    chargeTimer = 0;
    fireChargeBullet();
  }
}

function fireChargeBullet() {
  const level = getSkillLevel('charge');
  const damageMultiplier = level >= 2 ? 1.5 : 1;
  const baseDamage = 30;
  createChargeBullet(player.angle, baseDamage * damageMultiplier);
}
```

---

## 六、光刀 (Blade) 设计

### 6.1 角度参数
```javascript
function getBladeAngle() {
  const level = getSkillLevel('blade');
  if (level === 0) return 0;
  if (level === 1) return Math.PI / 2;    // 90°
  if (level === 2) return Math.PI * 0.75; // 135°
  return Math.PI * 1.25;                  // 225°
}
```

### 6.2 子弹销毁检测
```javascript
function checkBladeBulletCollision(bullet) {
  if (getSkillLevel('blade') < 1) return false;
  
  const bladeAngle = getPlayerAngle(); // 玩家朝向
  const bulletAngle = Math.atan2(bullet.y - player.y, bullet.x - player.x);
  let angleDiff = Math.abs(bladeAngle - bulletAngle);
  if (angleDiff > Math.PI) angleDiff = Math.PI * 2 - angleDiff;
  
  return angleDiff < getBladeAngle() / 2;
}
```

---

## 七、激光连锁 (Laser Chain) 设计

### 7.1 连锁逻辑
- Lv.1: 连锁2个额外目标（共3个）
- Lv.2: 连锁3个额外目标（共4个）
- Lv.3: 连锁4个额外目标（共5个）

### 7.2 代码结构（复用现有逻辑）
```javascript
function findLaserChainTargets(primaryTarget) {
  const level = getSkillLevel('laser');
  const chainCount = level + 1; // 2/3/4
  // 从近到远排序，选择最近的chainCount个
}
```

---

## 八、电磁波 (EM Wave) 设计

### 8.1 多波纹实现
```javascript
function releaseEMWave() {
  const level = getSkillLevel('emWave');
  const waveCount = level + 1; // 2/3/4
  
  for (let i = 0; i < waveCount; i++) {
    setTimeout(() => {
      createEMWaveRing(i === 0 ? 1.0 : 0.2); // 首波100%，余波20%
    }, i * 15 * (1000/60)); // 每15帧延迟
  }
}
```

---

## 九、UI设计

### 9.1 技能状态栏
位置：波次完成界面顶部
```html
<div class="skill-status-bar">
  <span class="skill-badge" title="穿透弹">🔫 Lv.2/3</span>
  <span class="skill-badge" title="散弹">散弹 Lv.1/3</span>
  <span class="skill-badge" title="光刀">⚔️ Lv.3/3</span>
  ...
</div>
```

### 9.2 技能满级样式
```css
.skill-badge.maxed {
  opacity: 0.5;
  border: 2px solid gold;
}
```

---

## 十、存档兼容

- `skillStacks` 字段存储各技能等级
- 新版本支持旧存档自动补全
- maxStack 从4改为3不影响旧存档（已超过3级的按3级处理）
