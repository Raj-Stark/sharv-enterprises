import fs from 'node:fs';
import path from 'node:path';

export type StoredMedia = {
  id?: number;
  name?: string;
  provider?: string | null;
  url?: string | null;
};

function getPublicDirectory(): string {
  return path.resolve(
    process.cwd(),
    process.env.PUBLIC_DIR || './public',
  );
}

function isNonEmptyFile(filePath: string): boolean {
  try {
    const stat = fs.statSync(filePath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
}

/**
 * Resolves only files served by Strapi's local `/uploads` provider. Remote
 * provider URLs intentionally return null because their durability belongs to
 * the configured object-storage provider rather than the container filesystem.
 */
export function resolveLocalUploadPath(media: StoredMedia | null | undefined): string | null {
  if (!media?.url || (media.provider && media.provider !== 'local')) {
    return null;
  }

  let pathname: string;

  try {
    pathname = media.url.startsWith('http://') || media.url.startsWith('https://')
      ? new URL(media.url).pathname
      : media.url;
  } catch {
    return null;
  }

  if (!pathname.startsWith('/uploads/')) {
    return null;
  }

  const publicDirectory = getPublicDirectory();
  const uploadsDirectory = path.resolve(publicDirectory, 'uploads');
  const targetPath = path.resolve(
    publicDirectory,
    pathname.replace(/^\/+/, ''),
  );
  const isInsideUploads =
    targetPath === uploadsDirectory ||
    targetPath.startsWith(`${uploadsDirectory}${path.sep}`);

  return isInsideUploads ? targetPath : null;
}

export function isStoredMediaAvailable(media: StoredMedia | null | undefined): boolean {
  if (!media?.url) {
    return false;
  }

  const localPath = resolveLocalUploadPath(media);

  if (!localPath) {
    return media.provider !== 'local' && /^https?:\/\//.test(media.url);
  }

  return isNonEmptyFile(localPath);
}

/**
 * Restores a missing local-provider file while preserving the existing Strapi
 * upload record and URL. Returns true when the destination is healthy after
 * the operation. Remote-provider media is considered outside this repairer's
 * scope and is left untouched.
 */
export function restoreLocalMediaFromAsset(
  media: StoredMedia,
  sourcePath: string,
): boolean {
  const targetPath = resolveLocalUploadPath(media);

  if (!targetPath) {
    return isStoredMediaAvailable(media);
  }

  if (isNonEmptyFile(targetPath)) {
    return true;
  }

  if (!isNonEmptyFile(sourcePath)) {
    return false;
  }

  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.copyFileSync(sourcePath, targetPath);
  } catch {
    return false;
  }

  return isNonEmptyFile(targetPath);
}
