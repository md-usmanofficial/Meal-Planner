/**
 * Shared API response types for Next.js API Routes.
 */

/**
 * Standard API success response envelope
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response envelope
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  details?: Record<string, string[]>;  // Zod validation errors
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Generic query parameters for list endpoints
 */
export interface ListQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

/**
 * Favorite types
 */
export type FavoriteType = "RECIPE" | "FOOD" | "MEAL_PLAN";

export interface Favorite {
  id: string;
  userId: string;
  itemType: FavoriteType;
  externalId: string;
  itemData: Record<string, unknown>;
  createdAt: Date;
}

/**
 * Recently viewed item
 */
export interface RecentlyViewed {
  id: string;
  userId: string;
  itemType: string;
  externalId: string;
  itemData: Record<string, unknown>;
  viewedAt: Date;
}

/**
 * In-app notification
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: Date;
}
