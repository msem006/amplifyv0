"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function PrototypeNav() {
    const pathname = usePathname()
    if (pathname === '/') return null; // Don't show on landing page

    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-2 flex justify-between items-center text-xs">
            <div className="flex gap-4 font-mono text-gray-400">
                <span className="text-purple-400 font-bold">AMPLIFY V2 PROTOTYPE</span>
                <span>•</span>
                <span>Current View: <span className="text-white uppercase">{pathname.split('/')[1] || 'Home'}</span></span>
            </div>

            <div className="flex gap-4">
                <form action="/api/auth/signout" method="POST">
                    <button className="hover:text-white transition-colors">Sign Out</button>
                </form>
                <span className="text-gray-700">|</span>
                <Link href="/dashboard" className={`hover:text-white transition-colors ${pathname === '/dashboard' ? 'text-white' : ''}`}>
                    Creator View
                </Link>
                <Link href="/admin" className={`hover:text-white transition-colors ${pathname === '/admin' ? 'text-white' : ''}`}>
                    Admin ROI
                </Link>
                <span className="text-gray-700">|</span>
                <Link href="/dashboard/campaigns" className={`hover:text-white transition-colors ${pathname === '/dashboard/campaigns' ? 'text-white' : ''}`}>
                    Offer Wall
                </Link>
            </div>
        </div>
    )
}
