import os
from collections import defaultdict

suspicious = []
for root, dirs, files in os.walk('src/app'):
    for f in files:
        if '.component.' in f or '.service.' in f or f.endswith('-routing.module.ts'):
            suspicious.append(os.path.join(root, f))
        elif f.endswith('.ts'):
            base = f[:-3]
            if base + '.service.ts' in files or base + '.component.ts' in files:
                suspicious.append(os.path.join(root, f))

with open('scratch/suspicious.txt', 'w') as out:
    for s in suspicious:
        out.write(s + '\n')
