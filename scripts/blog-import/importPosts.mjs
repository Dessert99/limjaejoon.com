import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);
const defaultContentDir = path.join(rootDir, 'content/blog');
const envFilePath = path.join(rootDir, '.env.local');

const parseArgs = (argv) => {
  return argv.reduce(
    (state, arg) => {
      if (arg === '--dry-run') {
        return { ...state, dryRun: true };
      }

      if (arg.startsWith('--target=')) {
        return { ...state, target: arg.slice('--target='.length) };
      }

      return state;
    },
    { dryRun: false, target: undefined }
  );
};

const readEnvFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');

    return Object.fromEntries(
      content
        .split(/\r?\n/)
        .map((line) => {
          return line.trim();
        })
        .filter((line) => {
          return line && !line.startsWith('#') && line.includes('=');
        })
        .map((line) => {
          const index = line.indexOf('=');
          const key = line.slice(0, index);
          const value = line.slice(index + 1).replace(/^['"]|['"]$/g, '');

          return [key, value];
        })
    );
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }

    throw error;
  }
};

const requireEnv = (env, key) => {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return env[key];
};

const resolveSupabaseImportEnv = (env, target) => {
  if (target === 'local') {
    return {
      supabaseUrl:
        env.NEXT_PUBLIC_LOCAL_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseServiceRoleKey:
        env.LOCAL_SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY,
    };
  }

  if (target === 'remote') {
    return {
      supabaseUrl:
        env.NEXT_PUBLIC_REMOTE_SUPABASE_URL ?? env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseServiceRoleKey:
        env.REMOTE_SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_ROLE_KEY,
    };
  }

  throw new Error(`Unsupported import target: ${target}`);
};

const slugFromFilePath = (filePath) => {
  return path.basename(filePath, path.extname(filePath));
};

const assertString = (value, field, slug) => {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing ${field} frontmatter for ${slug}`);
  }

  return value;
};

const assertTags = (value, slug) => {
  if (
    !Array.isArray(value) ||
    value.some((tag) => {
      return typeof tag !== 'string';
    })
  ) {
    throw new Error(`Missing tags frontmatter for ${slug}`);
  }

  const tags = value
    .map((tag) => {
      return tag.trim();
    })
    .filter(Boolean);

  if (tags.length === 0) {
    throw new Error(`Missing tags frontmatter for ${slug}`);
  }

  return tags;
};

export const buildPostRowFromSource = ({ filePath, source }) => {
  const slug = slugFromFilePath(filePath);
  const parsed = matter(source);
  const title = assertString(parsed.data.title, 'title', slug);
  const date = assertString(parsed.data.date, 'date', slug);
  const description = assertString(
    parsed.data.description,
    'description',
    slug
  );
  const tags = assertTags(parsed.data.tags, slug);

  return {
    slug,
    title,
    description,
    content_markdown: parsed.content,
    tags,
    series: null,
    status: 'published',
    published_at: `${date}T00:00:00.000Z`,
  };
};

export const loadPostRows = async (contentDir = defaultContentDir) => {
  const entries = await fs.readdir(contentDir);
  const mdxFiles = entries
    .filter((entry) => {
      return entry.endsWith('.mdx');
    })
    .sort();

  return Promise.all(
    mdxFiles.map(async (entry) => {
      const filePath = path.join(contentDir, entry);
      const source = await fs.readFile(filePath, 'utf8');

      return buildPostRowFromSource({
        filePath,
        source,
      });
    })
  );
};

export const importPosts = async ({ dryRun, target }) => {
  const rows = await loadPostRows();

  if (dryRun) {
    console.log(`Dry run: ${rows.length} posts ready for ${target} import.`);
    return rows;
  }

  const fileEnv = await readEnvFile(envFilePath);
  const env = { ...fileEnv, ...process.env };
  const resolved = resolveSupabaseImportEnv(env, target);
  const supabaseUrl = resolved.supabaseUrl ?? '';
  const supabaseServiceRoleKey = resolved.supabaseServiceRoleKey ?? '';
  const supabase = createClient(
    requireEnv({ SUPABASE_URL: supabaseUrl }, 'SUPABASE_URL'),
    requireEnv(
      { SUPABASE_SERVICE_ROLE_KEY: supabaseServiceRoleKey },
      'SUPABASE_SERVICE_ROLE_KEY'
    )
  );
  const { data, error } = await supabase
    .from('posts')
    .upsert(rows, { onConflict: 'slug' })
    .select('slug');

  if (error) {
    throw error;
  }

  console.log(`Imported ${data?.length ?? rows.length} posts to ${target}.`);

  return data;
};

const main = async () => {
  const args = parseArgs(process.argv.slice(2));
  const target =
    args.target ?? process.env.NEXT_PUBLIC_SUPABASE_TARGET ?? 'local';

  await importPosts({ dryRun: args.dryRun, target });
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
