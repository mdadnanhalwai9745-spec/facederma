export interface Product {
  id: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  keyBenefits: string[];
  image: string; // Primary image (product jar)
  secondaryImage?: string; // Secondary image (product information banner)
  volume?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
  ingredients?: string[];
  usage?: string;
}

export interface ContactInfo {
  address: string;
  mapsUrl: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsapp: string;
  whatsappRaw: string;
  hours: string;
}
