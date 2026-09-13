import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChefHat,
  Heart,
  ShoppingCart,
  Sparkles,
  Star,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recipe Hub — Your recipes, meal plan and shopping list" },
      {
        name: "description",
        content:
          "Recipe Hub is a calm home for the food you actually cook: save recipes, plan the week and generate a shopping list in one tap.",
      },
      { property: "og:title", content: "Recipe Hub — Your recipes, meal plan and shopping list" },
      {
        property: "og:description",
        content: "Save recipes, plan the week and generate your shopping list automatically.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: UtensilsCrossed,
    title: "A recipe box that scales",
    body: "Ingredients, method, photos, timings and categories - searchable and filterable in a second.",
    iconBg: "oklch(0.58 0.19 48 / 12%)",
    iconColor: "oklch(0.46 0.17 44)",
  },
  {
    icon: CalendarDays,
    title: "Plan the week visually",
    body: "Drop recipes into breakfast, lunch and dinner across a seven-day board.",
    iconBg: "oklch(0.54 0.13 148 / 12%)",
    iconColor: "oklch(0.38 0.12 148)",
  },
  {
    icon: ShoppingCart,
    title: "Shopping list, generated",
    body: "Savora merges every ingredient from your plan into one tickable list.",
    iconBg: "oklch(0.6 0.1 220 / 12%)",
    iconColor: "oklch(0.44 0.09 220)",
  },
  {
    icon: Heart,
    title: "Favourites at hand",
    body: "Star the keepers so the meals you love are never more than a click away.",
    iconBg: "oklch(0.54 0.21 24 / 12%)",
    iconColor: "oklch(0.40 0.18 24)",
  },
];

const MEALS = [
  { day: "Mon", meal: "Lemon risotto" },
  { day: "Tue", meal: "Miso salmon" },
  { day: "Wed", meal: "Chickpea curry" },
  { day: "Thu", meal: "Ragu rigatoni" },
  { day: "Fri", meal: "Tacos" },
  { day: "Sat", meal: "Roast chicken" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background" style={{ position: "relative" }}>
      {/* Ambient gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(80% 60% at 10% 0%, oklch(0.82 0.16 86 / 30%) 0%, transparent 60%), radial-gradient(60% 50% at 90% 5%, oklch(0.58 0.19 48 / 20%) 0%, transparent 55%)",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="gradient-brand flex h-9 w-9 items-center justify-center rounded-xl text-primary-foreground shadow-glow">
              <ChefHat className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold tracking-tight">Recipe Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/auth">Sign in</Link>
            </Button>
            <Button asChild className="shadow-glow">
              <Link to="/auth" search={{ mode: "signup" }}>
                Get started
              </Link>
            </Button>
          </div>
        </header>

        <section className="relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-16">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-7"
            >
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                style={{
                  background: "oklch(0.58 0.19 48 / 8%)",
                  borderColor: "oklch(0.58 0.19 48 / 30%)",
                  color: "oklch(0.46 0.17 44)",
                }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Recipes, planning and shopping in one place
              </span>
              <h1 className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                Cook better weeks,{" "}
                <span className="text-gradient-brand">not just meals</span>.
              </h1>
              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                Savora keeps your recipe box, weekly meal plan and shopping list perfectly in sync
                so deciding what&apos;s for dinner stops being a daily negotiation.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="shadow-glow">
                  <Link to="/auth" search={{ mode: "signup" }}>
                    Create your free account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link to="/auth">I already have one</Link>
                </Button>
              </div>
              {/* Social proof */}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-primary text-primary" />
                  ))}
                </div>
                <span>Loved by home cooks</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="glass-panel relative rounded-3xl p-6 shadow-lift"
            >
              {/* Top accent line */}
              <div
                aria-hidden="true"
                className="gradient-brand absolute left-1/4 right-1/4 top-0 h-0.5 rounded-b-full"
              />
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="font-display text-lg font-semibold">This week</p>
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: "oklch(0.58 0.19 48 / 12%)", color: "oklch(0.46 0.17 44)" }}
                  >
                    18 recipes - 21 meals
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {MEALS.map((item, index) => (
                    <motion.div
                      key={item.day}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.06 }}
                      className="rounded-xl border bg-card/80 p-3 shadow-soft"
                    >
                      <p className="font-medium text-muted-foreground">{item.day}</p>
                      <p className="mt-1 font-semibold leading-tight text-foreground">{item.meal}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-xl border bg-card/80 p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Shopping list</p>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ background: "oklch(0.54 0.13 148 / 12%)", color: "oklch(0.38 0.12 148)" }}
                    >
                      12 items
                    </span>
                  </div>
                  <div className="mt-2.5 space-y-1.5 text-sm text-muted-foreground">
                    {["200 g arborio rice", "2 lemons", "Bunch of coriander"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                          style={{ background: "oklch(0.58 0.19 48)" }}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="border-t py-16 lg:py-24" style={{ background: "oklch(0.955 0.02 85)" }}>
          <div className="mx-auto max-w-6xl px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <h2 className="font-display text-3xl tracking-tight">Everything a home cook needs</h2>
              <p className="mt-2 text-muted-foreground">One calm place for all the moving parts of home cooking.</p>
            </motion.div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="rounded-2xl border bg-card p-5 shadow-soft transition-shadow hover:shadow-lift"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: feature.iconBg, color: feature.iconColor }}
                  >
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-16 lg:py-20">
          <div className="mx-auto max-w-2xl px-4 text-center lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              <span className="gradient-brand mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-primary-foreground shadow-glow">
                <ChefHat className="h-7 w-7" />
              </span>
              <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Ready to cook smarter?</h2>
              <p className="text-lg text-muted-foreground">Free to start. No credit card required.</p>
              <Button asChild size="lg" className="px-8 shadow-glow">
                <Link to="/auth" search={{ mode: "signup" }}>
                  Create your free account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        <footer className="border-t py-8" style={{ background: "oklch(0.955 0.02 85)" }}>
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm text-muted-foreground sm:flex-row lg:px-8">
            <div className="flex items-center gap-2">
              <span className="gradient-brand flex h-6 w-6 items-center justify-center rounded-lg text-primary-foreground">
                <ChefHat className="h-3.5 w-3.5" />
              </span>
              <p>{new Date().getFullYear()} Recipe Hub</p>
            </div>
            <Link to="/auth" className="transition-colors hover:text-foreground">
              Sign in
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
