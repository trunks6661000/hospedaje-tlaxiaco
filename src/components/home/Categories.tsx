"use client";

import { useState } from "react";
import {
  Building2,
  Home,
  Bed,
  TreePine,
  Mountain,
  MapPin,
  Warehouse,
  Castle,
} from "lucide-react";

const categories = [
  { id: "todos", name: "Todos", icon: Building2 },
  { id: "casa", name: "Casas", icon: Home },
  { id: "habitacion", name: "Habitaciones", icon: Bed },
  { id: "cabana", name: "Cabañas", icon: TreePine },
  { id: "rustico", name: "Rústicos", icon: Mountain },
  { id: "centro", name: "Centro", icon: MapPin },
  { id: "completo", name: "Casa completa", icon: Warehouse },
];

interface CategoriesProps {
  onSelect?: (category: string) => void;
}

export default function Categories({ onSelect }: CategoriesProps) {
  const [active, setActive] = useState("todos");

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <div className="border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 overflow-x-auto py-4 scrollbar-hide">
          {categories.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleSelect(id)}
              className={`flex flex-col items-center gap-1.5 min-w-fit pb-2 border-b-2 transition-all ${
                active === id
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium whitespace-nowrap">
                {name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
