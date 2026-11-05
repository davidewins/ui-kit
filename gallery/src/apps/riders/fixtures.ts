// Fixture data for the RIDERS pages in the gallery (TAK-1491). RIDERS has its
// own demo mode (stores/demoStore): API reads return data/demoData and writes
// are no-ops. The delivery screen gets one of its demo orders, accepted.
import { generateDemoOrder } from "@/apps/riders/data/demoData";
import { useDemoStore } from "@/apps/riders/stores/demoStore";
import { useRiderStore } from "@/apps/riders/stores/riderStore";

useDemoStore.getState().setDemoMode(true);
if (!useRiderStore.getState().activeDelivery) {
  useRiderStore.getState().setActiveDelivery({ ...generateDemoOrder(), status: "accepted" });
}
