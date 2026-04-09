"use server";

import { fetchSteamProfile, fetchSteamBans, fetchCS2SpaceData } from '@/lib/apiClients';
import { calculateRiskMetrics } from '@/lib/scanner';
import { generateMockReport } from '@/lib/mockData';

export async function analyzeUser(steamId) {
  // 1. Check if we have real API keys
  const hasSteamKey = process.env.STEAM_API_KEY && process.env.STEAM_API_KEY !== "your_steam_api_key_here";
  
  if (!hasSteamKey) {
    // Fallback to Mock Data if no keys configured
    console.log("No API keys found. Returning mock data for demonstration.");
    return generateMockReport(steamId);
  }

  try {
    // 2. Parallel fetching of real data
    const [steamProfile, steamBans, cs2Data] = await Promise.all([
      fetchSteamProfile(steamId),
      fetchSteamBans(steamId),
      fetchCS2SpaceData(steamId)
    ]);

    if (!steamProfile) {
      throw new Error("Could not find Steam profile.");
    }

    // 3. Transform external data into our report format
    const matches = cs2Data?.matches || []; // Assuming cs2.space returns a match history
    const riskAnalysis = calculateRiskMetrics(matches);

    // If no matches found in external data, we might still have profile risk
    const finalRisk = riskAnalysis || {
      probability: steamBans?.VACBanned ? 99 : 5,
      level: steamBans?.VACBanned ? "RAGE_CHEATER" : "LOW",
      label: steamBans?.VACBanned ? "Banned" : "Bajo Riesgo",
      color: steamBans?.VACBanned ? "#ef4444" : "#22c55e",
      flags: steamBans?.VACBanned ? [{ title: "VAC Banned", severity: "CRITICAL", description: "Account is already banned by Valve." }] : []
    };

    return {
      report_id: `real_${Date.now()}`,
      timestamp: new Date().toISOString(),
      profile: {
        steam_id: steamId,
        personaname: steamProfile.personaname,
        avatar_url: steamProfile.avatarfull,
        account_age_days: Math.floor((Date.now() - (steamProfile.timecreated * 1000)) / (1000 * 60 * 60 * 24)) || 0,
        total_cs2_hours: 0, // Need to fetch from GetOwnedGames if needed
        faceit_level: cs2Data?.faceit?.level || null,
        vac_banned: steamBans?.VACBanned || false,
        game_bans: steamBans?.NumberOfGameBans || 0
      },
      risk_analysis: finalRisk,
      overall_stats: {
        avg_kd: riskAnalysis?.stats?.avg_kd || 0,
        avg_hs_percent: riskAnalysis?.stats?.avg_hs_percent || 0,
        avg_adr: 0, 
        consistency_score: riskAnalysis?.stats?.consistency_score || 0
      },
      history: matches.map(m => ({
        kd: m.kd,
        hs: m.hs_percent,
        adr: m.adr,
        date: m.date,
        is_anomaly: m.kd > 2.5 || m.hs_percent > 80 // Simple rule for real data
      })),
      benchmarks: {
        user_vs_pro: {
          aim_rating: cs2Data?.leetify?.aim_rating || 50,
          pro_avg: 88,
          percentile: 50
        }
      }
    };
  } catch (error) {
    console.error("Analysis failed:", error);
    return { error: error.message };
  }
}
