# 更新日志 / Changelog

## v0.2.1 (2026-08-29)

### 新增 / Added

- **快捷键跳转 / Keyboard jump**：`Alt+↑ / Alt+↓` 在相邻用户消息间平滑跳转，与点击跳转同一链路——未入窗消息先按需加载再落位、高亮横线、列表回中。连按 / 按住可跨多条连续推进；焦点在已有草稿的输入框内时不触发，避免打断输入。
  `Alt+↑ / Alt+↓` smooth-jump between adjacent user messages, sharing the click-to-jump path (on-demand loading for unloaded messages + highlight dash + list re-centering). Repeated / held presses keep stepping across messages; suppressed while the focus is in an input holding a draft, so typing is never interrupted.

### 修复 / Fixed

- 快速连续跳转（连按快捷键或快速点击节点）时，前一次跳转的看门狗会误把视口拉回旧目标；现在只有最新一次跳转的看门狗与落位逻辑生效。
  During rapid consecutive jumps (held keyboard repeat or fast node clicks), the previous jump's watchdog could drag the viewport back to the stale target; only the newest jump's watchdog and landing logic take effect now.
