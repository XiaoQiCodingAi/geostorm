# 配置常量提取提案

**日期**: 2026-04-23
**状态**: 待处理

## 目标
将 index.html 中的游戏配置常量提取到独立的 `src/config.js` 文件中，便于统一管理和修改。

## 需要提取的常量
- 画布尺寸：GAME_WIDTH, GAME_HEIGHT
- 玩家属性：PLAYER_RADIUS, PLAYER_SPEED, PLAYER_HIT_RADIUS, GRAZE_RADIUS, INVINCIBLE_FRAMES
- 子弹属性：BULLET_SPEED, BULLET_RADIUS, FIRE_RATE, DAMAGE, MAX_BULLETS
- 瞄准角度：AIM_ANGLE
- Boss 属性：BOSS_HP, BOSS_RADIUS
- 能量系统：MAX_ENERGY, ENERGY_PER_KILL, K_SKILL_COST, J_SKILL_SPEED_BONUS, J_SKILL_DAMAGE, ENERGY_DRAIN_RATE
- 精英上限：MAX_ELITE
- 敌人类型：ENEMY_TYPES
- 波次配置：ROGUE_WAVES, TEST_ROGUE_WAVES, WAVE_REWARDS
- API 配置：API_BASE
- 技能配置：ALL_SKILLS
- 掉落配置：DROP_TABLE

## 不提取
- canvas, ctx（DOM 相关）
- 函数定义的常量（如 saveProgress）
- 运行时变量（keys, gameState 等）
