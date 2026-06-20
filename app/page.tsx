import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function PriceCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 text-2xl">
          🚗
        </div>
        <div>
          <p className="font-semibold text-zinc-900">Jeep Grand Cherokee 2019</p>
          <p className="text-sm text-zinc-500">85,000 mi · Austin, TX</p>
        </div>
      </div>
      <div className="mb-5 rounded-xl bg-amber-50 p-5 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-600">
          Recommended Price
        </p>
        <p className="text-4xl font-bold text-zinc-900">$18,400</p>
        <p className="mt-1 text-xs text-zinc-500">Based on 47 similar sales</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Model ✓", "Year ✓", "Mileage ✓", "Location ✓"].map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </div>
  );
}

const stats = [
  { value: "12,000+", label: "Sale reports" },
  { value: "150+", label: "Car models" },
  { value: "Free", label: "Always" },
];

const steps = [
  {
    step: "01",
    title: "Enter car details",
    desc: "Provide the make, model, year, mileage, and your location.",
  },
  {
    step: "02",
    title: "Get a recommendation",
    desc: "Our algorithm calculates a fair market price from similar approved sales.",
  },
  {
    step: "03",
    title: "Submit your own sale",
    desc: "Sold a car? Report the price and help others get accurate estimates.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-zinc-900 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight">
              Find the right price
              <br />
              <span className="text-amber-400">for any used car</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400">
              Real prices from real sales. Get a recommendation based on model, year, mileage,
              and your location — powered by community-submitted reports.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/search">
                <Button variant="primary">Search a price</Button>
              </Link>
              <Link href="/reports/submit">
                <Button variant="outline">Submit a sale</Button>
              </Link>
            </div>
            <div className="mt-14 flex gap-10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 lg:mt-0">
            <PriceCard />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-zinc-900">How it works</h2>
          <p className="mt-3 text-center text-zinc-500">Three steps to a fair price</p>
          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step}>
                <p className="text-4xl font-bold text-amber-400">{item.step}</p>
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">{item.title}</h3>
                <p className="mt-2 leading-7 text-zinc-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-zinc-100 py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 text-center">
          <h2 className="text-3xl font-bold text-zinc-900">Sold a car recently?</h2>
          <p className="mt-4 max-w-xl text-zinc-600">
            Submit your sale report and help thousands of buyers and sellers get fair prices.
            All reports are reviewed before being included in recommendations.
          </p>
          <Link href="/reports/submit" className="mt-8">
            <Button variant="dark">Submit a sale report</Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 py-10 text-zinc-400">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm">
          <p className="font-semibold text-white">DealSense</p>
          <p>© 2026 DealSense. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}