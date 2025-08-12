import { GoldPrice, USDPrice } from "@/types";

export const PricesTab = ({
  goldPrices,
  usdPrice,
  refreshRates,
}: {
  goldPrices: GoldPrice | null;
  usdPrice: USDPrice | null;
  refreshRates: () => void;
}) => {
  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={refreshRates}
        >
          Refresh Rates
        </button>
      </div>
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
      <h2 className="text-2xl font-bold mb-6">USD Price</h2>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        USD Price: {usdPrice?.results.EGP} EGP
      </div>
    </div>
  );
};
