const productJSONLD = {
    __html: {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": "",
        "image": "",
        "description": "",
        "brand": {
            "@type": "Brand",
            "name": ""
        },
        "offers": {
            "@type": "Offer",
            "url": "",
            "priceCurrency": "GBP",
            "price": "",
            "priceValidUntil": "",
            "availability": "https://schema.org/InStock",
            "itemCondition": "https://schema.org/NewCondition"
        }
    }
}


export type ProductJSONLDType = {
    __html: Html
}
type Html = {
    "@context": string
    "@type": string
    name: string
    image: string
    description: string
    brand: Brand
    offers: Offers
}
type Brand = {
    "@type": string
    name: string
}
type Offers = {
    "@type": string
    url: string
    priceCurrency: string
    price: string
    priceValidUntil: string
    availability: string
    itemCondition: string
}

export default productJSONLD