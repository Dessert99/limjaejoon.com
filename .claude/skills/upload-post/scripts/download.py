"""urls.txt에 적힌 노션 서명 주소로 이미지 원본을 workdir/img/<n>에 받는다."""
import os
import sys
import urllib.request

workdir = sys.argv[1]
base = query = None
os.makedirs(f'{workdir}/img', exist_ok=True)
failed = []

for line in open(f'{workdir}/urls.txt', encoding='utf-8'):
    fields = line.split()
    if not fields:
        continue
    if fields[0] == 'base':
        base = fields[1]
        continue
    if fields[0] == 'query':
        query = fields[1]
        continue
    n, target = fields[0], fields[1]
    # 한 번에 받은 주소들은 서명만 다르므로 "n 경로 서명"으로 줄여 적을 수 있다. S3는 파라미터 순서를 안 본다
    url = target if target.startswith('http') else f'{base}/{target}?{query}&X-Amz-Signature={fields[2]}'
    try:
        with urllib.request.urlopen(url, timeout=30) as res:
            open(f'{workdir}/img/{n}', 'wb').write(res.read())
    except Exception as error:
        failed.append(f'{n}: {error}')

print(f'downloaded: {len(os.listdir(f"{workdir}/img"))}')
for fail in failed:
    print('FAIL', fail)
sys.exit(1 if failed else 0)
