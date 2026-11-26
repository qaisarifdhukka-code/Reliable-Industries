import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, ShieldCheck, Star } from 'lucide-react';

export interface HeroSlide {
  id: string;
  imageSrc: string;
  imageAlt: string;
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  theme: 'light-pharma' | 'cyan-product' | 'light-mission';
  badgeIcon: 'shield' | 'plus' | 'star';
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export default function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const moveSlide = useCallback(
    (direction: number) => {
      setCurrentSlide((prev) => (prev + direction + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || isPaused || slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      moveSlide(1);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused, moveSlide, slides.length]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveSlide(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveSlide(1);
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) > 45) {
      moveSlide(delta > 0 ? -1 : 1);
    }
  };

  const renderBadgeIcon = (icon: HeroSlide['badgeIcon']) => {
    if (icon === 'shield') {
      return <ShieldCheck size={18} strokeWidth={2} aria-hidden="true" />;
    }
    if (icon === 'plus') {
      return <PlusCircle size={18} strokeWidth={2} aria-hidden="true" />;
    }
    return <Star size={18} strokeWidth={2} aria-hidden="true" />;
  };

  const getOverlayClasses = (theme: HeroSlide['theme']) => {
    if (theme === 'cyan-product') {
      return 'bg-[linear-gradient(90deg,rgba(0,159,227,0.96)_0%,rgba(0,159,227,0.88)_70%,rgba(0,159,227,0.65)_100%)] min-[769px]:bg-[linear-gradient(90deg,rgba(0,159,227,1)_0%,rgba(0,159,227,0.9)_45%,rgba(0,159,227,0)_100%)]';
    }
    if (theme === 'light-mission') {
      return 'bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.9)_70%,rgba(255,255,255,0.65)_100%)] min-[769px]:bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_60%,rgba(255,255,255,0.2)_100%)]';
    }
    return 'bg-[linear-gradient(90deg,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.9)_70%,rgba(255,255,255,0.65)_100%)] min-[769px]:bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.95)_30%,rgba(255,255,255,0)_100%)]';
  };

  return (
    <section
      className="relative flex min-h-[540px] flex-col overflow-hidden text-white min-[769px]:min-h-[85vh]"
      aria-roledescription="carousel"
      aria-label="Featured showcase"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex w-full flex-1 transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => {
          const isCyan = slide.theme === 'cyan-product';
          const TitleTag = index === 0 ? 'h1' : 'h2';

          return (
            <div
              key={slide.id}
              className="relative flex min-w-full items-center py-12 min-[769px]:py-0"
              aria-hidden={index !== currentSlide}
            >
              <img
                src={slide.imageSrc}
                alt={slide.imageAlt}
                loading="eager"
                fetchPriority={index === 0 ? 'high' : 'low'}
                decoding="async"
                className="absolute inset-0 z-[1] h-full w-full object-cover object-center"
              />
              <div className={`absolute inset-0 z-[2] ${getOverlayClasses(slide.theme)}`} />

              <div className="site-container relative z-[3]">
                <div className="max-w-[900px] max-[1024px]:min-[769px]:px-10">
                  <span
                    className={`mb-[0.75rem] block text-[0.75rem] font-bold uppercase tracking-[2px] ${
                      isCyan ? 'text-white' : 'text-[#003B6D]'
                    }`}
                  >
                    {slide.kicker}
                  </span>

                  <TitleTag
                    className={`mb-[1rem] max-w-full text-[clamp(1.85rem,6.5vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-1.5px] min-[769px]:text-[clamp(2.5rem,4vw,3.2rem)] ${
                      isCyan ? 'text-white' : 'text-[#003B6D]'
                    }`}
                  >
                    {slide.titleLine1}
                    <br />
                    {slide.titleLine2}
                  </TitleTag>

                  <p
                    className={`mb-[1.5rem] max-w-[600px] text-[0.95rem] font-semibold leading-[1.5] min-[769px]:text-[1rem] ${
                      isCyan ? 'text-white' : 'text-[#003B6D]'
                    }`}
                  >
                    {slide.subtitle}
                  </p>

                  <div className="mb-[2rem] flex gap-[1rem]">
                    <a
                      href={slide.ctaHref}
                      tabIndex={index === currentSlide ? 0 : -1}
                      className={`inline-block rounded-none border-2 px-[2rem] py-[0.75rem] text-center text-[0.95rem] font-semibold transition-colors duration-300 min-[769px]:px-[2.5rem] min-[769px]:py-[0.8rem] ${
                        isCyan
                          ? 'border-[#FFE600] bg-[#FFE600] text-[#002038] hover:border-[#E6D000] hover:bg-[#E6D000]'
                          : 'border-[#003B6D] bg-[#003B6D] text-white hover:border-[#002038] hover:bg-[#002038]'
                      }`}
                    >
                      {slide.ctaLabel}
                    </a>
                  </div>

                  <div
                    className={`flex h-[35px] w-[35px] items-center justify-center rounded-full ${
                      isCyan
                        ? 'bg-white text-[#002038]'
                        : 'border-2 border-[#334155] text-[#334155]'
                    }`}
                    aria-hidden="true"
                  >
                    {renderBadgeIcon(slide.badgeIcon)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => moveSlide(-1)}
        aria-label="Previous slide"
        className="absolute bottom-[14px] left-[16px] z-10 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-white/75 text-[#003B6D] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors duration-300 hover:bg-white min-[769px]:top-1/2 min-[769px]:bottom-auto min-[769px]:left-[20px] min-[769px]:h-[40px] min-[769px]:w-[40px] min-[769px]:-translate-y-1/2 min-[769px]:bg-white/70"
      >
        <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={() => moveSlide(1)}
        aria-label="Next slide"
        className="absolute right-[16px] bottom-[14px] z-10 flex h-[36px] w-[36px] cursor-pointer items-center justify-center rounded-full bg-white/75 text-[#003B6D] shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-colors duration-300 hover:bg-white min-[769px]:top-1/2 min-[769px]:right-[20px] min-[769px]:bottom-auto min-[769px]:h-[40px] min-[769px]:w-[40px] min-[769px]:-translate-y-1/2 min-[769px]:bg-white/70"
      >
        <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      <div
        className="absolute bottom-[20px] left-1/2 z-10 flex -translate-x-1/2 gap-[8px]"
        role="tablist"
        aria-label="Slide indicators"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-label={`Go to slide ${index + 1}`}
            aria-selected={index === currentSlide}
            onClick={() => setCurrentSlide(index)}
            className={`h-[10px] w-[10px] cursor-pointer rounded-full border-none p-0 transition-colors duration-300 ${
              index === currentSlide ? 'bg-[#003B6D]' : 'bg-[#003B6D]/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
