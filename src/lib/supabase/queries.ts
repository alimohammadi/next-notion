"use server";

import db from "./db";
import { Subscription } from "./supbase.types";

export const getUserSubscriptionStatus = async (userId: string) => {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `Error ${error}` };
  }
};
