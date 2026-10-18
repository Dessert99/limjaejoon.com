// 프로젝트 루트에서 `node --env-file=.env.local <이 파일> <workdir>`로 실행한다. 웹 에디터와 같은 API로 원격 사이트에 글을 올린다.
import { createRequire } from 'node:module';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// 스크립트가 레포 밖 경로에서 불려도 프로젝트 node_modules의 sharp·supabase를 쓴다
const require = createRequire(join(process.cwd(), 'package.json'));
const sharp = require('sharp');
const { createServerClient } = require('@supabase/ssr');

const dir = process.argv[2];
const meta = JSON.parse(readFileSync(join(dir, 'meta.json'), 'utf8'));
const count = JSON.parse(readFileSync(join(dir, 'refs.json'), 'utf8')).length;
// limjaejoon.com은 www로 308 된다. Origin이 실제 host와 달라야 할 이유가 없게 www로 보낸다
const SITE = 'https://www.limjaejoon.com';

// 사이트 프록시가 읽는 것과 같은 이름·인코딩의 세션 쿠키를 ssr 클라이언트가 만들게 한다
const jar = new Map();
const client = createServerClient(
  process.env.NEXT_PUBLIC_REMOTE_SUPABASE_URL,
  process.env.NEXT_PUBLIC_REMOTE_SUPABASE_ANON_KEY,
  {
    cookies: {
      getAll: () => [...jar].map(([name, value]) => ({ name, value })),
      setAll: (list) => list.forEach(({ name, value }) => jar.set(name, value)),
    },
  }
);
const { error: loginError } = await client.auth.signInWithPassword({
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
});
if (loginError) throw loginError;
// adminGuard가 Origin 없는 쓰기를 CSRF로 보고 거절한다
const headers = {
  Cookie: [...jar].map(([name, value]) => `${name}=${value}`).join('; '),
  Origin: SITE,
};

// 웹 에디터 shrinkImage와 같은 규칙: 폭 1600 이하, webp 0.85, 커지면 원본
const shrink = async (buf) => {
  const webp = await sharp(buf)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();
  if (webp.length < buf.length) {
    return { buf: webp, ext: 'webp' };
  }
  const { format } = await sharp(buf).metadata();
  return { buf, ext: format === 'jpeg' ? 'jpg' : format };
};

let body = readFileSync(join(dir, 'body.md'), 'utf8');
const uploaded = [];

for (let n = 1; n <= count; n++) {
  const img = await shrink(readFileSync(join(dir, 'img', String(n))));
  const type = `image/${img.ext === 'jpg' ? 'jpeg' : img.ext}`;
  const form = new FormData();
  form.append(
    'file',
    new File([img.buf], `${meta.slug}-${n}.${img.ext}`, { type })
  );
  const res = await fetch(`${SITE}/api/admin/images`, {
    method: 'POST',
    headers,
    body: form,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`upload ${n}: ${res.status} ${JSON.stringify(json)}`);
  }
  uploaded.push(json);
  // 실패하면 버킷에 남은 파일을 알 수 있게 장마다 기록한다
  writeFileSync(join(dir, 'uploaded.json'), JSON.stringify(uploaded, null, 1));
  body = body.replace(`{{IMG:${n}}}`, json.url);
  console.log(`image ${n}/${count} ${img.ext} ${img.buf.length}B`);
}

if (body.includes('{{IMG:')) throw new Error('placeholder left');

const save = await fetch(`${SITE}/api/admin/posts`, {
  method: 'POST',
  headers: { ...headers, 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...meta, content_markdown: body }),
});
const saved = await save.json();
if (!save.ok) {
  throw new Error(`save: ${save.status} ${JSON.stringify(saved)}`);
}

const path = `/${meta.kind === 'story' ? 'experience' : 'blog'}/${meta.slug}`;
const page = await fetch(`${SITE}${path}`);
const html = await page.text();
const shown = uploaded.filter(({ url }) => html.includes(url)).length;
console.log(`saved ${saved.post.id} ${SITE}${path}`);
console.log(`page ${page.status}, images on page ${shown}/${count}`);

if (page.status !== 200 || shown !== count) {
  throw new Error('page check failed, workdir kept');
}

// 확인까지 끝난 뒤에만 지운다. 실패하면 uploaded.json으로 남은 이미지를 추적해야 한다
rmSync(dir, { recursive: true, force: true });
console.log(`removed ${dir}`);
