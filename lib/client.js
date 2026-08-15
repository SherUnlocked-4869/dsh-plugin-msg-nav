window.__ModuleLoader__.load({
  id: "dsh-plugin-msg-nav",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let React = require("react");

    //#region style (dsh-css pattern: the client module loader removes this tag on unload)
    const CSS = [
      ".dsnv-rail{position:fixed;z-index:30;width:34px;pointer-events:none;opacity:0;overflow:hidden;transition:opacity .18s ease-out}",
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
      ".dsnv-panel{position:fixed;z-index:90;box-sizing:border-box;width:272px;overflow:hidden;background:var(--dsw-specific-menu, var(--dsw-alias-bg-overlay, #2C2C2E));border:1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08));border-radius:16px;box-shadow:var(--dsw-shadow-lv3, 0 0 1px 0 rgba(0,0,0,.2), 0 12px 32px 0 rgba(0,0,0,.08));transform-origin:right center;animation:dsnv-panel-in .18s ease-out}",
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
      let railHotRef = false
      const setters = { active: null, rowCount: null, geo: null }
      const latest = { spy: null, measure: null, wheel: null }

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
        const sc = el.closest('[data-conversation-scroll]')
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
      })
      const iv = ctx.setInterval(tick, 700)
      const t0 = ctx.setTimeout(tick, 150)

      return function NavRail(props) {
        const session = props.session
        const [active, setActive] = React.useState(-1)
        const [geo, setGeo] = React.useState(null)
        const [rowCount, setRowCount] = React.useState(-1)
        const [listScroll, setListScroll] = React.useState(0)
        const [railHot, setRailHot] = React.useState(false)

        let users = []
        try {
          if (session && session.chat && Array.isArray(session.chat.order)) {
            const nodes = session.chat.nodes
            for (const key of session.chat.order) {
              const n = nodes.get(key)
              if (isUserish(n)) {
                users.push({ key: String(key), time: n.data ? n.data.time : undefined, text: previewOf(n.data) })
              }
            }
          }
        } catch (error) {
          console.error('[msg-nav] failed to read conversation snapshot', error)
        }
        currentUsers = users
        setters.active = setActive
        setters.rowCount = setRowCount
        setters.geo = setGeo
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
        }, [N])

        if (session === undefined || session === null || session.removed === true) return null

        const shown = N >= 2 && rowCount === N
        const railH = geo !== null ? geo.railH : 160
        const rightPx = geo !== null ? geo.right : 24
        const topPx = geo !== null ? geo.top : 120
        const dpr = (winEl && winEl.devicePixelRatio) || 1
        const yOf = (i) => Math.round(i * GAP * dpr) / dpr
        const contentH = (N - 1) * GAP + 3
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
          const row = u === undefined ? null : rowFor(u.key)
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
        }

        return React.createElement('div', {
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
            children: users.map((u, i) => React.createElement('button', {
              key: u.key,
              type: 'button',
              className: 'dsnv-dot' + (i === active ? ' dsnv-on' : ''),
              style: { top: yOf(i) + 'px' },
              'aria-label': '跳转到第 ' + (i + 1) + ' 条用户消息',
              onClick: () => jumpTo(i),
            })),
          }),
          railHot && shown ? React.createElement('div', {
            key: 'panel',
            className: 'dsnv-panel',
            style: { right: rightPx + 'px', top: (topPx - 3 + (railH + 6) / 2 - (Math.min(N, MAX_VIS) * 24 + 16) / 2) + 'px', height: (Math.min(N, MAX_VIS) * 24 + 16) + 'px' },
            children: React.createElement('div', {
              key: 'scroll',
              className: 'dsnv-panel-scroll',
              style: { transform: 'translateY(' + (-offset * 1.2) + 'px)' },
              children: users.map((u, i) => React.createElement('button', {
                key: u.key,
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
            }),
          }) : null,
        ])
      }
    }
    //#endregion

    //#region plugin
    const inject = ["slots", "timer"];

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
