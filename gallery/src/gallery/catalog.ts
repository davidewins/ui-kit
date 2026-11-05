// Gallery-only: every page in ZESTY, in one place. The home page, the
// compartment index pages, search and the root layout's header titles all
// read from here, and scripts/check-routes.mjs fails if a route file is
// missing from this list (or listed but missing on disk).
import {
  AppWindow,
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
  /** Expo Router route name (file path under src/app without .tsx). */
  route: string;
  /** Link target when the route has params. Defaults to "/" + route. */
  href?: string;
  section: string;
  Icon: LucideIcon;
  /** Extra search terms: the @expo/ui and kit names on the page. */
  keywords?: string;
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
  s("screens", "sign-in", "Sign in", LogIn),
  s("screens", "account", "Account", User),
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
  { title: "List", route: "screens/patterns/list", section: "patterns", Icon: List },
  { title: "Detail with sticky footer", route: "screens/patterns/detail", section: "patterns", Icon: Type },
  { title: "Edit", route: "screens/patterns/edit", section: "patterns", Icon: TextCursorInput },
  { title: "Create (modal)", route: "screens/patterns/create", section: "patterns", Icon: PanelBottom },
];

export const hrefOf = (e: Entry) => e.href ?? `/${e.route}`;
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
