window.__ModuleLoader__.load({
  id: "dsh-plugin-msg-nav",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let React = require("react");
    let ReactDOM = require("react-dom");

    //#region style (dsh-css pattern: the client module loader removes this tag on unload)
    const CSS = [
      ".dsnv-rail{position:fixed;z-index:1001;width:34px;pointer-events:none;opacity:0;overflow:hidden;transition:opacity .18s ease-out}",
      ".dsnv-rail.dsnv-on{opacity:1;pointer-events:auto}",
      ".dsnv-list{position:absolute;top:3px;left:0;width:34px;will-change:transform;transition:transform .12s ease-out,opacity .15s ease-out}",
      ".dsnv-rail.dsnv-pop .dsnv-list{opacity:0;pointer-events:none}",
      ".dsnv-dot{position:absolute;left:50%;width:14px;height:3px;margin-left:-7px;border:0;padding:0;border-radius:2px;background:rgba(15,17,21,.28);cursor:pointer;transition:background-color .15s,transform .15s}",
      ".dsnv-dot:hover{background:rgba(15,17,21,.52);transform:scale(2)}",
      ".dsnv-dot:focus-visible{background:rgba(15,17,21,.52);transform:scale(2)}",
      "body[data-ds-dark-theme] .dsnv-dot{background:rgba(255,255,255,.45)}",
      "body[data-ds-dark-theme] .dsnv-dot:hover{background:rgba(255,255,255,.75)}",
      "body[data-ds-dark-theme] .dsnv-dot:focus-visible{background:rgba(255,255,255,.75)}",
      ".dsnv-dot.dsnv-on{background:var(--dsw-static-deepseek-500, #4176E6)}",
      "body[data-ds-dark-theme] .dsnv-dot.dsnv-on{background:#fff}",
      ".dsnv-panel{position:fixed;z-index:1002;box-sizing:border-box;width:272px;overflow:hidden;background:var(--dsw-specific-menu, var(--dsw-alias-bg-overlay, #2C2C2E));border:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08));border-radius:16px;box-shadow:var(--dsw-shadow-lv3, 0 0 1px 0 rgba(0,0,0,.2), 0 12px 32px 0 rgba(0,0,0,.08));transform-origin:right center;animation:dsnv-panel-in .18s ease-out}",
      "@keyframes dsnv-panel-in{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}",
      ".dsnv-panel-scroll{position:relative;transition:transform .12s ease-out}",
      ".dsnv-panel-row{position:absolute;left:0;right:0;height:24px;box-sizing:border-box;display:flex;align-items:center;gap:12px;padding:0 10px 0 18px;border:0;border-radius:8px;background:transparent;cursor:pointer;font-size:13px;line-height:24px;color:var(--dsw-alias-label-secondary, rgba(255,255,255,.72));white-space:nowrap}",
      ".dsnv-panel-row:hover{color:var(--dsw-alias-label-primary, #ECECF1);background:var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.05))}",
      ".dsnv-panel-text{flex:1;min-width:0;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".dsnv-panel-dash{flex:none;width:14px;height:3px;border-radius:2px;background:rgba(15,17,21,.28)}",
      "body[data-ds-dark-theme] .dsnv-panel-dash{background:rgba(255,255,255,.45)}",
      ".dsnv-panel-row:hover .dsnv-panel-dash{background:rgba(15,17,21,.52)}",
      "body[data-ds-dark-theme] .dsnv-panel-row:hover .dsnv-panel-dash{background:rgba(255,255,255,.75)}",
      ".dsnv-panel-row.dsnv-panel-on{color:var(--dsw-static-deepseek-500, #4176E6)}",
      "body[data-ds-dark-theme] .dsnv-panel-row.dsnv-panel-on{color:#fff}",
      ".dsnv-panel-row.dsnv-panel-on .dsnv-panel-dash{background:var(--dsw-static-deepseek-500, #4176E6)}",
      "body[data-ds-dark-theme] .dsnv-panel-row.dsnv-panel-on .dsnv-panel-dash{background:#fff}",
      ".dsnv-highlight{position:relative}",
      ".dsnv-highlight::after{content:\"\";position:absolute;left:0;right:0;top:-9px;height:2px;border-radius:1px;background:var(--dsw-alias-state-business-primary, #4176E6);animation:dsnv-line 1.4s ease-out forwards}",
      "@keyframes dsnv-line{0%{opacity:0;transform:scaleX(.5)}25%{opacity:1;transform:scaleX(1)}70%{opacity:1}100%{opacity:0}}",
      ".dsnv-dot.dsnv-pending{cursor:default;background:var(--dsw-static-deepseek-500, #4176E6);animation:dsnv-pulse 1.2s ease-in-out infinite}",
      ".dsnv-dot.dsnv-pending:hover{transform:none;background:var(--dsw-static-deepseek-500, #4176E6)}",
      "body[data-ds-dark-theme] .dsnv-dot.dsnv-pending{background:#fff}",
      "body[data-ds-dark-theme] .dsnv-dot.dsnv-pending:hover{background:#fff}",
      ".dsnv-panel-row.dsnv-panel-loading{cursor:default;color:var(--dsw-alias-label-secondary, rgba(255,255,255,.55))}",
      ".dsnv-panel-row.dsnv-panel-loading:hover{color:var(--dsw-alias-label-secondary, rgba(255,255,255,.55));background:transparent}",
      ".dsnv-panel-row.dsnv-panel-loading .dsnv-panel-dash{background:var(--dsw-static-deepseek-500, #4176E6);animation:dsnv-pulse 1.2s ease-in-out infinite}",
      "body[data-ds-dark-theme] .dsnv-panel-row.dsnv-panel-loading .dsnv-panel-dash{background:#fff}",
      "@keyframes dsnv-pulse{0%,100%{opacity:.12}50%{opacity:.65}}",
      "@media (prefers-reduced-motion:reduce){.dsnv-list{transition:none}.dsnv-rail{transition:none}.dsnv-dot{transition:none}.dsnv-highlight::after{animation-duration:.6s}}",
    ].join("\n");
    const CSS_TAG_ID = "dsh-plugin-msg-nav/style.css";
    if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(CSS_TAG_ID) + "]") === null) {
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-plugin-msg-nav";
      tag.dataset.pluginCss = CSS_TAG_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    //#endregion

    //#region node navigation rail
    function makeRail(ctx) {
      const GAP = 20
      const MAX_VIS = 10
      let railEl = null
      let wiredScroller = null
      let wiredWheelEl = null
      let scrollerEl = null
      let winEl = null
      let docEl = null
      let resizeObs = null
      let rowsCache = {}
      let currentUsers = []
      let ringTimer = null
      let ringEl = null
      let activeIdx = -1
      let lastRowCount = -1
      let lastGeo = null
      const setters = { active: null, rowCount: null, geo: null, fullLoading: null }
      const latest = { spy: null, measure: null, wheel: null }

      //#region full-history auto-load（自动下载更早信息 → 全量用户信息入串）
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
      // 每页 50 条；至多 120 页（与 dsh-chat-timeline 相同的礼貌上限）
      const FULL_LOAD_PAGES = 120
      let loadAllGen = 0

      function stopLoadAll() {
        loadAllGen++
      }

      // 后台全量加载：跟随运行时的 hasMore 权威标志逐页拉取更早历史，
      // 直到整段日志全部进入聊天窗口（节点串因此覆盖全部用户消息）。
      // 会话未打开时等待重试；error / 页数上限 / 无更多历史时退出。
      async function loadAllOlder(face, gen) {
        let pages = 0
        let guard = 0
        while (gen === loadAllGen && guard++ < 600) {
          let snap = null
          try { snap = face.getSnapshot() } catch (error) { return }
          if (snap === undefined || snap === null) return
          if (snap.openState === 'error') return
          if (snap.openState !== 'open') { await delay(120); continue }
          if (snap.hasMore !== true) return
          if (snap.loadingOlder === true) { await delay(50); continue }
          try { await face.loadOlder() } catch (error) { return }
          if (++pages >= FULL_LOAD_PAGES) return
        }
      }

      // 点击按需加载：循环拉取更早历史，直到目标消息节点的 key 出现在
      // 已加载窗口（随后由 React 提交渲染成 DOM 行，再滚动落位）。
      async function loadUntilKeyLoaded(face, key) {
        let pages = 0
        let guard = 0
        while (guard++ < 300) {
          let snap = null
          try { snap = face.getSnapshot() } catch (error) { return }
          if (snap === undefined || snap === null) return
          if (snap.openState === 'error') return
          if (snap.openState !== 'open') { await delay(120); continue }
          let has = false
          try {
            has = snap.chat !== undefined && snap.chat.nodes !== undefined && snap.chat.nodes.get(key) !== undefined
          } catch (error) { return }
          if (has) return
          if (snap.hasMore !== true) return
          if (snap.loadingOlder === true) { await delay(50); continue }
          try { await face.loadOlder() } catch (error) { return }
          if (++pages >= FULL_LOAD_PAGES) return
        }
      }

      // 投影条目（尚未入窗的消息）按持久消息 id 关联窗口行：
      // 在已加载窗口中查找 data.id 匹配的节点。
      function windowHasId(snap, id) {
        try {
          if (snap.chat === undefined || snap.chat.order === undefined || snap.chat.nodes === undefined) return false
          for (const k of snap.chat.order) {
            const n = snap.chat.nodes.get(k)
            if (n !== undefined && n !== null && String(n.id) === String(id)) return true
          }
        } catch (error) { /* fall through */ }
        return false
      }

      // 已加载窗口内 id → 节点 key（供 jumpTo 直接定位 DOM 行）。
      function keyForIdInWindow(face, id) {
        try {
          const snap = face.getSnapshot()
          if (snap === undefined || snap === null) return null
          if (snap.chat === undefined || snap.chat.order === undefined || snap.chat.nodes === undefined) return null
          for (const k of snap.chat.order) {
            const n = snap.chat.nodes.get(k)
            if (n !== undefined && n !== null && String(n.id) === String(id)) return String(k)
          }
        } catch (error) { /* fall through */ }
        return null
      }

      // 点击按需加载（按 id）：循环拉取更早历史，直到目标消息出现在
      // 已加载窗口（随后 React 提交渲染出行，再滚动落位）。
      async function loadUntilIdLoaded(face, id) {
        let pages = 0
        let guard = 0
        while (guard++ < 300) {
          let snap = null
          try { snap = face.getSnapshot() } catch (error) { return }
          if (snap === undefined || snap === null) return
          if (snap.openState === 'error') return
          if (snap.openState !== 'open') { await delay(120); continue }
          if (windowHasId(snap, id)) return
          if (snap.hasMore !== true) return
          if (snap.loadingOlder === true) { await delay(50); continue }
          try { await face.loadOlder() } catch (error) { return }
          if (++pages >= FULL_LOAD_PAGES) return
        }
      }

      // 启动/重启后台全量加载（sessionId 变化即换代，旧循环自动失效）。
      function startLoadAll(sessionId) {
        stopLoadAll()
        const gen = loadAllGen
        if (setters.fullLoading) setters.fullLoading(true)
        const finish = () => {
          if (gen === loadAllGen && setters.fullLoading) setters.fullLoading(false)
        }
        const run = async () => {
          try {
            let guard = 0
            while (gen === loadAllGen && guard++ < 200) {
              let face = null
              try { face = ctx.sessions.binding(sessionId)?.session ?? null } catch (error) { face = null }
              if (face === null) { await delay(250); continue }
              await loadAllOlder(face, gen)
              break
            }
          } finally {
            finish()
          }
        }
        run().catch(() => {})
      }
      //#endregion

      function isUserish(n) {
        if (n === undefined || n === null) return false
        return n.kind === 'user' || n.kind === 'steering'
      }

      function previewOf(data) {
        if (!data || !Array.isArray(data.content)) return ''
        let text = ''
        let hasImage = false
        for (const b of data.content) {
          if (!b) continue
          if (b.type === 'text' && typeof b.text === 'string') {
            text += b.text + '\n'
            if (text.length > 420) break
          } else if (b.type === 'image') hasImage = true
        }
        const cleaned = text.replace(/^\s*<\s*goal_[a-z_]*\s*>\s*/i, '')
        const trimmed = cleaned.trim()
        if (trimmed !== '') return trimmed.length > 420 ? trimmed.slice(0, 420) + '…' : trimmed
        return hasImage ? '[图片消息]' : ''
      }

      function rowFor(key) {
        const row = rowsCache[key]
        return row === undefined ? null : row
      }

      function clearRing() {
        if (ringTimer !== null) { ringTimer(); ringTimer = null }
        if (ringEl !== null) { ringEl.classList.remove('dsnv-highlight'); ringEl = null }
      }

      function onScroll() {
        if (latest.spy) latest.spy()
      }

      function onResize() {
        scheduleResize()
      }

      let resizePending = false
      function scheduleResize() {
        if (resizePending || winEl === null) return
        resizePending = true
        const raf = winEl.requestAnimationFrame || ((fn) => { winEl.setTimeout(fn, 16) })
        raf(() => {
          resizePending = false
          if (latest.measure) latest.measure()
        })
      }

      function onWheelNative(event) {
        if (latest.wheel) latest.wheel(event)
      }

      function unwire() {
        if (wiredScroller !== null && winEl !== null) {
          wiredScroller.removeEventListener('scroll', onScroll)
          winEl.removeEventListener('resize', onResize)
          if (resizeObs !== null) { resizeObs.disconnect(); resizeObs = null }
        }
        if (wiredWheelEl !== null) {
          wiredWheelEl.removeEventListener('wheel', onWheelNative)
          wiredWheelEl = null
        }
        wiredScroller = null
        scrollerEl = null
        winEl = null
        docEl = null
      }

      function ensureWired() {
        const el = railEl
        if (el === null) return false
        const doc = el.ownerDocument
        const win = doc.defaultView
        const sc = doc.querySelector('[data-conversation-scroll]')
        if (sc === null) return false
        if (wiredScroller !== sc) {
          if (wiredScroller !== null && winEl !== null) {
            wiredScroller.removeEventListener('scroll', onScroll)
            winEl.removeEventListener('resize', onResize)
            if (resizeObs !== null) { resizeObs.disconnect(); resizeObs = null }
          }
          scrollerEl = sc
          docEl = doc
          winEl = win
          sc.addEventListener('scroll', onScroll, { passive: true })
          win.addEventListener('resize', onResize)
          if (typeof win.ResizeObserver === 'function') {
            resizeObs = new win.ResizeObserver(onResize)
            resizeObs.observe(sc)
          }
          wiredScroller = sc
          if (latest.measure) latest.measure()
        } else {
          scrollerEl = sc
        }
        if (wiredWheelEl !== el) {
          if (wiredWheelEl !== null) wiredWheelEl.removeEventListener('wheel', onWheelNative)
          el.addEventListener('wheel', onWheelNative, { passive: false })
          wiredWheelEl = el
        }
        return true
      }

      function tick() {
        if (railEl === null) return
        if (ensureWired() && latest.spy) latest.spy()
      }

      ctx.effect(() => () => {
        unwire()
        clearRing()
        stopLoadAll()
      })
      const iv = ctx.setInterval(tick, 700)
      const t0 = ctx.setTimeout(tick, 150)

      return function NavRail(props) {
        const session = props.session
        // host 投影：全量用户消息列表（尾页 + 推送帧即时送达，零翻页）
        const projected = props.useProjection("msgNavMessages")
        const railHotRef = React.useRef(false)
        const [active, setActive] = React.useState(-1)
        const [geo, setGeo] = React.useState(null)
        const [rowCount, setRowCount] = React.useState(-1)
        const [listScroll, setListScroll] = React.useState(0)
        const [railHot, setRailHot] = React.useState(false)
        const [fullLoading, setFullLoading] = React.useState(false)

        // 已加载窗口中的用户消息（携带 id/seq，用于与投影条目按 id 关联）
        let winUsers = []
        let winOrphans = []
        try {
          if (session && session.chat && Array.isArray(session.chat.order)) {
            const nodes = session.chat.nodes
            for (const key of session.chat.order) {
              const n = nodes.get(key)
              if (isUserish(n)) {
                const w = {
                  key: String(key),
                  id: n.id !== undefined && n.id !== null ? String(n.id) : undefined,
                  seq: typeof n.anchorSeq === 'number' ? n.anchorSeq : undefined,
                  time: n.data ? n.data.time : undefined,
                  text: previewOf(n.data),
                }
                winUsers.push(w)
                if (w.id === undefined) winOrphans.push(w)
              }
            }
          }
        } catch (error) {
          console.error('[msg-nav] failed to read conversation snapshot', error)
        }

        // 投影命中：host 已折叠整段日志 → 全量列表即时可得，无需后台翻页。
        const projectionActive = projected !== undefined && projected !== null &&
          Array.isArray(projected.messages) && projected.messages.length > 0

        let users
        if (projectionActive) {
          const byId = new Map()
          for (const w of winUsers) if (w.id !== undefined) byId.set(w.id, w)
          users = []
          for (const m of projected.messages) {
            if (m === null || typeof m !== 'object' || typeof m.seq !== 'number') continue
            const id = typeof m.id === 'string' ? m.id : undefined
            const w = id !== undefined ? byId.get(id) : undefined
            if (w !== undefined) {
              users.push(w) // 已入窗：用窗口的 key 与完整预览文本
              byId.delete(id)
            } else {
              users.push({ key: null, id: id, seq: m.seq, time: typeof m.time === 'number' ? m.time : undefined, text: typeof m.text === 'string' ? m.text : '' })
            }
          }
          // 安全网：投影未覆盖的窗口消息（理论上不会出现）与无 id 消息
          for (const w of byId.values()) users.push(w)
          for (const w of winOrphans) users.push(w)
          users.sort((a, b) => (a.seq ?? Infinity) - (b.seq ?? Infinity))
        } else {
          users = winUsers
        }
        currentUsers = users
        setters.active = setActive
        setters.rowCount = setRowCount
        setters.geo = setGeo
        setters.fullLoading = setFullLoading
        const N = users.length

        const measure = () => {
          if (!scrollerEl || !winEl) return
          let right, top, railH
          try {
            const srect = scrollerEl.getBoundingClientRect()
            const dpr = winEl.devicePixelRatio || 1
            right = Math.round((Math.max(0, winEl.innerWidth - srect.right) + 14) * dpr) / dpr
            const m = currentUsers.length
            railH = Math.max(Math.min(m, MAX_VIS) * GAP + 3, 3)
            top = Math.max(8, Math.round((srect.height - railH) / 2 + srect.top))
            top = Math.round(top * dpr) / dpr
          } catch (err) { return }
          if (lastGeo !== null && lastGeo.right === right && lastGeo.railH === railH && lastGeo.top === top) return
          lastGeo = { right: right, railH: railH, top: top }
          if (setters.geo) setters.geo(lastGeo)
        }
        latest.measure = measure

        const scrollspy = () => {
          if (!scrollerEl) return
          try {
            const srect = scrollerEl.getBoundingClientRect()
            const line = srect.top + srect.height * 0.33
            rowsCache = {}
            const all = scrollerEl.querySelectorAll('[data-chat-anchor-key]')
            for (let i = 0; i < all.length; i++) rowsCache[all[i].dataset.chatAnchorKey] = all[i]
            let idx = -1
            let found = 0
            for (let i = 0; i < currentUsers.length; i++) {
              const row = rowsCache[currentUsers[i].key]
              if (row === undefined) continue
              found++
              const r = row.getBoundingClientRect()
              if (r.top <= line) idx = i
            }
            if (found !== lastRowCount) { lastRowCount = found; if (setters.rowCount) setters.rowCount(found) }
            if (idx !== activeIdx) { activeIdx = idx; if (setters.active) setters.active(idx) }
          } catch (error) {
            console.error('[msg-nav] scrollspy failed', error)
          }
        }
        latest.spy = scrollspy

        React.useEffect(() => {
          ensureWired()
        }, [])

        // 兜底全量加载：仅在 host 投影缺席时后台翻页（投影一旦送达立即停止）。
        React.useEffect(() => {
          const sid = props.sessionId
          if (sid === undefined || sid === null || projectionActive) {
            stopLoadAll()
            return
          }
          startLoadAll(sid)
          return stopLoadAll
        }, [props.sessionId, projectionActive])

        React.useEffect(() => {
          ensureWired()
          measure()
          scrollspy()
          if (!railHotRef.current) {
            const rh = Math.max(Math.min(N, MAX_VIS) * GAP + 3, 3)
            const maxScroll = Math.max(0, (N - 1) * GAP + 3 - rh)
            const centerIdx = activeIdx >= 0 ? activeIdx : 0
            const centered = Math.min(Math.max(centerIdx * GAP - rh / 2, 0), maxScroll)
            setListScroll(centered)
          }
        }, [N, fullLoading])

        if (session === undefined || session === null || session.removed === true) return null

        // 投影模式下全量列表即时可得，无需等待窗口内所有行渲染；
        // 兜底模式（无投影）仍要求已加载行齐全（rowCount === N）。
        const shown = N >= 2 && (projectionActive || rowCount === N)
        const railH = geo !== null ? geo.railH : 160
        const rightPx = geo !== null ? geo.right : 24
        const topPx = geo !== null ? geo.top : 120
        const dpr = (winEl && winEl.devicePixelRatio) || 1
        const yOf = (i) => Math.round(i * GAP * dpr) / dpr
        const contentH = (N - 1) * GAP + 3 + (fullLoading ? GAP : 0)
        const maxScroll = Math.max(0, contentH - railH)
        const offset = Math.min(listScroll, maxScroll)

        const onWheel = (event) => {
          if (maxScroll <= 0) return
          event.preventDefault()
          const next = Math.min(Math.max(listScroll + event.deltaY, 0), maxScroll)
          if (next !== listScroll) setListScroll(next)
        }
        latest.wheel = onWheel
        const jumpTo = (i) => {
          const u = currentUsers[i]
          if (u === undefined) return
          if (scrollerEl === null) return
          void (async () => {
            // 目标行尚未渲染时按需拉取更早历史直至该消息入窗，再等 React
            // 提交出 DOM 行：兜底模式按节点 key，投影模式按持久消息 id。
            let row = u.key !== null && u.key !== undefined ? rowFor(u.key) : null
            if (row === null) {
              let face = null
              try { face = ctx.sessions.binding(props.sessionId)?.session ?? null } catch (error) { face = null }
              if (face !== null) {
                if (u.key !== null && u.key !== undefined) {
                  await loadUntilKeyLoaded(face, u.key)
                  if (latest.spy) latest.spy()
                  let tries = 0
                  while (tries++ < 20 && (row = rowFor(u.key)) === null) await delay(60)
                } else if (u.id !== null && u.id !== undefined) {
                  await loadUntilIdLoaded(face, u.id)
                  let tries = 0
                  while (tries++ < 20 && row === null) {
                    if (latest.spy) latest.spy()
                    const k = keyForIdInWindow(face, u.id)
                    if (k !== null) row = rowFor(k)
                    if (row === null) await delay(60)
                  }
                }
              }
            }
            if (row === null || scrollerEl === null) return
            let target = 0
            try {
              const srect = scrollerEl.getBoundingClientRect()
              const rrect = row.getBoundingClientRect()
              const offset2 = Math.min(160, Math.max(80, Math.round(srect.height * 0.25)))
              target = Math.max(0, scrollerEl.scrollTop + (rrect.top - srect.top) - offset2)
            } catch (error) {
              console.error('[msg-nav] jump failed', error)
            }
          const before = scrollerEl.scrollTop
          try {
            scrollerEl.scrollTo({ top: target, behavior: 'smooth' })
          } catch (err) {
            scrollerEl.scrollTop = target
          }
          ctx.setTimeout(() => {
            if (scrollerEl === null) return
            if (Math.abs(scrollerEl.scrollTop - before) < 2) {
              try {
                scrollerEl.scrollTo({ top: target, behavior: 'smooth' })
              } catch (err) {
                scrollerEl.scrollTop = target
              }
            }
          }, 220)
          ctx.setTimeout(() => {
            if (scrollerEl === null) return
            if (Math.abs(scrollerEl.scrollTop - before) < 8) {
              scrollerEl.scrollTop = target
            }
          }, 850)
          clearRing()
          row.classList.add('dsnv-highlight')
          ringEl = row
          ringTimer = ctx.setTimeout(clearRing, 1500)
          const centered = Math.min(Math.max(yOf(i) - railH / 2, 0), maxScroll)
          setListScroll(centered)
          })()
        }

        return ReactDOM.createPortal(React.createElement('div', {
          ref: (el) => { railEl = el },
          className: 'dsnv-rail' + (shown ? ' dsnv-on' : '') + (railHot ? ' dsnv-pop' : ''),
          role: 'navigation',
          'aria-label': '消息导航',
          style: { right: rightPx + 'px', top: (topPx - 3) + 'px', height: (railH + 6) + 'px' },
          onPointerEnter: () => { railHotRef.current = true; setRailHot(true) },
          onPointerLeave: () => {
            railHotRef.current = false
            setRailHot(false)
            const centered = Math.min(Math.max(yOf(activeIdx >= 0 ? activeIdx : 0) - railH / 2, 0), maxScroll)
            setListScroll(centered)
          },
        }, [
          React.createElement('div', {
            key: 'list',
            className: 'dsnv-list',
            style: { transform: 'translateY(' + (-offset) + 'px)' },
            children: [
              ...users.map((u, i) => React.createElement('button', {
                key: u.key !== null && u.key !== undefined ? u.key : (u.id !== undefined ? 'id-' + u.id : 'proj-' + i),
                type: 'button',
                className: 'dsnv-dot' + (i === active ? ' dsnv-on' : ''),
                style: { top: yOf(i) + 'px' },
                'aria-label': '跳转到第 ' + (i + 1) + ' 条用户消息',
                onClick: () => jumpTo(i),
              })),
              fullLoading ? React.createElement('span', {
                key: 'pending',
                className: 'dsnv-dot dsnv-pending',
                style: { top: yOf(N) + 'px' },
                'aria-hidden': true,
              }) : null,
            ],
          }),
          railHot && shown ? React.createElement('div', {
            key: 'panel',
            className: 'dsnv-panel',
            style: { right: rightPx + 'px', top: (topPx - 3 + (railH + 6) / 2 - (Math.min(N, MAX_VIS) * 24 + 16) / 2) + 'px', height: (Math.min(N, MAX_VIS) * 24 + 16) + 'px' },
            children: React.createElement('div', {
              key: 'scroll',
              className: 'dsnv-panel-scroll',
              style: { transform: 'translateY(' + (-offset * 1.2) + 'px)' },
              children: [
                ...users.map((u, i) => React.createElement('button', {
                  key: u.key !== null && u.key !== undefined ? u.key : (u.id !== undefined ? 'id-' + u.id : 'proj-' + i),
                  type: 'button',
                  className: 'dsnv-panel-row' + (i === active ? ' dsnv-panel-on' : ''),
                  style: { top: (8 + i * 24) + 'px' },
                  'aria-label': '跳转到第 ' + (i + 1) + ' 条用户消息',
                  onClick: () => jumpTo(i),
                  children: [
                    React.createElement('span', { className: 'dsnv-panel-text', children: u.text !== '' ? u.text : '(无文本内容)' }),
                    React.createElement('span', { className: 'dsnv-panel-dash' }),
                  ],
                })),
                fullLoading && N >= MAX_VIS ? React.createElement('div', {
                  key: 'loading',
                  className: 'dsnv-panel-row dsnv-panel-loading',
                  style: { top: (8 + N * 24) + 'px' },
                  children: [
                    React.createElement('span', { className: 'dsnv-panel-text', children: '正在加载更早消息…' }),
                    React.createElement('span', { className: 'dsnv-panel-dash' }),
                  ],
                }) : null,
              ],
            }),
          }) : null,
        ]), document.body)
      }
    }
    //#endregion

    //#region plugin
    const inject = ["slots", "timer", "sessions"];

    function apply(ctx) {
      ctx.slots.inject("conversation.composer.dock", () => ctx.slots.register(
        { name: "conversation.composer.dock", id: "msg-nav", order: 10, label: "消息导航" },
        makeRail(ctx),
      ));
    }

    exports.apply = apply;
    exports.inject = inject;
    return module.exports;
    //#endregion
  },
});
