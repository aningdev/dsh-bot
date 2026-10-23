# 第三方兼容补丁

根 package.json 的 patchedDependencies 与 bun.lock 管理补丁，安装时由 Bun 自动应用，不手动改写 node_modules。

## Electron Forge 8.0.1

core-utils 的 Electron 查找只识别 package-lock.json、yarn.lock 与 pnpm-lock.yaml。Bun hoisted 工作区将 Electron 安装在根 node_modules，应用目录查找不到它时，需要通过根锁文件定位依赖。

当前补丁仅向该查找列表加入 bun.lock 和 bun.lockb，不改变 Electron 版本选择或打包流程。打包 E2E 可验证应用子目录能够发现根 Electron；上游支持 Bun 锁文件后，升级并验证成品启动，再移除此补丁。
