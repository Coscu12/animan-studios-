// sets/util.js — shared helpers for template shots: word-synced keys, outfit lookup, fade-out.
import { E, wordTime, clamp } from '/engine/core.js';
import * as C from '../cast.js';
export const WHO = { TU: C.TU, ANCESTRO: C.ANCESTRO, BERRIDGE: C.BERRIDGE, SCHULTZ: C.SCHULTZ, LUCIA: C.LUCIA, SKINNER: C.SKINNER, LEMBKE: C.LEMBKE, MARK: C.MARK, LEROY: C.LEROY, AMIGO: C.AMIGO, TRIBE: C.TRIBE };
// seconds into the shot when `word` is spoken (number = fixed time)
export const wt = (w, info, d = 0.3) => typeof w === 'number' ? w : (wordTime(w, info.shot.start - 0.05) ?? info.shot.start + d) - info.shot.start;
// [[word|time, value], ...] -> value active at t
export function at(t, info, keys, def) { let v = def; for (const [w, val] of keys || []) if (t >= wt(w, info) - 0.12) v = val; return v; }
export const outA = (t, info, d = 0.3) => clamp((info.dur - t) / d);
export const rngT = (n) => { let s = n; return () => ((s = (s * 16807) % 2147483647) / 2147483647); };
