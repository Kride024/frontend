// chatbotUtils.tsx
import React from "react";
import communities from "./communities.json";
import { ExtractResult } from "./types";

export function extractRoomAndArea(sentence: string): ExtractResult {
  const roomRegex = /(\d+)\s*(?:bedroom|room|br|bd|beds?|rooms?|bhk)\b/i;
  const areaRegex = /(\d+)\s*(?:sqm|sq\.?m|square\s*meters?|m²)\b/i;
  const communityRegex = new RegExp(
    `\\b(${(communities as any).communities
      .map((c: string) => c.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"))
      .join("|")})\\b`,
    "i"
  );

  const rooms = (() => {
    const match = sentence.match(roomRegex);
    return match ? parseInt(match[1], 10) : null;
  })();

  const area = (() => {
    const match = sentence.match(areaRegex);
    return match ? parseInt(match[1], 10) : null;
  })();

  const community = (() => {
    const exactMatch = sentence.match(communityRegex);
    if (exactMatch) return exactMatch[1];

    const lowerSentence = sentence.toLowerCase();
    for (const validCommunity of (communities as any).communities as string[]) {
      const lowerCommunity = validCommunity.toLowerCase();
      if (new RegExp(`\\b${lowerCommunity}\\b`, "i").test(lowerSentence)) {
        return validCommunity;
      }
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

export function generatePropertySearchUrl(
  rooms: number | null,
  community: string | null,
  RENTALS_BASE: string
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
