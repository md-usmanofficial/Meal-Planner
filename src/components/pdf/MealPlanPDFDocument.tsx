import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define PDF styles using @react-pdf/renderer StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1e293b",
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#8b5cf6",
    borderBottomStyle: "solid",
    paddingBottom: 12,
    marginBottom: 15,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  brandSubtitle: {
    fontSize: 9,
    color: "#64748b",
  },
  metaRight: {
    textAlign: "right",
  },
  metaText: {
    fontSize: 9,
    color: "#64748b",
  },
  summaryCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "solid",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#64748b",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
    borderBottomStyle: "solid",
    paddingBottom: 4,
  },
  dayBlock: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#fafafa",
    borderRadius: 6,
  },
  dayHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8b5cf6",
    marginBottom: 6,
  },
  mealRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
    borderBottomStyle: "solid",
  },
  mealType: {
    width: "20%",
    fontSize: 9,
    fontWeight: "bold",
    color: "#475569",
  },
  mealTitle: {
    width: "60%",
    fontSize: 9,
    color: "#0f172a",
  },
  mealCalories: {
    width: "20%",
    fontSize: 9,
    textAlign: "right",
    color: "#f59e0b",
    fontWeight: "bold",
  },
  ingredientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 6,
  },
  ingredientItem: {
    width: "50%",
    fontSize: 8,
    color: "#334155",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    borderTopStyle: "solid",
    paddingTop: 8,
  },
});

export interface PDFMealData {
  id: string;
  mealType: string;
  recipeTitle: string;
  calories: number;
  date: string;
}

interface MealPlanPDFDocumentProps {
  planName: string;
  userName: string;
  planType: string;
  startDate: string;
  endDate: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  meals: PDFMealData[];
  ingredientsList?: string[];
}

export function MealPlanPDFDocument({
  planName,
  userName,
  planType,
  startDate,
  endDate,
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFat,
  meals,
  ingredientsList = [
    "Avocados (2 pcs)",
    "Salmon Fillets (4 x 100g)",
    "Brown Rice (500g)",
    "Quinoa (300g)",
    "Chicken Breast (600g)",
    "Fresh Kale (200g)",
    "Soy Sauce (50ml)",
    "Garlic (1 bulb)",
  ],
}: MealPlanPDFDocumentProps) {
  // Group meals by date string
  const groupedMeals: Record<string, PDFMealData[]> = {};
  meals.forEach((m) => {
    const dStr = new Date(m.date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!groupedMeals[dStr]) groupedMeals[dStr] = [];
    groupedMeals[dStr].push(m);
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>NutriPlan</Text>
            <Text style={styles.brandSubtitle}>Smart Meal Planner & Nutrition Guide</Text>
          </View>
          <View style={styles.metaRight}>
            <Text style={styles.metaText}>Prepared for: {userName}</Text>
            <Text style={styles.metaText}>Plan: {planName}</Text>
            <Text style={styles.metaText}>Duration: {startDate} - {endDate}</Text>
          </View>
        </View>

        {/* Daily Target Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Daily Calories</Text>
            <Text style={styles.summaryValue}>{targetCalories} kcal</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Protein Target</Text>
            <Text style={styles.summaryValue}>{targetProtein}g</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Carbs Target</Text>
            <Text style={styles.summaryValue}>{targetCarbs}g</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Fat Target</Text>
            <Text style={styles.summaryValue}>{targetFat}g</Text>
          </View>
        </View>

        {/* Day-by-Day Meal Breakdown */}
        <Text style={styles.sectionTitle}>Day-by-Day Meal Schedule ({planType})</Text>
        {Object.entries(groupedMeals).map(([dayDate, dayMeals]) => (
          <View key={dayDate} style={styles.dayBlock} wrap={false}>
            <Text style={styles.dayHeader}>{dayDate}</Text>
            {dayMeals.map((m) => (
              <View key={m.id} style={styles.mealRow}>
                <Text style={styles.mealType}>{m.mealType}</Text>
                <Text style={styles.mealTitle}>{m.recipeTitle}</Text>
                <Text style={styles.mealCalories}>{m.calories} kcal</Text>
              </View>
            ))}
          </View>
        ))}

        {/* Grocery Checklist */}
        <Text style={styles.sectionTitle}>Grocery & Ingredients Checklist</Text>
        <View style={styles.ingredientGrid}>
          {ingredientsList.map((ing, i) => (
            <Text key={i} style={styles.ingredientItem}>
              [ ] {ing}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated by NutriPlan — Eat Smarter, Feel Better. Page 1 of 1
        </Text>
      </Page>
    </Document>
  );
}
