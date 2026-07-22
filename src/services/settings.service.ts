/**
 * Settings Service — Business logic for updating user preferences and account settings.
 */

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { UnitSystem } from "@/types/profile";

export interface UpdateSettingsData {
  darkMode?: boolean;
  units?: UnitSystem;
  emailNotifications?: boolean;
  mealReminders?: boolean;
}

export class SettingsService {
  /**
   * Get user settings from database.
   */
  static async getSettings(userId: string) {
    const settings = await prisma.userSettings.findUnique({
      where: { userId },
    });

    if (!settings) {
      return await prisma.userSettings.create({
        data: {
          userId,
          darkMode: false,
          units: "METRIC",
          emailNotifs: true,
          mealReminders: true,
        },
      });
    }

    return settings;
  }

  /**
   * Update user settings in database.
   */
  static async updateSettings(userId: string, data: UpdateSettingsData) {
    return await prisma.userSettings.upsert({
      where: { userId },
      create: {
        userId,
        darkMode: data.darkMode ?? false,
        units: data.units ?? "METRIC",
        emailNotifs: data.emailNotifications ?? true,
        mealReminders: data.mealReminders ?? true,
      },
      update: {
        ...(data.darkMode !== undefined && { darkMode: data.darkMode }),
        ...(data.units !== undefined && { units: data.units }),
        ...(data.emailNotifications !== undefined && { emailNotifs: data.emailNotifications }),
        ...(data.mealReminders !== undefined && { mealReminders: data.mealReminders }),
      },
    });
  }

  /**
   * Change user password via Supabase Auth.
   */
  static async changePassword(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw new Error(error.message);
    return true;
  }
}
