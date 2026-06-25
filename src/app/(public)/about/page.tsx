export default function AboutPage() {
  return (
    <div id="about-page" className="container-page py-16">
      <h1 className="section-heading">About Jatri</h1>
      <p className="mt-4 max-w-3xl text-slate-600 dark:text-slate-400">
        Jatri is a modern online ticket booking platform for Bangladesh. We bring bus, train, launch, and flight
        operators onto a single platform with real-time seat selection so you always know exactly where you will sit.
        Seats are locked the moment you pick them and held for five minutes while you complete a secure Stripe payment.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { k: '4', v: 'Transport types' },
          { k: '64', v: 'Districts covered' },
          { k: '5 min', v: 'Seat hold window' },
        ].map((s) => (
          <div key={s.v} className="rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{s.k}</p>
            <p className="mt-1 text-sm text-slate-500">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
