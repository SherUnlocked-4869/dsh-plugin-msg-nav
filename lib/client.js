window.__ModuleLoader__.load({
  id: "dsh-plugin-msg-nav",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
    let React = require("react");

    //#region style (dsh-css pattern: the client module loader removes this tag on unload)
    const CSS = [
      ".dsnv-rail{position:fixed;z-index:30;width:34px;pointer-events:none;opacity:0;transition:opacity .18s ease-out}",
      ".dsnv-rail.dsnv-on{opacity:1;pointer-events:auto}",
      ".dsnv-dot{position:absolute;left:50%;width:14px;height:3px;margin-left:-7px;border:0;padding:0;border-radius:2px;background:rgba(15,17,21,.28);cursor:pointer;transition:background-color .15s,transform .15s}",
      ".dsnv-dot:hover{background:rgba(15,17,21,.52);transform:scale(2)}",
      ".dsnv-dot:focus-visible{background:rgba(15,17,21,.52);transform:scale(2)}",
      "body[data-ds-dark-theme] .dsnv-dot{background:rgba(255,255,255,.45)}",
      "body[data-ds-dark-theme] .dsnv-dot:hover{background:rgba(255,255,255,.75)}",
      "body[data-ds-dark-theme] .dsnv-dot:focus-visible{background:rgba(255,255,255,.75)}",
      ".dsnv-dot.dsnv-on{background:var(--dsw-static-deepseek-500, #4176E6)}",
      "body[data-ds-dark-theme] .dsnv-dot.dsnv-on{background:#fff}",
      ".dsnv-card{position:fixed;z-index:100;box-sizing:border-box;width:244px;padding:12px 16px;border-radius:12px;background:var(--dsw-specific-menu, var(--dsw-alias-bg-overlay, #2C2C2E));box-shadow:var(--dsw-shadow-lv3, 0 0 1px 0 rgba(0,0,0,.2), 0 12px 32px 0 rgba(0,0,0,.08));color:var(--dsw-alias-label-primary, #ECECF1);font-size:13px;line-height:20px;word-break:break-word}",
      ".dsnv-card-caption{font-size:12px;line-height:16px;color:var(--dsw-alias-label-tertiary, rgba(255,255,255,.45));margin-bottom:6px;font-variant-numeric:tabular-nums}",
      ".dsnv-card-text{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:6;overflow:hidden;white-space:pre-wrap}",
      ".dsnv-highlight{position:relative}",
      ".dsnv-highlight::after{content:\"\";position:absolute;left:0;right:0;top:-9px;height:2px;border-radius:1px;background:var(--dsw-alias-state-business-primary, #4176E6);animation:dsnv-line 1.4s ease-out forwards}",
      "@keyframes dsnv-line{0%{opacity:0;transform:scaleX(.5)}25%{opacity:1;transform:scaleX(1)}70%{opacity:1}100%{opacity:0}}",
      "@media (prefers-reduced-motion:reduce){.dsnv-dot{transition:none}.dsnv-highlight::after{animation-duration:.6s}}",
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
      const WIN = 11
      const CARD_W = 244
      let railEl = null
      let cardEl = null
      let wiredScroller = null
      let scrollerEl = null
      let winEl = null
      let docEl = null
      let resizeObs = null
      let rowsCache = {}
      let currentUsers = []
      let currentHover = null
      let hoverEl = null
      let hoverTimer = null
      let ringTimer = null
      let ringEl = null
      let activeIdx = -1
      let lastRowCount = -1
      let lastGeo = null
      const setters = { active: null, rowCount: null, geo: null, hover: null }
      const latest = { spy: null, measure: null, position: null }

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

      function fmtTime(t) {
        if (typeof t !== 'number') return ''
        const d = new Date(t)
        const p = (x) => (x < 10 ? '0' + x : String(x))
        return p(d.getHours()) + ':' + p(d.getMinutes())
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
        if (latest.position) latest.position()
      }

      function onResize() {
        if (latest.measure) latest.measure()
        if (latest.spy) latest.spy()
      }

      function unwire() {
        if (wiredScroller !== null && winEl !== null) {
          wiredScroller.removeEventListener('scroll', onScroll)
          winEl.removeEventListener('resize', onResize)
          if (resizeObs !== null) { resizeObs.disconnect(); resizeObs = null }
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
        if (wiredScroller === sc) { scrollerEl = sc; return true }
        unwire()
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
        return true
      }

      function tick() {
        if (railEl === null) return
        if (ensureWired() && latest.spy) latest.spy()
      }

      ctx.effect(() => () => {
        unwire()
        clearRing()
        if (hoverTimer !== null) { hoverTimer(); hoverTimer = null }
      })
      const iv = ctx.setInterval(tick, 700)
      const t0 = ctx.setTimeout(tick, 150)

      return function NavRail(props) {
        const session = props.session
        const [active, setActive] = React.useState(-1)
        const [geo, setGeo] = React.useState(null)
        const [hover, setHover] = React.useState(null)
        const [rowCount, setRowCount] = React.useState(-1)

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
        currentHover = hover
        setters.active = setActive
        setters.rowCount = setRowCount
        setters.geo = setGeo
        setters.hover = setHover
        const N = users.length

        const measure = () => {
          if (!scrollerEl || !winEl) return
          let right, top, railH
          try {
            const srect = scrollerEl.getBoundingClientRect()
            const dpr = winEl.devicePixelRatio || 1
            right = Math.round((Math.max(0, winEl.innerWidth - srect.right) + 14) * dpr) / dpr
            const m = currentUsers.length
            railH = m <= WIN ? Math.max((m - 1) * GAP + 3, 3) : Math.min(Math.max(Math.round(srect.height * 0.6), 120), 560)
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

        const positionCard = () => {
          if (cardEl === null || currentHover === null || winEl === null || hoverEl === null) return
          try {
            const r = hoverEl.getBoundingClientRect()
            const h = cardEl.offsetHeight || 140
            const top = Math.min(Math.max(r.top + r.height / 2 - h / 2, 8), winEl.innerHeight - h - 8)
            const left = Math.max(8, r.left - 8 - CARD_W)
            cardEl.style.left = left + 'px'
            cardEl.style.top = top + 'px'
          } catch (err) { /* ignore */ }
        }
        latest.position = positionCard

        React.useEffect(() => {
          ensureWired()
        }, [])

        React.useEffect(() => {
          positionCard()
        }, [hover])

        React.useEffect(() => {
          ensureWired()
          measure()
          scrollspy()
        }, [N])

        if (session === undefined || session === null || session.removed === true) return null

        const shown = N >= 2 && rowCount === N
        const railH = geo !== null ? geo.railH : 160
        const rightPx = geo !== null ? geo.right : 24
        const topPx = geo !== null ? geo.top : 120
        const dpr = (winEl && winEl.devicePixelRatio) || 1
        const yOf = (i) => N <= WIN
          ? Math.round(i * GAP * dpr) / dpr
          : Math.round(((railH - 3) * i / (N - 1)) * dpr) / dpr

        let visible = []
        if (N <= WIN) {
          for (let i = 0; i < N; i++) visible.push(i)
        } else {
          const c = active < 0 ? 0 : active
          let start = c - (WIN >> 1)
          if (start < 0) start = 0
          if (start > N - WIN) start = N - WIN
          for (let i = start; i < start + WIN; i++) visible.push(i)
        }

        const cancelHover = () => {
          if (hoverTimer !== null) { hoverTimer(); hoverTimer = null }
        }
        const armHover = (i, el) => {
          cancelHover()
          hoverTimer = ctx.setTimeout(() => {
            hoverTimer = null
            hoverEl = el
            if (setters.hover) setters.hover({ index: i })
          }, 450)
        }
        const jumpTo = (i) => {
          const u = currentUsers[i]
          const row = u === undefined ? null : rowFor(u.key)
          if (row === null || scrollerEl === null) return
          let target = 0
          try {
            const srect = scrollerEl.getBoundingClientRect()
            const rrect = row.getBoundingClientRect()
            const offset = Math.min(160, Math.max(80, Math.round(srect.height * 0.25)))
            target = Math.max(0, scrollerEl.scrollTop + (rrect.top - srect.top) - offset)
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
        }

        const card = hover === null ? null : React.createElement('div', {
          key: 'card',
          ref: (el) => { cardEl = el; positionCard() },
          className: 'dsnv-card',
          style: { left: '-9999px', top: '-9999px' },
          onPointerEnter: () => cancelHover(),
          children: [
            React.createElement('div', {
              className: 'dsnv-card-caption',
              children: '消息 ' + (hover.index + 1) + ' / ' + N + (users[hover.index] && typeof users[hover.index].time === 'number' ? ' · ' + fmtTime(users[hover.index].time) : ''),
            }),
            React.createElement('div', {
              className: 'dsnv-card-text',
              children: users[hover.index] && users[hover.index].text !== '' ? users[hover.index].text : '(无文本内容)',
            }),
          ],
        })

        return React.createElement('div', {
          ref: (el) => { railEl = el },
          className: 'dsnv-rail' + (shown ? ' dsnv-on' : ''),
          role: 'navigation',
          'aria-label': '消息导航',
          style: { right: rightPx + 'px', top: topPx + 'px', height: railH + 'px' },
          onMouseLeave: () => {
            cancelHover()
            hoverTimer = ctx.setTimeout(() => { hoverTimer = null; hoverEl = null; if (setters.hover) setters.hover(null) }, 220)
          },
        }, [
          ...visible.map((i) => React.createElement('button', {
            key: users[i].key,
            type: 'button',
            className: 'dsnv-dot' + (i === active ? ' dsnv-on' : ''),
            style: { top: yOf(i) + 'px' },
            'aria-label': '跳转到第 ' + (i + 1) + ' 条用户消息',
            onClick: () => jumpTo(i),
            onPointerEnter: (e) => armHover(i, e.currentTarget),
          })),
          card,
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
