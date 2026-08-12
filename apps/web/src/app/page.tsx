import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <>
      {/* Floating Pill Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full border border-bg-border bg-bg-base/80 backdrop-blur-md">
        <div className="text-white font-bold text-sm tracking-wider">RunsDark</div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-xs text-text-secondary hover:text-white transition-smooth">
            Platform
          </a>
          <a href="#" className="text-xs text-text-secondary hover:text-white transition-smooth">
            Tools
          </a>
          <a href="#" className="text-xs text-text-secondary hover:text-white transition-smooth">
            Dark Ops
          </a>
          <a href="#" className="text-xs text-text-secondary hover:text-white transition-smooth">
            For EAs
          </a>
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <a href="/login" className="text-xs text-text-secondary hover:text-white transition-smooth">
            Sign In
          </a>
          <a href="/signup" className="px-4 py-2 bg-accent-primary text-white text-xs font-semibold rounded-full hover:bg-blue-600 transition-smooth inline-block">
            Get Started Free
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-glow-blue pointer-events-none" />

        {/* Particles background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-primary rounded-full mix-blend-screen filter blur-3xl opacity-20" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent-primary rounded-full mix-blend-screen filter blur-3xl opacity-20" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          {/* Announcement Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-bg-border bg-bg-surface">
            <span className="px-2 py-1 rounded bg-accent-primary text-white text-[10px] font-bold uppercase tracking-wider">
              Free
            </span>
            <span className="text-xs text-text-secondary">
              Now open for Filipino EAs — no waitlist
            </span>
            <ArrowRight className="w-3 h-3 text-text-secondary" />
          </div>

          {/* Headline */}
          <h1 className="text-hero font-black text-white leading-tight">
            The ops layer<br />Filipino EAs run on.
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Purpose-built tools for global executive support. Draft emails, track calendars, manage travel — all in one dark, focused workspace.
          </p>

          {/* CTA Row */}
          <div className="flex gap-4 justify-center pt-4">
            <a href="/signup" className="px-8 py-3 bg-accent-primary text-white rounded-full font-semibold text-sm hover:bg-blue-600 transition-smooth glow-blue">
              Get started free
            </a>
            <a href="#apps" className="px-8 py-3 border border-text-muted text-text-secondary hover:text-white rounded-full font-semibold text-sm transition-smooth hover:border-white">
              See how it works →
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border border-text-muted rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-text-muted rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Three Apps Section - Coming soon */}
      <section className="relative py-24 px-4 bg-bg-base">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <p className="mono text-accent-primary font-semibold">Three Essential Apps</p>
            <h2 className="text-section font-bold">Everything an EA needs.</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Built specifically for managing global clients from anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* EDrafting */}
            <div className="md:col-span-2 p-8 rounded-2xl border border-bg-border bg-bg-surface hover:border-accent-primary/30 transition-smooth cursor-pointer group">
              <p className="mono text-accent-primary text-xs font-semibold tracking-widest uppercase">EDrafting</p>
              <h3 className="text-2xl font-semibold text-white mt-3">Draft emails that sound like your client</h3>
              <p className="text-text-secondary mt-3">Upload reference docs. AI learns the voice. You approve in seconds.</p>
            </div>

            {/* Calendar Tracker */}
            <div className="p-8 rounded-2xl border border-bg-border bg-bg-surface hover:border-accent-primary/30 transition-smooth cursor-pointer">
              <p className="mono text-accent-primary text-xs font-semibold tracking-widest uppercase">Calendar</p>
              <h3 className="text-xl font-semibold text-white mt-3">Track booking status across clients</h3>
              <p className="text-text-secondary text-sm mt-3">One dashboard. Six statuses. Zero missed follow-ups.</p>
            </div>

            {/* Docket */}
            <div className="p-8 rounded-2xl border border-bg-border bg-bg-surface hover:border-accent-primary/30 transition-smooth cursor-pointer">
              <p className="mono text-accent-primary text-xs font-semibold tracking-widest uppercase">Docket</p>
              <h3 className="text-xl font-semibold text-white mt-3">Task management per client</h3>
              <p className="text-text-secondary text-sm mt-3">Organized, prioritized, never loses context switching.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Ops Section */}
      <section className="relative py-24 px-4 bg-bg-base">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl border border-ops-accent/20 bg-bg-ops p-12">
            {/* Red radial glow */}
            <div className="absolute inset-0 bg-glow-red pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <p className="mono text-xs text-ops-accent tracking-[0.3em] uppercase font-semibold">
                ████ Dark Ops
              </p>

              <h2 className="text-4xl font-bold text-white">
                For founders who need<br />it handled.
              </h2>

              <p className="text-text-secondary max-w-md">
                Dedicated Filipino EA, matched to your workflow. Retainer-based. Async-first. Results, not check-ins.
              </p>

              <button className="mt-8 px-8 py-3 border border-ops-accent text-ops-accent hover:bg-ops-accent hover:text-white rounded-full font-semibold text-sm transition-smooth">
                Apply for a spot →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-bg-border bg-bg-base py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white font-bold">RunsDark</div>
          <div className="text-text-secondary text-sm">
            Built for Filipino EAs managing global clients.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-text-secondary hover:text-white transition-smooth text-sm">Twitter</a>
            <a href="#" className="text-text-secondary hover:text-white transition-smooth text-sm">Email</a>
          </div>
        </div>
      </footer>
    </>
  );
}
