with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'r') as f:
    content = f.read()

old = '''const ROGUE_WAVES = [
  { enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:6}], eliteChance: 0 },
  { enemies: [{type:'square',count:10},{type:'circle',count:8}], eliteChance: 0.1 },
  { enemies: [{type:'circle',count:10},{type:'pentagon',count:6}], eliteChance: 0.15 },
  { enemies: [{type:'pentagon',count:8},{type:'hexagon',count:4}], eliteChance: 0.2 },
  { enemies: [{type:'hexagon',count:6},{type:'chaser',count:10},{type:'elite',count:2}], eliteChance: 0.3 },
  { enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8}], eliteChance: 0, isBoss: true },
  { enemies: [{type:'pentagon',count:10},{type:'hexagon',count:8},{type:'elite',count:3}], eliteChance: 0.4 },
  { enemies: [{type:'hexagon',count:10},{type:'chaser',count:15},{type:'elite',count:4}], eliteChance: 0.5 },
  { enemies: [{type:'pentagon',count:10},{type:'hexagon',count:10},{type:'elite',count:5}], eliteChance: 0.6 },
  { enemies: [{type:'triangle',count:8},{type:'square',count:8},{type:'circle',count:8},{type:'pentagon',count:6},{type:'hexagon',count:4},{type:'elite',count:8}], eliteChance: 0.8, isBoss: true }
];'''

new = '''const ROGUE_WAVES = [
  { enemies: [{type:'triangle',count:18},{type:'square',count:18},{type:'circle',count:9}], eliteChance: 0 },
  { enemies: [{type:'square',count:15},{type:'circle',count:12}], eliteChance: 0.1 },
  { enemies: [{type:'circle',count:15},{type:'pentagon',count:9}], eliteChance: 0.15 },
  { enemies: [{type:'pentagon',count:12},{type:'hexagon',count:6}], eliteChance: 0.2 },
  { enemies: [{type:'hexagon',count:9},{type:'chaser',count:15},{type:'elite',count:3}], eliteChance: 0.3 },
  { enemies: [{type:'triangle',count:15},{type:'square',count:15},{type:'circle',count:15},{type:'pentagon',count:12}], eliteChance: 0, isBoss: true },
  { enemies: [{type:'pentagon',count:15},{type:'hexagon',count:12},{type:'elite',count:5}], eliteChance: 0.4 },
  { enemies: [{type:'hexagon',count:15},{type:'chaser',count:23},{type:'elite',count:6}], eliteChance: 0.5 },
  { enemies: [{type:'pentagon',count:15},{type:'hexagon',count:15},{type:'elite',count:8}], eliteChance: 0.6 },
  { enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:9},{type:'hexagon',count:6},{type:'elite',count:12}], eliteChance: 0.8, isBoss: true }
];'''

if old in content:
    content = content.replace(old, new)
    print('OK: waves updated')
else:
    print('ERROR: pattern not found, checking current...')
    import re
    m = re.search(r'const ROGUE_WAVES = \[.*?\];', content, re.DOTALL)
    if m:
        print(m.group(0)[:200])

with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'w') as f:
    f.write(content)