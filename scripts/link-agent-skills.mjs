import { readdir, mkdir, symlink, lstat, stat, readlink } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const utilsRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const appRoot = dirname(utilsRoot);
const sharedSkillsDir = join(utilsRoot, '.agents/skills');
const targetDir = join(appRoot, '.agents/skills');

async function isSubmodule(repoRoot) {
  try {
    return (await stat(join(repoRoot, '.git'))).isFile();
  } catch {
    return false;
  }
}

async function linkSkill(name) {
  const src = resolve(sharedSkillsDir, name);
  const dest = resolve(targetDir, name);
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';

  try {
    await symlink(src, dest, linkType);
    console.log(`Linked agent skill: ${name}`);
    return;
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }

  const destStat = await lstat(dest);
  if (!destStat.isSymbolicLink()) {
    return;
  }

  const existingTarget = resolve(dirname(dest), await readlink(dest));
  if (existingTarget.toLowerCase() !== src.toLowerCase()) {
    console.warn(`Skipped agent skill "${name}": link already exists (${existingTarget})`);
  }
}

async function main() {
  if (!(await isSubmodule(utilsRoot))) {
    return;
  }

  let sharedSkills;
  try {
    sharedSkills = await readdir(sharedSkillsDir);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }
    throw error;
  }

  await mkdir(targetDir, { recursive: true });

  for (const name of sharedSkills) {
    const skillPath = join(sharedSkillsDir, name);
    if ((await lstat(skillPath)).isDirectory()) {
      await linkSkill(name);
    }
  }
}

main().catch((error) => {
  console.error('Failed to link agent skills:', error);
  process.exit(1);
});
