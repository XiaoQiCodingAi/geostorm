// state.js - 游戏状态和辅助函数

// 辅助函数
function getSkillLevel(skillId) {
  return skillStacks[skillId] || 0;
}

function getSkillEffect(skillId) {
  const level = skillStacks[skillId] || 0;
  if (level === 0) return 0;
  const skill = ALL_SKILLS.find(s => s.id === skillId);
  if (!skill) return 0;
  return skill.effect[Object.keys(skill.effect)[0]] * level;
}

function getMaxEnergy() {
  let max = MAX_ENERGY;
  if (skillStacks['energyCap1']) max += skillStacks['energyCap1'] * 50;
  return max;
}

function getEnergyPerKill() {
  const level = skillStacks['energyCharge'] || 0;
  const perDamage = 10 + level * 5;
  return { flat: ENERGY_PER_KILL, perDamage };
}
