with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'r') as f:
    content = f.read()

# Fix wave 6 (index 5)
old6 = "{ enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:8}], eliteChance: 0, isBoss: true }"
new6 = "{ enemies: [{type:'triangle',count:12},{type:'square',count:12},{type:'circle',count:12},{type:'pentagon',count:8},{type:'elite',count:5}], eliteChance: 0, isBoss: true }"

# Fix wave 10 (index 9)  
old10 = "{ enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8},{type:'hexagon',count:6},{type:'chaser',count:8}], eliteChance: 0, isBoss: true }"
new10 = "{ enemies: [{type:'triangle',count:10},{type:'square',count:10},{type:'circle',count:10},{type:'pentagon',count:8},{type:'hexagon',count:6},{type:'chaser',count:8},{type:'elite',count:5}], eliteChance: 0, isBoss: true }"

if old6 in content:
    content = content.replace(old6, new6)
    print('OK: wave 6 fixed')
else:
    print('ERROR: wave 6 pattern not found')

if old10 in content:
    content = content.replace(old10, new10)
    print('OK: wave 10 fixed')
else:
    print('ERROR: wave 10 pattern not found')

with open('/root/.openclaw/workspace/games/geo-storm/src/config.js', 'w') as f:
    f.write(content)