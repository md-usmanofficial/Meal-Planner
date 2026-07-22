"use client";

/**
 * Recipes Page — Full Recipe Discovery & Custom Recipe Management Hub.
 *
 * Supports:
 * - Creating, editing, and deleting custom user recipes saved to database
 * - Filtering API Preset recipes & My Custom recipes
 * - Search by Name, Diet, Cooking Time, Calorie Target
 * - Modal preview with step-by-step instructions & macro breakdown
 */

import { useState, useEffect } from "react";
import { ChefHat, Sparkles, Search, Heart, Plus, Edit3, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { RecipeSearchFilters } from "@/components/recipes/RecipeSearchFilters";
import { IngredientSearchWidget } from "@/components/recipes/IngredientSearchWidget";
import { RecipeDetailModal } from "@/components/recipes/RecipeDetailModal";
import { CreateCustomRecipeDialog } from "@/components/recipes/CreateCustomRecipeDialog";
import { getCustomRecipesAction, deleteCustomRecipeAction } from "@/app/(dashboard)/recipes/actions";
import type { Recipe } from "@/types/recipe";
import { toast } from "sonner";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingCustomRecipe, setEditingCustomRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filters State
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState("all");
  const [maxReadyTime, setMaxReadyTime] = useState("all");
  const [maxCalories, setMaxCalories] = useState("all");

  const fetchRecipes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set("query", query);
      if (diet !== "all") params.set("diet", diet);
      if (maxReadyTime !== "all") params.set("maxReadyTime", maxReadyTime);
      if (maxCalories !== "all") params.set("maxCalories", maxCalories);

      const res = await fetch(`/api/recipes/search?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRecipes(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomRecipes = async () => {
    try {
      const customs = await getCustomRecipesAction();
      setCustomRecipes(customs);
    } catch (err) {
      console.error("Failed to fetch custom recipes:", err);
    }
  };

  useEffect(() => {
    fetchCustomRecipes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 300);
    return () => clearTimeout(timer);
  }, [query, diet, maxReadyTime, maxCalories]);

  const handleIngredientSearch = async (ingredients: string[]) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ ingredients: ingredients.join(",") });
      const res = await fetch(`/api/recipes/by-ingredients?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setRecipes(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch recipes by ingredients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setQuery("");
    setDiet("all");
    setMaxReadyTime("all");
    setMaxCalories("all");
  };

  const toggleFavorite = (recipe: Recipe) => {
    if (favorites.some((f) => f.id === recipe.id)) {
      setFavorites(favorites.filter((f) => f.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  const handleDeleteCustomRecipe = async (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this custom recipe?")) return;
    try {
      await deleteCustomRecipeAction(recipeId);
      toast.success("Custom recipe deleted.");
      fetchCustomRecipes();
    } catch (err) {
      toast.error("Failed to delete custom recipe.");
    }
  };

  const handleEditCustomRecipe = (recipe: Recipe, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCustomRecipe(recipe);
    setEditDialogOpen(true);
  };

  const openRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header & Create Custom Recipe Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ChefHat className="h-7 w-7 text-primary" /> Recipe Discovery & Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Explore preset API recipes or create your own custom database recipes.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingCustomRecipe(null);
            setCreateDialogOpen(true);
          }}
          className="rounded-2xl font-bold gap-2 bg-primary text-primary-foreground shadow-sm h-11"
        >
          <Plus className="h-4 w-4" /> Create Custom Recipe
        </Button>
      </div>

      {/* Main Tabs (Search vs My Custom Recipes vs By Ingredients vs Favorites) */}
      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="bg-muted/40 p-1 rounded-2xl">
          <TabsTrigger value="search" className="rounded-xl font-bold text-xs gap-2">
            <Search className="h-3.5 w-3.5" /> API Recipe Search
          </TabsTrigger>
          <TabsTrigger value="custom" className="rounded-xl font-bold text-xs gap-2">
            <Edit3 className="h-3.5 w-3.5 text-amber-500" /> My Custom Recipes ({customRecipes.length})
          </TabsTrigger>
          <TabsTrigger value="fridge" className="rounded-xl font-bold text-xs gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> By Ingredients
          </TabsTrigger>
          <TabsTrigger value="favorites" className="rounded-xl font-bold text-xs gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-500" /> Favorites ({favorites.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: API SEARCH & FILTERS */}
        <TabsContent value="search" className="space-y-6">
          <RecipeSearchFilters
            query={query}
            onQueryChange={setQuery}
            diet={diet}
            onDietChange={setDiet}
            maxReadyTime={maxReadyTime}
            onMaxReadyTimeChange={setMaxReadyTime}
            maxCalories={maxCalories}
            onMaxCaloriesChange={setMaxCalories}
            onReset={handleResetFilters}
          />

          {/* Recipe Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 rounded-3xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          ) : recipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={openRecipeDetail}
                  isFavorite={favorites.some((f) => f.id === recipe.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl border border-dashed border-border">
              <ChefHat className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-base font-bold text-foreground">No recipes found</h3>
              <p className="text-xs text-muted-foreground mt-1">Try relaxing your search query or filters.</p>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: MY CUSTOM RECIPES */}
        <TabsContent value="custom" className="space-y-6">
          {customRecipes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customRecipes.map((recipe) => (
                <div key={recipe.id} className="relative group">
                  <RecipeCard
                    recipe={recipe}
                    onSelect={openRecipeDetail}
                    isFavorite={favorites.some((f) => f.id === recipe.id)}
                    onToggleFavorite={toggleFavorite}
                  />

                  {/* Edit & Delete Action Buttons Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      className="h-7 w-7 rounded-xl bg-card/90 backdrop-blur-md shadow-xs hover:bg-card"
                      onClick={(e) => handleEditCustomRecipe(recipe, e)}
                      title="Edit Custom Recipe"
                    >
                      <Edit3 className="h-3.5 w-3.5 text-amber-500" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      className="h-7 w-7 rounded-xl bg-card/90 backdrop-blur-md shadow-xs hover:bg-destructive hover:text-white"
                      onClick={(e) => handleDeleteCustomRecipe(recipe.id, e)}
                      title="Delete Custom Recipe"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive group-hover:text-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-dashed border-border space-y-3">
              <ChefHat className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-bold text-foreground">No custom recipes created yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Create your own custom recipes to use in your manual meal plans and AI meal generation!
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="rounded-xl font-bold bg-primary text-primary-foreground text-xs mt-2"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Create Your First Custom Recipe
              </Button>
            </div>
          )}
        </TabsContent>

        {/* TAB 3: WHAT CAN I COOK WITH THESE INGREDIENTS? */}
        <TabsContent value="fridge" className="space-y-6">
          <IngredientSearchWidget onSearch={handleIngredientSearch} isLoading={isLoading} />

          {/* Results Grid */}
          {recipes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={openRecipeDetail}
                  isFavorite={favorites.some((f) => f.id === recipe.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* TAB 4: FAVORITES */}
        <TabsContent value="favorites" className="space-y-6">
          {favorites.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favorites.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onSelect={openRecipeDetail}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl border border-dashed border-border">
              <Heart className="mx-auto h-10 w-10 text-rose-500/40 mb-3" />
              <h3 className="text-base font-bold text-foreground">No favorite recipes saved yet</h3>
              <p className="text-xs text-muted-foreground mt-1">Click the heart icon on any recipe card to save it here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Custom Recipe Modal */}
      <CreateCustomRecipeDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => fetchCustomRecipes()}
      />

      {/* Edit Custom Recipe Modal */}
      <CreateCustomRecipeDialog
        initialRecipe={editingCustomRecipe}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => fetchCustomRecipes()}
      />

      {/* Recipe Detail Popup Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
