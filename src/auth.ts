import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: "V2 Prototype Access",
            credentials: {
                role: { label: "Select Role", type: "text" }
            },
            async authorize(credentials) {
                // Determine which mock user to login as
                let email = "shroud_clone@gmail.com"; // Default High Tier Creator

                if (credentials?.role === "admin") {
                    email = "admin@amplify.gg";
                } else if (credentials?.role === "newbie") {
                    email = "newbie_streamer@test.com";
                }

                const user = await prisma.creator.findUnique({
                    where: { email }
                });

                if (user) {
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.twitchUsername,
                    }
                }
                return null
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    },
    pages: {
        signIn: '/' // Redirect to home to use our custom buttons
    }
})
