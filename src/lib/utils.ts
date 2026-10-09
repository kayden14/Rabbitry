import { EstimatorResult, NIGERIAN_STATES, NigerianState } from '@/types';
export { NIGERIAN_STATES, type NigerianState };

export function calculateEstimate(rabbitCount: number): EstimatorResult {
  const rabbitsPerHole = 1; // one rabbit per cage compartment
  const holesPerCage = 2;
  const cageCount = Math.ceil(rabbitCount / holesPerCage);
  const drinkerCount = Math.ceil(rabbitCount / 5); // 1 nipple per 5 rabbits
  const feedPerRabbitKgPerDay = 0.15; // ~150g per rabbit per day
  const feedVolumeKgPerDay = rabbitCount * feedPerRabbitKgPerDay;
  const feedVolumeKgPerMonth = feedVolumeKgPerDay * 30;

  let cageDimensions = '120cm x 60cm x 45cm';
  let cageRecommendation = 'Standard 2-hole wire cages';

  if (rabbitCount > 10) {
    cageDimensions = '240cm x 60cm x 45cm';
    cageRecommendation = 'Commercial 4-hole battery cages';
  }

  const cageCostPerUnit = rabbitCount > 10 ? 85000 : 45000;
  const estimatedCageCost = `₦${(cageCostPerUnit * cageCount).toLocaleString()}`;

  return {
    rabbitCount,
    cageRecommendation,
    cageCount,
    drinkerCount,
    feedVolumeKgPerDay: Math.round(feedVolumeKgPerDay * 100) / 100,
    feedVolumeKgPerMonth: Math.round(feedVolumeKgPerMonth * 100) / 100,
    estimatedCageCost,
  };
}

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function formatCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    'live-stock': 'Live Breeding Stock & Pets',
    'processed-meat': 'Processed Rabbit Meat',
    'catering': 'Culinary & Event Catering',
    'by-products': 'By-Products & Farm Inputs',
    'equipment': 'Equipment & Fabrication',
  };
  return map[category] || category;
}

export const WHATSAPP_NUMBER = '2348136228305'; // international format, no +
export const PHONE_1 = '08136228305';
export const PHONE_2 = '07052335766';
export const BANK_NAME = 'First Bank of Nigeria';
export const BANK_ACCOUNT_NAME = 'Danethicals Limited';
export const BANK_ACCOUNT_NUMBER = '2041893721';
export const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
export const FARM_LOCATION = 'Parakin-Obalufe Area, Ile-Ife, Osun State, Nigeria';
export const INSTAGRAM = '@Rabbitryrabbit';
export const FACEBOOK = 'Rabbitryrabbit';
export const TWITTER = '@Rabbitryrabbit';
