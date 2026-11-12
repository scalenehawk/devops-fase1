import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
test('fontes HTML e JS referenciam arquivos presentes', async () => {
  const html = await readFile(path.join(root, 'src/index.html'), 'utf8');
  assert.match(html, /lang="pt-BR"/);
  for (const name of ['style.css', 'app.js', 'tasks.js']) {
    assert.ok((await readFile(path.join(root, 'src', name))).length > 0);
  }
  assert.match(html, /src="app.js"/);
  assert.match(html, /href="style.css"/);
});

test('manifesto do build corresponde ao conteúdo publicado', async () => {
  const manifest = JSON.parse(await readFile(path.join(root, 'dist/manifest.json'), 'utf8'));
  for (const [name, expected] of Object.entries(manifest)) {
    const content = await readFile(path.join(root, 'dist', name));
    assert.equal(createHash('sha256').update(content).digest('hex'), expected);
  }
});
