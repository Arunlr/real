import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
}));

// Service-role client (admin, bypasses RLS)
const adminSupabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Helper: verify bearer token and return user id
async function getAuthUserId(req: Request): Promise<string | null> {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) return null;
  const { data: { user }, error } = await adminSupabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

// ========================
// HEALTH
// ========================
app.get("/make-server-5bf721dd/health", (c) => c.json({ status: "ok" }));

// ========================
// AUTH — SIGN UP (service role, auto-confirms email)
// ========================
app.post("/make-server-5bf721dd/auth/signup", async (c) => {
  try {
    const { email, password, name, phone } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split("@")[0], phone: phone || "" },
      // Auto-confirm email — no email server configured
      email_confirm: true,
    });

    if (error) {
      console.log("Signup error:", error.message);
      return c.json({ error: error.message }, 400);
    }

    // Create profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name: name || email.split("@")[0],
      phone: phone || "",
      role: "user",
      xp: 0,
      trustScore: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    });

    // Init stats
    await kv.set(`user:${data.user.id}:stats`, {
      xp: 0,
      trustScore: 0,
      totalEarnings: 0,
      monthlyEarnings: 0,
      verificationCount: 0,
      reviewCount: 0,
      streak: 0,
      level: 1,
      credits: 0,
    });

    return c.json({ success: true, userId: data.user.id });
  } catch (err) {
    console.log("Signup exception:", err);
    return c.json({ error: `Signup failed: ${err.message}` }, 500);
  }
});

