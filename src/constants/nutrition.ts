/**
 * Nutrition constants — used in BMI/BMR/TDEE calculations
 * and macro target computations.
 */

// Activity level multipliers for TDEE = BMR × multiplier
export const ACTIVITY_MULTIPLIERS = {
  SEDENTARY: 1.2,
  LIGHTLY_ACTIVE: 1.375,
  MODERATELY_ACTIVE: 1.55,
  VERY_ACTIVE: 1.725,
  EXTRA_ACTIVE: 1.9,
} as const;

// Calorie adjustments per goal
export const GOAL_CALORIE_ADJUSTMENT = {
  WEIGHT_LOSS: -500,  // 500 kcal deficit → ~0.5kg/week loss
  WEIGHT_GAIN: +500,  // 500 kcal surplus → ~0.5kg/week gain
  MAINTENANCE: 0,
  MUSCLE_GAIN: +250,  // Moderate surplus for lean muscle gain
} as const;

// Protein targets (g per kg of body weight) per goal
export const PROTEIN_TARGETS = {
  WEIGHT_LOSS: 2.0,    // Higher protein to preserve muscle during deficit
  WEIGHT_GAIN: 1.8,
  MAINTENANCE: 1.6,
  MUSCLE_GAIN: 2.2,    // Maximum protein for muscle synthesis
} as const;

// Fat targets (g per kg of body weight)
export const FAT_TARGETS = {
  WEIGHT_LOSS: 0.8,
  WEIGHT_GAIN: 1.0,
  MAINTENANCE: 0.9,
  MUSCLE_GAIN: 0.9,
  KETO: 1.5,           // Keto requires significantly higher fat
} as const;

// BMI classification thresholds (kg/m²)
export const BMI_RANGES = {
  UNDERWEIGHT: { max: 18.5, label: "Underweight", color: "#60a5fa" },
  NORMAL: { min: 18.5, max: 24.9, label: "Normal weight", color: "#34d399" },
  OVERWEIGHT: { min: 25, max: 29.9, label: "Overweight", color: "#fbbf24" },
  OBESE: { min: 30, label: "Obese", color: "#f87171" },
} as const;

// Default daily water goal in millilitres
export const DEFAULT_WATER_GOAL_ML = 2000;

// Caloric value of macronutrients (kcal per gram)
export const KCAL_PER_GRAM = {
  PROTEIN: 4,
  CARBS: 4,
  FAT: 9,
  FIBER: 2,
} as const;

// Meal type display labels
export const MEAL_TYPE_LABELS = {
  BREAKFAST: "Breakfast",
  LUNCH: "Lunch",
  DINNER: "Dinner",
  SNACK: "Snack",
  DESSERT: "Dessert",
} as const;

// Approximate calorie distribution per meal type (% of daily calories)
export const MEAL_CALORIE_DISTRIBUTION = {
  BREAKFAST: 0.25,
  LUNCH: 0.30,
  DINNER: 0.30,
  SNACK: 0.10,
  DESSERT: 0.05,
} as const;
