export const navConfig = {
  routes: [
    { label: "HOME", href: "/", hasMega: false },
    { label: "SHOP", href: "/shop", hasMega: true },
    { label: "TAILORING", href: "/tailoring", hasMega: false },
    { label: "ABOUT", href: "/about", hasMega: false },
    { label: "CONTACT", href: "/contact", hasMega: false },
  ],
  megaMenu: {
    columns: [
      {
        heading: "KOREAN",
        links: [
          { label: "Korean Dresses", href: "/shop?cat=korean" },
          { label: "Korean Tops", href: "/shop?cat=korean" },
          { label: "Korean Pants", href: "/shop?cat=korean" },
          { label: "Accessories", href: "/shop?cat=accessories" },
        ],
      },
      {
        heading: "WESTERN",
        links: [
          { label: "Co-ord Sets", href: "/shop?cat=western" },
          { label: "Crop Tops", href: "/shop?cat=western" },
          { label: "Dresses", href: "/shop?cat=western" },
          { label: "Jeans and Pants", href: "/shop?cat=western" },
          { label: "Jackets and Hoodies", href: "/shop?cat=western" },
        ],
      },
      {
        heading: "ETHNIC",
        links: [
          { label: "Kurtis", href: "/shop?cat=ethnic" },
          { label: "Anarkalis", href: "/shop?cat=ethnic" },
          { label: "Sarees", href: "/shop?cat=ethnic" },
          { label: "Indo-Western", href: "/shop?cat=ethnic" },
        ],
      },
      {
        heading: "MORE",
        links: [
          { label: "Innerwear and Lounge", href: "/shop?cat=innerwear" },
          { label: "Accessories", href: "/shop?cat=accessories" },
          { label: "Custom Tailoring", href: "/tailoring" },
        ],
      },
    ],
    featured: {
      heading: "CUSTOM TAILORING",
      line: "Stitched to your measurements.",
      ctaLabel: "BOOK A FITTING",
      ctaHref: "/tailoring",
    },
  },
  announcements: [
    "NEW KOREAN STOCK IN STORE",
    "CUSTOM TAILORING AVAILABLE",
    "LOCAL DELIVERY + IN-STORE PICKUP",
    "OLD PALLAVARAM, CHENNAI",
  ],
} as const

export type NavConfig = typeof navConfig
