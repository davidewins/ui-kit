// Gallery (TAK-1491): SELLERS' server routes answered from fixtures.
import { makeFixtureFetch } from "@/gallery/fixtureFetch";
import { MODULES } from "@/apps/sellers/fixtures";

export const fixtureFetch = makeFixtureFetch([
  [/\/vendors\/[^/]+\/me\/permissions$/, () => ({ permissions: [], isOwner: true, role: "owner", scope: "vendor_wide" })],
  [/\/vendors\/[^/]+\/modules$/, () => ({ modules: MODULES })],
]);
