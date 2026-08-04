import { ApiCategory } from "@/lib/api";
import { Utensils, GlassWater, IceCream, Pizza, Flame } from "lucide-react";

interface CategoryQuickSelectProps {
  categories: ApiCategory[];
  activeCategoryId: string | null;
  onSelect: (id: string) => void;
}

// TODO: swap for category.image once backend supports it
const iconMap: Record<string, any> = {
  burgers: Flame,
  burger: Flame,
  sides: Pizza,
  fries: Pizza,
  drinks: GlassWater,
  beverages: GlassWater,
  desserts: IceCream,
  dessert: IceCream,
};

function getCategoryIcon(name: string) {
  const key = name.toLowerCase().trim();
  return iconMap[key] || Utensils;
}

export default function CategoryQuickSelect({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryQuickSelectProps) {
  return (
    <div className="w-full py-2">
      <div className="flex gap-4 overflow-x-auto px-6 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => {
          const IconComponent = getCategoryIcon(cat.name);
          const isActive = activeCategoryId === cat._id;

          return (
            <button
              key={cat._id}
              onClick={() => onSelect(cat._id)}
              className={`flex-shrink-0 w-24 h-24 flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-br from-[#FFA600] to-[#F5511E] text-white shadow-lg scale-105"
                  : "bg-white border border-zinc-100 shadow-sm text-zinc-600 hover:bg-zinc-50"
              }`}
            >
              <div
                className={`p-2 rounded-full mb-1 transition-colors ${
                  isActive ? "bg-white/20 text-white" : "bg-zinc-50 text-zinc-500"
                }`}
              >
                <IconComponent className="w-6 h-6" />
              </div>
              <span
                className={`text-[11px] font-bold tracking-wide uppercase truncate w-full text-center ${
                  isActive ? "text-white" : "text-zinc-700"
                }`}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
