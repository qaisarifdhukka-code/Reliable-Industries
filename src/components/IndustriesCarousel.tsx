import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface IndustryItem {
  id: string;
  title: string;
  desc: string;
  imageSrc: string;
  href: string;
}

interface IndustriesCarouselProps {
  industries: IndustryItem[];
}

export default function IndustriesCarousel({ industries }: IndustriesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  const scrollToMobileSlide = (index: number) => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, industries.length - 1));
    const target = track.children[clamped] as HTMLElement | undefined;
    if (!target) return;
    const trackRect = track.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    track.scrollTo({
      left: track.scrollLeft + (targetRect.left - trackRect.left),
      behavior: 'smooth',
    });
    setMobileIndex(clamped);
  };

  const handleMobileScroll = () => {
    const track = mobileTrackRef.current;
    if (!track) return;
    const trackLeft = track.getBoundingClientRect().left;
    let closestIdx = 0;
    let closestDist = Infinity;
    Array.from(track.children).forEach((child, i) => {
      const dist = Math.abs(child.getBoundingClientRect().left - trackLeft);
      if (dist < closestDist) {
        closestDist = dist;
        closestIdx = i;
      }
    });
    setMobileIndex(closestIdx);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + industries.length) % industries.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % industries.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) > 45) {
      if (delta > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  return (
    <>
      {/* Mobile-Only Card Slider (<= 768px) */}
      <div className="min-[769px]:hidden">
        <div
          ref={mobileTrackRef}
          onScroll={handleMobileScroll}
          className="flex flex-nowrap gap-[1rem] overflow-x-auto snap-x snap-mandatory pb-[4px] scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {industries.map((item) => (
            <article
              key={`mobile-${item.id}`}
              className="flex w-[85%] shrink-0 snap-start flex-col overflow-hidden rounded-[2px] border border-[#e2e8f0] bg-white shadow-[0_4px_20px_rgba(0,43,73,0.05)]"
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#F4F6F8]">
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  loading="eager"
                  decoding="async"
                  className="block h-full w-full object-cover"
                />
              </div>
              <div className="flex grow flex-col p-[1.25rem]">
                <h3 className="mb-[0.55rem] text-[1.15rem] font-bold leading-[1.3] text-[#003B6D]">
                  {item.title}
                </h3>
                <p className="mb-[1.1rem] grow text-[0.88rem] leading-[1.5] text-[#334155]">
                  {item.desc}
                </p>
                <a
                  href={item.href}
                  className="inline-block self-start rounded-none border border-[#003B6D] bg-transparent px-[1.25rem] py-[0.55rem] text-[0.85rem] font-semibold text-[#003B6D] transition-colors duration-200 hover:bg-[#003B6D] hover:text-white"
                >
                  Read more
                </a>
              </div>
            </article>
          ))}
        </div>

        <div
          className="mt-[1.25rem] flex items-center justify-between gap-3"
          role="region"
          aria-label="Industries slider navigation"
        >
          <div className="flex items-center gap-[5px]" role="tablist" aria-label="Industries slides">
            {industries.map((item, idx) => (
              <button
                key={`dot-${item.id}`}
                type="button"
                onClick={() => scrollToMobileSlide(idx)}
                aria-label={`Show ${item.title}`}
                aria-selected={idx === mobileIndex}
                className={`h-[8px] cursor-pointer rounded-[2px] border-none transition-all duration-200 ${
                  idx === mobileIndex ? 'w-[18px] bg-[#009FE3]' : 'w-[8px] bg-[#cbd5e1]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={() => scrollToMobileSlide(mobileIndex - 1)}
              disabled={mobileIndex === 0}
              aria-label="Previous industry"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-none border border-[#003B6D] bg-white text-[#003B6D] transition-colors duration-200 hover:bg-[#003B6D] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToMobileSlide(mobileIndex + 1)}
              disabled={mobileIndex >= industries.length - 1}
              aria-label="Next industry"
              className="flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-none border border-[#003B6D] bg-[#003B6D] text-white transition-colors duration-200 hover:border-[#009FE3] hover:bg-[#009FE3] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Tablet & Desktop Layout (>= 769px) */}
      <div
        className="hidden min-[769px]:flex flex-col items-start gap-[2rem] bg-[#F4F6F8] min-[961px]:flex-row min-[961px]:gap-[4rem]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
      {/* Left Sliding Image */}
      <div className="aspect-[16/10] w-full overflow-hidden min-[961px]:w-auto min-[961px]:flex-[1.3] min-[961px]:max-w-[60%]">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {industries.map((item) => (
            <img
              key={item.id}
              src={item.imageSrc}
              alt={item.title}
              loading="eager"
              decoding="async"
              className="block h-full min-w-full object-cover"
            />
          ))}
        </div>
      </div>

      {/* Right Interactive Controls & Selector */}
      <div className="relative w-full p-0 min-[961px]:w-auto min-[961px]:flex-[1] min-[961px]:max-w-[45%]">
        <div className="mb-[1.5rem] flex gap-[2px]">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous item"
            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-none border-none bg-[#003B6D] text-[1rem] text-white transition-colors duration-300 hover:bg-[#009FE3]"
          >
            &#8592;
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next item"
            className="flex h-[40px] w-[40px] cursor-pointer items-center justify-center rounded-none border-none bg-[#003B6D] text-[1rem] text-white transition-colors duration-300 hover:bg-[#009FE3]"
          >
            &#8594;
          </button>
        </div>

        <div className="mb-[1rem] overflow-hidden" aria-live="polite">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {industries.map((item, index) => (
              <div
                key={item.id}
                className="min-w-full pr-[1rem]"
                aria-hidden={index !== activeIndex}
              >
                <h3 className="mb-[0.75rem] text-[1.4rem] font-bold text-[#003B6D]">
                  {item.title}
                </h3>
                <p className="mb-[1rem] max-w-full text-[0.95rem] text-[#334155] min-[961px]:max-w-[90%]">
                  {item.desc}
                </p>
                <a
                  href={item.href}
                  tabIndex={index === activeIndex ? 0 : -1}
                  className="mb-[2rem] inline-block rounded-none border border-[#003B6D] bg-transparent px-[1.5rem] py-[0.6rem] text-[0.9rem] font-semibold text-[#003B6D] transition-all duration-300 hover:bg-[#003B6D] hover:text-white"
                >
                  Read more
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-[1rem] gap-y-[0.5rem] min-[641px]:grid-cols-2 min-[641px]:gap-[0.8rem]">
          {industries.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={isActive}
                className={`block min-h-[36px] cursor-pointer border-none bg-transparent py-1 text-left text-[0.85rem] transition-colors duration-300 min-[961px]:min-h-0 min-[961px]:py-0 ${
                  isActive
                    ? 'font-bold text-[#003B6D]'
                    : 'font-normal text-[#94A3B8] hover:text-[#003B6D]'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
}
