var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
/** Host Cordis service: derive per-Bot agent presets from a base template. */
import { Service } from '@deepseek-ai/cordis';
import { Remote, RemoteError, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import { buildDefinition, compositionId, isDerivedPreset, listToggleable, parsePluginRows, } from './composition.js';
import { compositionsPath, loadCompositions, removeComposition, upsertComposition } from './store.js';
let BotCompositionService = (() => {
    let _classSuper = TypertRemoteService;
    let _instanceExtraInitializers = [];
    let _preview_decorators;
    let _compose_decorators;
    let _ensure_decorators;
    let _release_decorators;
    return class BotCompositionService extends _classSuper {
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _preview_decorators = [Remote('preview')];
            _compose_decorators = [Remote('compose')];
            _ensure_decorators = [Remote('ensure')];
            _release_decorators = [Remote('release')];
            __esDecorate(this, null, _preview_decorators, { kind: "method", name: "preview", static: false, private: false, access: { has: obj => "preview" in obj, get: obj => obj.preview }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _compose_decorators, { kind: "method", name: "compose", static: false, private: false, access: { has: obj => "compose" in obj, get: obj => obj.compose }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _ensure_decorators, { kind: "method", name: "ensure", static: false, private: false, access: { has: obj => "ensure" in obj, get: obj => obj.ensure }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(this, null, _release_decorators, { kind: "method", name: "release", static: false, private: false, access: { has: obj => "release" in obj, get: obj => obj.release }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(this, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static { this.inject = ['agentPresets']; }
        constructor(ctx) {
            super(ctx, 'botComposition');
            this.disposers = (__runInitializers(this, _instanceExtraInitializers), new Map());
            const home = process.env.DSH_HOME;
            if (!home)
                throw new Error('DSH_HOME is required for bot composition storage');
            this.path = compositionsPath(home);
            ctx.on('dispose', () => {
                void Promise.all([...this.disposers.values()].map(dispose => dispose().catch(() => undefined)));
            });
        }
        async [Service.init]() {
            const records = await loadCompositions(this.path);
            for (const record of records) {
                try {
                    await this.mount(record);
                }
                catch (error) {
                    this.ctx.logger.warn(`bot composition ${record.id}: ${error.message}`);
                }
            }
        }
        presets() {
            return this.ctx.agentPresets;
        }
        async mount(record) {
            if (this.disposers.has(record.id))
                return;
            const document = await this.presets().readDocument(record.basePreset);
            const rows = parsePluginRows(document.content);
            const built = buildDefinition(record.basePreset, rows, record.disabledEntryIds, record.name);
            const dispose = await this.presets().register(built.definition);
            this.disposers.set(record.id, dispose);
        }
        async preview(basePreset) {
            const id = basePreset.trim();
            if (!id)
                throw new RemoteError('bot-composition/invalid', 'basePreset is required', { reason: 'empty-base' });
            try {
                const document = await this.presets().readDocument(id);
                return { basePreset: id, plugins: listToggleable(parsePluginRows(document.content)) };
            }
            catch (error) {
                const reason = error instanceof Error ? error.message : String(error);
                throw new RemoteError('bot-composition/base-unavailable', reason, { basePreset: id, reason }, { cause: error });
            }
        }
        async compose(request) {
            const basePreset = request.basePreset?.trim();
            if (!basePreset)
                throw new RemoteError('bot-composition/invalid', 'basePreset is required', { reason: 'empty-base' });
            const disabledEntryIds = request.disabledEntryIds ?? [];
            const id = compositionId(basePreset, disabledEntryIds);
            if (!isDerivedPreset(id)) {
                return { agentPreset: basePreset, basePreset, disabledEntryIds: [] };
            }
            try {
                const document = await this.presets().readDocument(basePreset);
                const built = buildDefinition(basePreset, parsePluginRows(document.content), disabledEntryIds, request.name);
                await upsertComposition(this.path, built.record);
                const previous = this.disposers.get(built.id);
                if (previous) {
                    await previous().catch(() => undefined);
                    this.disposers.delete(built.id);
                }
                await this.mount(built.record);
                return { agentPreset: built.id, basePreset, disabledEntryIds: built.record.disabledEntryIds };
            }
            catch (error) {
                if (error instanceof RemoteError)
                    throw error;
                const reason = error instanceof Error ? error.message : String(error);
                throw new RemoteError('bot-composition/base-unavailable', reason, { basePreset, reason }, { cause: error });
            }
        }
        async ensure(agentPreset) {
            const id = agentPreset.trim();
            if (!id)
                throw new RemoteError('bot-composition/invalid', 'agentPreset is required', { reason: 'empty-id' });
            if (!isDerivedPreset(id))
                return { agentPreset: id, basePreset: id, disabledEntryIds: [] };
            const records = await loadCompositions(this.path);
            const record = records.find(item => item.id === id);
            if (!record)
                throw new RemoteError('bot-composition/not-found', `Unknown composition ${id}`, { id });
            await this.mount(record);
            return { agentPreset: record.id, basePreset: record.basePreset, disabledEntryIds: record.disabledEntryIds };
        }
        async release(agentPreset) {
            const id = agentPreset.trim();
            if (!isDerivedPreset(id))
                return { agentPreset: id };
            const dispose = this.disposers.get(id);
            if (dispose) {
                await dispose().catch(() => undefined);
                this.disposers.delete(id);
            }
            await removeComposition(this.path, id);
            return { agentPreset: id };
        }
    };
})();
export default BotCompositionService;
