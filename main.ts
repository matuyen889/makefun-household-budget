import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

mkdirSync(outputDir, { recursive: true });

// Copy app static assets to target output
const appSrc = join(rootDir, 'app');
const appDest = join(outputDir, 'app');
cpSync(appSrc, appDest, { recursive: true });

// Copy real captured screenshots to target output
const shotsSrc = join(rootDir, 'screenshots');
const shotsDest = join(outputDir, 'screenshots');
mkdirSync(shotsDest, { recursive: true });
if (existsSync(shotsSrc)) {
  cpSync(shotsSrc, shotsDest, { recursive: true });
}

// Build dossier compliant with makefun gate specifications
const dossierJson = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216
});

writeFileSync(join(outputDir, 'dossier.json'), dossierJson);
console.log('Successfully generated dossier.json in', outputDir);
