/**
 * Core analysis logic for CS2 Trust Factor / Anti-Cheat detection.
 * Implementing Z-Score and Rule-based thresholds.
 */

export const calculateRiskMetrics = (matches) => {
  if (!matches || matches.length === 0) return null;

  const kds = matches.map(m => m.kd);
  const hss = matches.map(m => m.hs_percent);

  const avgKd = kds.reduce((a, b) => a + b, 0) / kds.length;
  const avgHs = hss.reduce((a, b) => a + b, 0) / hss.length;

  // Simple variance calculation
  const kdVar = kds.reduce((a, b) => a + Math.pow(b - avgKd, 2), 0) / kds.length;
  const hsVar = hss.reduce((a, b) => a + Math.pow(b - avgHs, 2), 0) / hss.length;

  // Rule-based flags
  const flags = [];
  if (avgHs > 70) {
    flags.push({ 
      title: "Extremely High HS%", 
      severity: "HIGH", 
      description: "Average headshot percentage is significantly above professional standards." 
    });
  }
  if (avgKd > 2.0 && matches.length > 20) {
    flags.push({ 
      title: "Inhuman Consistency", 
      severity: "MEDIUM", 
      description: "Maintains a very high K/D across a large sample size." 
    });
  }
  if (hsVar > 400) { // High variance in HS%
    flags.push({ 
      title: "HS% Volatility", 
      severity: "LOW", 
      description: "Large swings in headshot accuracy between matches." 
    });
  }

  // Final probability estimation (simple weighted logic for prototype)
  let probability = (avgHs / 100) * 40 + (avgKd / 4) * 40 + (flags.length * 10);
  probability = Math.min(Math.max(Math.round(probability), 1), 99);

  let level = "LOW";
  let label = "Bajo Riesgo";
  let color = "#22c55e"; // Green

  if (probability > 75) {
    level = "RAGE_CHEATER";
    label = "Alto Riesgo / Rage";
    color = "#ef4444"; // Red
  } else if (probability > 40) {
    level = "SUSPICIOUS";
    label = "Sospechoso";
    color = "#f59e0b"; // Amber
  }

  return {
    probability,
    level,
    label,
    color,
    flags,
    stats: {
      avg_kd: avgKd,
      avg_hs_percent: avgHs,
      consistency_score: Math.sqrt(kdVar + hsVar) / 10
    }
  };
};
