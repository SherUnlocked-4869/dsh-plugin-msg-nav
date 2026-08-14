# dsh-plugin-msg-nav

DeepSeek Harness 对话节点导航条插件：在对话区右缘渲染一列短横线节点串（每条真实用户消息一个节点），支持悬停预览、点击平滑跳转 + 高亮线、>11 节点滑动窗口，<2 条用户消息或非对话页自动隐藏。

纯浏览器端插件（无 host 侧逻辑），以 **bundle** 形式发布：`dsh plugin` 安装后自动接入 profile 层栈，无需手改 `cordis.patch.yml`。

## 安装（DSH 官方命令）

```bash
# 方式一：从 npm 安装（发布到 registry 后）
dsh plugin --profile web add dsh-plugin-msg-nav

# 方式二：直接从 GitHub 安装（无需发布）
dsh plugin --profile web add github:SherUnlocked-4869/dsh-plugin-msg-nav
```

`dsh plugin` 会转发给 pnpm 安装到 profile 目录，并自动把声明了 `dsh.bundle` 的包加入 `dsh.profile.bundles` 层栈。随后（重新）启动你的部署即可：

```bash
dsh web          # 或 dsh --profile <你的 profile>
```

无需其他配置。移除：

```bash
dsh plugin --profile web remove dsh-plugin-msg-nav
```

## 功能

| 功能 | 行为 |
| --- | --- |
| 节点导航条 | 对话区右缘纵向短横线串，每条真实用户消息一个节点 |
| 跟随阅读位置 | 激活节点（品牌蓝 / 深色下白色）随滚动侦测更新 |
| 悬停预览 | 450ms 出卡：244px 卡片、6 行截断、对齐官方 HoverCard 视觉 |
| 点击跳转 | 平滑滚动到对应消息 + 全宽品牌蓝高亮横线（1.5s 淡出），流式输出下亦有兜底落位 |
| 滑动窗口 | >11 节点时只渲染以激活节点为中心的 11 个窗口内节点 |
| 自动隐藏 | <2 条用户消息、空白会话、非对话视图（如轨迹页）时不显示 |

## 包结构

- `lib/client.js` —— 浏览器端 bundle（`window.__ModuleLoader__` 注册格式，随 DSH 模块系统加载/卸载）
- `lib/index.js` —— host 侧空插件体（行挂载占位）
- `cordis.patch.yml` —— bundle 补丁层：一行 `ui-msg-nav` 客户端行
- `package.json` —— `dsh.client`（浏览器清单）+ `dsh.bundle`（bundle 清单）双声明

## 开发

```bash
git clone https://github.com/SherUnlocked-4869/dsh-plugin-msg-nav.git
# 本地联调：安装进一个测试 profile
dsh plugin --profile <profile> add file:<abs-path>
dsh --profile <profile> --port 3090
```

## License

MIT
