import type { ApiCategory, ApiLocation, ApiOffer, ApiSellerOffer, ApiShopSummary } from '@/lib/api-types';
import type { Offer } from '@/types/offer';
import type { SellerOffer, ShopCategory, ShopSummary } from '@/types/shop';

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

export function mapApiCategories(categories: ApiCategory[]): ShopCategory[] {
  return categories.map(mapApiCategory);
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

export function mapApiShopSummary(shop: ApiShopSummary): ShopSummary {
  return {
    id: shop.id,
    name: shop.name,
    description: shop.description ?? undefined,
    imageUrl: shop.imageUrl ?? undefined,
    locationId: shop.locationId,
    locationLabel: shop.location.label,
    categories: mapApiCategories(shop.categories),
    offerCount: shop.offerCount,
    activeOfferCount: shop.activeOfferCount,
    expiredOfferCount: shop.expiredOfferCount,
  };
}

export function mapApiShopSummaries(shops: ApiShopSummary[]): ShopSummary[] {
  return shops.map(mapApiShopSummary);
}

export function mapApiSellerOffer(offer: ApiSellerOffer): SellerOffer {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    discount: offer.discount,
    validUntil: offer.validUntil,
    shopId: offer.shopId,
    categoryNames: offer.shop.categories.map((category) => category.name).join(', '),
    status: offer.status,
    imageUrl: offer.imageUrl ?? undefined,
  };
}

export function mapApiSellerOffers(offers: ApiSellerOffer[]): SellerOffer[] {
  return offers.map(mapApiSellerOffer);
}
