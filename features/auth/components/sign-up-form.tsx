import { Button } from "@/components/ui/button";

export function SignUpForm() {
  return (
    <form className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Full Name</label>
        <input
          type="text"
          placeholder="John Doe"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-zinc-700">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
      </div>
      <Button variant="primary" className="w-full">Create Account</Button>
    </form>
  );
}