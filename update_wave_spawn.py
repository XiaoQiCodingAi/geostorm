with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'r') as f:
    content = f.read()

# New wave format with groups for more dynamic spawning
old = '''const ROGUE_WAVES = [
  { enemies: [{type:'triangle',count:15},{type:'circle',count:8}], eliteChance: 0.1 },
  { enemies: [{type:'square',count:12},{type:'circle',count:10},{type:'triangle',count:8}], eliteChance: 0.15 },
  { enemies: [{type:'circle',count:12},{type:'triangle',count:10},{type:'square',count:8}], eliteChance: 0.2 },
  { enemies: [{type:'triangle',count:12},{type:'square',count:10},{type:'circle',count:8},{type:'chaser',count:6}], eliteChance: 0.25 },
  { enemies: [{type:'circle',count:10},{type:'chaser',count:12},{type:'triangle',count:8},{type:'elite',count:3}], eliteChance: 0.2, isBoss: true },
  { enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:8},{type:'elite',count:5}], eliteChance: 0 },
  { enemies: [{type:'pentagon',count:10},{type:'square',count:8},{type:'circle',count:8},{type:'chaser',count:6},{type:'elite',count:3}], eliteChance: 0.25 },
  { enemies: [{type:'hexagon',count:10},{type:'pentagon',count:8},{type:'chaser',count:8},{type:'elite',count:4}], eliteChance: 0.2 },
  { enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8},{type:'hexagon',count:6},{type:'chaser',count:8}], eliteChance: 0.25 },
  { enemies: [{type:'elite',count:30}], eliteChance: 0, isBoss: true }
];'''

new = '''const ROGUE_WAVES = [
  // 第1波：三角形为主，圆形穿插
  { groups: [
    { types: ['triangle'], count: 5, interval: 25 },
    { types: ['circle'], count: 3, interval: 20 },
    { types: ['triangle'], count: 5, interval: 25 },
    { types: ['circle'], count: 3, interval: 20 },
    { types: ['triangle'], count: 5, interval: 25 },
  ], eliteChance: 0.1 },
  // 第2波：方形+圆形
  { groups: [
    { types: ['square'], count: 4, interval: 25 },
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['square'], count: 4, interval: 25 },
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['triangle'], count: 5, interval: 25 },
  ], eliteChance: 0.15 },
  // 第3波：混合型
  { groups: [
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['triangle'], count: 5, interval: 25 },
    { types: ['square'], count: 4, interval: 25 },
    { types: ['circle', 'triangle'], count: 3, mixed: true, interval: 30 },
  ], eliteChance: 0.2 },
  // 第4波：加入追踪者
  { groups: [
    { types: ['triangle'], count: 5, interval: 25 },
    { types: ['chaser'], count: 3, interval: 40 },
    { types: ['square'], count: 4, interval: 25 },
    { types: ['chaser'], count: 3, interval: 40 },
    { types: ['circle', 'triangle'], count: 3, mixed: true, interval: 30 },
  ], eliteChance: 0.25 },
  // 第5波BOSS：多种敌人混合+精英
  { groups: [
    { types: ['triangle'], count: 5, interval: 20 },
    { types: ['square'], count: 4, interval: 20 },
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['chaser'], count: 4, interval: 35 },
    { types: ['triangle', 'square', 'circle'], count: 3, mixed: true, interval: 25 },
  ], eliteChance: 0.2, isBoss: true },
  // 第6波：加入五边形
  { groups: [
    { types: ['triangle'], count: 5, interval: 20 },
    { types: ['pentagon'], count: 3, interval: 40 },
    { types: ['square'], count: 4, interval: 20 },
    { types: ['pentagon'], count: 3, interval: 40 },
    { types: ['circle', 'triangle'], count: 3, mixed: true, interval: 25 },
    { types: ['pentagon'], count: 3, interval: 40 },
  ], eliteChance: 0.3 },
  // 第7波：五边形为主
  { groups: [
    { types: ['pentagon'], count: 4, interval: 35 },
    { types: ['square'], count: 4, interval: 25 },
    { types: ['pentagon'], count: 4, interval: 35 },
    { types: ['circle'], count: 4, interval: 20 },
    { types: ['pentagon', 'triangle'], count: 3, mixed: true, interval: 30 },
  ], eliteChance: 0.25 },
  // 第8波：加入六边形
  { groups: [
    { types: ['hexagon'], count: 3, interval: 45 },
    { types: ['pentagon'], count: 4, interval: 35 },
    { types: ['hexagon'], count: 3, interval: 45 },
    { types: ['chaser'], count: 4, interval: 35 },
    { types: ['hexagon', 'pentagon'], count: 3, mixed: true, interval: 40 },
  ], eliteChance: 0.2 },
  // 第9波：全怪物大混战
  { groups: [
    { types: ['triangle', 'circle'], count: 4, mixed: true, interval: 20 },
    { types: ['square', 'pentagon'], count: 3, mixed: true, interval: 30 },
    { types: ['hexagon', 'chaser'], count: 3, mixed: true, interval: 35 },
    { types: ['triangle', 'square', 'circle'], count: 3, mixed: true, interval: 25 },
    { types: ['pentagon', 'hexagon'], count: 3, mixed: true, interval: 30 },
  ], eliteChance: 0.25 },
  // 第10波最终BOSS：全精英
  { groups: [
    { types: ['elite'], count: 6, interval: 30 },
    { types: ['elite'], count: 6, interval: 25 },
    { types: ['elite'], count: 6, interval: 25 },
    { types: ['elite', 'triangle'], count: 4, mixed: true, interval: 30 },
    { types: ['elite'], count: 6, interval: 20 },
  ], eliteChance: 0, isBoss: true }
];'''

if old in content:
    content = content.replace(old, new)
    print('OK')
else:
    print('ERROR: pattern not found')

with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'w') as f:
    f.write(content)