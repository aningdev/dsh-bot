import { createHash } from 'node:crypto';
import { entryListSchema } from '@deepseek-ai/cordis-plugin-include';
import { isJsExpr as cordisIsJsExpr } from '@deepseek-ai/cordis-plugin-loader';
import { load } from 'js-yaml';
/** Top-level preset child rows that must stay on for a usable Agent. */
export const LOCKED_ENTRY_IDS = new Set([
    'persona',
    'agent-instructions',
    'time-context',
    'compaction',
    'planning',
    'delegation',
    'skill-filesystem',
    'tool-skill',
    'command-goal',
    'tool-goal',
    'command-compact',
    'compaction-basic',
    'tool-result-pruner',
    'plan-mode',
]);
/** Stable derived preset id for one base + disabled set. */
export function compositionId(basePreset, disabledEntryIds) {
    const normalized = [...new Set(disabledEntryIds.map(item => item.trim()).filter(Boolean))].sort();
    if (!normalized.length)
        return basePreset;
    const digest = createHash('sha256')
        .update(JSON.stringify({ basePreset, disabled: normalized }))
        .digest('hex')
        .slice(0, 16);
    return `dshbot_${digest}`;
}
export function isDerivedPreset(id) {
    return id.startsWith('dshbot_');
}
function isJsExpr(value) {
    if (cordisIsJsExpr(value))
        return true;
    return !!value && typeof value === 'object' && !Array.isArray(value)
        && ('$js' in value || 'js' in value || 'expr' in value);
}
/** Parse agentPresets.read YAML into top-level plugin rows (Loader !!js dialect). */
export function parsePluginRows(content) {
    const parsed = load(content, { schema: entryListSchema });
    if (!Array.isArray(parsed))
        throw new Error('模板组成必须是插件行列表');
    return parsed;
}
/** Rows the product UI may toggle before Session initialization. */
export function listToggleable(rows, disabledEntryIds = []) {
    const disabled = new Set(disabledEntryIds);
    const result = [];
    for (const row of rows) {
        if (typeof row.id !== 'string' || !row.id.trim())
            continue;
        if (typeof row.name !== 'string' || !row.name)
            continue;
        if (LOCKED_ENTRY_IDS.has(row.id))
            continue;
        if (isJsExpr(row.disabled))
            continue;
        if (row.group === true)
            continue;
        const packageName = row.name.includes('/') ? row.name.slice(row.name.lastIndexOf('/') + 1) : row.name;
        result.push({
            id: row.id,
            name: row.name,
            label: packageName.replace(/^dsh-/, ''),
            enabled: !disabled.has(row.id) && row.disabled !== true,
        });
    }
    return result;
}
/** Drop or disable selected top-level rows; nested groups stay intact. */
export function applyDisabled(rows, disabledEntryIds) {
    const disabled = new Set(disabledEntryIds);
    for (const id of disabled) {
        if (LOCKED_ENTRY_IDS.has(id))
            throw new Error(`不能关闭核心插件「${id}」`);
    }
    return rows
        .filter(row => !(typeof row.id === 'string' && disabled.has(row.id)))
        .map(row => ({ ...row }));
}
export function buildDefinition(basePreset, rows, disabledEntryIds, name) {
    const normalized = [...new Set(disabledEntryIds.map(item => item.trim()).filter(Boolean))].sort();
    const id = compositionId(basePreset, normalized);
    const plugins = applyDisabled(rows, normalized);
    const label = name?.trim() || `${basePreset}（自定义）`;
    const record = {
        id,
        basePreset,
        disabledEntryIds: normalized,
        name: label,
        createdAt: new Date().toISOString(),
    };
    return {
        id,
        definition: {
            id,
            name: label,
            description: `Derived from ${basePreset}; disabled: ${normalized.join(', ') || '(none)'}`,
            plugins,
        },
        record,
    };
}
