import os
import re

files_to_process = [
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/auth/pages/login/login.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/holidays/pages/holiday-form/holiday-form.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/payroll/pages/payroll-detail/payroll-detail.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/company/pages/company-detail/company-detail.css",
    "/home/fayzillo/Desktop/zdes-frontend/src/app/features/attendance/pages/scanner/scanner.css",
]

def replace_more(content):
    # Text colors
    content = re.sub(r'(?i)#111827\b', 'var(--color-text-primary)', content)
    content = re.sub(r'(?i)#374151\b', 'var(--color-text-secondary)', content)
    content = re.sub(r'(?i)#666666\b', 'var(--color-text-secondary)', content)
    
    # Border / background light grays
    content = re.sub(r'(?i)#e5e7eb\b', 'var(--color-border)', content)
    content = re.sub(r'(?i)#cccccc\b', 'var(--color-border)', content)
    content = re.sub(r'(?i)#f5f5f5\b', 'var(--color-bg-secondary)', content)
    
    # company-detail / payroll specifics
    content = re.sub(r'(?i)#d4edda\b', 'var(--color-success)', content)
    content = re.sub(r'(?i)#155724\b', 'var(--color-text-primary)', content)
    content = re.sub(r'(?i)#f8d7da\b', 'var(--color-danger)', content)
    content = re.sub(r'(?i)#721c24\b', 'var(--color-text-primary)', content)
    content = re.sub(r'(?i)#fff3cd\b', 'var(--color-bg-secondary)', content)
    content = re.sub(r'(?i)#856404\b', 'var(--color-text-primary)', content)
    content = re.sub(r'(?i)#e2e3e5\b', 'var(--color-border)', content)
    content = re.sub(r'(?i)#383d41\b', 'var(--color-text-secondary)', content)
    
    # Shadows and rgba
    content = re.sub(r'(?i)rgba\(\s*0\s*,\s*86\s*,\s*179\s*,\s*[0-9.]+\s*\)', 'var(--shadow-color)', content)
    content = re.sub(r'(?i)rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*[0-9.]+\s*\)', 'var(--shadow-color)', content)
    
    # login.css specifics
    content = re.sub(r'(?i)#6366f1\b', 'var(--color-primary)', content)
    content = re.sub(r'(?i)#8b5cf6\b', 'var(--color-primary-hover)', content)
    content = re.sub(r'(?i)#0f0c29\b|#302b63\b|#24243e\b', 'var(--color-bg-primary)', content)
    
    content = re.sub(r'(?i)rgba\(\s*99\s*,\s*102\s*,\s*241\s*,\s*[0-9.]+\s*\)', 'var(--color-primary)', content)
    content = re.sub(r'(?i)rgba\(\s*139\s*,\s*92\s*,\s*246\s*,\s*[0-9.]+\s*\)', 'var(--color-primary-hover)', content)
    content = re.sub(r'(?i)rgba\(\s*239\s*,\s*68\s*,\s*68\s*,\s*[0-9.]+\s*\)', 'var(--color-danger)', content)
    content = re.sub(r'(?i)rgba\(\s*255\s*,\s*255\s*,\s*255\s*,\s*[0-9.]+\s*\)', 'var(--color-bg-primary)', content)
    
    return content

for filepath in files_to_process:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            original = f.read()
        modified = replace_more(original)
        with open(filepath, 'w') as f:
            f.write(modified)

