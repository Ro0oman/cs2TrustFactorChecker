export const generateMockReport = (steamId) => {
  const profile = {
    steam_id: steamId || "76561198000000000",
    personaname: "MockPlayer_Pro",
    avatar_url: "https://avatars.akamai.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg",
    account_age_days: 1250,
    total_cs2_hours: 4500,
    faceit_level: 10,
    vac_banned: false,
    game_bans: 0
  };

  const riskyStats = [
    { kd: 1.2, hs: 50, adr: 85, date: "2024-05-01" },
    { kd: 1.5, hs: 55, adr: 95, date: "2024-05-02" },
    { kd: 2.8, hs: 82, adr: 145, date: "2024-05-03", is_anomaly: true }, // Anomalous match
    { kd: 1.3, hs: 48, adr: 88, date: "2024-05-04" },
    { kd: 1.1, hs: 52, adr: 82, date: "2024-05-05" },
    { kd: 3.1, hs: 90, adr: 160, date: "2024-05-06", is_anomaly: true }, // Anomalous match
    { kd: 1.4, hs: 60, adr: 92, date: "2024-05-07" },
  ];

  return {
    report_id: `mock_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    profile,
    risk_analysis: {
      probability: 72,
      level: "SUSPICIOUS",
      label: "Sospechoso",
      color: "#f59e0b", // Amber/Yellow
      flags: [
        { id: 1, title: "Inhuman Reaction Time", severity: "HIGH", description: "Average reaction time below 150ms in several rounds." },
        { id: 2, title: "Abnormal HS% Spike", severity: "MEDIUM", description: "Headshot percentage jumped from 50% to 90% in consecutive matches." },
        { id: 3, title: "Low Account Trust", severity: "LOW", description: "Account has few friends and low inventory value." }
      ]
    },
    overall_stats: {
      avg_kd: 1.77,
      avg_hs_percent: 62.4,
      avg_adr: 105.3,
      consistency_score: 0.35 // Higher means more variation
    },
    history: riskyStats,
    benchmarks: {
      user_vs_pro: {
        aim_rating: 94,
        pro_avg: 88,
        percentile: 98.7
      }
    }
  };
};
