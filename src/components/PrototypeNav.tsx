"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function PrototypeNav() {
    const pathname = usePathname()
    if (pathname === '/') return null; // Don't show on landing page

    const views = [
        { name: "Landing Page", path: "/" },
        { name: "Creator Dashboard", path: "/dashboard" },
        { name: "Admin ROI Engine", path: "/admin" },
        { name: "Offer Wall", path: "/dashboard/campaigns" }
    ]

    const currentViewName = views.find(v => v.path === pathname)?.name || "Select View"

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-2 flex justify-between items-center text-xs">
            <div className="flex items-center gap-6 font-mono">
                <span className="text-purple-400 font-bold tracking-widest bg-purple-500/10 px-2 py-0.5 rounded">AMPLIFY V2</span>
            </div>

            <div className="flex items-center gap-6">
                <span className="animate-flashing-red select-none text-[10px] tracking-tighter">⚠️ PROTOTYPE: HOVER TO SWITCH VIEWS</span>
                <div className="nav-dropdown-container">
                    <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors uppercase tracking-tight">
                        Current View: <span className="text-white font-bold">{currentViewName}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    <div className="nav-dropdown-menu">
                        {views.map(view => (
                            <Link
                                key={view.path}
                                href={view.path}
                                className={`nav-dropdown-item ${pathname === view.path ? 'active' : ''}`}
                            >
                                {view.name}
                            </Link>
                        ))}
                        <div className="h-px bg-white/10 my-1" />
                        <form action="/api/auth/signout" method="POST">
                            <button className="nav-dropdown-item w-full text-left text-red-400/70 hover:text-red-400">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
