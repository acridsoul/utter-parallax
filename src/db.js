// src/db.js
import fs from 'fs/promises';
import path from 'path';

const noticesPath = path.join(process.cwd(), 'src', 'data', 'notices.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(path.dirname(noticesPath), { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function readNotices() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(noticesPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeNotices(notices) {
  await ensureDataDir();
  await fs.writeFile(noticesPath, JSON.stringify(notices, null, 2));
}

export default {
  async getNotices() {
    return await readNotices();
  },
  async addNotice(notice) {
    const notices = await readNotices();
    notices.push(notice);
    await writeNotices(notices);
    return notice;
  }
};
