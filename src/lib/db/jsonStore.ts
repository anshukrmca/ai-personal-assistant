import fs from "fs";
import path from "path";

/**
 * Minimal file-backed JSON datastore.
 *
 * This stands in for InsForge / Postgres during local development so the
 * app runs anywhere with zero native dependencies and zero setup. Every
 * repository in src/lib/db talks to this through a small, swappable API —
 * replacing it with a real database later means rewriting this file only.
 */

const DATA_DIR = path.join(process.cwd(), "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePathFor(collection: string) {
  return path.join(DATA_DIR, `${collection}.json`);
}

export function readCollection<T>(collection: string): T[] {
  ensureDataDir();
  const file = filePathFor(collection);
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(file, "utf-8");
  if (!raw.trim()) return [];
  try {
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

export function writeCollection<T>(collection: string, items: T[]): void {
  ensureDataDir();
  const file = filePathFor(collection);
  fs.writeFileSync(file, JSON.stringify(items, null, 2), "utf-8");
}

export function insertOne<T>(
  collection: string,
  item: T
): T {
  const items = readCollection<T>(collection);
  items.push(item);
  writeCollection(collection, items);
  return item;
}

export function updateWhere<T>(
  collection: string,
  predicate: (item: T) => boolean,
  updater: (item: T) => T
): T[] {
  const items = readCollection<T>(collection);
  const updated = items.map((item) => (predicate(item) ? updater(item) : item));
  writeCollection(collection, updated);
  return updated;
}

export function deleteWhere<T>(
  collection: string,
  predicate: (item: T) => boolean
): void {
  const items = readCollection<T>(collection);
  writeCollection(collection, items.filter((item) => !predicate(item)));
}

export function findOne<T>(
  collection: string,
  predicate: (item: T) => boolean
): T | undefined {
  return readCollection<T>(collection).find(predicate);
}

export function findMany<T>(
  collection: string,
  predicate: (item: T) => boolean
): T[] {
  return readCollection<T>(collection).filter(predicate);
}
