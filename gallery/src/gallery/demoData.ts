// Gallery-only: the realistic content the component demos share, from the
// apps' own world (VOID ordering, SELLERS stores, RIDERS deliveries).
export const STORE = { name: "Bao House", area: "Swords", url: "https://void.ie/s/bao-house" };

export const ORDERS = [
  { id: "1042", customer: "Aoife Byrne", items: "2x Pork belly bao, Kimchi fries", total: "€24.50", status: "Preparing" },
  { id: "1043", customer: "Cian Murphy", items: "Chicken katsu bao, Bubble tea", total: "€14.90", status: "Ready" },
  { id: "1044", customer: "Niamh Kelly", items: "3x Tofu bao, Edamame", total: "€21.00", status: "On the way" },
  { id: "1045", customer: "Seán O'Brien", items: "Bao box for two", total: "€38.00", status: "Delivered" },
] as const;

export const MENU = [
  { name: "Pork belly bao", price: "€6.50", tag: "Bestseller" },
  { name: "Chicken katsu bao", price: "€6.00", tag: "Spicy" },
  { name: "Crispy tofu bao", price: "€5.50", tag: "Vegan" },
  { name: "Kimchi fries", price: "€5.00", tag: "Sides" },
  { name: "Brown sugar bubble tea", price: "€4.90", tag: "Drinks" },
] as const;

export const STORES = [
  { name: "Bao House", meta: "Asian street food, 20 to 30 min" },
  { name: "Pizza Nova", meta: "Wood-fired pizza, 25 to 35 min" },
  { name: "Green Bowl", meta: "Salads and bowls, 15 to 25 min" },
  { name: "Taco Loco", meta: "Mexican, 20 to 30 min" },
] as const;

export const SALES_WEEK = [
  { x: "Mon", y: 412 },
  { x: "Tue", y: 388 },
  { x: "Wed", y: 455 },
  { x: "Thu", y: 520 },
  { x: "Fri", y: 790 },
  { x: "Sat", y: 910 },
  { x: "Sun", y: 640 },
];

export const PREP_TIMES = ["10 min", "15 min", "20 min", "30 min"] as const;
export const SLOTS = ["ASAP", "18:00 to 18:30", "18:30 to 19:00", "19:00 to 19:30"] as const;
export const DIETARY = ["Vegan", "Gluten free", "Halal", "Spicy"] as const;

// Page types (components/navigation/page-types): what each expo-router
// presentation is, when to use it, how it closes, and what Android does.
// `android` is null where Android matches iOS.
export const PAGE_TYPE_COPY = {
  card: {
    what: 'presentation: "card", the default. The screen slides in from the side over the current one, with a back button.',
    when: "Going deeper into something and coming back: an order, a product, a setting.",
    dismiss: "Tap back in the header or swipe from the left edge. On Android, the back gesture or button.",
    android: null,
  },
  modal: {
    what: 'presentation: "modal". On iOS a card slides up from the bottom and the page behind it stays visible at the top.',
    when: "A task that starts and ends here: create a product, add a note. VOID and SELLERS use it for create flows.",
    dismiss: "Swipe down, or tap Done.",
    android: "Android pushes it like a normal screen. There is no card look.",
  },
  formSheet: {
    what: 'presentation: "formSheet" with detents at 30, 50 and 100 percent. The native sheet, with the iOS 26 material and a grabber.',
    when: "A short choice over the page you are on: a prep time, a tip, a filter.",
    dismiss: "Swipe down past the smallest detent, or tap Done. Drag the grabber to resize.",
    android: "Android shows a Material bottom sheet: no grabber, and at most 3 detents.",
  },
  fittedFormSheet: {
    what: 'presentation: "formSheet" with sheetAllowedDetents: "fitToContents". The sheet is exactly as tall as what is in it.',
    when: "A confirm or a single choice with a known height: close the store, accept an order.",
    dismiss: "Swipe down, or tap Done.",
    android: "Android shows a Material bottom sheet sized to its content, with no grabber.",
  },
  pageSheet: {
    what: 'presentation: "pageSheet". A full-height iOS sheet. The page behind it shrinks back. No detents.',
    when: "A longer task that still feels temporary: edit a menu item, write a review.",
    dismiss: "Swipe down, or tap Done.",
    android: "Android falls back to modal, so it is pushed like a normal screen.",
  },
  fullScreenModal: {
    what: 'presentation: "fullScreenModal". Covers the whole screen. Nothing behind it shows, and swiping down does nothing.',
    when: "A flow the user finishes or quits on purpose: checkout, camera, onboarding.",
    dismiss: "Tap Done. There is no swipe to dismiss on iOS.",
    android: "Android falls back to modal: it is pushed like a normal screen and the back gesture closes it.",
  },
  transparentModal: {
    what: 'presentation: "transparentModal". The page underneath stays mounted and shows through this screen\'s transparent background.',
    when: "Your own overlay over live content: a scrim with a card, a coach mark.",
    dismiss: "Tap Done or the dimmed area.",
    android: null,
  },
  containedModal: {
    what: 'presentation: "containedModal". It covers the screen that presented it, not the whole window.',
    when: "Inside a split view or one tab, when the rest of the app stays visible. In a single stack it looks like a full screen modal.",
    dismiss: "Tap Done. There is no swipe to dismiss on iOS.",
    android: "Android falls back to modal, so it is pushed like a normal screen.",
  },
  containedTransparentModal: {
    what: 'presentation: "containedTransparentModal". Like transparentModal, but scoped to the screen that presented it.',
    when: "A transparent overlay inside one tab or pane.",
    dismiss: "Tap Done or the dimmed area.",
    android: "Android falls back to transparentModal.",
  },
} as const;
