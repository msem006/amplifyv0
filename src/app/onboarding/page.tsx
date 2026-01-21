"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveProfile } from './actions'

export default function OnboardingPage() {
    const router = useRouter()
    const [tags, setTags] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append("tags", tags)

        try {
            const result = await saveProfile(formData)
            if (result.success) {
                router.push('/dashboard')
            } else {
                alert(result.error)
            }
        } catch (err) {
            console.error(err)
            alert("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen p-8 bg-black text-white flex items-center justify-center">
            <div className="max-w-md w-full glass-panel p-8 space-y-8 animate-fade-in">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gradient">Complete Your Profile</h1>
                    <p className="text-gray-400 mt-2">Help us match you with the right game drops.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            What games do you usually stream?
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. FPS, RPG, MOBA"
                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-mono"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">Comma separated tags help us filter opportunities.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <span className="animate-pulse">Saving Profile...</span>
                        ) : (
                            <>
                                Enter Dashboard
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </main>
    )
}
