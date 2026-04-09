/**
 * API Clients for Steam, FACEIT, and CS2.space
 */

const STEAM_BASE_URL = "https://api.steampowered.com";
const CS2_SPACE_BASE_URL = "https://cs2.space/api";

export async function fetchSteamProfile(steamId) {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey || apiKey === "your_steam_api_key_here") {
    console.warn("Steam API Key missing. Falling back to mock data.");
    return null;
  }

  try {
    const response = await fetch(
      `${STEAM_BASE_URL}/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamId}`
    );
    const data = await response.json();
    return data.response.players[0] || null;
  } catch (error) {
    console.error("Error fetching Steam profile:", error);
    return null;
  }
}

export async function fetchSteamBans(steamId) {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey || apiKey === "your_steam_api_key_here") return null;

  try {
    const response = await fetch(
      `${STEAM_BASE_URL}/ISteamUser/GetPlayerBans/v1/?key=${apiKey}&steamids=${steamId}`
    );
    const data = await response.json();
    return data.players[0] || null;
  } catch (error) {
    console.error("Error fetching Steam bans:", error);
    return null;
  }
}

export async function fetchCS2SpaceData(steamId) {
  const apiKey = process.env.CS2_SPACE_API_KEY;
  if (!apiKey || apiKey === "your_cs2_space_key_here") {
    console.warn("CS2.space API Key missing.");
    return null;
  }

  try {
    const response = await fetch(`${CS2_SPACE_BASE_URL}/profile/${steamId}`, {
      headers: {
        "x-api-key": apiKey
      }
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Error fetching CS2.space data:", error);
    return null;
  }
}
