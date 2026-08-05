import { useState, useMemo } from "react";
import { X, Plus, Minus, ChevronDown, ChevronUp, Check } from "lucide-react";
import { ApiProduct, CustomizationGroup } from "@/lib/api";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
  product: ApiProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const initialConfig = useMemo(() => {
    const initial: Record<string, string | string[]> = {};
    const expanded: Record<string, boolean> = {};
    if (product?.customizations) {
      let firstRequiredFound = false;
      product.customizations.forEach((group) => {
        const isFirstRequired = group.required && !firstRequiredFound;
        if (isFirstRequired) firstRequiredFound = true;
        expanded[group.id] = isFirstRequired;
        if (group.type === "single" && group.required && group.options.length > 0) {
          initial[group.id] = group.options[0].id;
        } else if (group.type === "multiple") {
          initial[group.id] = [];
        }
      });
    }
    return { initial, expanded };
  }, [product]);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | string[]>>(() => initialConfig.initial);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(() => initialConfig.expanded);

  const handleOptionChange = (groupId: string, optionId: string, groupType: "single" | "multiple") => {
    setSelectedOptions((prev) => {
      if (groupType === "single") {
        return { ...prev, [groupId]: optionId };
      } else {
        const current = (prev[groupId] as string[]) || [];
        const updated = current.includes(optionId)
          ? current.filter((id) => id !== optionId)
          : [...current, optionId];
        return { ...prev, [groupId]: updated };
      }
    });
  };

  const calculateTotalPrice = useMemo(() => {
    if (!product) return 0;
    let price = product.price;
    if (product.customizations) {
      product.customizations.forEach((group) => {
        const selected = selectedOptions[group.id];
        if (group.type === "single" && selected) {
          const option = group.options.find((o) => o.id === selected);
          if (option) price += option.priceAdd;
        } else if (group.type === "multiple" && Array.isArray(selected)) {
          selected.forEach((id) => {
            const option = group.options.find((o) => o.id === id);
            if (option) price += option.priceAdd;
          });
        }
      });
    }
    return price * quantity;
  }, [product, selectedOptions, quantity]);

  const isGroupValid = (group: CustomizationGroup): boolean => {
    const selected = selectedOptions[group.id];
    if (group.required) {
      if (group.type === "single") return !!selected;
      if (group.type === "multiple") return Array.isArray(selected) && selected.length > 0;
    }
    return true;
  };

  const isValid = (): boolean => {
    if (!product?.customizations) return true;
    return product.customizations.every(isGroupValid);
  };

  const handleAddToCart = () => {
    if (!product || !isValid()) return;
    const customizations = product.customizations?.map((group) => {
      const selected = selectedOptions[group.id];
      const selectedOpts = group.type === "single"
        ? [group.options.find((o) => o.id === selected)].filter(Boolean)
        : (selected as string[]).map((id) => group.options.find((o) => o.id === id)).filter(Boolean);
      return {
        groupId: group.id,
        groupTitle: group.title,
        optionName: selectedOpts.map((o) => o?.name).join(", "),
        priceAdd: selectedOpts.reduce((sum, o) => sum + (o?.priceAdd || 0), 0)
      };
    }) || [];
    addToCart(product, customizations, quantity);
    onClose();
  };

  if (!product || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-2">
      <div className="bg-white rounded-xl overflow-hidden flex flex-col w-[90vw] max-w-[480px] h-[85vh] max-h-[85vh]">
        {/* STICKY HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-white flex-shrink-0">
          <h2 className="text-lg font-bold text-zinc-900 truncate pr-4">{product.name}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 touch-manipulation flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-zinc-700" />
          </button>
        </div>

        {/* SCROLLABLE MIDDLE SECTION */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 bg-white">
          {/* Short description - max 2 lines */}
          <p className="text-zinc-500 text-sm line-clamp-2">{product.description}</p>

          {/* Customization accordion groups */}
          {product.customizations && product.customizations.length > 0 ? (
            <div className="space-y-3">
              {product.customizations.map((group) => (
                <div key={group.id} className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setExpandedGroups((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                    className="w-full px-4 py-3 flex items-center justify-between bg-zinc-50 hover:bg-zinc-100 touch-manipulation"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-zinc-900">{group.title}</span>
                      {group.required && (
                        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">Required</span>
                      )}
                    </div>
                    <span className="transform transition-transform duration-200 flex-shrink-0">
                      {expandedGroups[group.id] ? (
                        <ChevronUp className="w-5 h-5 text-zinc-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-zinc-600" />
                      )}
                    </span>
                  </button>

                  {expandedGroups[group.id] && (
                    <div className="p-4 space-y-3 border-t border-zinc-100 animate-in slide-in-from-top-2 duration-200">
                      {group.options.map((option) => {
                        const isSelected = group.type === "single"
                          ? selectedOptions[group.id] === option.id
                          : (selectedOptions[group.id] as string[])?.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            onClick={() => handleOptionChange(group.id, option.id, group.type)}
                            className={`w-full p-4 rounded-lg flex items-center justify-between touch-manipulation transition-colors ${
                              isSelected
                                ? "bg-amber-50 border-2 border-amber-500"
                                : "bg-white border border-zinc-200 hover:bg-zinc-50"
                            }`}
                          >
                            <div className="flex-1 text-left min-w-0">
                              <span className="font-medium text-zinc-900 truncate">{option.name}</span>
                              {option.priceAdd > 0 && (
                                <span className="ml-2 text-sm font-bold text-amber-600 whitespace-nowrap">+${option.priceAdd.toFixed(2)}</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              {group.type === "single" ? (
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-amber-500 bg-amber-500" : "border-zinc-300"}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              ) : (
                                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${isSelected ? "border-amber-500 bg-amber-500" : "border-zinc-300"}`}>
                                  {isSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">No customization options available for this item.</p>
          )}
        </div>

        {/* STICKY FOOTER */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-200 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center touch-manipulation hover:bg-zinc-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4 text-zinc-600" />
            </button>
            <span className="w-10 text-center font-bold text-lg text-zinc-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center touch-manipulation hover:bg-zinc-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isValid()}
            className="bg-[#FFA600] hover:bg-[#F5511E] disabled:bg-zinc-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg text-base touch-manipulation transition-colors flex items-center gap-2"
          >
            Add to order
            <span className="font-mono">{formatPrice(calculateTotalPrice)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}