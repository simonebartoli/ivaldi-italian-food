export interface OpenStreetMapAPIType {
    place_id: number
    licence: string
    osm_type: string
    osm_id: number
    boundingbox: string[]
    lat: string
    lon: string
    display_name: string
    class: string
    type: string
    importance: number
    address: Address
}

export interface Address {
    building: string
    house_number: string
    road: string
    neighbourhood: string
    suburb: string
    borough: string
    city: string
    county: string
    state: string
    "ISO3166-2-lvl4": string
    postcode: string
    country: string
    country_code: string
}
