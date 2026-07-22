/**
 * Application route constants.
 * Use these everywhere instead of hardcoded strings to prevent typos.
 */
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Protected — Dashboard
  DASHBOARD: "/dashboard",
  MEAL_PLANS: "/meal-plans",
  FOOD_LOG: "/food-log",
  RECIPES: "/recipes",
  NUTRITION: "/nutrition",
  ANALYTICS: "/analytics",
  PROGRESS: "/progress",
  SETTINGS: "/settings",

  // Dynamic routes
  RECIPE_DETAIL: (id: string | number) => `/recipes/${id}`,
  MEAL_PLAN_DETAIL: (id: string) => `/meal-plans/${id}`,
} as const;

/**
 * Navigation items for the sidebar/topbar
 */
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: "LayoutDashboard",
  },
  {
    label: "Meal Plans",
    href: ROUTES.MEAL_PLANS,
    icon: "CalendarDays",
  },
  {
    label: "Food Log",
    href: ROUTES.FOOD_LOG,
    icon: "ClipboardList",
  },
  {
    label: "Recipes",
    href: ROUTES.RECIPES,
    icon: "ChefHat",
  },
  {
    label: "Nutrition",
    href: ROUTES.NUTRITION,
    icon: "Apple",
  },
  {
    label: "Analytics",
    href: ROUTES.ANALYTICS,
    icon: "BarChart3",
  },
  {
    label: "Progress",
    href: ROUTES.PROGRESS,
    icon: "TrendingUp",
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: "Settings",
  },
] as const;
