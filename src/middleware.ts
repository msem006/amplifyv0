export { auth as middleware } from "@/auth"

export const config = {
    // Only run middleware on dashboard and onboarding to avoid landing page loops
    matcher: ["/dashboard/:path*", "/onboarding/:path*"],
}
