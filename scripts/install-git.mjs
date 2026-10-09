import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';

async function main() {
  const targetDir = 'C:\\Users\\dell\\AppData\\Local\\Programs\\Git';
  const zipPath = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'mingit.zip');

  console.log('Ensuring destination directory:', targetDir);
  fs.mkdirSync(targetDir, { recursive: true });

  const url = 'https://github.com/git-for-windows/git/releases/download/v2.44.0.windows.1/MinGit-2.44.0-64-bit.zip';
  console.log('Downloading MinGit from', url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download: ${res.status} ${res.statusText}`);
  }

  const fileStream = fs.createWriteStream(zipPath);
  await pipeline(Readable.fromWeb(res.body), fileStream);
  console.log('Downloaded MinGit zip successfully. Size:', fs.statSync(zipPath).size);

  console.log('Extracting MinGit to', targetDir);
  execSync(`tar.exe -xf "${zipPath}" -C "${targetDir}"`, { stdio: 'inherit' });

  // Clean up zip
  try { fs.unlinkSync(zipPath); } catch {}

  const gitExe = path.join(targetDir, 'cmd', 'git.exe');
  console.log('Checking git executable:', fs.existsSync(gitExe));

  if (fs.existsSync(gitExe)) {
    console.log('Testing git version:');
    execSync(`"${gitExe}" --version`, { stdio: 'inherit' });

    // Add to User PATH permanently via PowerShell
    const cmdDir = path.join(targetDir, 'cmd');
    execSync(
      `powershell -Command "$userPath = [System.Environment]::GetEnvironmentVariable('Path', 'User'); if ($userPath -notlike '*${cmdDir.replace(/\\/g, '\\\\')}*') { [System.Environment]::SetEnvironmentVariable('Path', $userPath + ';${cmdDir}', 'User'); Write-Host 'Added to User PATH' }"`,
      { stdio: 'inherit' }
    );
  }
}

main().catch((err) => {
  console.error('Error installing MinGit:', err);
  process.exit(1);
});
