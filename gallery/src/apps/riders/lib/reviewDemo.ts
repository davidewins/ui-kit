// Mirrors hq-node's REVIEW_DEMO_PHONE / DEMO_RIDER_PHONE pin in
// riderController.ts's updateLocation - those two accounts are the ones
// App Store reviewers use, pinned to Galway server-side for dispatch
// matching. This is the client-side counterpart: without it, the map and
// anything derived from the rider's live position (route origin, "center on
// user") still shows the reviewer's real device location.
// +353838044262 was in here too. That is David's own rider account, and the
// server does NOT pin it: riderController pins env.REVIEW_DEMO_PHONE and
// DEMO_RIDER_PHONE (+353871234567) only, and the DB shows that rider's real
// GPS being written normally. So the client was pinning a rider the server
// treats as live, which drew the map somewhere he was not standing and made
// RIDERS impossible to test on a real device (TAK-1193).
//
// Only the account reviewers actually use stays pinned.
const REVIEW_DEMO_PHONES = new Set(["+353871234567"]);

export const GALWAY_COORDS = { lat: 53.2724, lng: -9.0488 };

export function isReviewDemoPhone(phone: string | null | undefined): boolean {
  return !!phone && REVIEW_DEMO_PHONES.has(phone);
}
