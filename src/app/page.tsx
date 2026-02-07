import Link from "next/link";
import {
  Wallet,
  PieChart,
  Bell,
  Repeat,
  Target,
  Shield,
  ArrowRight,
  Check,
  TrendingUp,
  Github,
} from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Kelola Transaksi",
    description: "Catat pemasukan dan pengeluaran dengan mudah, lengkap dengan kategori dan tag.",
  },
  {
    icon: PieChart,
    title: "Anggaran Pintar",
    description: "Buat anggaran per kategori dan pantau progress spending kamu secara real-time.",
  },
  {
    icon: Bell,
    title: "Pengingat Tagihan",
    description: "Jangan pernah lupa bayar tagihan dengan notifikasi otomatis.",
  },
  {
    icon: Repeat,
    title: "Langganan Tracker",
    description: "Pantau semua subscription kamu dari Netflix hingga Spotify dalam satu tempat.",
  },
  {
    icon: Target,
    title: "Target Keuangan",
    description: "Set financial goals dan track progress tabunganmu menuju target.",
  },
  {
    icon: Shield,
    title: "Privasi Terjamin",
    description: "Data kamu aman dengan enkripsi end-to-end dan autentikasi yang kuat.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">DompetKu</span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/fajri"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Masuk
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Personal Expense Tracker
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Kelola Keuanganmu <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">
              dengan Lebih Mudah
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            DompetKu membantu kamu melacak pengeluaran, mengatur anggaran,
            dan mencapai tujuan finansialmu dengan dashboard yang intuitif.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium hover:from-emerald-600 hover:to-cyan-600 transition-all shadow-lg shadow-emerald-500/30"
            >
              Mulai Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/fajri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
            >
              <Github className="w-5 h-5" />
              Lihat di GitHub
            </a>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 blur-3xl -z-10"></div>
            <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                    <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
                      <Wallet className="w-4 h-4" />
                      Total Saldo
                    </div>
                    <div className="text-xl md:text-2xl font-bold">Rp15,750,000</div>
                  </div>
                  <div className="p-4 rounded-xl bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Pemasukan</div>
                    <div className="text-lg md:text-xl font-bold text-green-600">Rp8,500,000</div>
                  </div>
                  <div className="p-4 rounded-xl bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Pengeluaran</div>
                    <div className="text-lg md:text-xl font-bold text-red-600">Rp4,250,000</div>
                  </div>
                  <div className="p-4 rounded-xl bg-card border">
                    <div className="text-sm text-muted-foreground mb-1">Tabungan</div>
                    <div className="text-lg md:text-xl font-bold">Rp4,250,000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fitur Lengkap untuk Keuangan Pribadi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Semua yang kamu butuhkan untuk mengelola keuangan dalam satu aplikasi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-card border border-border hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 flex items-center justify-center mb-4 group-hover:from-emerald-500/20 group-hover:to-cyan-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Mulai Kelola Keuanganmu Hari Ini</h2>
            <p className="opacity-90 mb-6 max-w-xl mx-auto">
              Aplikasi personal expense tracker yang simpel dan mudah digunakan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-emerald-600 font-medium hover:bg-white/90 transition-colors"
              >
                Masuk Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Data lokal
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Privasi terjaga
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4" />
                Open source
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
              <Wallet className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold">DompetKu</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/fajri"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 DompetKu. Made by Fajri.
          </p>
        </div>
      </footer>
    </div>
  );
}
