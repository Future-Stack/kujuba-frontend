"use client";

import PricingItemsList, { PricingItem } from "./PricingItemList";



const pricingItems: PricingItem[] = [
  { id: 4, name: "Flood Elevation Certificate", description: "Flood zone elevation measurement", price: 399, disabled: false },
  { id: 5, name: "Combined Inspection", description: "Four Point + Wind Mitigation package", price: 399, disabled: false },
  { id: 6, name: "Urgent Inspection Fee", description: "Additional fee for same-day urgent bookings", price: 50, disabled: false },
  { id: 7, name: "Late Cancellation Penalty (24h)", description: "Fee applied for cancellations within 24 hours", price: 50, disabled: false },
  { id: 8, name: "Last-Minute Cancel Penalty (2h)", description: "Fee applied for cancellations within 2 hours", price: 75, disabled: false },
];

export default function PricingConfiguration() {
  return <PricingItemsList initialItems={pricingItems} />;
}