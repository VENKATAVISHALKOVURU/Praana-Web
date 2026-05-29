import re

with open('praana.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

def get_balanced_blocks(text, start_tag='<div class="phone-frame">'):
    blocks = []
    idx = 0
    while True:
        idx = text.find(start_tag, idx)
        if idx == -1:
            break
        
        depth = 0
        i = idx
        while i < len(text):
            if text.startswith('<div', i):
                depth += 1
                i += 4
            elif text.startswith('</div', i):
                depth -= 1
                i += 5
                if depth == 0:
                    blocks.append(text[idx:i+1])
                    break
            else:
                i += 1
        idx = i
    return blocks

phone_frames = get_balanced_blocks(html_content)
print(f"Found {len(phone_frames)} phone frames in praana.html")

def html_to_jsx(html):
    html = html.replace('class=', 'className=')
    html = html.replace('readonly', 'readOnly')
    html = html.replace('stroke-width=', 'strokeWidth=')
    html = html.replace('stroke-linecap=', 'strokeLinecap=')
    html = html.replace('<br>', '<br />')
    
    def style_replacer(m):
        pairs = []
        for p in m.group(1).split(';'):
            if p.strip():
                kv = p.split(':')
                if len(kv) == 2:
                    pairs.append(f'"{kv[0].strip()}":"{kv[1].strip()}"')
        return 'style={{' + ','.join(pairs) + '}}'
        
    html = re.sub(r'style="([^"]+)"', style_replacer, html)
    
    html = re.sub(r'(<input[^>]*)(?<!/)>', r'\1 />', html)
    
    html = html.replace('"margin-bottom"', '"marginBottom"')
    html = html.replace('"margin-top"', '"marginTop"')
    html = html.replace('"padding-bottom"', '"paddingBottom"')
    html = html.replace('"padding-top"', '"paddingTop"')
    html = html.replace('"justify-content"', '"justifyContent"')
    html = html.replace('"align-items"', '"alignItems"')
    html = html.replace('"flex-direction"', '"flexDirection"')
    html = html.replace('"background-color"', '"backgroundColor"')
    html = html.replace('"font-family"', '"fontFamily"')
    html = html.replace('"font-size"', '"fontSize"')
    html = html.replace('"font-weight"', '"fontWeight"')
    html = html.replace('"font-style"', '"fontStyle"')
    html = html.replace('"border-radius"', '"borderRadius"')
    html = html.replace('"border-bottom"', '"borderBottom"')
    html = html.replace('"border-left"', '"borderLeft"')
    html = html.replace('"letter-spacing"', '"letterSpacing"')
    html = html.replace('"text-transform"', '"textTransform"')
    html = html.replace('"text-align"', '"textAlign"')
    html = html.replace('"line-height"', '"lineHeight"')
    
    return html

jsx_frames = [html_to_jsx(f) for f in phone_frames]

new_showcase = '<div className="screens-showcase" style={{ display: "flex", flexWrap: "wrap", gap: "32px", justifyContent: "center", padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>\n'
new_showcase += '\n'.join(jsx_frames)
new_showcase += '\n</div>\n\n'

with open('src/components/Landing.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_idx = content.find('<div className="screens-showcase"')
end_idx = content.find('<div className="testimonials"', start_idx)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_showcase + content[end_idx:]
    with open('src/components/Landing.jsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated Landing.jsx")
else:
    print("Could not find blocks in Landing.jsx")
