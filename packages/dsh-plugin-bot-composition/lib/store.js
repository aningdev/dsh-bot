import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
export function compositionsPath(dshHome) {
    return join(dshHome, 'bot-composition', 'compositions.json');
}
export async function loadCompositions(path) {
    try {
        const text = await readFile(path, 'utf8');
        const parsed = JSON.parse(text);
        return Array.isArray(parsed.compositions) ? parsed.compositions : [];
    }
    catch (error) {
        if (error.code === 'ENOENT')
            return [];
        throw error;
    }
}
export async function saveCompositions(path, compositions) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, `${JSON.stringify({ compositions }, null, 2)}\n`);
}
export async function upsertComposition(path, record) {
    const current = await loadCompositions(path);
    const next = [...current.filter(item => item.id !== record.id), record];
    await saveCompositions(path, next);
    return next;
}
export async function removeComposition(path, id) {
    const current = await loadCompositions(path);
    const next = current.filter(item => item.id !== id);
    await saveCompositions(path, next);
    return next;
}
