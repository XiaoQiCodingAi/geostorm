with open('src/config.js', 'r') as f:
    content = f.read()

old_enemy_types = '''const ENEMY_TYPES = {
  triangle: { hp: 30, radius: 12, speed: 2, score: 100, color: '#ff6666', shape: 'triangle', dropChance: 0.05 },
  square: { hp: 50, radius: 14, speed: 1.5, score: 150, color: '#ffaa00', shape: 'square', dropChance: 0.08 },
  circle: { hp: 40, radius: 13, speed: 2.5, score: 120, color: '#66ff66', shape: 'circle', dropChance: 0.06 },
  pentagon: { hp: 80, radius: 16, speed: 1.8, score: 200, color: '#6666ff', shape: 'pentagon', dropChance: 0.10 },
  hexagon: { hp: 120, radius: 18, speed: 1.2, score: 300, color: '#ff66ff', shape: 'hexagon', dropChance: 0.12 },
  chaser: { hp: 25, radius: 10, speed: 3, score: 80, color: '#ff9966', shape: 'circle', dropChance: 0.04 }
};'''

new_enemy_types = '''const ENEMY_TYPES = {
  // 三角形：三角箭 - 1正中+2侧角±20°
  triangle: { hp: 30, speed: 1.2, bulletSpeed: 2.5, radius: 16, score: 150, color: '#ff4444', fireRate: 80, attackType: 'triangle' },
  // 四边形：四角弹 - 朝四个角发射
  square: { hp: 60, speed: 1.0, bulletSpeed: 2.0, radius: 18, score: 250, color: '#ffaa22', fireRate: 100, attackType: 'square' },
  // 圆形：脉冲型 - 扩散脉冲环
  circle: { hp: 25, speed: 1.2, bulletSpeed: 0, radius: 15, score: 100, color: '#ff44aa', fireRate: 120, attackType: 'pulse' },
  // 五边形：五连星 - 5发间隔0.3秒逐发
  pentagon: { hp: 80, speed: 0.9, bulletSpeed: 1.8, radius: 20, score: 400, color: '#00ddff', fireRate: 90, attackType: 'pentagon' },
  // 六边形：六芒脉冲 - 大脉冲+6发小弹
  hexagon: { hp: 100, speed: 0.8, bulletSpeed: 1.5, radius: 22, score: 500, color: '#aa44ff', fireRate: 70, attackType: 'hexagon' },
  // 追踪者：蓄力冲刺
  chaser: { hp: 40, speed: 2.5, bulletSpeed: 0, radius: 18, score: 300, color: '#44ff88', fireRate: 180, attackType: 'dash' },
  // 精英：组合攻击
  elite: { hp: 150, speed: 1.0, bulletSpeed: 2.0, radius: 25, score: 800, color: '#ffffff', fireRate: 75, attackType: 'combo' }
};'''

if old_enemy_types in content:
    content = content.replace(old_enemy_types, new_enemy_types)
    print("ENEMY_TYPES 已修复")
else:
    print("未找到旧的 ENEMY_TYPES，尝试查找...")
    # Print what's in the file around ENEMY_TYPES
    idx = content.find('ENEMY_TYPES')
    if idx >= 0:
        print(content[idx:idx+500])

with open('src/config.js', 'w') as f:
    f.write(content)