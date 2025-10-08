type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function GameShell({ title, children }: Props) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-sky-100 text-slate-800">

      {/* Page container */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-10">
        {/* Board/Card */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          {title && (
            <h2 className="text-2xl font-bold text-slate-900 mb-5">{title}</h2>
          )}

          {children}
        </section>
      </div>
    </main>
  );
}
