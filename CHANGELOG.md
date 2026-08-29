# 更新日志 / Changelog

## v0.2.2 (2026-08-29)

### 性能 / Performance

- **滚动侦测节流 / Throttled scrollspy**：scroll 事件改为 rAF 合帧调度，每帧最多侦测一次；滚动位置与行集合均未变化时直接返回（空闲轮询近乎零成本）。行缓存 `rowsCache` 由 MutationObserver 置脏增量维护，不再每个滚动事件全子树重扫。
  Scroll events now coalesce via requestAnimationFrame (at most one detection per frame, early-exit when nothing changed); the row cache is maintained incrementally via a MutationObserver dirty flag instead of a full-subtree re-query per scroll event.
- **节点串 / 悬停面板窗口化 / Windowed rail & panel rendering**：只创建可视窗口内的短横线与面板行元素（`overflow:hidden` 裁剪下窗口外元素本不可见），长会话的首次挂载与每次滚动重渲染从 O(N) 降到 O(可见窗口)——实测 42 条消息的会话 DOM 从 42 按钮 + 126 面板元素降到 ~15 + 42。
  Only the visible window of dash nodes and panel rows is created (elements outside the `overflow:hidden` clip are invisible anyway), turning mount and per-scroll re-render cost from O(N) into O(visible window) — measured on a 42-message session: 42 buttons + 126 panel elements down to ~15 + 42.
- **卸载清理 / Unload cleanup**：插件卸载时清理 700ms 轮询 interval，不再泄漏。
  The 700 ms poll interval is now cleared on plugin unload.

> 说明：实测确认，打开超长会话时的页面卡顿主因是 DSH 应用自身一次性挂载全部消息行（1696 行实测产生约 5.2s 主线程长任务），与本插件无关——替换插件新旧版本打开成本差异 <1%。本版本把插件自身路径的开销降到近零，属前瞻性优化。
> Note: measured A/B confirms that the jank when opening very long sessions is dominated by the DSH app itself mounting all message rows (~5.2 s of main-thread long tasks for 1 696 rows); swapping plugin versions changes open cost by <1%. This release reduces the plugin's own paths to near-zero cost as forward-looking hardening.

## v0.2.1 (2026-08-29)

### 新增 / Added

- **快捷键跳转 / Keyboard jump**：`Alt+↑ / Alt+↓` 在相邻用户消息间平滑跳转，与点击跳转同一链路——未入窗消息先按需加载再落位、高亮横线、列表回中。连按 / 按住可跨多条连续推进；焦点在已有草稿的输入框内时不触发，避免打断输入。
  `Alt+↑ / Alt+↓` smooth-jump between adjacent user messages, sharing the click-to-jump path (on-demand loading for unloaded messages + highlight dash + list re-centering). Repeated / held presses keep stepping across messages; suppressed while the focus is in an input holding a draft, so typing is never interrupted.

### 修复 / Fixed

- 快速连续跳转（连按快捷键或快速点击节点）时，前一次跳转的看门狗会误把视口拉回旧目标；现在只有最新一次跳转的看门狗与落位逻辑生效。
  During rapid consecutive jumps (held keyboard repeat or fast node clicks), the previous jump's watchdog could drag the viewport back to the stale target; only the newest jump's watchdog and landing logic take effect now.
