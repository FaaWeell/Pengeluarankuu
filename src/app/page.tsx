import Link from "next/link";
import {
  Wallet,
  PieChart,
  Bell,
  Target,
  ArrowRight,
  Github,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simple Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">DompetKu</span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/FaaWeell"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero - Simple & Clean */}
      <section className="pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium mb-6">
            <Sparkles className="w-3 h-3" />
            Side project
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
            Tracking pengeluaran,<br />
            tanpa ribet.
          </h1>

          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            App sederhana buat catat uang masuk keluar.
            Gratis, data disimpan di browser, gak perlu sign up macem-macem.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Mulai Tracking
            </Link>
            <a
              href="https://github.com/FaaWeell"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              Source
            </a>
          </div>
        </div>
      </section>

      {/* Preview Card */}
      <section className="px-6 pb-16">
        <div className="container mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-primary text-primary-foreground">
                <div className="text-xs opacity-80 mb-1">Saldo</div>
                <div className="text-lg font-bold">Rp2.500.000</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Masuk</div>
                <div className="text-lg font-bold text-green-600">+5jt</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Keluar</div>
                <div className="text-lg font-bold text-red-500">-2.5jt</div>
              </div>
              <div className="p-4 rounded-lg bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Target</div>
                <div className="text-lg font-bold">75%</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Minimal */}
      <section className="px-6 py-16 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-xl font-semibold text-center mb-10">Yang bisa dilakuin</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Catat transaksi</h3>
                <p className="text-sm text-muted-foreground">Masuk keluar duit, tinggal masukin aja</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <PieChart className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Lihat breakdown</h3>
                <p className="text-sm text-muted-foreground">Grafiknya keliatan duit habis kemana</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Track subscription</h3>
                <p className="text-sm text-muted-foreground">Netflix, Spotify, dll biar gak lupa bayar</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Set target</h3>
                <p className="text-sm text-muted-foreground">Mau nabung berapa, progress-nya berapa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Simple */}
      <section className="px-6 py-16">
        <div className="container mx-auto max-w-xl text-center">
          <h2 className="text-xl font-semibold mb-3">Yuk, mulai tracking</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Data disimpan di browser kamu. Gak ada server, gak ada yang ngintip.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            Masuk
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="px-6 py-6 border-t border-border">
        <div className="container mx-auto max-w-3xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Wallet className="w-4 h-4" />
            DompetKu
          </div>
          <p className="text-xs text-muted-foreground">
            by Fajri
          </p>
        </div>
      </footer>
    </div>
  );
}
