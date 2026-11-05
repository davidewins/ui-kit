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
