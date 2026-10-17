import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { MenuItem, ItemVariation, ItemAddon } from '../../types/index.js';
import { VegBadge } from './VegBadge.js';
import { useRestaurant } from '../../context/RestaurantContext.js';
import { useCart } from '../../context/CartContext.js';

interface ItemCustomizerModalProps {
  item: MenuItem | null;
  onClose: () => void;
}

export const ItemCustomizerModal: React.FC<ItemCustomizerModalProps> = ({
  item,
  onClose,
}) => {
  const { formatPrice } = useRestaurant();
  const { addItem } = useCart();

  const [selectedVariation, setSelectedVariation] = useState<ItemVariation | undefined>(
    undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<ItemAddon[]>([]);
  const [instructions, setInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      // Default to first variation if available
      if (item.variations && item.variations.length > 0) {
        setSelectedVariation(item.variations[0]);
      } else {
        setSelectedVariation(undefined);
      }
      setSelectedAddons([]);
      setInstructions('');
      setQuantity(1);
    }
  }, [item]);

  if (!item) return null;

  const basePrice = selectedVariation ? selectedVariation.price : item.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const itemTotal = unitPrice * quantity;

  const toggleAddon = (addon: ItemAddon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      }
      return [...prev, addon];
    });
  };

  const handleAddToCart = () => {
    addItem(item, quantity, selectedVariation, selectedAddons, instructions);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image */}
        <div className="relative h-44 sm:h-56 w-full shrink-0 overflow-hidden bg-stone-100">
          <img
            src={
              item.imageUrl ||
              'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80'
            }
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
            <div className="flex items-center gap-2 mb-1">
              <VegBadge isVeg={item.isVeg} />
              <span className="text-white/90 text-xs font-semibold uppercase tracking-wider">
                {item.category?.name || 'Jai Bharat Special'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-white leading-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 sm:space-y-6">
          <p className="text-stone-600 text-sm leading-relaxed">{item.description}</p>

          {/* Size / Portion Variations */}
          {item.variations && item.variations.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-stone-900 text-sm">Select Portion Size</h4>
                <span className="text-xs text-[#991b1b] bg-red-50 px-2 py-0.5 rounded-full font-medium">
                  Required
                </span>
              </div>
              <div className="space-y-2">
                {item.variations.map((v) => {
                  const isSelected = selectedVariation?.id === v.id;
                  return (
                    <label
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#991b1b] bg-red-50/50 text-stone-900 font-medium'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#991b1b] bg-[#991b1b]' : 'border-stone-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm">{v.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">
                        {formatPrice(v.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Optional Add-ons */}
          {item.addons && item.addons.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-stone-900 text-sm">Delicious Add-ons</h4>
                <span className="text-xs text-stone-400">Optional</span>
              </div>
              <div className="space-y-2">
                {item.addons.map((addon) => {
                  const isChecked = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <label
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-[#991b1b] bg-red-50/50 text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center ${
                            isChecked ? 'border-[#991b1b] bg-[#991b1b]' : 'border-stone-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 text-white" />}
                        </div>
                        <span className="text-sm">{addon.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-stone-900">
                        +{formatPrice(addon.price)}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking Instructions */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Special Cooking Instructions (Optional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Less spicy, mild oil, extra onions or lemon..."
              rows={2}
              maxLength={200}
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-200 focus:outline-hidden focus:border-[#991b1b] focus:ring-1 focus:ring-[#991b1b] resize-none"
            />
          </div>
        </div>

        {/* Modal Footer: Quantity Selector & Add Button */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center bg-white border border-stone-300 rounded-full px-2 py-1 shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-1 rounded-full text-stone-600 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-600"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-stone-900 text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1 rounded-full text-stone-600 hover:text-stone-900"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-between bg-[#991b1b] hover:bg-[#7f1d1d] text-white font-bold px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            <span>Add to Order</span>
            <span className="text-red-100">{formatPrice(itemTotal)}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
