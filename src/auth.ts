import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "V2 Prototype Access",
            // For the V2 prototype, we use a custom Credentials provider to simulate different user roles.
            // This allows the user to jump between Admin and Creator views instantly.
            credentials: {
                role: { label: "Select Role", type: "text" }
            },
            async authorize(credentials) {
                // Map the selected role to one of our seeded email addresses
                let email = "shroud_clone@gmail.com"; // Default High Tier Creator ("Top Talent")

                if (credentials?.role === "admin") {
                    email = "admin@amplify.gg";
                } else if (credentials?.role === "newbie") {
                    email = "newbie_streamer@test.com";
                }

                console.log("[Auth] Attempting login for role:", credentials?.role, "Mapped email:", email);

                try {
                    // Verify the user exists in our local database
                    const user = await prisma.creator.findUnique({
                        where: { email }
                    });

                    if (user) {
                        console.log("[Auth] User found:", user.id);
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.twitchUsername,
                        }
                    } else {
                        console.error("[Auth] User NOT found for email:", email);
                        return null;
                    }
                } catch (error) {
                    console.error("[Auth] Database/Server Error during authorization:", error);
                    throw new Error("Internal Server Error during Login Check");
                }
            }
        })
    ],
    callbacks: {
        // Ensure the internal User ID is passed into the session for database queries
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        // Force the sign-in flow to use our custom landing page buttons
        signIn: '/'
    }
})
