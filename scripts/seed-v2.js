const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding Amplify V2 Scaled Data with Art...");

    // 1. Clear existing data
    await prisma.trackingLink.deleteMany({});
    await prisma.campaign.deleteMany({});
    await prisma.creator.deleteMany({});

    // 2. Create Expanded Campaigns (12 Items) with Art
    const campaignData = [
        { name: "Neon Strikers: Zero Hour", gameTitle: "Neon Strikers", genre: "FPS", status: "OPEN", keysAllocated: 5000, reward: "Use code NEON20 for 20% off skins", imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" }, // Cyberpunk Gaming
        { name: "Gothic Souls: Dark Arisen", gameTitle: "Gothic Souls", genre: "RPG", status: "WAITLIST", keysAllocated: 200, reward: "Exclusive 'Founder' Cloak for viewers", imageUrl: "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&w=800&q=80" }, // Dark Fantasy
        { name: "Cyber Arena Beta", gameTitle: "Cyber Arena", genre: "MOBA", status: "OPEN", keysAllocated: 10000, reward: "500 Gems Starter Pack", imageUrl: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80" }, // Neon Arena
        { name: "Star Wanderers", gameTitle: "Star Wanderers", genre: "Sci-Fi Sim", status: "OPEN", keysAllocated: 1500, reward: "Free Ship Skin: 'Void Runner'", imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=800&q=80" }, // Space
        { name: "Kingdom's Edge", gameTitle: "Kingdom's Edge", genre: "Strategy", status: "CLOSED", keysAllocated: 500, reward: "Gold Boost + 7 Day Premium", imageUrl: "https://images.unsplash.com/photo-1605806616949-1e87b487bcace?auto=format&fit=crop&w=800&q=80" }, // Castle/Strategy
        { name: "Apex Racers", gameTitle: "Apex Racers", genre: "Racing", status: "OPEN", keysAllocated: 3000, reward: "Unlock 'Turbo' Car Pack", imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80" }, // Racing
        { name: "Pixel Dungeon", gameTitle: "Pixel Dungeon", genre: "Roguelite", status: "OPEN", keysAllocated: 1000, reward: "Pet: 'Bit-Bat'", imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" }, // Retro/Pixel
        { name: "Horror Manor", gameTitle: "Horror Manor", genre: "Horror", status: "WAITLIST", keysAllocated: 100, reward: "Early Access Key", imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=800&q=80" }, // Spooky
        { name: "Tactical Ops 4", gameTitle: "Tactical Ops", genre: "Shooter", status: "OPEN", keysAllocated: 8000, reward: "Double XP Token (4 Hours)", imageUrl: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=800&q=80" }, // Soldier
        { name: "Card Battler X", gameTitle: "Card Battler X", genre: "TCG", status: "OPEN", keysAllocated: 2000, reward: "3 Gold Card Packs", imageUrl: "https://images.unsplash.com/photo-1612152605347-f93296cb657d?auto=format&fit=crop&w=800&q=80" }, // Cards
        { name: "Farm Life 2026", gameTitle: "Farm Life", genre: "Simulation", status: "OPEN", keysAllocated: 4000, reward: "Tractor Skin: 'Hot Rod'", imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" }, // Farm
        { name: "Dragon Quest: Origins", gameTitle: "Dragon Quest", genre: "MMO", status: "WAITLIST", keysAllocated: 500, reward: "Mount: 'Spectral Drake'", imageUrl: "https://images.unsplash.com/photo-1533236897111-3e94666b2edf?auto=format&fit=crop&w=800&q=80" } // Dragon/Fantasy
    ];

    const campaigns = [];
    for (const c of campaignData) {
        const camp = await prisma.campaign.create({
            data: {
                name: c.name,
                gameTitle: c.gameTitle,
                genre: c.genre,
                status: c.status,
                incentiveReward: c.reward,
                imageUrl: c.imageUrl,
                keysAllocated: c.keysAllocated,
                keysClaimed: Math.floor(Math.random() * (c.keysAllocated * 0.4)) // Random claimed amount
            }
        });
        campaigns.push(camp);
    }
    console.log(`✅ Created ${campaigns.length} campaigns.`);

    // 3. Create Diverse Creators (20 Items)
    const creatorTemplates = [
        { prefix: "Admin", role: "admin", score: 100, verified: true },
        { prefix: "Pro", role: "whale", score: 95, verified: true },
        { prefix: "Streamer", role: "mid", score: 75, verified: true },
        { prefix: "Newbie", role: "low", score: 40, verified: false }
    ];

    const creators = [];

    // Create specific login accounts first
    const specificAccounts = [
        { email: "admin@amplify.gg", user: "AmplifyAdmin", tag: "Admin", role: "admin" },
        { email: "shroud_clone@gmail.com", user: "FPS_God", tag: "FPS,Competitive", role: "whale" },
        { email: "newbie_streamer@test.com", user: "JustStarted123", tag: "Variety", role: "low" }
    ];

    for (const acc of specificAccounts) {
        const t = creatorTemplates.find(ct => ct.role === acc.role);
        creators.push(await prisma.creator.create({
            data: {
                email: acc.email,
                twitchId: `id_${acc.user}`,
                twitchUsername: acc.user,
                genreTags: acc.tag,
                status: t.verified ? "VERIFIED" : "WAITING",
                reliabilityScore: t.score,
                conversionRate: t.role === 'whale' ? 5.5 : 1.2
            }
        }));
    }

    // Generate random filler creators
    const genres = ["FPS", "RPG", "MOBA", "Strategy", "Horror", "Sim"];
    for (let i = 0; i < 17; i++) {
        const type = creatorTemplates[Math.floor(Math.random() * creatorTemplates.length)];
        const genre = genres[Math.floor(Math.random() * genres.length)];

        creators.push(await prisma.creator.create({
            data: {
                email: `user${i}@test.com`,
                twitchId: `twitch_id_${i}`,
                twitchUsername: `${type.prefix}_${genre}_${i}`,
                genreTags: genre,
                status: type.verified ? "VERIFIED" : "WAITING",
                reliabilityScore: Math.max(0, type.score + Math.floor(Math.random() * 20) - 10), // Add variance
                conversionRate: type.role === 'whale' ? (Math.random() * 5) + 2 : (Math.random() * 2)
            }
        }));
    }
    console.log(`✅ Created ${creators.length} creators.`);

    // 4. Generate Attribution Data (Links, Clicks, Installs)
    for (const creator of creators) {
        if (creator.status === "VERIFIED") {
            // Join 1-4 random campaigns
            const numCampaigns = Math.floor(Math.random() * 4) + 1;
            const shuffled = campaigns.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, numCampaigns);

            for (const camp of selected) {
                const baseClicks = creator.reliabilityScore * 5; // Better creators get more clicks
                const clicks = Math.floor(baseClicks * (Math.random() + 0.5));
                const installs = Math.floor(clicks * (creator.conversionRate / 100)); // Apply conversion rate

                await prisma.trackingLink.create({
                    data: {
                        creatorId: creator.id,
                        campaignId: camp.id,
                        uniqueCode: `${creator.twitchUsername.substring(0, 4)}-${camp.gameTitle.substring(0, 3)}-${Math.floor(Math.random() * 1000)}`.toLowerCase(),
                        clicksCount: clicks,
                        installsCount: installs
                    }
                });
            }
        }
    }

    console.log("✅ Generated realistic attribution history.");
    console.log("🌱 Scaled Database Populated!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
