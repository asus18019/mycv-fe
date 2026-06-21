import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";

export const roles = ["guest", "user", "admin"] as const;
export type Role = (typeof roles)[number];

type Action = "view";
type Subject = "LandingPage" | "SearchPage" | "TrendsPage" | "SubmitReportPage" | "AdminPage" | "DashboardPage" | "all";

export type AppAbility = MongoAbility<[Action, Subject]>;

export function defineAbilityFor(role: Role): AppAbility {
  const { can, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can("view", "LandingPage");

  if (role === "guest") {
    can("view", "SearchPage");
    can("view", "TrendsPage");
  }

  if (role === "user") {
    can("view", "SearchPage");
    can("view", "TrendsPage");
    can("view", "SubmitReportPage");
    can("view", "DashboardPage");
  }

  if (role === "admin") {
    can("view", "all");
  }

  return build();
}