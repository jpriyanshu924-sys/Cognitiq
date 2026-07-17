import os

app_js_path = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq\app.js"

with open(app_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace categoriesMapping in _updateDashboard
old_mapping_start = "// Dynamically update progress counters for all 7 trait categories"
idx1 = content.find(old_mapping_start)
if idx1 == -1:
    print("Error: Could not find categoriesMapping start")
    exit(1)

# Find the matching closing bracket of the categoriesMapping array
end_bracket_idx = content.find("];", idx1)
if end_bracket_idx == -1:
    print("Error: Could not find categoriesMapping end")
    exit(1)

new_mapping = """// Dynamically update progress counters for all 7 trait categories
    const categoriesMapping = [
      { id: 1, games: ['arrows-game', 'arrow-directions', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop', 'security-door', 'checking-game'] },
      { id: 2, games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets', 'number-dash'] },
      { id: 3, games: ['verify-numerical', 'calculation-game', 'flashback'] },
      { id: 4, games: ['verify-inductive', 'logic-deduction', 'pattern-matrix', 'patterns', 'power-generators', 'shapedance'] },
      { id: 5, games: ['tower-game', 'shape-spinner', 'order', 'mirror-match', 'pathfinder', 'gridlock', 'pipe-puzzle'] },
      { id: 6, games: ['balloon-game', 'money-exchange', 'hard-easy-game', 'cards-game', 'balloon-risk-game', 'business-sim'] },
      { id: 7, games: ['faces-game', 'emotions-face-game', 'team-selling', 'inbox-triage', 'scenario-judge', 'team-dilemma', 'crisis-room', 'personality-reveal'] }
    ]"""

content = content[:idx1] + new_mapping + content[end_bracket_idx + 2:]


# 2. Replace cats inside _showProfile
show_profile_marker = "const cats = ["
idx2 = content.find(show_profile_marker)
if idx2 == -1:
    print("Error: Could not find cats in _showProfile")
    exit(1)

# Find the end of cats array
end_cats_idx = content.find("];", idx2)
if end_cats_idx == -1:
    print("Error: Could not find end of cats in _showProfile")
    exit(1)

new_cats_profile = """const cats = [
      { name: 'Attention & Focus',         games: ['arrows-game', 'arrow-directions', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop', 'security-door', 'checking-game'], c1: '#06b6d4', c2: '#0891b2' },
      { name: 'Working Memory',            games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets', 'number-dash'], c1: '#7c3aed', c2: '#6d28d9' },
      { name: 'Quantitative',              games: ['verify-numerical', 'calculation-game', 'flashback'], c1: '#d97706', c2: '#b45309' },
      { name: 'Logical Reasoning',         games: ['verify-inductive', 'logic-deduction', 'pattern-matrix', 'patterns', 'power-generators', 'shapedance'], c1: '#8b5cf6', c2: '#7c3aed' },
      { name: 'Spatial & Planning',        games: ['tower-game', 'shape-spinner', 'order', 'mirror-match', 'pathfinder', 'gridlock', 'pipe-puzzle'], c1: '#2563eb', c2: '#1d4ed8' },
      { name: 'Risk & Decisions',          games: ['balloon-game', 'money-exchange', 'hard-easy-game', 'cards-game', 'balloon-risk-game', 'business-sim'], c1: '#10b981', c2: '#059669' },
      { name: 'Social & Interpersonal',    games: ['faces-game', 'emotions-face-game', 'team-selling', 'inbox-triage', 'scenario-judge', 'team-dilemma', 'crisis-room', 'personality-reveal'], c1: '#ec4899', c2: '#be185d' }
    ]"""

content = content[:idx2] + new_cats_profile + content[end_cats_idx + 2:]


# 3. Replace cats inside _drawRadar (first occurence of const cats = [ after _drawRadar)
draw_radar_marker = "_drawRadar(scores) {"
idx3 = content.find(draw_radar_marker)
if idx3 == -1:
    print("Error: Could not find _drawRadar")
    exit(1)

cats_radar_marker = "const cats = ["
idx4 = content.find(cats_radar_marker, idx3)
if idx4 == -1:
    print("Error: Could not find cats in _drawRadar")
    exit(1)

end_cats_radar_idx = content.find("];", idx4)
if end_cats_radar_idx == -1:
    print("Error: Could not find end of cats in _drawRadar")
    exit(1)

new_cats_radar = """const cats = [
      { name: 'Attention & Focus',         games: ['arrows-game', 'arrow-directions', 'lengths-game', 'motion-track', 'keypress-game', 'signal-stop', 'security-door', 'checking-game'] },
      { name: 'Working Memory',            games: ['memory-vault', 'digit-nback', 'sequence', 'aon-switch', 'tickets', 'number-dash'] },
      { name: 'Quantitative',              games: ['verify-numerical', 'calculation-game', 'flashback'] },
      { name: 'Logical Reasoning',         games: ['verify-inductive', 'logic-deduction', 'pattern-matrix', 'patterns', 'power-generators', 'shapedance'] },
      { name: 'Spatial & Planning',        games: ['tower-game', 'shape-spinner', 'order', 'mirror-match', 'pathfinder', 'gridlock', 'pipe-puzzle'] },
      { name: 'Risk & Decisions',          games: ['balloon-game', 'money-exchange', 'hard-easy-game', 'cards-game', 'balloon-risk-game', 'business-sim'] },
      { name: 'Social & Interpersonal',    games: ['faces-game', 'emotions-face-game', 'team-selling', 'inbox-triage', 'scenario-judge', 'team-dilemma', 'crisis-room', 'personality-reveal'] }
    ]"""

content = content[:idx4] + new_cats_radar + content[end_cats_radar_idx + 2:]


with open(app_js_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Progress mappings and radar categories updated successfully!")
