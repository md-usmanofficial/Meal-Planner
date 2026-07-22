"use client";

/**
 * RecipePickerModal — Interactive recipe search & selection modal.
 * Dynamically queries Spoonacular live API recipes & User Custom Database Recipes with debounce.
 */

import { useState, useEffect } from "react";
import { Search, Sparkles, Edit3, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCustomRecipeDialog } from "@/components/recipes/CreateCustomRecipeDialog";
import { getCustomRecipesAction } from "@/app/(dashboard)/recipes/actions";
import { EVERYDAY_SIMPLE_RECIPES } from "@/constants/everydayRecipes";
import type { Recipe } from "@/types/recipe";

interface RecipePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export function RecipePickerModal({ open, onOpenChange, onSelectRecipe }: RecipePickerModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"ALL" | "CUSTOM" | "API">("ALL");
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [apiSearchResults, setApiSearchResults] = useState<Recipe[]>(EVERYDAY_SIMPLE_RECIPES);
  const [isSearchingApi, setIsSearchingApi] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const fetchCustomRecipes = async () => {
    try {
      const userCustoms = await getCustomRecipesAction();
      setCustomRecipes(userCustoms);
    } catch (err) {
      console.error("Failed to load custom recipes:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchCustomRecipes();
    }
  }, [open]);

  // Live API Search with 350ms debounce
  useEffect(() => {
    if (!open) return;

    if (!searchQuery.trim()) {
      setApiSearchResults(EVERYDAY_SIMPLE_RECIPES);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingApi(true);
      try {
        const res = await fetch(`/api/recipes/search?query=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setApiSearchResults(json.data);
          }
        }
      } catch (err) {
        console.error("Failed to search API recipes:", err);
      } finally {
        setIsSearchingApi(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery, open]);

  // Combine API Search Results + User Custom Recipes
  const allRecipesPool: Recipe[] = [...customRecipes, ...apiSearchResults];

  // Deduplicate and filter based on selected tab
  const filteredRecipes = allRecipesPool.filter((recipe, index, self) => {
    const isFirstOccurrence = self.findIndex((r) => r.id === recipe.id) === index;
    if (!isFirstOccurrence) return false;

    const isCustom = recipe.source === "custom" || String(recipe.id).startsWith("custom");

    if (filterTab === "CUSTOM" && !isCustom) return false;
    if (filterTab === "API" && isCustom) return false;

    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl rounded-3xl p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" /> Select Recipe / Food Item
            </DialogTitle>

            {/* Quick Create Custom Recipe Button */}
            <Button
              size="sm"
              onClick={() => setCreateDialogOpen(true)}
              className="rounded-xl font-bold bg-primary text-primary-foreground text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Create New Recipe
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Search Bar & Tabs */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search live recipes (e.g. salad, pasta, chicken, eggs)..."
                className="pl-9 pr-9 h-10 rounded-2xl text-xs font-semibold"
              />
              {isSearchingApi && (
                <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-primary" />
              )}
            </div>

            <Tabs value={filterTab} onValueChange={(val) => setFilterTab(val as any)} className="w-full">
              <TabsList className="bg-muted/40 p-1 rounded-2xl w-full grid grid-cols-3">
                <TabsTrigger value="ALL" className="rounded-xl font-bold text-xs">
                  All ({filteredRecipes.length})
                </TabsTrigger>
                <TabsTrigger value="CUSTOM" className="rounded-xl font-bold text-xs gap-1">
                  <Edit3 className="h-3 w-3 text-amber-500" /> My Custom ({customRecipes.length})
                </TabsTrigger>
                <TabsTrigger value="API" className="rounded-xl font-bold text-xs gap-1">
                  <Sparkles className="h-3 w-3 text-primary" /> Live API ({apiSearchResults.length})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Recipes List Grid */}
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {isSearchingApi ? (
              <div className="text-center py-10 space-y-2">
                <Loader2 className="mx-auto h-7 w-7 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground font-medium">Searching live recipe database...</p>
              </div>
            ) : filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => {
                const isCustom = recipe.source === "custom" || String(recipe.id).startsWith("custom");
                return (
                  <div
                    key={recipe.id}
                    onClick={() => {
                      onSelectRecipe(recipe);
                      onOpenChange(false);
                    }}
                    className="group p-3 rounded-2xl border border-border/80 bg-card hover:bg-accent/40 cursor-pointer transition-all flex items-center gap-3 shadow-2xs"
                  >
                    <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-muted">
                      <img src={recipe.image} alt={recipe.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {isCustom ? (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold">
                            Custom
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20 font-bold">
                            API
                          </Badge>
                        )}
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {recipe.readyInMinutes || 15}m • {recipe.servings || 1} serving
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {recipe.title}
                      </h4>

                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        <strong className="text-amber-500">{recipe.nutrition?.calories || 400} kcal</strong> • {recipe.nutrition?.proteinG || 25}g P • {recipe.nutrition?.carbsG || 45}g C • {recipe.nutrition?.fatG || 15}g F
                      </p>
                    </div>

                    <Button size="xs" variant="outline" className="rounded-xl font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-primary-foreground">
                      Select
                    </Button>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 rounded-2xl border border-dashed border-border space-y-2">
                <Search className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="text-xs font-bold text-foreground">No matching recipes found for "{searchQuery}"</p>
                <Button size="sm" onClick={() => setCreateDialogOpen(true)} className="rounded-xl font-bold bg-primary text-primary-foreground text-xs mt-1">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Create & Add Custom Recipe
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>

      {/* Embedded Create Custom Recipe Modal */}
      <CreateCustomRecipeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={(newRecipe) => {
          fetchCustomRecipes();
          onSelectRecipe(newRecipe);
          onOpenChange(false);
        }}
      />
    </Dialog>
  );
}