// ========================
// PLACES
// ========================
app.get("/make-server-5bf721dd/places", async (c) => {
  try {
    const places = await kv.getByPrefix("place:");
    return c.json({ places });
  } catch (err) {
    console.log("Error fetching places:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.get("/make-server-5bf721dd/places/:id", async (c) => {
  try {
    const place = await kv.get(`place:${c.req.param("id")}`);
    if (!place) return c.json({ error: "Place not found" }, 404);
    return c.json({ place });
  } catch (err) {
    console.log("Error fetching place:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.post("/make-server-5bf721dd/places", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const id = body.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await kv.set(`place:${id}`, {
      ...body,
      id,
      createdBy: userId,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, id });
  } catch (err) {
    console.log("Error saving place:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ========================
// REVIEWS
// ========================
app.get("/make-server-5bf721dd/reviews", async (c) => {
  try {
    const reviews = await kv.getByPrefix("review:");
    return c.json({ reviews });
  } catch (err) {
    console.log("Error fetching reviews:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.get("/make-server-5bf721dd/reviews/place/:placeId", async (c) => {
  try {
    const reviews = await kv.getByPrefix(`review:place:${c.req.param("placeId")}:`);
    return c.json({ reviews });
  } catch (err) {
    console.log("Error fetching reviews for place:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.post("/make-server-5bf721dd/reviews", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const reviewId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const review = {
      ...body,
      id: reviewId,
      userId,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`review:${reviewId}`, review);
    if (body.placeId) {
      await kv.set(`review:place:${body.placeId}:${reviewId}`, review);
    }

    // Award 10 credits for submitting a review
    const stats: any = await kv.get(`user:${userId}:stats`) || {};
    await kv.set(`user:${userId}:stats`, {
      ...stats,
      xp: (stats.xp || 0) + 100,
      credits: (stats.credits || 0) + 10,
      reviewCount: (stats.reviewCount || 0) + 1,
      updatedAt: new Date().toISOString(),
    });

    return c.json({ success: true, reviewId });
  } catch (err) {
    console.log("Error submitting review:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ========================
// VERIFICATIONS
// ========================
app.get("/make-server-5bf721dd/verifications/:placeId", async (c) => {
  try {
    const verifications = await kv.getByPrefix(`verification:${c.req.param("placeId")}:`);
    return c.json({ verifications });
  } catch (err) {
    console.log("Error fetching verifications:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.post("/make-server-5bf721dd/verifications", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const { placeId } = body;
    if (!placeId) return c.json({ error: "placeId is required" }, 400);

    const verificationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await kv.set(`verification:${placeId}:${verificationId}`, {
      id: verificationId,
      placeId,
      userId,
      ...body,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, verificationId });
  } catch (err) {
    console.log("Error submitting verification:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ========================
// USERS
// ========================
app.get("/make-server-5bf721dd/users/me", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const user = await kv.get(`user:${userId}`);
    const stats = await kv.get(`user:${userId}:stats`);
    return c.json({ user: user || { id: userId }, stats: stats || {} });
  } catch (err) {
    console.log("Error fetching current user:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.get("/make-server-5bf721dd/users/:userId", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const user = await kv.get(`user:${c.req.param("userId")}`);
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json({ user });
  } catch (err) {
    console.log("Error fetching user:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.post("/make-server-5bf721dd/users/:userId", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);
    if (userId !== c.req.param("userId")) return c.json({ error: "Forbidden" }, 403);

    const body = await c.req.json();
    const existing: any = await kv.get(`user:${userId}`) || {};
    await kv.set(`user:${userId}`, { ...existing, ...body, id: userId, updatedAt: new Date().toISOString() });

    return c.json({ success: true });
  } catch (err) {
    console.log("Error updating user:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.get("/make-server-5bf721dd/users/:userId/stats", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const stats = await kv.get(`user:${c.req.param("userId")}:stats`);
    return c.json({
      stats: stats || { xp: 0, trustScore: 0, totalEarnings: 0, monthlyEarnings: 0, verificationCount: 0, reviewCount: 0, streak: 0, level: 1, credits: 0 }
    });
  } catch (err) {
    console.log("Error fetching stats:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.post("/make-server-5bf721dd/users/:userId/stats", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);
    if (userId !== c.req.param("userId")) return c.json({ error: "Forbidden" }, 403);

    const body = await c.req.json();
    const existing: any = await kv.get(`user:${userId}:stats`) || {};
    await kv.set(`user:${userId}:stats`, { ...existing, ...body, updatedAt: new Date().toISOString() });

    return c.json({ success: true });
  } catch (err) {
    console.log("Error updating stats:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ========================
// REWARDS
// ========================
app.get("/make-server-5bf721dd/users/:userId/rewards", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const rewards = await kv.getByPrefix(`reward:${c.req.param("userId")}:`);
    return c.json({ rewards });
  } catch (err) {
    console.log("Error fetching rewards:", err);
    return c.json({ error: err.message }, 500);
  }
});

app.post("/make-server-5bf721dd/users/:userId/rewards", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const rewardId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await kv.set(`reward:${c.req.param("userId")}:${rewardId}`, {
      id: rewardId,
      userId: c.req.param("userId"),
      ...body,
      createdAt: new Date().toISOString(),
    });

    return c.json({ success: true, rewardId });
  } catch (err) {
    console.log("Error adding reward:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ========================
// LEADERBOARD
// ========================
app.get("/make-server-5bf721dd/leaderboard", async (c) => {
  try {
    const leaderboard = await kv.get("leaderboard");
    return c.json({ leaderboard: leaderboard || [] });
  } catch (err) {
    console.log("Error fetching leaderboard:", err);
    return c.json({ error: err.message }, 500);
  }
});

// ========================
// ADMIN — list all users (service role only, check admin role)
// ========================
app.get("/make-server-5bf721dd/admin/users", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.raw);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const profile: any = await kv.get(`user:${userId}`);
    if (profile?.role !== "admin") return c.json({ error: "Forbidden" }, 403);

    const { data: { users }, error } = await adminSupabase.auth.admin.listUsers();
    if (error) return c.json({ error: error.message }, 500);

    return c.json({ users });
  } catch (err) {
    console.log("Error listing users:", err);
    return c.json({ error: err.message }, 500);
  }
});

Deno.serve(app.fetch);
