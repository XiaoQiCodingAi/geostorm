# 代码重构任务清单

**变更名称**: code-refactor  
**日期**: 2026-04-23

---

## 状态：进行中（第一阶段完成）

### 已完成
- [x] 提取常量到 `src/constants.js`（33个常量）
- [x] `index.html` 加载 constants.js
- [x] 语法检查通过
- [x] 已部署到服务器

### 当前文件状态
| 文件 | 大小 | 说明 |
|------|------|------|
| index.html | 98KB | 主文件，JS从92KB减少到86KB |
| src/constants.js | 6.5KB | 常量配置（window.* 导出）|

### src/ 目录其他文件（待集成）
- state.js, weapons.js, skills.js, enemies.js, waves.js, collision.js, drops.js, effects.js, game.js, renderer.js

---

## 下一步
- [ ] 继续提取 state.js（游戏状态）
- [ ] 提取其他模块
- [ ] 完整功能测试

---

## 验证
- [x] 语法检查通过
- [ ] 功能测试（需要你测试）
