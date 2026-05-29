import type { ApiCategory, ApiLocation, ApiOffer } from '@/lib/api-types';
import type { Offer } from '@/types/offer';

export type Location = {
  id: string;
  label: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export function mapApiLocation(location: ApiLocation): Location {
  return {
    id: location.id,
    label: location.label,
  };
}

export function mapApiCategory(category: ApiCategory): Category {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

export function mapApiOffer(offer: ApiOffer): Offer {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    shopName: offer.shop.name,
    discount: offer.discount,
    validUntil: offer.validUntil,
    locationId: offer.shop.locationId,
    imageUrl: offer.imageUrl ?? undefined,
  };
}

export function mapApiOffers(offers: ApiOffer[]): Offer[] {
  return offers.map(mapApiOffer);
}
