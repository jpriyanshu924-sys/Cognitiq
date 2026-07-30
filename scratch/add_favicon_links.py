import os
import re

workspace = r"C:\Users\PRIYANSHU\.gemini\antigravity\scratch\cognitiq"

html_files = [f for f in os.listdir(workspace) if f.endswith(".html")]

favicon_tag = '  <link rel="icon" type="image/svg+xml" href="favicon.svg" />\n'

for f_name in html_files:
    file_path = os.path.join(workspace, f_name)
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "favicon.svg" not in content:
        # Insert after <meta name="viewport" ... /> or <head>
        if '<meta name="viewport"' in content:
            content = re.sub(
                r'(<meta name="viewport"[^>]*>)',
                r'\1\n' + favicon_tag.rstrip(),
                content,
                count=1
            )
        else:
            content = content.replace("<head>", "<head>\n" + favicon_tag.rstrip())
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Added favicon link to {f_name}")
    else:
        print(f"Favicon already in {f_name}")

print("=== FAVICON LINK INJECTION COMPLETE ===")
