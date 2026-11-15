// Gallery-only: every page in ZESTY, in one place. The home page, the
// compartment index pages, search and the root layout's header titles all
// read from here, and scripts/check-routes.mjs fails if a route file is
// missing from this list (or listed but missing on disk).
import {
  AppWindow,
  FileLock,
  ScrollText,
  Bell,
  Bike,
  Blocks,
  ChartColumn,
  ChartLine,
  CircleCheck,
  CircleDot,
  Columns2,
  Contact,
  Cpu,
  Disc,
  Ellipsis,
  FormInput,
  Gauge,
  GalleryHorizontal,
  Hand,
  Image,
  Inbox,
  KeyRound,
  Layers,
  LayoutGrid,
  LayoutList,
  Link,
  List,
  ListCollapse,
  ListTree,
  LogIn,
  Mail,
  MessageSquare,
  MousePointerClick,
  Navigation,
  Package,
  Palette,
  PanelBottom,
  PanelTop,
  Plus,
  Receipt,
  RefreshCw,
  Rows3,
  Ruler,
  Search,
  Share,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  Store,
  Tag,
  TextCursorInput,
  Timer,
  ToggleRight,
  Type,
  User,
  Volume2,
  Wallet,
  Calendar,
  Pipette,
  Minus,
  MessageCircleWarning,
  Loader,
  CircleAlert,
  Settings2,
  Dumbbell,
  Trophy,
  Activity,
  ShoppingCart,
  CalendarDays,
  CalendarPlus,
  Users,
  Clock,
  UserPen,
  Wand,
  Clapperboard,
  Music,
  Megaphone,
  type LucideIcon,
} from "lucide-react-native";

export type Kind = "foundations" | "components" | "screens";

export interface Section {
  id: string;
  kind: Kind;
  title: string;
  Icon: LucideIcon;
  /** The compartment's own index route. */
  route: string;
}

export interface Entry {
  title: string;
  /** The page's own header title, when the catalog title describes the
   *  variant ("Tracking, arriving now") rather than naming the page. */
  header?: string;
  /** Expo Router route name (file path under src/app without .tsx). */
  route: string;
  /** Link target when the route has params. Defaults to "/" + route. */
  href?: string;
  section: string;
  Icon: LucideIcon;
  /** Extra search terms: the @expo/ui and kit names on the page. */
  keywords?: string;
  /** Screen states (loaded, empty, sold out...). The compartment lists one row
   *  per state and opens the page with ?state=, so the page itself carries no
   *  switch and looks exactly as it would in an app. */
  states?: readonly string[];
}

const s = (kind: Kind, id: string, title: string, Icon: LucideIcon): Section => ({
  id,
  kind,
  title,
  Icon,
  route: kind === "foundations" ? "foundations/index" : `${kind}/${id}/index`,
});

export const SECTIONS: Section[] = [
  s("foundations", "foundations", "Foundations", Palette),
  s("components", "actions", "Actions", MousePointerClick),
  s("components", "inputs", "Inputs", TextCursorInput),
  s("components", "lists", "Lists", List),
  s("components", "feedback", "Feedback", Bell),
  s("components", "overlays", "Overlays", SquareStack),
  s("components", "navigation", "Navigation", Navigation),
  s("components", "surfaces", "Surfaces", Layers),
  s("components", "layout", "Layout", LayoutGrid),
  s("components", "data", "Data and media", ChartColumn),
  s("components", "native", "Native hosts", Cpu),
  s("screens", "fitness", "Fitness", Dumbbell),
  s("screens", "money", "Money", Wallet),
  s("screens", "orders", "Orders", Package),
  s("screens", "shop", "Shop", ShoppingBag),
  s("screens", "calendar", "Calendar", CalendarDays),
  s("screens", "social", "Social", Megaphone),
  s("screens", "bookings", "Bookings", Clock),
  s("screens", "profile", "Account and settings", User),
  s("screens", "motion", "Transitions", Clapperboard),
  s("screens", "sign-in", "Sign in", LogIn),
  s("screens", "account", "Account (copied from the apps)", User),
  s("screens", "selling", "Selling (SELLERS)", Store),
  s("screens", "ordering", "Ordering (VOID)", ShoppingBag),
  s("screens", "delivering", "Delivering (RIDERS)", Bike),
  s("screens", "patterns", "Patterns", Blocks),
];

