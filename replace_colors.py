import os
import re

files_to_process = [
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/auth/pages/login/login.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/holidays/pages/holiday-form/holiday-form.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/payroll/pages/payroll-detail/payroll-detail.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/company/pages/company-detail/company-detail.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/attendance/pages/scanner/scanner.css",
]

def replace_colors_in_css(content):
    # Mapping exact hex/rgba to the variables from T-013.
    # We will do a generic replacement for standard ones.
    
    # Text colors
    content = re.sub(r'(?i)(color\s*:\s*)(#1a1a1a|#333333|#333|var\(--text-color,\s*#333333\))\b', r'\1var(--color-text-primary)', content)
    content = re.sub(r'(?i)(color\s*:\s*)(#6c757d|#6b7280|#666666|#666|var\(--text-muted,\s*#666666\))\b', r'\1var(--color-text-secondary)', content)
    
    # Background colors
    content = re.sub(r'(?i)(background(?:-color)?\s*:\s*)(#ffffff|#fff|var\(--surface-color,\s*#ffffff\))\b', r'\1var(--color-bg-primary)', content)
    content = re.sub(r'(?i)(background(?:-color)?\s*:\s*)(#f3f4f6|#f9fafb|#f8f9fa)\b', r'\1var(--color-bg-secondary)', content)
    
    # Border colors
    content = re.sub(r'(?i)(border(?:-color|-top-color|-bottom-color|-left-color|-right-color)?\s*:\s*[^;}]*)(#e5e7eb|#cccccc|#ccc|#dddddd|#ddd|var\(--border-color,\s*#cccccc\))\b', r'\1var(--color-border)', content)
    
    # Primary colors
    content = re.sub(r'(?i)(#007bff|var\(--primary-color,\s*#007bff\))\b', r'var(--color-primary)', content)
    # login.css uses #6366f1 as primary sometimes, but let's stick to the prompt's request: "T-013-dark-light-analysis.md dagi CSS custom property sxemasini ... mos var(--color-*)/var(--shadow-color) o'zgaruvchilariga almashtiring."
    # If there are other hex codes, should we replace them? The prompt says "qattiq kodlangan rang qiymatlarini ... mos ... o'zgaruvchilariga almashtiring".
    
    # Hover primary
    content = re.sub(r'(?i)(#0056b3|#004494|var\(--primary-hover,\s*#004494\))\b', r'var(--color-primary-hover)', content)
    
    # Danger
    content = re.sub(r'(?i)(#dc3545|#ef4444|#f87171|#fca5a5)\b', r'var(--color-danger)', content)
    
    # Success
    content = re.sub(r'(?i)(#10b981|#34d399|#28a745)\b', r'var(--color-success)', content)
    
    # Shadow and Overlay
    content = re.sub(r'(?i)rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.1\s*\)', r'var(--shadow-color)', content)
    content = re.sub(r'(?i)rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.05\s*\)', r'var(--shadow-color)', content)
    content = re.sub(r'(?i)rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.5\s*\)', r'var(--color-overlay)', content)
    
    # Some generic white colors not matched by background/text:
    # login.css uses color: #fff; background: rgba(255, 255, 255, 0.05); etc.
    # T-013 states --color-bg-primary is #fff. If #fff is used for text in dark sections, maybe it should be --color-bg-primary for background. 
    # Let's just blindly replace #fff with var(--color-bg-primary) if it's not in color: #fff.
    # Wait, in dark theme --color-bg-primary is dark. If login.css has white text, it needs a variable that is always white, or --color-bg-primary if it flips.
    
    # Let's look at login.css specifics. 
    
    # Let's fallback replace remaining exact matches from T-013
    content = re.sub(r'(?i)\b#ffffff\b', r'var(--color-bg-primary)', content)
    # content = re.sub(r'(?i)\b#fff\b', r'var(--color-bg-primary)', content)  # Skipping this broadly to avoid breaking things, we'll see.
    
    return content

for filepath in files_to_process:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            original = f.read()
        
        modified = replace_colors_in_css(original)
        
        # Additional manual replacements based on T-013 specific mentions:
        modified = re.sub(r'(?i)var\(--text-color,\s*#333333\)', 'var(--color-text-primary)', modified)
        modified = re.sub(r'(?i)var\(--border-color,\s*#cccccc\)', 'var(--color-border)', modified)
        modified = re.sub(r'(?i)var\(--primary-color,\s*#0056b3\)', 'var(--color-primary)', modified)
        modified = re.sub(r'(?i)var\(--surface-color,\s*#ffffff\)', 'var(--color-bg-primary)', modified)
        
        # Replace simple #fff for background, #333 for color, #ccc for border
        modified = re.sub(r'(?i)(background(?:-color)?\s*:\s*)#fff\b', r'\1var(--color-bg-primary)', modified)
        modified = re.sub(r'(?i)(color\s*:\s*)#fff\b', r'\1var(--color-bg-primary)', modified) # wait, if color is #fff, it should probably be var(--color-bg-primary) if we assume it inverts, or var(--color-text-primary) which is #1a1a1a in light, #f3f4f6 in dark. Actually in light it should be black. If login is dark, it flips. But wait, login.css has its own dark background. If it uses #fff, it might be text.
        
        with open(filepath, 'w') as f:
            f.write(modified)
        print(f"Processed {filepath}")
    else:
        print(f"File not found: {filepath}")

