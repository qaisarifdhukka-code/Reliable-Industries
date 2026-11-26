import { useRef, useState } from 'react';

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
  const touchStartX = useRef<number | null>(null);

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
    <div
      className="flex flex-col items-start gap-[2rem] bg-[#F4F6F8] min-[961px]:flex-row min-[961px]:gap-[4rem]"
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
  );
}
