import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, FileDown, Search } from 'lucide-react';
import type {
  NavProductItem,
  NavSuperCategory,
  TopMenuConfig,
} from '@/data/navigation';

interface DesktopNavProps {
  menus: TopMenuConfig[];
  superCategories: NavSuperCategory[];
  searchProducts: NavProductItem[];
  brochureHref: string;
  brochureDownload: string;
  activeMenuId?: TopMenuConfig['id'] | null;
}

export default function DesktopNav({
  menus,
  superCategories,
  searchProducts,
  brochureHref,
  brochureDownload,
  activeMenuId = 'products',
}: DesktopNavProps) {
  const [openMenuId, setOpenMenuId] = useState<TopMenuConfig['id'] | null>(null);
  const [activeSuperId, setActiveSuperId] = useState<string>(
    superCategories[0]?.id ?? 'mechanical-seal'
  );
  const [activeSubId, setActiveSubId] = useState<string>(
    superCategories[0]?.subcategories[0]?.id ?? 'multi-spring'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navContainerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<number | null>(null);

  const activeSuper = useMemo(
    () =>
      superCategories.find((s) => s.id === activeSuperId) ??
      superCategories[0],
    [activeSuperId, superCategories]
  );

  const activeSub = useMemo(() => {
    if (!activeSuper) return undefined;
    return (
      activeSuper.subcategories.find((sub) => sub.id === activeSubId) ??
      activeSuper.subcategories[0]
    );
  }, [activeSubId, activeSuper]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return searchProducts
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [searchProducts, searchQuery]);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const openMenu = (id: TopMenuConfig['id']) => {
    clearCloseTimeout();
    setOpenMenuId(id);
    setIsSearchOpen(false);
  };

  const scheduleCloseMenu = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = window.setTimeout(() => {
      setOpenMenuId(null);
    }, 140);
  };

  const handleSelectSuper = (superCat: NavSuperCategory) => {
    setActiveSuperId(superCat.id);
    setActiveSubId(superCat.subcategories[0]?.id ?? '');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearCloseTimeout();
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const currentMenu = menus.find((m) => m.id === openMenuId);

  return (
    <div
      ref={navContainerRef}
      className="hidden min-[769px]:block"
      onMouseLeave={scheduleCloseMenu}
    >
      <nav aria-label="Main navigation">
        <ul className="flex items-center gap-[2rem] max-[960px]:gap-[1.15rem]">
          {menus.map((menu) => {
            const isOpen = openMenuId === menu.id;
            const isActive = activeMenuId === menu.id;
            return (
              <li
                key={menu.id}
                onMouseEnter={() => openMenu(menu.id)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() =>
                    setOpenMenuId((prev) => (prev === menu.id ? null : menu.id))
                  }
                  className={`relative flex cursor-pointer items-center gap-[4px] border-none bg-transparent p-0 text-[0.95rem] font-semibold transition-colors duration-300 max-[960px]:text-[0.88rem] ${isActive
                    ? 'text-[#009FE3] before:absolute before:-top-[12.8px] before:left-0 before:h-[4px] before:w-full before:bg-[#009FE3] before:content-[""]'
                    : isOpen
                      ? 'text-[#009FE3]'
                      : 'text-[#003B6D] hover:text-[#009FE3]'
                    }`}
                >
                  <span>{menu.label}</span>
                  <ChevronDown
                    size={12}
                    strokeWidth={2.2}
                    aria-hidden="true"
                    className={`mt-[1px] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#009FE3]' : ''
                      } ${isActive ? 'text-[#009FE3]' : 'text-[#94A3B8]'}`}
                  />
                </button>
              </li>
            );
          })}

          <li className="relative ml-[10px] max-[960px]:ml-0">
            <div className="flex items-center border-b border-[#94A3B8] pb-[2px] focus-within:border-[#009FE3]">
              <Search
                size={16}
                strokeWidth={2}
                className="mr-[5px] shrink-0 text-[#003B6D]"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  setOpenMenuId(null);
                  if (searchQuery.trim().length >= 2) setIsSearchOpen(true);
                }}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchQuery(val);
                  setIsSearchOpen(val.trim().length >= 2);
                }}
                placeholder="Search..."
                aria-label="Search products"
                className="w-[80px] border-none bg-transparent text-[0.9rem] text-[#334155] outline-none transition-[width] duration-300 placeholder:text-[#94A3B8] focus:w-[130px] focus:outline-none max-[960px]:w-[68px] max-[960px]:focus:w-[100px]"
              />
            </div>

            {isSearchOpen && searchQuery.trim().length >= 2 && (
              <div
                className="absolute top-full right-0 z-[120] mt-[12px] w-[320px] rounded-[2px] border border-[#e2e8f0] border-t-2 border-t-[#009FE3] bg-white shadow-[0_12px_30px_rgba(0,43,73,0.12)]"
                role="region"
                aria-label="Search suggestions"
              >
                {searchResults.length > 0 ? (
                  <ul className="max-h-[340px] divide-y divide-[#F4F6F8] overflow-y-auto">
                    {searchResults.map((item) => (
                      <li key={item.id}>
                        <a
                          href={item.href}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors duration-200 hover:bg-[#F4F6F8]"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[0.86rem] font-semibold text-[#003B6D]">
                              {item.name}
                            </p>
                            <p className="text-[0.74rem] text-[#64748b]">
                              {item.category}
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            strokeWidth={2}
                            className="shrink-0 text-[#009FE3]"
                            aria-hidden="true"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-4 py-3 text-[0.85rem] text-[#64748b]">
                    No products matching &ldquo;{searchQuery.trim()}&rdquo;.
                  </p>
                )}
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* Mega-Menu Panels (Anchored to Header Bottom Border) */}
      {openMenuId && currentMenu && (
        <div
          className="absolute top-full right-0 left-0 z-[110]"
          onMouseEnter={clearCloseTimeout}
        >
          <div className="site-container">
            {openMenuId === 'products' ? (
              <div className="grid grid-cols-[205px_225px_1fr] overflow-hidden rounded-[2px] border border-[#e2e8f0] border-t-[3px] border-t-[#009FE3] bg-white shadow-[0_14px_34px_rgba(0,43,73,0.12)] min-[1025px]:grid-cols-[235px_250px_1fr]">
                {/* Tier 1: Super Categories */}
                <div className="flex flex-col justify-between bg-[#003B6D] p-4 text-white">
                  <div>
                    <p className="px-2 pb-2.5 text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#009FE3]">
                      Product Groups
                    </p>
                    <ul className="space-y-1">
                      {superCategories.map((superCat) => {
                        const isSelected = superCat.id === activeSuper?.id;
                        return (
                          <li key={superCat.id}>
                            <button
                              type="button"
                              onMouseEnter={() => handleSelectSuper(superCat)}
                              onClick={() => handleSelectSuper(superCat)}
                              className={`flex w-full cursor-pointer items-center justify-between rounded-[4px] px-3 py-2 text-left text-[0.86rem] transition-colors duration-200 ${isSelected
                                ? 'bg-[#009FE3] font-bold text-white'
                                : 'font-medium text-[#cbd5e1] hover:bg-white/10 hover:text-white'
                                }`}
                            >
                              <span>{superCat.title}</span>
                              <ChevronRight
                                size={14}
                                strokeWidth={2.2}
                                className={
                                  isSelected ? 'text-white' : 'text-white/50'
                                }
                                aria-hidden="true"
                              />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <div className="mt-4 border-t border-white/15 pt-3.5">
                    <p className="mb-3 text-[0.78rem] leading-[1.45] text-[#cbd5e1]">
                      Browse all 46 mechanical seals, rotary unions &amp; support systems.
                    </p>
                    <a
                      href="/products"
                      onClick={() => setOpenMenuId(null)}
                      className="inline-block rounded-[4px] border-2 border-[#FFE600] bg-[#FFE600] px-4 py-1.5 text-[0.82rem] font-semibold text-[#003B6D] transition-colors duration-200 hover:border-[#E6D000] hover:bg-[#E6D000]"
                    >
                      View All Products
                    </a>
                  </div>
                </div>

                {/* Tier 2: Subcategories */}
                <div className="max-h-[430px] overflow-y-auto border-r border-[#e2e8f0] bg-white py-3">
                  <p className="px-4 pb-2 text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#64748b]">
                    Categories
                  </p>
                  <ul className="space-y-0.5 px-2">
                    {activeSuper?.subcategories.map((sub) => {
                      const isSelected = sub.id === activeSub?.id;
                      return (
                        <li key={sub.id}>
                          <button
                            type="button"
                            onMouseEnter={() => setActiveSubId(sub.id)}
                            onClick={() => setActiveSubId(sub.id)}
                            className={`flex w-full cursor-pointer items-center justify-between rounded-[2px] px-3 py-2 text-left text-[0.86rem] transition-colors duration-200 ${isSelected
                              ? 'bg-[#F4F6F8] font-semibold text-[#003B6D]'
                              : 'text-[#334155] hover:bg-[#F4F6F8]/60 hover:text-[#003B6D]'
                              }`}
                          >
                            <span>{sub.title}</span>
                            <ChevronRight
                              size={13}
                              strokeWidth={2}
                              className={
                                isSelected ? 'text-[#009FE3]' : 'text-[#94A3B8]'
                              }
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Tier 3: Products Detail Grid + Catalogue Link */}
                <div className="flex max-h-[430px] flex-col justify-between bg-white p-5">
                  <div className="overflow-y-auto pr-1">
                    <div className="mb-3 flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                      <span className="text-[0.8rem] font-bold uppercase tracking-[1px] text-[#009FE3]">
                        {activeSub?.title}
                      </span>
                      <span className="text-[0.75rem] text-[#64748b]">
                        {activeSub?.products.length ?? 0} series
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 min-[1025px]:grid-cols-2">
                      {activeSub?.products.map((prod) => (
                        <a
                          key={prod.id}
                          href={prod.href}
                          onClick={() => setOpenMenuId(null)}
                          className="group flex items-center gap-3 rounded-[2px] border border-[#e2e8f0] bg-white p-2.5 transition-colors duration-200 hover:border-[#009FE3] hover:bg-[#F4F6F8]/60"
                        >
                          {prod.thumbSrc && (
                            <div className="h-[48px] w-[48px] shrink-0 overflow-hidden rounded-[2px] border border-[#e2e8f0] bg-[#F4F6F8]">
                              <img
                                src={prod.thumbSrc}
                                alt={prod.name}
                                loading="lazy"
                                decoding="async"
                                className="block h-full w-full object-cover object-center"
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <span className="block text-[0.83rem] font-semibold leading-[1.3] text-[#003B6D] group-hover:text-[#009FE3]">
                              {prod.name}
                            </span>
                            <span className="mt-0.5 block text-[0.7rem] font-medium text-[#64748b] group-hover:text-[#009FE3]">
                              View specifications
                            </span>
                          </div>
                          <ChevronRight
                            size={14}
                            strokeWidth={2}
                            className="shrink-0 text-[#94A3B8] transition-colors group-hover:text-[#009FE3]"
                            aria-hidden="true"
                          />
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e2e8f0] pt-3">
                    <a
                      href={brochureHref}
                      download={brochureDownload}
                      onClick={() => setOpenMenuId(null)}
                      className="inline-flex items-center gap-2 text-[0.84rem] font-semibold text-[#003B6D] transition-colors duration-200 hover:text-[#009FE3]"
                    >
                      <FileDown size={16} strokeWidth={2} aria-hidden="true" />
                      <span>Download Technical Catalogue (PDF)</span>
                    </a>
                    <span className="text-[0.75rem] text-[#64748b]">
                      Standard &amp; custom specifications available
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="grid w-full max-w-[780px] grid-cols-[240px_1fr] gap-5 rounded-[2px] border border-[#e2e8f0] border-t-[3px] border-t-[#009FE3] bg-white p-5 shadow-[0_14px_34px_rgba(0,43,73,0.12)]">
                  {currentMenu.promo && (
                    <div className="flex flex-col justify-between rounded-[2px] bg-[#003B6D] p-5 text-white">
                      <div>
                        <span className="mb-2 block text-[0.7rem] font-bold uppercase tracking-[1.2px] text-[#009FE3]">
                          {currentMenu.label}
                        </span>
                        <h3 className="mb-2 text-[1.1rem] font-bold leading-[1.3] text-white">
                          {currentMenu.promo.title}
                        </h3>
                        <p className="text-[0.84rem] leading-[1.5] text-[#cbd5e1]">
                          {currentMenu.promo.description}
                        </p>
                      </div>
                      <a
                        href={currentMenu.promo.buttonHref}
                        onClick={() => setOpenMenuId(null)}
                        className="mt-4 inline-block self-start rounded-[4px] border-2 border-[#FFE600] bg-[#FFE600] px-4 py-1.5 text-[0.82rem] font-semibold text-[#003B6D] transition-colors duration-200 hover:border-[#E6D000] hover:bg-[#E6D000]"
                      >
                        {currentMenu.promo.buttonText}
                      </a>
                    </div>
                  )}

                  <div
                    className={`grid gap-6 py-1 ${(currentMenu.columns?.length ?? 1) > 1
                      ? 'grid-cols-2'
                      : 'grid-cols-1'
                      }`}
                  >
                    {currentMenu.columns?.map((col) => (
                      <div key={col.columnTitle}>
                        <h4 className="mb-3 border-b border-[#e2e8f0] pb-2 text-[0.76rem] font-bold uppercase tracking-[1px] text-[#009FE3]">
                          {col.columnTitle}
                        </h4>
                        <ul className="space-y-2">
                          {col.links.map((link) => (
                            <li key={link.title}>
                              <a
                                href={link.href}
                                onClick={() => setOpenMenuId(null)}
                                className="flex items-center justify-between rounded-[2px] py-1 text-[0.9rem] font-medium text-[#334155] transition-colors duration-200 hover:text-[#009FE3]"
                              >
                                <span>{link.title}</span>
                                <ChevronRight
                                  size={14}
                                  strokeWidth={2}
                                  className="text-[#94A3B8]"
                                  aria-hidden="true"
                                />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
