import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
    const [creators, campaigns] = await Promise.all([
        prisma.creator.findMany({
            orderBy: { reliabilityScore: 'desc' },
            include: { trackingLinks: true }
        }),
        prisma.campaign.findMany({
            include: { trackingLinks: true }
        })
    ])

    // Calculate Platform Totals
    const totalClicks = campaigns.reduce((acc, c) => acc + c.trackingLinks.reduce((a, l) => a + l.clicksCount, 0), 0);
    const totalInstalls = campaigns.reduce((acc, c) => acc + c.trackingLinks.reduce((a, l) => a + l.installsCount, 0), 0);

    return (
        <main className="min-h-screen p-8 bg-black text-white">
            <div className="container mx-auto space-y-12 animate-fade-in">

                {/* Header Stats */}
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient">Admin Ops: Scale Engine</h1>
                            <p className="text-gray-400 mt-1">ROI Monitoring & Attribution</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="glass-panel p-6 border-b-4 border-purple-500">
                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Roster</div>
                            <div className="text-3xl font-bold">{creators.length}</div>
                        </div>
                        <div className="glass-panel p-6 border-b-4 border-blue-500">
                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Platform Clicks</div>
                            <div className="text-3xl font-bold">{totalClicks.toLocaleString()}</div>
                        </div>
                        <div className="glass-panel p-6 border-b-4 border-green-500">
                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Verified Installs</div>
                            <div className="text-3xl font-bold text-green-400">{totalInstalls.toLocaleString()}</div>
                        </div>
                        <div className="glass-panel p-6 border-b-4 border-yellow-500">
                            <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Conversion Rate</div>
                            <div className="text-3xl font-bold">{totalClicks > 0 ? ((totalInstalls / totalClicks) * 100).toFixed(2) : 0}%</div>
                        </div>
                    </div>
                </div>

                {/* Campaign ROI Table */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Active Campaign Performance</h2>
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-6">Campaign</th>
                                    <th className="py-4 px-6">Keys Claimed</th>
                                    <th className="py-4 px-6">Traffic (Clicks)</th>
                                    <th className="py-4 px-6">Attribution (Installs)</th>
                                    <th className="py-4 px-6 text-right">Conv. Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {campaigns.map(campaign => {
                                    const clicks = campaign.trackingLinks.reduce((a, l) => a + l.clicksCount, 0);
                                    const installs = campaign.trackingLinks.reduce((a, l) => a + l.installsCount, 0);
                                    return (
                                        <tr key={campaign.id} className="hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-6 font-bold flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-gray-800 overflow-hidden shrink-0">
                                                    {campaign.imageUrl && <img src={campaign.imageUrl} className="w-full h-full object-cover" />}
                                                </div>
                                                {campaign.name}
                                            </td>
                                            <td className="py-4 px-6 text-gray-400">{campaign.keysClaimed} / {campaign.keysAllocated}</td>
                                            <td className="py-4 px-6 font-mono text-blue-300">{clicks}</td>
                                            <td className="py-4 px-6 font-mono text-green-400">{installs}</td>
                                            <td className="py-4 px-6 text-right font-mono">
                                                {clicks > 0 ? ((installs / clicks) * 100).toFixed(1) : 0}%
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Creator Roster Table */}
                <div>
                    <h2 className="text-2xl font-bold mb-4">Top Performing Creators</h2>
                    <div className="glass-panel overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/5 text-gray-400 uppercase tracking-wider">
                                <tr>
                                    <th className="py-4 px-6">Score</th>
                                    <th className="py-4 px-6">Creator</th>
                                    <th className="py-4 px-6">Tags</th>
                                    <th className="py-4 px-6 text-right">Attributed Installs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {creators.map((creator) => (
                                    <tr key={creator.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="py-4 px-6">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${creator.reliabilityScore >= 80 ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                {creator.reliabilityScore}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-medium text-white">{creator.twitchUsername}</div>
                                            <div className="text-[10px] text-gray-500">{creator.email}</div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-400 max-w-[200px] truncate">{creator.genreTags}</td>
                                        <td className="py-4 px-6 text-right font-bold text-green-400">
                                            {creator.trackingLinks.reduce((a, b) => a + b.installsCount, 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}