const c = (section: string, slug: string, title: string, Icon: LucideIcon, keywords?: string): Entry => ({
  title,
  route: `components/${section}/${slug}`,
  section,
  Icon,
  keywords,
});

export const ENTRIES: Entry[] = [
  // Foundations
  { title: "Colours", route: "foundations/colours", section: "foundations", Icon: Palette, keywords: "tokens colors" },
  { title: "Type", route: "foundations/type", section: "foundations", Icon: Type, keywords: "geist font" },
  { title: "Spacing and radius", route: "foundations/tokens", section: "foundations", Icon: Ruler, keywords: "tokens radius gutter haptics" },

  // Actions
  c("actions", "buttons", "Buttons", MousePointerClick, "Button NativeButton GlassButton PillButton swiftui"),
  c("actions", "material-buttons", "Native button styles", MousePointerClick, "compose FilledTonalButton OutlinedButton ElevatedButton IconButton ToggleButton SplitButtonLayout"),
  c("actions", "header-menu", "Header menu", Ellipsis, "ActionMenu toolbar"),
  c("actions", "menu", "Menu", Ellipsis, "Menu DropdownMenu SelectableDropdownMenuItem DropdownMenuGroup"),
  c("actions", "context-menu", "Context menu", Hand, "ContextMenu long press DropdownMenu"),
  c("actions", "share-link", "Share link", Share, "ShareLink share sheet"),
  c("actions", "link", "Link", Link, "Link url open"),
  c("actions", "control-group", "Control group", Columns2, "ControlGroup"),
  c("actions", "floating-action-button", "Floating action button", Plus, "FloatingActionButton SmallFloatingActionButton LargeFloatingActionButton ExtendedFloatingActionButton HorizontalFloatingToolbar fab"),

  // Inputs
  c("inputs", "input", "Input", TextCursorInput, "Input TextInput"),
  c("inputs", "text-field", "Native text field", FormInput, "NativeTextField TextField SecureField OutlinedTextField BasicTextField password"),
  c("inputs", "switch", "Switch", ToggleRight, "Switch Toggle SyncToggle SyncSwitch"),
  c("inputs", "checkbox", "Checkbox", CircleCheck, "Checkbox TriStateCheckbox"),
  c("inputs", "radio-group", "Radio group", CircleDot, "RadioGroup RadioButton"),
  c("inputs", "chips", "Chips", Tag, "FilterChip Chip AssistChip InputChip SuggestionChip"),
  c("inputs", "picker", "Picker", LayoutList, "Picker PickerRow ExposedDropdownMenuBox wheel menu inline"),
  c("inputs", "segmented", "Segmented control", Columns2, "SegmentedControl SingleChoiceSegmentedButtonRow MultiChoiceSegmentedButtonRow SegmentedButton"),
  c("inputs", "slider", "Slider", SlidersHorizontal, "Slider SliderRow VerticalSlider"),
  c("inputs", "stepper", "Stepper", Minus, "Stepper StepperRow"),
  c("inputs", "date-picker", "Date picker", Calendar, "DatePicker DateRow DateTimePicker DateRangePicker DatePickerDialog TimePickerDialog"),
  c("inputs", "color-picker", "Colour picker", Pipette, "ColorPicker ColorRow"),
  c("inputs", "select-rows", "Select rows", Rows3, "SelectRow CheckRow onboarding"),

  // Lists
  c("lists", "settings-rows", "Settings rows", List, "SettingsRow SettingsGroup"),
  c("lists", "list", "List", LayoutList, "List ForEach LazyColumn ListItem onDelete onMove"),
  c("lists", "swipe-actions", "Swipe actions", Hand, "SwipeActions"),
  c("lists", "form", "Form and sections", Settings2, "Form Section LabeledContent"),
  c("lists", "disclosure", "Disclosure", ListCollapse, "Disclosure DisclosureGroup AnimatedVisibility collapsible"),
  c("lists", "lazy-stacks", "Lazy stacks", ListTree, "LazyVStack LazyHStack LazyRow LazyColumn"),
  c("lists", "carousel", "Carousel", GalleryHorizontal, "Carousel HorizontalMultiBrowseCarousel HorizontalCenteredHeroCarousel HorizontalUncontainedCarousel"),
  c("lists", "pager", "Pager", GalleryHorizontal, "HorizontalPager TabView page"),
  c("lists", "pull-to-refresh", "Pull to refresh", RefreshCw, "PullToRefreshBox refreshable RefreshControl"),

  // Feedback
  c("feedback", "states", "Empty, loading and error", Inbox, "EmptyState LoadErrorState Skeleton"),
  c("feedback", "badges-and-toasts", "Badges and toasts", Tag, "Badge CountBadge Toast"),
  c("feedback", "status-badges", "Status badges", Tag, "Badge status"),
  c("feedback", "toast-sounds", "Toast sounds", Volume2, "sound toast"),
  c("feedback", "content-unavailable", "Content unavailable", Inbox, "ContentUnavailable ContentUnavailableView empty"),
  c("feedback", "gauge", "Gauge", Gauge, "Gauge CircularProgressIndicator capacity"),
  c("feedback", "progress", "Progress", Loader, "ProgressView ProgressBar LinearProgressIndicator CircularProgressIndicator LinearWavyProgressIndicator CircularWavyProgressIndicator LoadingIndicator ContainedLoadingIndicator"),
  c("feedback", "snackbar", "Snackbar", MessageSquare, "Snackbar SnackbarHost"),
  c("feedback", "badge", "Native badge", Disc, "Badge BadgedBox badge modifier"),
  c("feedback", "tooltip", "Tooltip", MessageCircleWarning, "TooltipBox PlainTooltip RichTooltip"),

  // Overlays
  c("overlays", "sheet", "Sheet", PanelBottom, "Sheet BottomSheet ModalBottomSheet"),
  c("overlays", "confirm-dialog", "Confirm dialog", CircleAlert, "ConfirmDialog Alert ConfirmationDialog AlertDialog BasicAlertDialog"),
  c("overlays", "popover", "Popover", MessageSquare, "Popover DropdownMenu"),

  // Navigation
  c("navigation", "navigation-stack", "Navigation stack", Navigation, "NavigationStack NavigationLink NavigationDestination"),
  c("navigation", "split-view", "Split view", Columns2, "NavigationSplitView"),
  c("navigation", "tab-view", "Tabs", AppWindow, "TabView Tab NavigationBar NavigationBarItem"),
  c("navigation", "toolbar", "Toolbar and app bar", PanelTop, "Toolbar ToolbarItem TopAppBar HorizontalFloatingToolbar"),
  c("navigation", "search", "Search", Search, "searchable SearchBar DockedSearchBar headerSearchBarOptions"),
  c("navigation", "page-types", "Page types", SquareStack, "presentation card push modal formSheet pageSheet fullScreenModal transparentModal containedModal containedTransparentModal sheetAllowedDetents fitToContents"),

  // Surfaces
  c("surfaces", "card-and-tile", "Card, Tile and glass", Layers, "Card Tile GlassSurface"),
  c("surfaces", "liquid-glass", "Liquid Glass", Sparkles, "GlassEffectContainer glassEffect"),
  c("surfaces", "sticky-footer", "Sticky footer", PanelBottom, "footer"),
  c("surfaces", "material-surfaces", "Material surfaces", SquareStack, "Card ElevatedCard OutlinedCard Surface"),

  // Layout
  c("layout", "layout", "Layout", LayoutGrid, "VStack HStack ZStack Spacer Divider Grid ScrollView Group Overlay Background Mask Shapes Rectangle RoundedRectangle Circle Capsule Ellipse UnevenRoundedRectangle ConcentricRectangle Namespace withAnimation Row Column Box FlowRow Shape AnimatedVisibility CompositionLocalProvider HorizontalDivider VerticalDivider"),

  // Data and media
  c("data", "chart", "Chart", ChartLine, "Chart line bar area pie point rectangle Sparkline"),
  c("data", "text-and-label", "Text and label", Type, "Text Label typography markdown timer"),
  c("data", "image-and-icon", "Image and icon", Image, "Image Icon IconButton SF Symbol material symbol"),

  // Native hosts
  c("native", "host", "Host and RNHostView", Cpu, "Host RNHostView SwiftHost ComposeHost"),
  c("native", "native-state", "Native state", Timer, "useNativeState SyncToggle SyncSwitch worklet"),

  // Transitions
  { title: "Apple zoom", route: "screens/motion/zoom", section: "motion", Icon: Music, keywords: "AppleZoom zoom transition Link.Preview peek menu native apple music" },
  { title: "Push styles", route: "screens/motion/push-styles", section: "motion", Icon: Navigation, keywords: "animation fade slide_from_bottom simple_push native stack" },
  { title: "Transition lab", route: "screens/motion/lab/index", href: "/screens/motion/lab", section: "motion", Icon: Wand, keywords: "react-native-screen-transitions shared element bounds zoom presets sheet snap points card stack" },

  // Screens built to look like the best app at each job, on kit components
  // (charts, rings, calendars, timelines, bubbles). src/screens holds them.
  { title: "Today", route: "screens/fitness/today", section: "fitness", Icon: Activity, keywords: "ActivityRings Sparkline Trend rings home goals week" },
  { title: "Live workout", header: "Lower body power", route: "screens/fitness/session", section: "fitness", Icon: Timer, keywords: "rest timer ActivityRings sets heart rate" },
  { title: "Workout summary", header: "Lower body power", route: "screens/fitness/summary", section: "fitness", Icon: Trophy, keywords: "LineChart SegmentBar BarList heart rate zones records" },
  { title: "Progress", route: "screens/fitness/progress", section: "fitness", Icon: ChartLine, keywords: "Heatmap BarChart LineChart BarList consistency volume one-rep max" },
  { title: "Balance", route: "screens/money/balance", section: "money", Icon: Wallet, keywords: "LineChart IconTile Chip transactions payout scrub" },
  { title: "Sales today", header: "Today", route: "screens/money/sales", section: "money", Icon: ChartColumn, keywords: "BarChart SegmentBar BarList Badge forecast channels" },
  { title: "Spending", header: "October", route: "screens/money/spending", section: "money", Icon: Disc, keywords: "DonutChart LineChart Heatmap comparison busy hours" },
  { title: "Rider earnings", header: "Earnings", route: "screens/money/earnings", section: "money", Icon: Bike, keywords: "BarChart SegmentBar ProgressBar goal trips tips RIDERS" },
  { title: "Orders", route: "screens/orders/list", section: "orders", Icon: Receipt, keywords: "ThumbStack StepTracker history reorder" },
  { title: "Tracking, courier timeline", header: "Order", route: "screens/orders/track-timeline", section: "orders", Icon: Package, keywords: "Timeline StepTracker BrandMark CopyButton DPD Visa" },
  { title: "Tracking, arriving now", header: "On its way", route: "screens/orders/track-live", section: "orders", Icon: Bike, keywords: "QuickActions Avatar handover code ETA rider" },
  { title: "Receipt", route: "screens/orders/receipt", section: "orders", Icon: Receipt, keywords: "TicketCard BrandMark CopyButton VAT totals" },
  { title: "Order on one screen", header: "Order", route: "screens/orders/compact", section: "orders", Icon: Rows3, keywords: "dense compact VOID StepTracker" },
  { title: "Product, photo gallery", header: "", route: "screens/orders/product-gallery", section: "shop", Icon: Image, keywords: "Carousel Chip reviews sizes stock" },
  { title: "Product, editorial", header: "", route: "screens/orders/product-editorial", section: "shop", Icon: Type, keywords: "PhotoCard glass story specs" },
  { title: "Month", header: "Calendar", route: "screens/calendar/month", section: "calendar", Icon: Calendar, keywords: "MonthGrid posts TKVR social calendar" },
  { title: "Week", header: "Calendar", route: "screens/calendar/week", section: "calendar", Icon: Columns2, keywords: "WeekGrid hours now line" },
  { title: "Day", header: "Calendar", route: "screens/calendar/day", section: "calendar", Icon: CalendarDays, keywords: "DayTimeline WeekStrip bookings salon overlap" },
  { title: "List", header: "Calendar", route: "screens/calendar/agenda", section: "calendar", Icon: LayoutList, keywords: "AgendaList agenda two weeks" },
  { title: "Team day", header: "Calendar", route: "screens/calendar/team", section: "calendar", Icon: Users, keywords: "DayTimeline columns staff resource view" },
  { title: "Account, profile", route: "screens/social/account-profile", section: "social", Icon: User, keywords: "Avatar MediaGrid IconTabs posts TKVR instagram" },
  { title: "Account, insights", route: "screens/social/account-insights", section: "social", Icon: ChartLine, keywords: "LineChart BarChart DonutChart Heatmap followers reach best times" },
  { title: "Account, timeline", route: "screens/social/account-feed", section: "social", Icon: Megaphone, keywords: "post cards results failed retry SegmentBar" },
  { title: "Inbox", route: "screens/social/inbox", section: "social", Icon: Inbox, keywords: "ConversationRow DMs unread networks" },
  { title: "Conversation", route: "screens/social/thread", section: "social", Icon: MessageSquare, keywords: "MessageBubble Composer chat thread" },
  { title: "Activity", route: "screens/social/activity", section: "social", Icon: Bell, keywords: "AvatarStack likes comments follows mentions" },
  { title: "Choose a plan", header: "Set up", route: "screens/profile/plan", section: "profile", Icon: Sparkles, keywords: "SelectRow GlassGroup InsetShell SegmentedControl pricing onboarding" },

  // Demo apps: built only from kit components, one idiom across all of them.
  { title: "Workouts", route: "screens/fitness/workouts", section: "fitness", Icon: Dumbbell, keywords: "library grid chips", states: ["Loaded", "Loading", "No results"] },
  { title: "Workout", route: "screens/fitness/workout/[id]", href: "/screens/fitness/workout/lower-power", section: "fitness", Icon: Dumbbell, keywords: "detail exercises", states: ["Not started", "In your plan", "Done today"] },
  { title: "New workout", route: "screens/fitness/new-workout", section: "fitness", Icon: Plus, keywords: "create modal" },
  { title: "Shop", route: "screens/shop/home", section: "shop", Icon: Store, keywords: "ecommerce home grid", states: ["Loaded", "Loading", "Couldn't load"] },
  { title: "Product", route: "screens/shop/product/[id]", href: "/screens/shop/product/pace", section: "shop", Icon: Tag, keywords: "sizes carousel", states: ["In stock", "Sold out"] },
  { title: "Bag and checkout", route: "screens/shop/basket", section: "shop", Icon: ShoppingCart, keywords: "basket cart checkout VOID BasketFooter" },
  { title: "Schedule", route: "screens/bookings/schedule", section: "bookings", Icon: CalendarDays, keywords: "day appointments salon", states: ["Busy", "Loading", "Day off"] },
  { title: "Booking", route: "screens/bookings/booking/[id]", href: "/screens/bookings/booking/b2", section: "bookings", Icon: Clock, keywords: "appointment detail check in", states: ["Confirmed", "Checked in", "Cancelled"] },
  { title: "New booking", route: "screens/bookings/new-booking", section: "bookings", Icon: CalendarPlus, keywords: "create slots modal" },
  { title: "Clients", route: "screens/bookings/clients", section: "bookings", Icon: Users, keywords: "customers search", states: ["Loaded", "Loading", "Empty"] },
  { title: "Opening hours", route: "screens/bookings/hours", section: "bookings", Icon: Clock, keywords: "availability rules" },
  { title: "Account", route: "screens/profile/account", section: "profile", Icon: User, keywords: "profile settings sign out", states: ["Signed in", "Email not verified"] },
  { title: "Edit details", route: "screens/profile/edit-profile", section: "profile", Icon: UserPen, keywords: "profile form" },
  { title: "Notifications", route: "screens/profile/notifications", section: "profile", Icon: Bell, keywords: "push email quiet hours", states: ["Allowed", "Off in Settings"] },
  { title: "Privacy and data", route: "screens/profile/privacy", section: "profile", Icon: ShieldCheck, keywords: "gdpr export delete account", states: ["Default", "Preparing export", "Export ready"] },
  { title: "Terms", route: "screens/profile/terms", section: "profile", Icon: ScrollText, keywords: "legal LegalScreen terms of service" },
  { title: "Privacy policy", route: "screens/profile/privacy-policy", section: "profile", Icon: FileLock, keywords: "legal LegalScreen" },

  // Screens
  { title: "Welcome", route: "screens/sign-in/welcome", section: "sign-in", Icon: Sparkles, keywords: "VOID auth" },
  { title: "Email", route: "screens/sign-in/email", section: "sign-in", Icon: Mail, keywords: "VOID auth" },
  { title: "Verify code", route: "screens/sign-in/verify-code", href: "/screens/sign-in/verify-code?email=aoife%40example.com", section: "sign-in", Icon: KeyRound, keywords: "VOID otp" },
  { title: "Forgot password", route: "screens/sign-in/forgot-password", section: "sign-in", Icon: KeyRound, keywords: "SELLERS" },
  { title: "Notifications", route: "screens/account/notifications", section: "account", Icon: Bell, keywords: "VOID profile" },
  { title: "GDPR", route: "screens/account/gdpr", section: "account", Icon: ShieldCheck, keywords: "SELLERS privacy" },
  { title: "Country code", route: "screens/account/country-code", section: "account", Icon: Contact, keywords: "phone" },
  { title: "Product details", route: "screens/selling/product/[id]", href: "/screens/selling/product/6b6c5dd2-5920-4a5e-b6d9-0d6ef8b11288", section: "selling", Icon: Package, keywords: "SELLERS" },
  { title: "Analytics", route: "screens/selling/analytics", section: "selling", Icon: ChartLine, keywords: "SELLERS" },
  { title: "Storefronts", route: "screens/selling/storefronts", section: "selling", Icon: Store, keywords: "SELLERS" },
  { title: "Orders", route: "screens/ordering/orders", section: "ordering", Icon: Receipt, keywords: "VOID" },
  { title: "Order on the way", route: "screens/ordering/order/[id]", href: "/screens/ordering/order/order-1", section: "ordering", Icon: Bike, keywords: "VOID tracking" },
  { title: "Earnings", route: "screens/delivering/earnings", section: "delivering", Icon: Wallet, keywords: "RIDERS" },
  { title: "Active delivery", route: "screens/delivering/delivery/[id]", href: "/screens/delivering/delivery/demo", section: "delivering", Icon: Bike, keywords: "RIDERS" },
  { title: "Store settings", route: "screens/patterns/store-settings", section: "patterns", Icon: Settings2, keywords: "native controls" },
  { title: "List", route: "screens/patterns/list", section: "patterns", Icon: List, states: ["Loaded", "Loading", "Empty"] },
  { title: "Detail with sticky footer", route: "screens/patterns/detail", section: "patterns", Icon: Type },
  { title: "Edit", route: "screens/patterns/edit", section: "patterns", Icon: TextCursorInput },
  { title: "Create (modal)", route: "screens/patterns/create", section: "patterns", Icon: PanelBottom },
];

