// Gallery (TAK-1491): RIDERS runs in its own demo mode here, so its API reads
// come from data/demoData. Anything else gets a 404, never the network.
import { makeFixtureFetch } from "@/gallery/fixtureFetch";

export const fetchWithTimeout = makeFixtureFetch([]);
