import { GoldPrice } from "@/types";
export const GoldPricesTab = ({
  goldPrices,
}: {
  goldPrices: GoldPrice | null;
}) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gold Prices</h2>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        18K Gold Price: {goldPrices?.price_gram_18k} EGP
      </div>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        21K Gold Price: {goldPrices?.price_gram_21k} EGP
      </div>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        24K Gold Price: {goldPrices?.price_gram_24k} EGP
      </div>
    </div>
  );
};
