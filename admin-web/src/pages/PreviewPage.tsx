import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { referenceItemApi } from '../api/referenceItemApi';
import { marketItemApi } from '../api/marketItemApi';
import { marketApi } from '../api/marketApi';
import { categoryApi } from '../api/categoryApi';
import { Search, ChevronDown, Package, BadgePercent, Trophy } from 'lucide-react';

export function PreviewPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);

    const { data: items = [] } = useQuery({
        queryKey: ['items'],
        queryFn: referenceItemApi.getAll,
    });

    const { data: marketItems = [] } = useQuery({
        queryKey: ['marketItems'],
        queryFn: marketItemApi.getAll,
    });

    const { data: markets = [] } = useQuery({
        queryKey: ['markets'],
        queryFn: marketApi.getAll,
    });

    const { data: categories = [] } = useQuery({
        queryKey: ['categories', 'active'],
        queryFn: categoryApi.getActive,
    });

    // Only show active items and markets
    const activeItems = items.filter(item => item.active);
    const activeMarkets = markets.filter(market => market.active);

    // Filter items by search and category
    const filteredItems = activeItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !filterCategory || item.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Get price info for an item (only from active markets)
    const getPriceInfo = (itemId: string) => {
        const itemPrices = marketItems.filter(mi =>
            mi.referenceItemId === itemId &&
            mi.currentPrice &&
            activeMarkets.some(m => m.id === mi.marketId)
        );
        if (itemPrices.length === 0) return null;

        const prices = itemPrices.map(mi => mi.currentPrice).filter((p): p is number => p !== undefined);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        const cheapest = itemPrices.find(mi => mi.currentPrice === min);
        const cheapestMarket = activeMarkets.find(m => m.id === cheapest?.marketId);

        return { min, max, cheapestMarket: cheapestMarket?.name || 'Unknown', priceCount: prices.length };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">User Preview</h1>
                <p className="text-slate-500 text-sm mt-1">
                    See how items appear to shoppers in the mobile app.
                </p>
            </div>

            {/* Phone Frame */}
            <div className="flex justify-center">
                <div className="w-full max-w-sm bg-slate-900 rounded-[3rem] p-3 shadow-2xl">
                    <div className="bg-white rounded-[2.5rem] overflow-hidden">
                        {/* Status Bar */}
                        <div className="bg-slate-100 px-6 py-2 flex justify-between items-center text-xs text-slate-600">
                            <span>9:41</span>
                            <div className="flex gap-1">
                                <span>📶</span>
                                <span>🔋</span>
                            </div>
                        </div>

                        {/* App Content */}
                        <div className="h-[600px] overflow-y-auto">
                            {/* Search */}
                            <div className="sticky top-0 bg-white p-4 border-b border-slate-100">
                                <div className="relative">
                                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Category Pills */}
                            <div className="flex gap-2 p-4 overflow-x-auto">
                                <button
                                    onClick={() => setFilterCategory('')}
                                    className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${!filterCategory
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-slate-100 text-slate-700'
                                        }`}
                                >
                                    All
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setFilterCategory(cat.id)}
                                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${filterCategory === cat.id
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-slate-100 text-slate-700'
                                            }`}
                                    >
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>

                            {/* Items List */}
                            <div className="p-4 space-y-3">
                                {filteredItems.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400">
                                        No items found
                                    </div>
                                ) : (
                                    filteredItems.map(item => {
                                        const priceInfo = getPriceInfo(item.id);
                                        const isExpanded = expandedItem === item.id;
                                        const itemMarketPrices = marketItems.filter(mi =>
                                            mi.referenceItemId === item.id &&
                                            activeMarkets.some(m => m.id === mi.marketId)
                                        );

                                        return (
                                            <div
                                                key={item.id}
                                                className="bg-slate-50 rounded-2xl p-4 cursor-pointer"
                                                onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                                            >
                                                <div className="flex gap-3">
                                                    {/* Image */}
                                                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                        {item.images?.[0] ? (
                                                            <img src={item.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                                                        ) : (
                                                            <Package size={24} className="text-slate-300" />
                                                        )}
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-slate-800 truncate">{item.name}</div>
                                                        <div className="text-xs text-slate-500">{item.category}</div>

                                                        {priceInfo ? (
                                                            <>
                                                                <div className="text-lg font-bold text-primary-600 mt-1">
                                                                    {priceInfo.min === priceInfo.max
                                                                        ? `$${priceInfo.min.toFixed(2)}`
                                                                        : `$${priceInfo.min.toFixed(2)} - $${priceInfo.max.toFixed(2)}`
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-green-600 flex items-center gap-1">
                                                                    <Trophy size={12} />
                                                                    Best: {priceInfo.cheapestMarket}
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="text-sm text-slate-400 mt-1">No prices yet</div>
                                                        )}
                                                    </div>

                                                    {/* Expand Icon */}
                                                    <ChevronDown size={20} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </div>

                                                {/* Expanded Prices */}
                                                {isExpanded && itemMarketPrices.length > 0 && (
                                                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                                                        {itemMarketPrices.map(mi => {
                                                            const market = markets.find(m => m.id === mi.marketId);
                                                            const discount = mi.originalPrice && mi.currentPrice && mi.originalPrice > mi.currentPrice
                                                                ? Math.round(((mi.originalPrice - mi.currentPrice) / mi.originalPrice) * 100)
                                                                : null;

                                                            return (
                                                                <div key={mi.id} className="flex justify-between items-center text-sm">
                                                                    <span className="text-slate-600">{market?.name || 'Unknown'}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        {discount && (
                                                                            <span className="text-xs text-green-600 font-medium flex items-center gap-0.5">
                                                                                <BadgePercent size={12} />
                                                                                -{discount}%
                                                                            </span>
                                                                        )}
                                                                        {mi.originalPrice && mi.originalPrice > (mi.currentPrice || 0) && (
                                                                            <span className="text-xs text-slate-400 line-through">
                                                                                ${mi.originalPrice.toFixed(2)}
                                                                            </span>
                                                                        )}
                                                                        <span className="font-semibold text-slate-800">
                                                                            ${mi.currentPrice?.toFixed(2) || '—'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Home Indicator */}
                        <div className="bg-white pb-2 pt-1 flex justify-center">
                            <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="text-center text-sm text-slate-500">
                This preview simulates how items appear in the mobile app.
            </div>
        </div>
    );
}
