"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

/**
 * Server Action: Allows a creator to join a campaign.
 * This generates a unique tracking link (Loot Link) and handles key inventory.
 */
export async function joinCampaign(campaignId: string) {
    // 1. Authenticate the session
    const session = await auth()
    if (!session?.user?.email) {
        throw new Error("Unauthorized")
    }

    // 2. Fetch the creator's profile from the database
    const creator = await prisma.creator.findUnique({
        where: { email: session.user.email }
    })

    if (!creator) {
        throw new Error("Creator not found")
    }

    // 3. Verify the creator hasn't already joined this campaign
    const existing = await prisma.trackingLink.findFirst({
        where: {
            creatorId: creator.id,
            campaignId: campaignId
        }
    })

    if (existing) {
        return { success: true, message: "Already joined" }
    }

    // 4. Validate the campaign exists and has available keys
    const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
    })

    if (!campaign) {
        throw new Error("Campaign not found")
    }

    // Simulation: Block join if keys are exhausted
    if (campaign.keysClaimed >= campaign.keysAllocated) {
        return { success: false, message: "No keys remaining" }
    }

    // 5. Generate a semi-random unique tracking code (e.g., "shro-neon-1234")
    // In production, this would be a shortened amplify.gg/c/[code] URL
    const username = creator.twitchUsername || "user";
    const uniqueCode = `${username.substring(0, 4)}-${campaign.gameTitle.substring(0, 3)}-${Math.floor(Math.random() * 10000)}`.toLowerCase()

    // 6. Persist the new link in the database
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

    // 7. Increment global claim count for the campaign ROI monitoring
    await prisma.campaign.update({
        where: { id: campaignId },
        data: { keysClaimed: { increment: 1 } }
    })

    // 8. Revalidate the UI paths to reflect changes instantly (Next.js App Router)
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/campaigns")

    return { success: true }
}
