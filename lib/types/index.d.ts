/**
 * dsh-plugin-msg-nav host half: registers the `msgNavMessages` session
 * projection unit (via the optional `sessionProjections` registry) so the
 * browser rail receives the complete user-message list instantly — no client
 * page pulls. Deployments without the registry stay unaffected; the client
 * falls back to a background `loadOlder` loop.
 */
/** Host plugin body: registers the session projection under an injected child fiber. */
export declare function apply(ctx: unknown): void;
