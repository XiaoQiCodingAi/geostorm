# 代码重构提案

**变更名称**: code-refactor  
**创建日期**: 2026-04-23  
**状态**: draft

---

## 一、为什么需要重构

### 当前问题

1. **单文件过大**：`index.html` 包含 2000+ 行代码，JS/CSS/HTML 全混在一起
2. **调试困难**：每次改动后难以快速定位问题所在
3. **状态分散**：几十个全局变量散落各处，无统一管理
4. **配置混杂**：常量（波次、技能、敌人数值）和逻辑混杂
5. **难以扩展**：新增功能需要在 2000 行文件里找位置

### 重构收益

- 每次改动可精准定位文件，减少回归 bug
- 配置与逻辑分离，改数值不影响代码逻辑
- 为未来功能（关卡编辑器、AI 对战、多人模式）打下基础
- 代码可读性提升，利于维护

---

## 二、重构目标

### 2.1 目录结构

```
geo-storm/
├── src/
│   ├── constants.js      # 游戏常量（波次、技能、敌人数值、掉落表）
│   ├── state.js          # 游戏状态（player, boss, enemies, bullets 等）
│   ├── weapons.js        # 武器系统（散弹、穿透弹、蓄力弹）
│   ├── skills.js         # 技能系统（光刀、激光连锁、电磁波、充能加速）
│   ├── enemies.js        # 敌人逻辑（生成、AI、弹幕）
│   ├── waves.js          # 波次管理（波次配置、生成队列）
│   ├── renderer.js       # 渲染逻辑（所有 draw 函数）
│   ├── collision.js      # 碰撞检测
│   ├── drops.js          # 掉落系统
│   ├── effects.js        # 粒子、特效
│   └── game.js           # 主循环、入口点
├── index.html            # HTML + 样式（保持轻量）
└── package.json
```

### 2.2 模块职责

| 模块 | 职责 |
|------|------|
| `constants.js` | 所有配置数据（波次、技能、敌人属性、常量数值） |
| `state.js` | 游戏运行时状态（player, boss, enemies[], bullets[], particles[]） |
| `weapons.js` | 武器发射逻辑（散弹、穿透弹、蓄力弹、普通子弹） |
| `skills.js` | 技能效果（光刀旋转、激光连锁、电磁波、充能加速） |
| `enemies.js` | 敌人行为（移动、射击、AI、生成） |
| `waves.js` | 波次调度（波次选择、敌人队列、BOSS 触发） |
| `renderer.js` | 所有渲染逻辑（统一入口 `render()`） |
| `collision.js` | 碰撞检测（玩家子弹 vs 敌人、敌弹 vs 玩家、光刀销毁敌弹） |
| `drops.js` | 掉落系统（掉落表、拾取逻辑） |
| `effects.js` | 粒子系统、浮动文字、特效 |
| `game.js` | 主循环、事件处理、存档加载 |

### 2.3 状态管理约定

所有状态集中在 `state.js`，格式如下：

```javascript
// state.js
const state = {
  player: { x, y, lives, energy, ... },
  boss: null,
  enemies: [],
  playerBullets: [],
  enemyBullets: [],
  particles: [],
  floatingTexts: [],
  skillStacks: {},      // 技能等级
  activeDrops: [],
  kWaves: [],
  laserHitTargets: [],
  // ...其他状态
};
```

各模块通过 `state` 对象访问和修改状态，不使用零散的全局变量。

---

## 三、保持不变的内容

- **游戏数值**：不改数值，只改组织结构
- **功能逻辑**：散弹、穿透弹等行为保持不变
- **服务端 API**：服务器代码和数据库不变
- **用户数据**：存档格式兼容，不丢失数据

---

## 四、验收标准

1. ✅ 所有模块可独立测试
2. ✅ `index.html` 行数减少到 200 行以内
3. ✅ 修改任何功能可精准定位到对应文件
4. ✅ 原有功能（战斗、技能、掉落、波次）行为不变
5. ✅ test 账号测试配置仍然生效
6. ✅ 存档加载/保存正常
7. ✅ 语法检查通过
8. ✅ 游戏可正常运行