// Routes that are reached from other pages, not listed in a compartment: the
// push styles' destination, and the transition lab's own stack (a nested
// Blank Stack, so the root stack registers only "screens/motion/lab").
export const UNLISTED_ROUTES = [
  { route: "screens/motion/push-target" },
  { route: "screens/motion/playlist/[id]" },
  { route: "screens/motion/lab/photo/[id]" },
  { route: "screens/motion/lab/playlist/[id]" },
  { route: "screens/motion/lab/sheet" },
  { route: "screens/motion/lab/stack" },
  { route: "screens/motion/lab/preset-slide-top" },
  { route: "screens/motion/lab/preset-zoom-in" },
  { route: "screens/motion/lab/preset-slide-bottom" },
  { route: "screens/motion/lab/preset-draggable" },
  { route: "screens/motion/lab/preset-elastic" },
];
export const NESTED_STACKS = ["screens/motion/lab"];

// The screens the Page types page opens, one per expo-router presentation.
// Not compartment rows: the root layout declares each on the Stack with its
// own presentation, and the Page types page links to them.
export const PAGE_TYPES = {
  card: { title: "Push", route: "components/navigation/page-types/card" },
  modal: { title: "Modal", route: "components/navigation/page-types/modal" },
  formSheet: { title: "Form sheet", route: "components/navigation/page-types/form-sheet" },
  fittedFormSheet: { title: "Fitted form sheet", route: "components/navigation/page-types/fitted-form-sheet" },
  pageSheet: { title: "Page sheet", route: "components/navigation/page-types/page-sheet" },
  fullScreenModal: { title: "Full screen modal", route: "components/navigation/page-types/full-screen-modal" },
  transparentModal: { title: "Transparent modal", route: "components/navigation/page-types/transparent-modal" },
  containedModal: { title: "Contained modal", route: "components/navigation/page-types/contained-modal" },
  containedTransparentModal: { title: "Contained transparent modal", route: "components/navigation/page-types/contained-transparent-modal" },
} as const;

export type PageType = keyof typeof PAGE_TYPES;

export const hrefOf = (e: Entry, state?: string) => {
  const base = e.href ?? `/${e.route}`;
  return state ? `${base}${base.includes("?") ? "&" : "?"}state=${encodeURIComponent(state)}` : base;
};
export const sectionHref = (sec: Section) => `/${sec.route.replace(/\/index$/, "")}`;
export const entriesIn = (id: string) => ENTRIES.filter((e) => e.section === id);
export const sectionById = (id: string) => SECTIONS.find((sec) => sec.id === id)!;

export function search(query: string): Entry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return ENTRIES.filter((e) =>
    `${e.title} ${e.keywords ?? ""} ${sectionById(e.section).title}`.toLowerCase().includes(q),
  );
}
