// generate.ts
import { RENTALS_BASE } from "@packages/config/constants";

export const VALID_COMMUNITIES: string[] = [
  "Aparna Aura",
  "Aparna Avenues",
  "Aparna Boulevard",
  "Aparna Cyber Commune",
  "Aparna CyberLife",
  "Aparna CyberZon",
  "Aparna Elixir",
  "Aparna Gardenia",
  "Aparna Grande",
  "Aparna Lake Breeze",
  "Aparna Sarovar",
  "Aparna Serene Park",
  "Aparna Shangrila",
  "Aparna Silver Oaks",
  "Aparna WestSide",
  "Aparna Zenith",
  "Fortune Nest",
  "Fortune Towers",
  "Hallmark Empyrean",
  "Hallmark Vicinia",
  "Honer Aquantis",
  "Honer Vivantis",
  "Jayabheri Orange County",
  "Jayabheri Silicon County",
  "Jayabheri Temple Tree",
  "Jayabheri The Meadows",
  "Jayabheri The Peak",
  "Jayabheri The Summit",
  "Jayabheri Whistling Court",
  "L&T Serene County",
  "Lodha Bell Gardens",
  "Lodha Belleza Sky Villas",
  "Lodha Burlingame Bellezza",
  "Lodha Codename 520",
  "Lodha Luxury Life Style",
  "Lodha Majesto",
  "Lodha Meridian",
  "Lodha Meridian Super 60",
  "Myhome Abhra",
  "Myhome Ankura",
  "Myhome Avatar",
  "Myhome Bhooja",
  "Myhome Jewel",
  "Myhome Krishe",
  "Myhome Mangala",
  "Myhome Navadeepa",
  "Myhome Tarkshya",
  "Myhome Tridasa",
  "Myhome Vihanga",
  "NCC Nagarjuna Residency",
  "NCC Urban One",
  "Prestige High Fields",
  "Prestige IVY League",
  "Prestige Tranquil Towers",
  "Rainbow vistas Marina Skies",
  "Rainbow vistas Rock Garden",
  "Rajpushpa Atria",
  "Rajpushpa Cannon Dale",
  "Rajpushpa Eterna",
  "Rajpushpa Green Dale",
  "Rajpushpa Open Skies",
  "Rajpushpa Regalia",
  "Rajpushpa Silicon Ridge",
  "Rajpushpa The Retreat",
  "Ramky One Kosmos",
  "Ramky The Huddle",
  "Ramky Towers",
  "Ramky Tranquillas",
  "Sumadhura AcroPolis",
  "Vasavi GP Trends",
  "Vasavi Shanthinikethan",
  "Vertex Panache",
  "Vertex Pleasent",
  "Vertex Premio",
  "Vertex Prime",
  "Vertex Sadhgurukrupa",
];

export interface ExtractResult {
  rooms: number | null;
  area: number | null;
  community: string | null;
}

export function generatePropertySearchUrl(
  rooms: number | null,
  community: string | null
): string {
  const baseUrl = `${RENTALS_BASE}`;
  const params = new URLSearchParams();

  if (community) {
    params.append("community", community);
  }

  if (rooms) {
    params.append("hometype", `${rooms} BHK`);
  }

  return `${baseUrl}?${params.toString()}`;
}

export function extractRoomAndArea(sentence: string): ExtractResult {
  const roomRegex = /(\d+)\s*(?:bedroom|room|br|bd|beds?|rooms?|bhk)\b/i;
  const areaRegex = /(\d+)\s*(?:sqm|sq\.?m|square\s*meters?|m²)\b/i;
  const communityRegex = new RegExp(
    `\\b(${VALID_COMMUNITIES.map((c) =>
      c.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    ).join("|")})\\b`,
    "i"
  );

  const rooms: number | null = (() => {
    const match = sentence.match(roomRegex);
    return match ? parseInt(match[1], 10) : null;
  })();

  const area: number | null = (() => {
    const match = sentence.match(areaRegex);
    return match ? parseInt(match[1], 10) : null;
  })();

  const community: string | null = (() => {
    const exactMatch = sentence.match(communityRegex);
    if (exactMatch) return exactMatch[1];

    const lowerSentence = sentence.toLowerCase();
    for (const validCommunity of VALID_COMMUNITIES) {
      const lowerCommunity = validCommunity.toLowerCase();

      // exact phrase as whole word(s)
      if (new RegExp(`\\b${lowerCommunity}\\b`, "i").test(lowerSentence)) {
        return validCommunity;
      }

      // partial word match (>=20% words)
      const communityWords = lowerCommunity.split(/\s+/);
      const matchingWords = communityWords.filter((word) =>
        lowerSentence.includes(word)
      );

      if (matchingWords.length / communityWords.length >= 0.2) {
        return validCommunity;
      }
    }

    return null;
  })();

  return { rooms, area, community };
}
