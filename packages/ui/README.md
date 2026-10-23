# @dsh-bot/ui

内部 React DOM 基础 UI 包，供桌面与后续 Web 界面使用。保留 base-nova / neutral 的 shadcn 组件、Geist 字体和明暗设计 Token。Message、Trace 等组件只提供通用展示，不包含 Bot 数据与操作。

```tsx
import { Button } from '@dsh-bot/ui/components/ui/button'
```

应用 CSS 导入 `@dsh-bot/ui/globals.css`。共享样式显式扫描本包源码；应用仍需扫描自己的源码。应用负责主题切换、偏好持久化、布局与滚动策略。源码由应用 Vite 编译，React/React DOM 由消费方提供。

从根目录执行 `bun run --filter @dsh-bot/ui check`；添加组件可执行 `bun run --cwd packages/ui shadcn add <name>`，更新现有组件执行 `bun run --filter @dsh-bot/ui bump-ui`。更新使用锁文件安装的 CLI，生成别名统一指向本包。
