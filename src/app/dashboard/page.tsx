import { auth, signOut } from "@/auth"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    // 1. Session & Auth: Check if user is logged in
    const session = await auth()

    if (!session?.user?.email) {
        redirect("/")
    }

    // 2. Data Ingestion: Fetch the creator's profile along with their active "Tracking Links"
    // This demonstrates the V2 "Attribution" model vs simple key distribution.
    const creator = await prisma.creator.findUnique({
        where: { email: session.user.email },
        include: {
            trackingLinks: {
                include: { campaign: true }
            }
        }
    })

    // 3. Fallback: If DB was reset/reseeded, the current browser session might be stale.
    // We show a clear "Session Expired" screen instead of a raw 404 or crash.
    if (!creator) {
        return (
            <main className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
                <div className="glass-panel p-8 max-w-md w-full text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-500 mb-4">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gradient">Session Expired</h1>
                    <p className="text-gray-400">Your prototype session is invalid because the database was reset. Please login again.</p>
                    <form action={async () => {
                        "use server"
                        await signOut({ redirectTo: "/" })
                    }}>
                        <button className="btn-primary w-full">Back to Login</button>
                    </form>
                </div>
            </main>
        )
    }

    // Calculate simulated earnings based on mock installs
    const estimatedEarnings = creator.trackingLinks.reduce((acc, link) => acc + (link.installsCount * 5), 0);

    return (
        <main className="min-h-screen bg-black text-white p-8">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold">Welcome, <span className="text-gradient">{creator.twitchUsername}</span></h1>
                            {creator.reliabilityScore > 80 && (
                                <span className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                                    Top Talent
                                </span>
                            )}
                        </div>
                        <div className="flex gap-4 items-center text-sm text-gray-400">
                            <p>Status: <span className={creator.status === 'VERIFIED' ? 'text-green-400' : 'text-yellow-400'}>{creator.status}</span></p>
                            <span>•</span>
                            <Link href="/admin" className="hover:text-white underline decoration-dashed underline-offset-4">
                                Admin View (Prototype)
                            </Link>
                        </div>
                    </div>
                </header>

                {/* ROI Stats Grid: Demonstrates the business value of tracking clicks vs installs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 border-l-4 border-green-500 has-tooltip">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Reliability Score</div>
                        <div className="text-3xl font-bold">{creator.reliabilityScore}<span className="text-lg text-gray-500">/100</span></div>
                        <div className="tooltip-text">A weighted score (0-100) based on your historical campaign performance, key usage, and audience engagement quality.</div>
                    </div>
                    <div className="glass-panel p-6 border-l-4 border-blue-500 has-tooltip">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Clicks</div>
                        <div className="text-3xl font-bold">{creator.trackingLinks.reduce((a, b) => a + b.clicksCount, 0)}</div>
                        <div className="tooltip-text">The cumulative number of unique shoppers who clicked your shared Loot Links across all active campaigns.</div>
                    </div>
                    <div className="glass-panel p-6 border-l-4 border-purple-500 has-tooltip">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Verified Installs</div>
                        <div className="text-3xl font-bold">{creator.trackingLinks.reduce((a, b) => a + b.installsCount, 0)}</div>
                        <div className="tooltip-text">Successful game installations that were directly attributed to your tracking links via the Amplify attribution engine.</div>
                    </div>
                    <div className="glass-panel p-6 border-l-4 border-yellow-500 has-tooltip">
                        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Est. Earnings</div>
                        <div className="text-3xl font-bold">${estimatedEarnings}</div>
                        <div className="tooltip-text">Calculated revenue based on verified installs. Note: This prototype uses a flat $5.00 per-install reward model.</div>
                    </div>
                </div>

                {/* Active Campaigns / Tracking Links */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Your Active Drops</h2>
                        <Link href="/dashboard/campaigns" className="btn-secondary text-sm">Find New Campaigns</Link>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {creator.trackingLinks.length > 0 ? creator.trackingLinks.map(link => (
                            <div key={link.id} className="glass-panel p-6 flex flex-col lg:flex-row justify-between items-center gap-6 group hover:border-white/20 transition-all">
                                <div className="flex gap-6 items-center flex-1">
                                    <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center font-bold text-xl border border-white/10 overflow-hidden relative">
                                        {link.campaign.imageUrl ? (
                                            <img src={link.campaign.imageUrl} alt={link.campaign.name} className="w-full h-full object-cover" />
                                        ) : (
                                            link.campaign.name[0]
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold group-hover:text-purple-400 transition-colors">{link.campaign.name}</h3>
                                        <div className="flex gap-2 mt-2">
                                            <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                                                Reward: {link.campaign.incentiveReward}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Loot Link Component: This is the core engine feature. The uniqueCode is used for redirection/attribution. */}
                                <div className="flex flex-col gap-2 w-full lg:w-auto bg-black/40 p-4 rounded-lg border border-white/5">
                                    <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your Tracking Link</div>
                                    <div className="flex items-center gap-2 font-mono text-purple-300 bg-purple-500/10 px-3 py-2 rounded text-sm break-all">
                                        amplify.gg/c/{link.uniqueCode}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto opacity-50 cursor-pointer hover:opacity-100">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex gap-8 text-center min-w-[150px]">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase">Clicks</div>
                                        <div className="font-bold text-lg">{link.clicksCount}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase">Installs</div>
                                        <div className="font-bold text-lg text-green-400">{link.installsCount}</div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 glass-panel border-dashed border-2 border-white/10">
                                <p className="text-gray-400 mb-4">You haven't joined any campaigns yet.</p>
                                <Link href="/dashboard/campaigns" className="btn-primary">Browse Offer Wall</Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}
