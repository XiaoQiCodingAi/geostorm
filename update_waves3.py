with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'r') as f:
    content = f.read()

old = '''  { enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:8}], eliteChance: 0, isBoss: true },
  { enemies: [{type:'pentagon',count:12},{type:'hexagon',count:10},{type:'chaser',count:12},{type:'elite',count:5}], eliteChance: 0.25 },
  { enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8},{type:'hexagon',count:6},{type:'chaser',count:8}], eliteChance: 0, isBoss: true }'''

new = '''  { enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:8},{type:'elite',count:5}], eliteChance: 0, isBoss: true },
  { enemies: [{type:'pentagon',count:12},{type:'hexagon',count:10},{type:'chaser',count:12},{type:'elite',count:5}], eliteChance: 0.25 },
  { enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8},{type:'hexagon',count:6},{type:'chaser',count:8},{type:'elite',count:5}], eliteChance: 0, isBoss: true }'''

if old in content:
    content = content.replace(old, new)
    print('OK: waves 6 and 10 updated with 5 elites each')
else:
    print('ERROR: pattern not found')

with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'w') as f:
    f.write(content)