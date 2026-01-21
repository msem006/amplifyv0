"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function joinCampaign(campaignId: string) {
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    const creator = await prisma.creator.findUnique({
        where: { email: session.user.email }
    })

    if (!creator) {
        throw new Error("Creator not found")
    }

    // Check if already joined
    const existing = await prisma.trackingLink.findFirst({
        where: {
            creatorId: creator.id,
            campaignId: campaignId
        }
    })

    if (existing) {
        return { success: true, message: "Already joined" }
    }

    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
    })

    if (!campaign) {
        throw new Error("Campaign not found")
    }

    // Check inventory (Simulated)
    if (campaign.keysClaimed >= campaign.keysAllocated) {
        return { success: false, message: "No keys remaining" }
    }

    // Generate Link
    // Simple mock logic for unique code
    const username = creator.twitchUsername || "user";
    const uniqueCode = `${username.substring(0, 4)}-${campaign.gameTitle.substring(0, 3)}-${Math.floor(Math.random() * 10000)}`.toLowerCase()

    await prisma.trackingLink.create({
        data: {
            creatorId: creator.id,
            campaignId: campaignId,
            uniqueCode,
            status: "ACTIVE",
            clicksCount: 0,
            installsCount: 0
        }
    })

    // Increment claim count
    await prisma.campaign.update({
        where: { id: campaignId },
        data: { keysClaimed: { increment: 1 } }
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/campaigns")

    return { success: true }
}
