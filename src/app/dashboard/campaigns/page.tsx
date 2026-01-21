import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { joinCampaign } from "./actions"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function CampaignsPage() {
    // 1. Context check: Ensure the user is logged in as a creator.
    const session = await auth()
    if (!session?.user?.email) redirect("/")

    // 2. State Check: Fetch campaigns and the user's current "Joined" status.
    // This prevents double-applying and shows which campaigns are already active in their dashboard.
    const [campaigns, creator] = await Promise.all([
        prisma.campaign.findMany({ orderBy: { status: 'asc' } }),
        prisma.creator.findUnique({
            where: { email: session.user.email },
            include: { trackingLinks: true }
        })
    ])

    if (!creator) return (
        <main className="min-h-screen bg-black text-white p-8 pt-20 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold text-red-500">Error loading profile</h2>
                <p className="text-gray-400">Please try logging out and back in.</p>
            </div>
        </main>
    )

    const joinedCampaignIds = new Set(creator.trackingLinks.map(l => l.campaignId))

    return (
        <main className="min-h-screen bg-black text-white p-8 pt-20">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
                <header className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-gradient">Amplify Offer Wall</h1>
                        <p className="text-gray-400 mt-2">Discover new games, earn rewards, and grow your audience.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => {
                        const isJoined = joinedCampaignIds.has(campaign.id);
                        const isWaitlist = campaign.status === 'WAITLIST';
                        const isClosed = campaign.status === 'CLOSED';

                        return (
                            <div key={campaign.id} className={`glass-panel overflow-hidden flex flex-col h-full transition-all group ${isJoined ? 'border-purple-500/50 bg-purple-500/5' : 'hover:border-purple-500/30'}`}>
                                {/* Card Image */}
                                <div className="h-40 w-full relative bg-gray-900 border-b border-white/10">
                                    {campaign.imageUrl ? (
                                        <img
                                            src={campaign.imageUrl}
                                            alt={campaign.name}
                                            className={`w-full h-full object-cover transition-transform duration-500 ${isJoined ? 'opacity-100' : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold bg-white/5">
                                            NO IMAGE
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        {isJoined && (
                                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md bg-purple-500 text-white shadow-lg shadow-purple-500/20">
                                                Active
                                            </span>
                                        )}
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${campaign.status === 'OPEN' ? 'bg-green-500/80 text-white border border-green-500/50' :
                                            campaign.status === 'WAITLIST' ? 'bg-blue-500/80 text-white border border-blue-500/50' :
                                                'bg-gray-700/80 text-gray-300'
                                            }`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">{campaign.genre}</span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">{campaign.name}</h3>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">{campaign.incentiveReward}</p>

                                        {!isJoined && !isClosed && (
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-gray-400">
                                                    <span>Keys Available</span>
                                                    <span>{campaign.keysAllocated - campaign.keysClaimed}</span>
                                                </div>
                                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gray-500"
                                                        style={{ width: `${(campaign.keysClaimed / campaign.keysAllocated) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {isJoined ? (
                                        <Link href="/dashboard" className="w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-center transition-all shadow-lg shadow-purple-900/20">
                                            View in Dashboard
                                        </Link>
                                    ) : isClosed ? (
                                        <button disabled className="w-full py-2 rounded-lg bg-white/5 text-gray-500 font-semibold cursor-not-allowed">
                                            Campaign Closed
                                        </button>
                                    ) : (
                                        <form action={async () => {
                                            "use server"
                                            await joinCampaign(campaign.id)
                                        }}>
                                            <button className={`w-full py-2 rounded-lg font-semibold transition-all border ${isWaitlist
                                                ? 'bg-blue-900/20 border-blue-500/30 text-blue-300 hover:bg-blue-900/40'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500 hover:text-purple-300'
                                                }`}>
                                                {isWaitlist ? 'Join Waitlist' : 'Apply Now'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}
