import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, FileDown, Menu, Search, X } from 'lucide-react';
import type {
  NavProductItem,
  NavSuperCategory,
  TopMenuConfig,
  UtilityLink,
} from '@/data/navigation';

interface MobileNavProps {
  menus: TopMenuConfig[];
  superCategories: NavSuperCategory[];
  searchProducts: NavProductItem[];
  utilityLinks: UtilityLink[];
  brochureHref: string;
  brochureDownload: string;
  brandFirst: string;
  brandSecond: string;
  mfgSubline1: string;
  mfgSubline2: string;
}

export default function MobileNav({
  menus,
  superCategories,
  searchProducts,
  utilityLinks,
  brochureHref,
  brochureDownload,
  brandFirst,
  brandSecond,
  mfgSubline1,
  mfgSubline2,
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>('products');
  const [openSuperId, setOpenSuperId] = useState<string | null>(
    superCategories[0]?.id ?? null
  );
  const [openSubId, setOpenSubId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q.length < 2) return [];
    return searchProducts
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchProducts, searchQuery]);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }

    document.body.style.overflow = '';
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="min-[769px]:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#003B6D] transition-colors duration-300 hover:text-[#009FE3]"
      >
        <Menu size={24} strokeWidth={2} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[150] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
          id="mobile-nav-drawer"
        >
          <div
            className="fixed inset-0 bg-[#002038]/40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative z-[160] flex h-full w-full max-w-[340px] flex-col bg-white shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-3.5">
              <div>
                <div className="flex items-baseline gap-[6px] font-serif italic text-[#003B6D]">
                  <span className="text-[1.3rem] font-bold leading-[1]">
                    {brandFirst}
                  </span>
                  <span className="text-[1.3rem] font-bold leading-[1]">
                    {brandSecond}
                  </span>
                </div>
                <span className="mt-[3px] block border-t border-[#003B6D] pt-[3px] text-left font-serif text-[0.54rem] font-bold leading-[1.2] text-[#003B6D]">
                  <span className="block whitespace-nowrap">{mfgSubline1}</span>
                  <span className="block whitespace-nowrap">{mfgSubline2}</span>
                </span>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-11 w-11 cursor-pointer items-center justify-center text-[#003B6D] transition-colors duration-300 hover:text-[#009FE3]"
              >
                <X size={22} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
              <div className="mb-4">
                <div className="flex items-center border-b border-[#94A3B8] pb-2 focus-within:border-[#009FE3]">
                  <Search
                    size={16}
                    strokeWidth={2}
                    className="mr-2 shrink-0 text-[#003B6D]"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    aria-label="Search products"
                    className="w-full border-none bg-transparent text-[0.95rem] text-[#334155] placeholder:text-[#94A3B8] focus:outline-none"
                  />
                </div>

                {searchQuery.trim().length >= 2 && (
                  <div className="mt-2 rounded-[2px] border border-[#e2e8f0] bg-[#F4F6F8]">
                    {searchResults.length > 0 ? (
                      <ul className="divide-y divide-[#e2e8f0]">
                        {searchResults.map((item) => (
                          <li key={item.id}>
                            <a
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center justify-between px-3 py-2 text-left"
                            >
                              <div className="min-w-0">
                                <span className="block truncate text-[0.84rem] font-semibold text-[#003B6D]">
                                  {item.name}
                                </span>
                                <span className="block text-[0.72rem] text-[#64748b]">
                                  {item.category}
                                </span>
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
                      <p className="px-3 py-2 text-[0.82rem] text-[#64748b]">
                        No matching products found.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <nav aria-label="Mobile main navigation">
                <ul className="divide-y divide-[#F4F6F8]">
                  {menus.map((menu) => {
                    const isMenuExpanded = openMenuId === menu.id;
                    return (
                      <li key={menu.id} className="py-1">
                        <button
                          type="button"
                          aria-expanded={isMenuExpanded}
                          onClick={() =>
                            setOpenMenuId((prev) =>
                              prev === menu.id ? null : menu.id
                            )
                          }
                          className={`flex min-h-[44px] w-full cursor-pointer items-center justify-between text-left text-[1rem] font-semibold transition-colors duration-200 ${
                            isMenuExpanded || menu.active
                              ? 'text-[#009FE3]'
                              : 'text-[#003B6D]'
                          }`}
                        >
                          <span>{menu.label}</span>
                          <ChevronDown
                            size={16}
                            strokeWidth={2}
                            className={`transition-transform duration-200 ${
                              isMenuExpanded
                                ? 'rotate-180 text-[#009FE3]'
                                : 'text-[#94A3B8]'
                            }`}
                            aria-hidden="true"
                          />
                        </button>

                        {isMenuExpanded && menu.id === 'products' && (
                          <div className="mb-3 space-y-2 pt-1">
                            {superCategories.map((superCat) => {
                              const isSuperOpen = openSuperId === superCat.id;
                              return (
                                <div
                                  key={superCat.id}
                                  className="rounded-[2px] border border-[#e2e8f0] bg-[#F4F6F8]"
                                >
                                  <button
                                    type="button"
                                    aria-expanded={isSuperOpen}
                                    onClick={() => {
                                      setOpenSuperId((prev) =>
                                        prev === superCat.id
                                          ? null
                                          : superCat.id
                                      );
                                      setOpenSubId(
                                        superCat.subcategories[0]?.id ?? null
                                      );
                                    }}
                                    className="flex min-h-[40px] w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-[0.9rem] font-bold text-[#003B6D]"
                                  >
                                    <span>{superCat.title}</span>
                                    <ChevronDown
                                      size={14}
                                      strokeWidth={2}
                                      className={`transition-transform ${
                                        isSuperOpen
                                          ? 'rotate-180 text-[#009FE3]'
                                          : 'text-[#64748b]'
                                      }`}
                                      aria-hidden="true"
                                    />
                                  </button>

                                  {isSuperOpen && (
                                    <div className="space-y-1 border-t border-[#e2e8f0] bg-white px-2.5 py-2">
                                      {superCat.subcategories.map((sub) => {
                                        const isSubOpen = openSubId === sub.id;
                                        return (
                                          <div key={sub.id}>
                                            <button
                                              type="button"
                                              aria-expanded={isSubOpen}
                                              onClick={() =>
                                                setOpenSubId((prev) =>
                                                  prev === sub.id
                                                    ? null
                                                    : sub.id
                                                )
                                              }
                                              className="flex min-h-[36px] w-full cursor-pointer items-center justify-between rounded-[2px] px-2 py-1.5 text-left text-[0.84rem] font-semibold text-[#003B6D] hover:bg-[#F4F6F8]"
                                            >
                                              <span>{sub.title}</span>
                                              <span className="text-[0.72rem] text-[#64748b]">
                                                {sub.products.length}
                                              </span>
                                            </button>

                                            {isSubOpen && (
                                              <ul className="mt-1 space-y-1 border-l-2 border-[#009FE3] pl-2.5">
                                                {sub.products.map((prod) => (
                                                  <li key={prod.id}>
                                                    <a
                                                      href={prod.href}
                                                      onClick={() =>
                                                        setIsOpen(false)
                                                      }
                                                      className="block py-1 text-[0.8rem] text-[#334155] hover:text-[#009FE3]"
                                                    >
                                                      {prod.name}
                                                    </a>
                                                  </li>
                                                ))}
                                              </ul>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            <a
                              href={brochureHref}
                              download={brochureDownload}
                              onClick={() => setIsOpen(false)}
                              className="flex min-h-[42px] items-center justify-center gap-2 rounded-[4px] bg-[#003B6D] px-3 py-2 text-[0.85rem] font-semibold text-white"
                            >
                              <FileDown
                                size={15}
                                strokeWidth={2}
                                aria-hidden="true"
                              />
                              <span>Technical Catalogue (PDF)</span>
                            </a>
                          </div>
                        )}

                        {isMenuExpanded &&
                          menu.id !== 'products' &&
                          menu.columns && (
                            <div className="mb-3 space-y-3 rounded-[2px] bg-[#F4F6F8] p-3">
                              {menu.columns.map((col) => (
                                <div key={col.columnTitle}>
                                  <p className="mb-1.5 text-[0.72rem] font-bold uppercase tracking-[1px] text-[#009FE3]">
                                    {col.columnTitle}
                                  </p>
                                  <ul className="space-y-1">
                                    {col.links.map((link) => (
                                      <li key={link.title}>
                                        <a
                                          href={link.href}
                                          onClick={() => setIsOpen(false)}
                                          className="flex min-h-[34px] items-center text-[0.86rem] text-[#334155] hover:text-[#009FE3]"
                                        >
                                          {link.title}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          )}
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="mt-5 border-t border-[#e2e8f0] pt-4">
                <p className="mb-2 text-[0.75rem] font-bold uppercase tracking-[1px] text-[#94A3B8]">
                  Reliable Industries Group
                </p>
                <nav aria-label="Mobile utility navigation">
                  <ul className="flex flex-col gap-1">
                    {utilityLinks.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          download={link.download}
                          onClick={() => setIsOpen(false)}
                          className="flex min-h-[40px] items-center text-[0.9rem] text-[#334155] transition-colors duration-300 hover:text-[#009FE3]"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
