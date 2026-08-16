[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

# dsh-plugin-msg-nav

DeepSeek Harness 对话节点导航条插件：在对话区右缘渲染一列短横线节点串（每条真实用户消息一个节点），跟随阅读位置；鼠标靠近节点串时，节点条「变形弹出」为单行消息预览面板（覆盖原位置，移开复原），点击任意预览平滑跳转 + 高亮横线，节点过多时可在悬停区域内用滚轮滑动浏览。

![效果图](assets/screenshot.png)

纯浏览器端插件（无 host 侧逻辑），以 **bundle** 形式发布：`dsh plugin` 安装后自动接入 profile 层栈，无需手改任何配置文件。

## 安装（DSH 官方命令）

```bash
# 直接从 GitHub 安装
dsh plugin --profile web add github:SherUnlocked-4869/dsh-plugin-msg-nav
```

`dsh plugin` 会转发给 pnpm 安装到 profile 目录，并自动把声明了 `dsh.bundle` 的包加入 `dsh.profile.bundles` 层栈。随后启动（已在运行则重启）部署即可：

```bash
dsh web          # 或 dsh --profile <你的 profile>
```

更新到最新版本：

```bash
cd ~/.dsh/profiles/web && pnpm update dsh-plugin-msg-nav
```

卸载：

```bash
dsh plugin --profile web remove dsh-plugin-msg-nav
```

## 功能

| 功能 | 行为 |
| --- | --- |
| 节点导航条 | 对话区右缘纵向短横线串，每条**真实用户消息**一个节点（系统注入的 goal 自动延续等不计入），恒定 20px 间距 |
| 悬停弹出面板 | 鼠标进入节点串区域：节点条短横线淡出、左侧**单行预览面板弹出**（0.18s 放大动画，覆盖节点条原位置，行内短横线落在原节点条短横线的横坐标上，如节点条变形展开）；移出后节点条恢复 |
| 面板排版 | 每条消息一行（左文字 + 右短横线），24px 行距、上下 8px 对称留白；悬停行时文字与短横线**同步高亮**并出现 8px 圆角底色；当前阅读位置整行（文字+短横线）以品牌蓝/白色高亮 |
| 列表滑动 | 最多显示 10 条；超过时鼠标悬停在节点串区域内**滚轮上下滑动列表**（页面不滚动），面板按比例同步滚动 |
| 移出回中 | 鼠标移出悬停区域后，列表平滑居中回当前阅读位置，恢复跟随 |
| 跟随阅读位置 | 激活节点（品牌蓝 / 深色下白色）随滚动侦测实时更新 |
| 点击跳转 | 平滑滚动到对应消息 + 全宽品牌蓝高亮横线（1.5s 淡出），流式输出干扰下亦有看门狗兜底落位，列表自动居中到目标节点 |
| 自动隐藏 | <2 条用户消息、空白会话、非对话视图（如轨迹页）时不显示 |
| 渲染细节 | 节点位置按 devicePixelRatio 对齐设备像素（粗细一致）；窗口调整 rAF 合帧，不拖慢界面 |

## 包结构

- `lib/client.js` —— 浏览器端 bundle（`window.__ModuleLoader__` 注册格式，随 DSH 模块系统加载/卸载）
- `lib/index.js` —— host 侧空插件体（行挂载占位）
- `lib/types/` —— TypeScript 类型声明
- `cordis.patch.yml` —— bundle 补丁层：`insert` 一行 `ui-msg-nav` 客户端行
- `package.json` —— `dsh.client`（浏览器清单）+ `dsh.bundle`（bundle 清单）双声明
- `assets/screenshot.png` —— 效果图

## 常见问题

**`dsh plugin add` 报 `ERR_PNPM_TARBALL_INTEGRITY`？**

profile 里某个以 `refs/heads/...` 分支地址安装的第三方插件在上游更新后，新 tarball 校验和与锁文件不符，pnpm 的供应链保护会拒绝整个安装。确认上游更新可信后，把该依赖固定到具体 commit 即可一劳永逸（本插件即以此方式接入）：

```json
"dependencies": {
  "<pkg>": "https://codeload.github.com/<owner>/<repo>/tar.gz/<commit-sha>"
}
```

然后 `pnpm install` 刷新锁文件，再重新执行 `dsh plugin add`。

**节点串没出现？**

- 确认部署已重启、页面已刷新（bundle 变更需重启部署；刷新页面通常即可拿到新 bundle）
- 当前会话需有 ≥2 条真实用户消息，且处于「对话」视图

## 开发

```bash
git clone https://github.com/SherUnlocked-4869/dsh-plugin-msg-nav.git
# 本地联调：安装进一个测试 profile
dsh plugin --profile <profile> add file:<abs-path>
dsh --profile <profile> --port 3090
```

## License

MIT
