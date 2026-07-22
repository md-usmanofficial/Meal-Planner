"use client";

/**
 * EditPlanNameDialog — Dialog for updating a Meal Plan title.
 */

import { useState } from "react";
import { Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateMealPlanNameAction } from "@/app/(dashboard)/meal-plans/actions";
import { toast } from "sonner";

interface EditPlanNameDialogProps {
  planId: string;
  currentName: string;
  onSuccess?: () => void;
}

export function EditPlanNameDialog({ planId, currentName, onSuccess }: EditPlanNameDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(currentName);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsPending(true);
    try {
      await updateMealPlanNameAction(planId, name.trim());
      toast.success("Meal plan name updated!");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to update plan name.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="h-7 w-7 rounded-lg hover:bg-accent" title="Edit Plan Name">
          <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-foreground">Edit Plan Name</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="plan-edit-name" className="text-xs font-bold">Plan Title</Label>
            <Input
              id="plan-edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My High Protein Plan"
              className="h-10 rounded-xl"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl font-bold bg-primary text-primary-foreground">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
