"use client";

/**
 * WeightLogForm Component — Modal form for logging new weight entries.
 */

import { useState } from "react";
import { Scale, Plus, Loader2 } from "lucide-react";
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
import { logWeightAction } from "@/app/(dashboard)/progress/actions";

interface WeightLogFormProps {
  currentWeightKg?: number;
  onWeightLogged?: () => void;
}

export function WeightLogForm({ currentWeightKg = 70, onWeightLogged }: WeightLogFormProps) {
  const [open, setOpen] = useState(false);
  const [weightKg, setWeightKg] = useState(currentWeightKg);
  const [notes, setNotes] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("weightKg", String(weightKg));
      formData.set("notes", notes);
      formData.set("date", new Date().toISOString());

      await logWeightAction(formData);
      setIsPending(false);
      setOpen(false);
      onWeightLogged?.();
    } catch (err) {
      console.error("Log weight error:", err);
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl font-bold gap-2">
          <Plus className="h-4 w-4" /> Log Weight Entry
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> Log Current Weight
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="weight-input" className="text-xs font-bold">Weight (kg)</Label>
            <Input
              id="weight-input"
              type="number"
              step="0.1"
              min={20}
              max={300}
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              required
              className="h-11 rounded-xl text-base font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weight-notes" className="text-xs font-bold">Notes (Optional)</Label>
            <Input
              id="weight-notes"
              placeholder="e.g. Morning weigh-in, post-workout"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full h-11 rounded-2xl font-bold">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Weight Log"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
