// Google Maps Places API integration for lead discovery

export interface LeadDiscoveryInput {
  industry: string
  location: string
  radius?: number // in meters, default 50000 (50km)
  keywords?: string[]
  maxResults?: number
}

export interface DiscoveredLead {
  placeId: string
  name: string
  address: string
  phone?: string
  website?: string
  rating?: number
  userRatingsTotal?: number
  types: string[]
  location: {
    lat: number
    lng: number
  }
}

/**
 * Search for leads using Google Maps Places API
 */
export async function discoverLeadsFromGoogleMaps(
  input: LeadDiscoveryInput
): Promise<DiscoveredLead[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    throw new Error("Google Maps API key not configured")
  }

  const { industry, location, radius = 50000, keywords = [], maxResults = 20 } = input

  // Build search query
  const searchQuery = [industry, ...keywords].join(" ")

  try {
    // First, geocode the location to get lat/lng
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()

    if (geocodeData.status !== "OK" || !geocodeData.results[0]) {
      throw new Error(`Failed to geocode location: ${location}`)
    }

    const { lat, lng } = geocodeData.results[0].geometry.location

    // Search for places using Places API (Nearby Search)
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(searchQuery)}&key=${apiKey}`
    const placesResponse = await fetch(placesUrl)
    const placesData = await placesResponse.json()

    if (placesData.status !== "OK") {
      console.error("Places API error:", placesData.status, placesData.error_message)
      return []
    }

    // Get detailed information for each place
    const leads: DiscoveredLead[] = []
    const results = placesData.results.slice(0, maxResults)

    for (const place of results) {
      // Get place details for additional info (phone, website)
      const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,types,geometry&key=${apiKey}`
      const detailsResponse = await fetch(detailsUrl)
      const detailsData = await detailsResponse.json()

      if (detailsData.status === "OK" && detailsData.result) {
        const result = detailsData.result
        leads.push({
          placeId: place.place_id,
          name: result.name,
          address: result.formatted_address,
          phone: result.formatted_phone_number,
          website: result.website,
          rating: result.rating,
          userRatingsTotal: result.user_ratings_total,
          types: result.types || [],
          location: {
            lat: result.geometry.location.lat,
            lng: result.geometry.location.lng,
          },
        })
      }

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return leads
  } catch (error) {
    console.error("Error discovering leads from Google Maps:", error)
    throw error
  }
}

/**
 * Convert ICP criteria to Google Maps search parameters
 */
export function icpToSearchParams(icp: {
  industry: string
  companySize?: string
  criteria?: string[]
}): { industry: string; keywords: string[] } {
  const keywords: string[] = []

  // Add company size hints
  if (icp.companySize) {
    if (icp.companySize.includes("1-10") || icp.companySize.includes("small")) {
      keywords.push("small business", "local")
    } else if (icp.companySize.includes("50-200") || icp.companySize.includes("medium")) {
      keywords.push("established")
    }
  }

  // Add criteria as keywords
  if (icp.criteria) {
    keywords.push(...icp.criteria)
  }

  return {
    industry: icp.industry,
    keywords,
  }
}
