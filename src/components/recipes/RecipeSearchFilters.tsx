"use client";

/**
 * RecipeSearchFilters — Filter bar for search query, diet, max ready time, and max calories.
 */

import { Search, Filter, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dietaryPreferenceOptions } from "@/lib/validations/profile";

interface RecipeSearchFiltersProps {
  query: string;
  onQueryChange: (query: string) => void;
  diet: string;
  onDietChange: (diet: string) => void;
  maxReadyTime: string;
  onMaxReadyTimeChange: (time: string) => void;
  maxCalories: string;
  onMaxCaloriesChange: (calories: string) => void;
  onReset: () => void;
}

export function RecipeSearchFilters({
  query,
  onQueryChange,
  diet,
  onDietChange,
  maxReadyTime,
  onMaxReadyTimeChange,
  maxCalories,
  onMaxCaloriesChange,
  onReset,
}: RecipeSearchFiltersProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Name Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by recipe name..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-10 rounded-xl pl-9 bg-background border-border/80 text-xs"
          />
        </div>

        {/* Diet Filter */}
        <Select value={diet} onValueChange={(val: any) => val && onDietChange(val)}>
          <SelectTrigger className="h-10 rounded-xl bg-background border-border/80 text-xs">
            <SelectValue placeholder="All Diets" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All Diets</SelectItem>
            {dietaryPreferenceOptions
              .filter((d) => d !== "NONE")
              .map((d) => (
                <SelectItem key={d} value={d.toLowerCase()}>
                  {d.replace("_", " ")}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        {/* Max Ready Time */}
        <Select value={maxReadyTime} onValueChange={(val: any) => val && onMaxReadyTimeChange(val)}>
          <SelectTrigger className="h-10 rounded-xl bg-background border-border/80 text-xs">
            <SelectValue placeholder="Any Cooking Time" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">Any Cooking Time</SelectItem>
            <SelectItem value="15">15 mins or less</SelectItem>
            <SelectItem value="30">30 mins or less</SelectItem>
            <SelectItem value="45">45 mins or less</SelectItem>
            <SelectItem value="60">60 mins or less</SelectItem>
          </SelectContent>
        </Select>

        {/* Max Calories */}
        <Select value={maxCalories} onValueChange={(val: any) => val && onMaxCaloriesChange(val)}>
          <SelectTrigger className="h-10 rounded-xl bg-background border-border/80 text-xs">
            <SelectValue placeholder="Any Calorie Target" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">Any Calorie Target</SelectItem>
            <SelectItem value="400">Under 400 kcal</SelectItem>
            <SelectItem value="500">Under 500 kcal</SelectItem>
            <SelectItem value="600">Under 600 kcal</SelectItem>
            <SelectItem value="700">Under 700 kcal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Indicators & Reset Button */}
      {(query || diet !== "all" || maxReadyTime !== "all" || maxCalories !== "all") && (
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <Filter className="h-3.5 w-3.5 text-primary" /> Active filters applied
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 text-xs font-semibold text-destructive hover:bg-destructive/10"
          >
            <RotateCcw className="mr-1 h-3 w-3" /> Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
