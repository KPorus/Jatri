import Link from 'next/link';
import { ShieldCheck, Clock3, Wallet, Headphones, ArrowRight } from 'lucide-react';

const popularRoutes = [
  { from: 'Dhaka', to: 'Chattogram', price: 'from BDT 600' },
  { from: 'Dhaka', to: "Cox's Bazar", price: 'from BDT 1200' },
  { from: 'Dhaka', to: 'Sylhet', price: 'from BDT 700' },
  { from: 'Dhaka', to: 'Khulna', price: 'from BDT 850' },
];

const features = [
  { icon: ShieldCheck, title: 'Secure Payments', desc: 'Stripe-powered checkout with end-to-end protection.' },
  { icon: Clock3, title: 'Live Seat Hold', desc: 'Your seat is reserved for 5 minutes while you pay.' },
  { icon: Wallet, title: 'Best Prices', desc: 'Transparent per-seat pricing, no hidden fees.' },
  { icon: Headphones, title: '24/7 Support', desc: 'We are here whenever you travel.' },
];

export function PopularRoutes() {
  return (
    <section id="popular-routes" className="container-page py-12">
      <h2 className="section-heading">Popular Routes</h2>
      <p className="mt-2 text-slate-600 dark:text-slate-400">Most travelled journeys across Bangladesh.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {popularRoutes.map((r) => (
          <Link
            key={`${r.from}-${r.to}`}
            href={`/tickets?from=${encodeURIComponent(r.from)}&to=${encodeURIComponent(r.to)}`}
            className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              {r.from} <ArrowRight size={18} className="text-brand-500" /> {r.to}
            </div>
            <p className="mt-2 text-sm text-brand-600 dark:text-brand-400">{r.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="bg-slate-100 py-12 dark:bg-slate-900">
      <div className="container-page">
        <h2 className="section-heading">Why Choose TicketCutter?</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">Everything you need for a smooth booking experience.</p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/40">
                <f.icon size={22} />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
