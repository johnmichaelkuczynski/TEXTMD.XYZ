import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// MINIMAL SCHEMA - Only what's needed for payment + core functionality

// Users table - for login and payment status
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  googleId: text("google_id").unique(),
  profileImageUrl: text("profile_image_url"),
  isPro: boolean("is_pro").default(false).notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  googleId: true,
  profileImageUrl: true,
});

// Generated outputs - track what was generated for each user
export const generatedOutputs = pgTable("generated_outputs", {
  id: serial("id").primaryKey(),
  outputId: text("output_id").notNull().unique(),
  outputType: text("output_type").notNull(),
  outputFull: text("output_full"),
  outputPreview: text("output_preview").notNull(),
  isTruncated: boolean("is_truncated").default(false).notNull(),
  userId: serial("user_id"),
  sessionId: text("session_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertGeneratedOutputSchema = createInsertSchema(generatedOutputs).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = Pick<InsertUser, "username" | "password">;

export type InsertGeneratedOutput = z.infer<typeof insertGeneratedOutputSchema>;
export type GeneratedOutput = typeof generatedOutputs.$inferSelect;
