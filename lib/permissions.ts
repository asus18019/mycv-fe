import { AbilityBuilder, createMongoAbility, type MongoAbility } from "@casl/ability";
import { User } from "@/features/auth/types";

export const roles = ["guest", "user", "admin"] as const;
export type Role = (typeof roles)[number];

type Action = "view";
export type Pages =
    | "LandingPage"
    | "SearchPage"
    | "TrendsPage"
    | "SubmitReportPage"
    | "AdminPage"
    | "OverviewPage"
    | "MyReportsPage"
    | "SettingsPage";
type Subject = Pages | "all";

export type AppAbility = MongoAbility<[Action, Subject]>;

export function defineAbilityFor(role: Role): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility);

  can("view", "LandingPage");

  if (role === "guest") {
    can("view", "SearchPage");
    can("view", "TrendsPage");
  }

  if (role === "user") {
    const allowedPages: Pages[] = [
      "SearchPage",
      "TrendsPage",
      "SubmitReportPage",
      "OverviewPage",
      "MyReportsPage",
      "SettingsPage",
    ];
    allowedPages.forEach((page) => can("view", page));
  }

  if (role === "admin") {
    can("view", "all");
  }

  return build();
}

function getRole(user: User | null): Role {
  if (!user) return "guest";
  if (user.admin) return "admin";
  return "user";
}

export const canUser = (user: User | null, action: Action, subject: Subject) => {
  const role = getRole(user);
  const ability = defineAbilityFor(role);
  return ability.can(action, subject);
}