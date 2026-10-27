"""노션 fetch 마크다운을 블로그 본문 형식으로 바꾸고, 이미지 자리는 {{IMG:n}}로 비워 둔다."""
import json
import re
import sys

workdir = sys.argv[1]
lines = open(f'{workdir}/raw.md', encoding='utf-8').read().split('\n')
out, refs, warns = [], [], []
code_pad = None
code_lines = []


def blank():
    if out and out[-1].strip() != '':
        out.append('')


for no, raw in enumerate(lines, 1):
    # 노션은 들여쓰기를 탭으로 준다. 블로그 글은 4칸이라 탭 하나를 4칸으로 편다
    tabs = len(raw) - len(raw.lstrip('\t'))
    line = '    ' * tabs + raw[tabs:]
    stripped = line.strip()
    pad = line[: len(line) - len(line.lstrip(' '))]

    if code_pad is not None:
        if stripped == '```':
            # 노션은 안쪽 줄을 0열로 주기도, 펜스 깊이로 들여 주기도 한다. 이미 들여 준 블록은 두 번 밀지 않는다
            indented = all(l.startswith(code_pad) for l in code_lines if l.strip())
            out.extend(l if indented and l else code_pad + l for l in code_lines)
            out.append(code_pad + '```')
            out.append(code_pad)
            code_pad = None
        else:
            code_lines.append(line)
        continue

    # 노션은 인라인 코드를 <code>로 준다. 안쪽 <Suspense> 같은 글자가 HTML 태그로 읽히지 않게 백틱으로 바꾼다
    line = re.sub(r'<code>(.*?)</code>', r'`\1`', line)
    stripped = line.strip()

    if stripped in ('<empty-block/>', '<p />'):
        continue
    if stripped.startswith('```'):
        if pad:
            out.append(pad)
        else:
            blank()
        # 노션은 tsx를 TypeScript로 저장해 ts로 돌려준다. 블로그 하이라이터는 tsx만 알아서 ts면 색이 빠진다
        out.append(pad + re.sub(r'^```(ts|typescript)$', '```tsx', stripped))
        code_pad = pad
        code_lines = []
        continue

    image = re.fullmatch(r'!\[[^\]]*\]\((notion-file-block://[^)]+)\)|<image source="(notion-file-block://[^"]+)" />', stripped)
    if image:
        refs.append(image.group(1) or image.group(2))
        blank()
        out.append(f'{pad}<img src="{{{{IMG:{len(refs)}}}}}" alt="" />')
        out.append('')
        continue
    if stripped.startswith('!['):
        warns.append(f'{no}: 노션 파일이 아닌 이미지 {stripped[:80]}')
    if re.match(r'#{1,6} ', line):
        blank()
        out.append(line)
        out.append('')
        continue
    link = r'\[https?://[^\]]+\]\([^)]+\)|https?://\S+'
    # 노션은 이어진 링크 줄을 <br />로 한 줄에 붙여 주기도 한다. 블로그는 한 줄씩 문단이다
    if not pad and all(re.fullmatch(link, part) for part in stripped.split('<br />')):
        for part in stripped.split('<br />'):
            blank()
            out.append(part)
            out.append('')
        continue
    if stripped.startswith('<'):
        warns.append(f'{no}: 변환 규칙이 없는 노션 블록 {stripped[:80]}')
    out.append(line)

if code_pad is not None:
    warns.append('닫히지 않은 코드 블록')

open(f'{workdir}/body.md', 'w', encoding='utf-8').write('\n'.join(out).strip('\n') + '\n')
json.dump(refs, open(f'{workdir}/refs.json', 'w'), indent=1)
print(f'images: {len(refs)}')
for warn in warns:
    print('WARN', warn)
sys.exit(2 if warns else 0)
