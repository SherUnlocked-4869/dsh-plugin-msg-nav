// Host half of dsh-plugin-msg-nav: registers the `msgNavMessages` session
// projection unit so the browser rail gets the COMPLETE user-message list
// instantly (history tail page + session/projection push frames) without the
// client pulling history pages one by one.
//
// The unit folds every direct user-sent message (and steering messages —
// both ride `user/message` events with `source.kind === "user"`, exactly as
// the chat view's node assembler classifies them; plugin/tool-injected
// context rows carry a different `source.kind` and are excluded). Each entry
// carries: seq (ordering), time, a short preview text, and the durable
// message id used by the client to match loaded chat-window rows for
// reading-position tracking and click-to-jump.
//
// Architecture reference (borrowed feature, adapted to this package):
// jjxjjjjiik-bot/dsh-chat-timeline — host sessionProjections registration.
// The registration rides `ctx.inject(["sessionProjections"], …)` so
// deployments without the registry stay unaffected (the client then falls
// back to its background loadOlder loop).

const PROJECTION_KEY = "msgNavMessages";

/**
 * Cap preview text so projection payloads stay small (200 chars is plenty
 * for the rail's single-line preview row; the client uses the full in-window
 * node content once a message is loaded).
 */
const MAX_TEXT_CHARS = 200;

/**
 * Join the text blocks of a ContentBlock list (host-side message content),
 * mirroring the client-side previewOf semantics (goal-tag strip, image
 * placeholder) so projection previews match the window previews.
 */
function textOf(content) {
  if (!Array.isArray(content)) return "";
  let out = "";
  let hasImage = false;
  for (const block of content) {
    if (block !== null && typeof block === "object" && block.type === "text" && typeof block.text === "string") out += block.text;
    else if (block !== null && typeof block === "object" && block.type === "image") hasImage = true;
  }
  const cleaned = out.replace(/^\s*<\s*goal_[a-z_]*\s*>\s*/i, "");
  const trimmed = cleaned.trim().slice(0, MAX_TEXT_CHARS);
  return trimmed !== "" ? trimmed : (hasImage ? "[图片消息]" : "");
}

const MessageIndexSchema = {
  parse: (val) => val
};

const messageIndexProjectionDefinition = {
  key: PROJECTION_KEY,
  schema: MessageIndexSchema,
  init: () => ({ messages: [] }),
  apply: (state, event) => {
    // Only direct user-sent messages shape the rail. Plugin- and tool-injected
    // context also rides `user/message` events but with a different
    // `source.kind` (job completions, tool notices, cron notifications,
    // agent.inject context...) — context rows, not user turns, so they are
    // excluded exactly as the chat view's node assembler classifies them.
    if (event.type === "user/message") {
      const data = event.data;
      if (data.source === null || typeof data.source !== "object" || data.source.kind !== "user") return state;
      const text = textOf(data.content);
      const entry = { seq: event.seq, time: event.time, text, ...(typeof data.id === "string" ? { id: data.id } : {}) };
      return { messages: [...state.messages, entry] };
    }
    // Compaction does not remove user messages (dsh renders a compaction
    // marker but keeps the transcript above it), so no event removes entries.
    return state;
  },
  view: (state) => state,
  stateVersion: 1
};

function apply(ctx) {
  ctx.inject(["sessionProjections"], (projectionCtx) => {
    projectionCtx.sessionProjections.register(messageIndexProjectionDefinition);
  });
}

export { apply };
