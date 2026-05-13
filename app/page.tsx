"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoIcon, DashboardIcon, OrdersIcon, CustomersIcon, AnalyticsIcon } from "@/components/icons";
import { motion } from "framer-motion";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-16 w-16 rounded-2xl border-b-4 border-r-4 border-primary shadow-2xl shadow-primary/20"
        />
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30 overflow-x-hidden">
      {/* Abstract Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-700" />
      </div>

      {/* Navigation */}
      <nav className="relative flex items-center justify-between p-6 max-w-7xl mx-auto z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg group-hover:rotate-12 transition-transform">
            <LogoIcon className="w-5 h-5" />
          </div>
          <span className="font-black text-2xl tracking-tighter italic">TEZFLOW <span className="text-primary not-italic font-bold">CRM</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-6 shadow-xl shadow-white/10">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-32 z-10 text-center space-y-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
            The Future of Telegram Sales
          </span>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8">
            SELL SMARTER ON <br />
            <span className="bg-gradient-to-r from-primary via-blue-400 to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">TELEGRAM</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium">
            TezFlow is the premium dashboard for Telegram-based startups.
            Manage orders, automate notifications, and scale your business with ease.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/signup">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 w-full sm:w-auto">
              Start Free Today
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold rounded-full border-slate-700 hover:bg-slate-900 w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative max-w-5xl mx-auto mt-20 pt-4 rounded-t-[2.5rem] bg-gradient-to-b from-slate-800 to-slate-950 p-2 border-t border-x border-slate-700 shadow-[0_-40px_100px_-20px_rgba(59,130,246,0.15)]"
        >
          <div className="rounded-t-[2rem] bg-slate-900 overflow-hidden aspect-[16/10] border border-slate-800">
            <div className="flex items-center gap-2 p-4 border-b border-slate-800 bg-slate-900/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 max-w-md mx-auto h-6 rounded-md bg-slate-800/50 flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-mono">dashboard.tezflow.io</span>
              </div>
            </div>
            <div className="p-8 grid grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
              <div className="col-span-2 space-y-6">
                <div className="h-12 w-48 bg-slate-800 rounded-lg" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-800 rounded-xl" />
                  <div className="h-24 bg-slate-800 rounded-xl" />
                  <div className="h-24 bg-slate-800 rounded-xl" />
                </div>
                <div className="h-64 bg-slate-800 rounded-2xl" />
              </div>
              <div className="space-y-6">
                <div className="h-80 bg-slate-800 rounded-2xl" />
                <div className="h-24 bg-slate-800 rounded-xl" />
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-950/80 backdrop-blur-md px-8 py-4 rounded-2xl border border-primary/20 text-primary font-bold shadow-2xl">
                SaaS Dashboard Preview
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-6 py-32 z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-4">Built for Hyper-Growth</h2>
          <p className="text-slate-400">Everything you need to turn Telegram into a revenue engine.</p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <FeatureCard
            variants={item}
            icon={DashboardIcon}
            title="Smart Analytics"
            desc="Track every conversion and dollar with precision charts."
          />
          <FeatureCard
            variants={item}
            icon={OrdersIcon}
            title="Order Engine"
            desc="Flow from creation to delivery in a single beautiful pipeline."
          />
          <FeatureCard
            variants={item}
            icon={CustomersIcon}
            title="CRM Pro"
            desc="Keep full history of your buyers and their preferences."
          />
          <FeatureCard
            variants={item}
            icon={AnalyticsIcon}
            title="Telegram Bot"
            desc="Auto-notify your team and customers via Telegram instantly."
          />
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-6 py-32 text-center relative z-10">
        <div className="rounded-[3rem] bg-gradient-to-br from-primary to-blue-700 p-1px">
          <div className="rounded-[3rem] bg-slate-950 p-12 md:p-20 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none" />
            <h2 className="text-4xl md:text-5xl font-black">Ready to launch?</h2>
            <p className="text-slate-400 text-xl max-w-xl mx-auto">
              Join the top 1% of Telegram sellers who use TezFlow to dominate their niche.
            </p>
            <Link href="/signup" className="inline-block">
              <Button size="lg" className="h-16 px-10 text-xl font-black rounded-full bg-white text-black hover:bg-slate-100 shadow-2xl">
                Claim Your Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-12 px-6 text-center text-sm text-slate-500 relative z-10 bg-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-6 h-6 rounded-md bg-white text-black flex items-center justify-center font-black text-[10px]">A</div>
            <span className="font-bold tracking-tighter">TEZFLOW</span>
          </div>
          <p>&copy; 2025 TezFlow CRM. The premium OS for Telegram Sellers.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, variants }: any) {
  return (
    <motion.div
      variants={variants}
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-primary/50 transition-all group"
    >
      <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary transition-all shadow-lg group-hover:shadow-primary/20">
        <Icon className="w-6 h-6 text-primary group-hover:text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}
