import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'src');
const target = path.join(root, 'dist');
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const files = (await readdir(source)).sort();
const manifest = {};
for (const name of files) {
  const content = await readFile(path.join(source, name));
  await cp(path.join(source, name), path.join(target, name));
  manifest[name] = createHash('sha256').update(content).digest('hex');
}
await writeFile(path.join(target, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`Build concluído: ${files.length} arquivos em dist/`);
