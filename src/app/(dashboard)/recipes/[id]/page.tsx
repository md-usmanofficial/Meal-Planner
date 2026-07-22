import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Flame, Users, CheckCircle2, ExternalLink } from "lucide-react";
import { RecipeService } from "@/services/recipe.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const recipe = await RecipeService.getById(id);
  return {
    title: recipe ? `${recipe.title} — Recipe` : "Recipe Details",
  };
}

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await RecipeService.getById(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button */}
      <Button asChild variant="ghost" className="rounded-xl pl-0 text-muted-foreground hover:text-foreground">
        <Link href={ROUTES.RECIPES}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes
        </Link>
      </Button>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-foreground leading-tight">
          {recipe.title}
        </h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {recipe.summary.replace(/<[^>]*>?/gm, "")}
        </p>
      </div>

      {/* Hero Image */}
      <div className="relative h-80 w-full overflow-hidden rounded-3xl bg-muted shadow-md">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover"
        />
        {recipe.healthScore && (
          <Badge className="absolute bottom-4 left-4 bg-slate-950/80 text-white backdrop-blur-md text-xs font-bold px-3 py-1">
            Health Score: {recipe.healthScore}/100
          </Badge>
        )}
      </div>

      {/* Meta Stats Row */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-2xl border border-border bg-card p-4">
          <Clock className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
          <span className="text-sm font-bold text-foreground block">{recipe.readyInMinutes} Mins</span>
          <span className="text-xs text-muted-foreground">Cooking Time</span>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <Users className="mx-auto h-5 w-5 text-muted-foreground mb-1" />
          <span className="text-sm font-bold text-foreground block">{recipe.servings} Servings</span>
          <span className="text-xs text-muted-foreground">Yield</span>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
          <Flame className="mx-auto h-5 w-5 text-amber-500 mb-1" />
          <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 block">
            {recipe.nutrition?.calories || 400} kcal
          </span>
          <span className="text-xs text-amber-600/80 dark:text-amber-400/80 font-semibold">Calories</span>
        </div>
      </div>

      {/* Ingredients List */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
        <h3 className="text-base font-bold text-foreground">Ingredients</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {recipe.ingredients?.map((ing) => (
            <div key={ing.id} className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-muted/20">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-foreground">{ing.name}</span>
              <span className="text-xs text-muted-foreground ml-auto font-medium">
                {ing.amount} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
        <h3 className="text-base font-bold text-foreground">Instructions</h3>
        <div className="space-y-4">
          {recipe.instructions?.map((step) => (
            <div key={step.stepNumber} className="flex gap-4">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-extrabold text-xs">
                {step.stepNumber}
              </div>
              <p className="text-xs text-foreground leading-relaxed pt-1">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* External Link */}
      {recipe.sourceUrl && (
        <div className="flex justify-end pt-2">
          <Button asChild variant="outline" className="rounded-xl font-bold">
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
              View Original Recipe Source <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
