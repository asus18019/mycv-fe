import { getCurrentUser } from "@/lib/get-current-user";
import { redirect } from "next/navigation";

export async function SettingsTab() {
  const user = await getCurrentUser();
  if(!user) redirect("/?auth=sign-in");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-base font-medium text-zinc-900">Account</h2>
        <p className="mt-1 text-sm text-zinc-500">Your account information.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
            Email
          </label>
          <div className="mt-1.5 flex items-center gap-3 rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2.5">
            <span className="text-sm text-zinc-700">{user.email}</span>
            <span className="ml-auto rounded-full bg-zinc-200 px-2 py-0.5 text-xs text-zinc-500">
              Read-only
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-8">
        <h3 className="text-sm font-medium text-red-600">Danger Zone</h3>
        <p className="mt-1 text-sm text-zinc-500">
          Irreversible actions — proceed with caution.
        </p>
        <button
          disabled
          className="mt-4 rounded-md border border-red-200 px-4 py-2 text-sm font-medium text-red-500 opacity-50 cursor-not-allowed"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}