# NSH 客户端约束

本文件补充[根约束](../../AGENTS.md)。职责与协议设计以[架构文档](../../docs/ARCHITECTURE.md)的「通信与配置 UI」「复用与移除边界」为准；本文件只记录客户端实现时容易误判的框架限制。

## 前端职责

- `frontend/ui` 负责页面、交互与模型绑定，`frontend/application` 持有产品状态及业务流程，`frontend/infrastructure` 提供官方协议、原生与标准系统 API 适配；依赖沿界面到应用到基础设施，基础设施保持独立。根 `App.tsx` 只挂载，连接、模型与导航在 `frontend/main.tsx` 装配。
- 主页面限定工作台与设置，使用 NSH 导航栈；其他操作使用所属页面的原生 Dialog。页面切换保留工作台状态，关闭弹窗保留未决审批；组件卸载只释放其拥有的资源。

## TSX 与运行时

- NSH TSX 使用细粒度响应式，组件函数通常只在创建时执行；动态值在 JSX 绑定、getter 或派生计算中读取 signal / props。需要持续更新的值保留响应式读取，避免在组件初始化时求值或解构成固定快照；使用 NSH 自己的 API，不套用 React 重渲染与 hooks 规则，也不因语义相近引入 `solid-js`。
- 订阅、定时器、网络连接和原生句柄在所属组件或 effect 的 `cleanup` 中释放。异步清理要有等待与错误处理归属；组件卸载不等于后台任务停止，也不依赖 GC 及时回收外部资源。
- 应用运行于 NSH 的 QuickJS 环境，构建与部分单测运行于 Bun。生产代码只使用实际 NSH 版本提供的模块与方法；Node 风格名称不代表完整 Node API。文件操作用 `fs/promises` 等受支持标准 API，不为同步 Node API 的缺失新增 Rust 文件接口。
- 框架接口优先核对实际 CLI 生成的 `.nsh/types/` 与官方文档，参考源码仅用于定位证据；参考提交或最新上游文档可能与安装版不同，以安装版类型和运行实测核对适用性。

## 原生接口与权限

- 本地文件、工作区、普通进程操作与服务登记策略留在 TypeScript。Rust 只适配 Cookie WebSocket、Unix socket / 状态订阅、`SMAppService` 系统调用等已核实缺口；返回系统事实，产品分支由 TypeScript 解释。服务操作与 `frontend/application/backend/`、`frontend/infrastructure/host/legacy/` 中的临时兼容遵守[宿主约束](../host/AGENTS.md)。
- 新增文件、网络、进程或环境访问时同步核对产品 `nsh.json` 的 capabilities，限定操作、路径、主机与变量；测试专属权限放测试 manifest，不为测试方便扩大产品权限。
- `src/lib.rs` 保持原生注册入口，导出最小 Interface；修改 Rust 导出后运行工作区检查以重新生成声明，并核对 TypeScript 调用。`.nsh/` 是 CLI 生成内容，`sdk.js` / `presets.js` 由根准备脚本生成，修改其源文件或生成入口，不手工修补产物。
- 外部 JSON / IPC 在接收或解码边界校验；原生句柄明确关闭与取消归属。原生 transport 不独立重放写请求，客户端宿主适配不复制宿主生命周期策略。

## 状态与验证

- `BackendConnection` 管理宿主发现、generation、更换连接与退役清理；`Connection` 保留官方认证、remote 与 Session 协议。界面通过协调器使用连接，不另起 generation / 重连状态机；切换 Bot 的异步结果同样检查所属对象仍有效。
- 修改已有 Bot 通过注册表的最新记录更新入口完成字段变更；整记录保存用于新建或明确的整体写入，不能拿 UI 旧快照覆盖并发草稿、改名、归档或 Session 更新。持久化失败保留用户可恢复内容并显示错误。当前串行队列只覆盖同一 JS 上下文；多窗口、多 VM 或多进程写入须另行设计单写者或跨上下文协调，原子替换不能防止丢失更新。
- Bun 单测验证纯逻辑与依赖注入，不能证明 NSH 的模块支持、权限、原生绑定或真实界面行为。触及这些能力时补跑相应 NSH 集成或端到端入口；原生导出修改还须完成声明生成与实际绑定验证。
- `nsh/test` 测试文件 VM 与被测 App 的运行上下文不同，不假定它具有桌面文件 API、环境或相同 manifest。需验证文件访问时使用声明权限的隔离 NSH 夹具执行生产 API，测试状态通过本次运行的参数或进程上下文传入。
