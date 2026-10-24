# 第三方兼容补丁

根 package.json 的 patchedDependencies 与 bun.lock 管理补丁，安装时由 Bun 自动应用，不手动改写 node_modules。补丁的 diff 上下文保留上游原始空白，`.gitattributes` 仅对 `patches/*.patch` 关闭 Git 空白样式检查；应用正确性由冻结安装和相应行为测试验证。

## Typert generator 0.2.1-rc.2

发布版生成器只将工作区注册的 protocol 包或 ambient module 中的符号识别为 Remote 元数据。产品通过 npm 导入同版 protocol 时，原生成器报告 Bot 没有 Remote 方法，无法生成严格的 Host/Client 产物。

当前补丁只在现有符号识别处补充检查：声明所属的已安装 npm 包必须为 `@deepseek-ai/dsh-typert-protocol`。不按装饰器名称猜测来源，不修改生成格式，也不复制生成器。Runner 契约测试经生成客户端发起真实调用，并确认错误 wire 参数返回 `gateway/input-invalid`，验证严格描述已生效。

上游版本支持独立 npm protocol 后，移除此补丁，重建 Bot 并通过 profile、Remote、输入拒绝和进程重启测试。

## Electron Forge 8.0.1

core-utils 的 Electron 查找只识别 package-lock.json、yarn.lock 与 pnpm-lock.yaml。Bun hoisted 工作区将 Electron 安装在根 node_modules，应用目录查找不到它时，需要通过根锁文件定位依赖。

当前补丁仅向该查找列表加入 bun.lock 和 bun.lockb，不改变 Electron 版本选择或打包流程。打包 E2E 可验证应用子目录能够发现根 Electron；上游支持 Bun 锁文件后，升级并验证成品启动，再移除此补丁。
