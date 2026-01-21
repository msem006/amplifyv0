import Link from 'next/link';
import { auth, signIn } from '@/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // 1. Session Check: (Disabled to prevent redirect loops on Vercel deployment if session is stale)
  /*
  let session = null;
  try {
    session = await auth();
  } catch (error) {
    console.error("Auth check error (likely due to DB reset):", error);
  }

  if (session) {
    redirect("/dashboard");
  }
  */

  return (
    <main className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
      </div>

      <div className="container relative z-10 text-center animate-fade-in">
        <div className="mb-8">
          <span className="px-3 py-1 rounded-full border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] text-sm text-gray-400 uppercase tracking-widest">
            Exclusive Access
          </span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
          YOU'VE BEEN <br />
          <span className="text-gradient">SCOUTED</span>
        </h1>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          We are building an exclusive roster for upcoming AAA launches.
          Secure your spot now to be eligible for future drops.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          {/* Prototype Login: This form simulates a Creator login using NextAuth server actions */}
          <form action={async () => {
            "use server"
            await signIn("credentials", { role: "creator", redirectTo: "/dashboard/campaigns" })
          }}>
            <button className="btn-primary flex items-center gap-2 group w-full md:w-auto justify-center px-8">
              <span className="font-bold">Login as Top Creator</span>
              <span className="text-xs opacity-75">(Mock Auth)</span>
            </button>
          </form>

          {/* Prototype Login: Simulates an Admin login */}
          <form action={async () => {
            "use server"
            await signIn("credentials", { role: "admin", redirectTo: "/admin" })
          }}>
            <button className="px-8 py-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all font-semibold glass-panel w-full md:w-auto text-purple-300">
              Login as Admin
            </button>
          </form>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-500 text-sm">
          <div>
            <div className="text-white text-2xl font-bold mb-1">1,000+</div>
            <div>Creators Onboarded</div>
          </div>
          <div>
            <div className="text-white text-2xl font-bold mb-1">AAA</div>
            <div>Game Partnerships</div>
          </div>
          <div>
            <div className="text-white text-2xl font-bold mb-1">Early</div>
            <div>Access Keys</div>
          </div>
          <div>
            <div className="text-white text-2xl font-bold mb-1">$0</div>
            <div>Platform Fees</div>
          </div>
        </div>
      </div>
    </main>
  );
}
