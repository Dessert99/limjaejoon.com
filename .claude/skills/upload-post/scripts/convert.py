"""노션 fetch 마크다운을 블로그 본문 형식으로 바꾸고, 이미지 자리는 {{IMG:n}}로 비워 둔다."""
import json
import re
import sys

workdir = sys.argv[1]
lines = open(f'{workdir}/raw.md', encoding='utf-8').read().split('\n')
out, refs, warns = [], [], []
code_pad = None


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
            out.append(code_pad + '```')
            out.append(code_pad)
            code_pad = None
        else:
            # 노션은 펜스만 들여쓰고 안쪽 줄은 0열로 준다. 펜스 깊이만큼 밀어야 목록 안에 남는다
            out.append(code_pad + line if line else code_pad)
        continue

    if stripped == '<empty-block/>':
        continue
    if stripped.startswith('```'):
        if pad:
            out.append(pad)
        else:
            blank()
        out.append(pad + stripped)
        code_pad = pad
        continue

    image = re.fullmatch(r'!\[[^\]]*\]\((notion-file-block://[^)]+)\)', stripped)
    if image:
        refs.append(image.group(1))
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
    if not pad and re.fullmatch(r'\[https?://[^\]]+\]\([^)]+\)|https?://\S+', stripped):
        blank()
        out.append(line)
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
