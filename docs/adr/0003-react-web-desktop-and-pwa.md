# 桌面与 Web/PWA 共用 React Web，原生移动端用 Expo

四个平台需要同一份执行事实，但界面复用方向分成两类。桌面已有成熟的 React DOM 组件（shadcn、Markdown、代码呈现、工具结果），而 iOS 与 Android 需要真正的原生导航与系统集成。

因此桌面与独立的 Web/PWA 应用共用 React Web 业务组件，各应用保留自己的路由、导航、布局与平台能力；iOS 与 Android 由同一个 Expo 项目交付，使用 React Native 界面。跨端共享的是协议、客户端核心逻辑和适用的非平台代码，而不是同一套组件实现。

代价是要维护两套界面栈：Web 组件无法直接变成原生视图，内容呈现（如 Markdown 与代码块）在两个栈中分别实现。选择 Expo Web 统一全部端也能减少一套栈，但需要迁移现有桌面界面，并放弃现有 Web 组件的复用。依据见 [Host 与客户端调研](../HOST_AND_CLIENT_RESEARCH.md)。
