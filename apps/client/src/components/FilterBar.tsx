"use client";

interface FilterBarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function FilterBar({ categories, selectedCategory, onSelectCategory }: FilterBarProps) {
    return (
        <div className="w-full flex gap-3 overflow-x-auto pb-6 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-8 py-3 rounded-2xl whitespace-nowrap transition-all duration-300 font-black text-xs uppercase tracking-[0.15em] shadow-sm ${selectedCategory === cat
                        ? "bg-ocean-gradient text-white shadow-[var(--ocean-end)]/20"
                        : "bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-[var(--ocean-start)]"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
