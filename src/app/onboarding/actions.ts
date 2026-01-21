"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function saveProfile(formData: FormData) {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const tags = formData.get("tags") as string

    try {
        await prisma.creator.update({
            where: { email: session.user.email },
            data: {
                genreTags: tags,
                status: "VERIFIED" // Moving from WAITING to VERIFIED after onboarding
            }
        })
        revalidatePath("/dashboard")
        return { success: true }
    } catch (error) {
        console.error("Failed to save profile:", error)
        return { success: false, error: "Failed to save profile" }
    }
}
