/**
 * dsh-plugin-msg-nav browser half: registers the conversation node navigation
 * rail into the `conversation.composer.dock` slot.
 *
 * Data source, fastest first:
 * 1. `useProjection("msgNavMessages")` — host-folded complete user-message
 *    list (instant, zero page pulls); window rows are matched by message id.
 * 2. Loaded chat-window nodes — fallback when the projection is absent.
 * 3. Background `loadOlder` loop — fallback only (stops once the projection
 *    delivers); click-to-jump loads pages on demand for out-of-window nodes.
 *
 * Services:
 * - `slots`    — slot registration surface
 * - `timer`    — lifecycle-safe interval/timeout utilities
 * - `sessions` — session face lookup (`binding(sessionId).session`) used by
 *   the fallback full-history loader and the on-demand jump loader
 */
/** Plugin service declaration (Loader activation gating). */
export declare const inject: readonly string[];
/** Registers the rail UI. */
export declare function apply(ctx: unknown): void;
