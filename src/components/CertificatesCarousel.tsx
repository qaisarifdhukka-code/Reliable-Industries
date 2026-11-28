import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface CertificateCardData {
  id: string;
  category: string;
  title: string;
  regNumber: string;
  organizationLabel: string;
  organization: string;
  standardCode: string;
  description: string;
  sealLabel: string;
  signatoryName: string;
  signatoryRole: string;
  accentType: 'navy' | 'cyan';
  pdfUrl?: string;
}

interface CertificatesCarouselProps {
  certificates: CertificateCardData[];
}

export default function CertificatesCarousel({
  certificates,
}: CertificatesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const total = certificates.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      handleNext();
    }
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const delta = endX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(delta) > 40) {
      if (delta > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
  };

  const getCircularOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  const getCardStyleClass = (offset: number) => {
    if (offset === 0) {
      return 'z-30 translate-x-0 scale-100 rotate-0 opacity-100 shadow-[0_12px_32px_rgba(0,43,73,0.12)]';
    }
    if (offset === -1) {
      return 'z-20 -translate-x-[16px] scale-[0.94] -rotate-[2deg] opacity-90 shadow-[0_6px_18px_rgba(0,43,73,0.08)] min-[577px]:-translate-x-[72px] min-[577px]:scale-[0.9] min-[577px]:-rotate-[4deg] min-[1201px]:-translate-x-[96px]';
    }
    if (offset === 1) {
      return 'z-20 translate-x-[16px] scale-[0.94] rotate-[2deg] opacity-90 shadow-[0_6px_18px_rgba(0,43,73,0.08)] min-[577px]:translate-x-[72px] min-[577px]:scale-[0.9] min-[577px]:rotate-[4deg] min-[1201px]:translate-x-[96px]';
    }
    if (offset <= -2) {
      return 'z-10 pointer-events-none opacity-0 min-[577px]:pointer-events-auto min-[577px]:-translate-x-[135px] min-[577px]:scale-[0.81] min-[577px]:-rotate-[7deg] min-[577px]:opacity-85 min-[1201px]:-translate-x-[178px] shadow-[0_4px_12px_rgba(0,43,73,0.06)]';
    }
    return 'z-10 pointer-events-none opacity-0 min-[577px]:pointer-events-auto min-[577px]:translate-x-[135px] min-[577px]:scale-[0.81] min-[577px]:rotate-[7deg] min-[577px]:opacity-85 min-[1201px]:translate-x-[178px] shadow-[0_4px_12px_rgba(0,43,73,0.06)]';
  };

  return (
    <div
      className="flex flex-col items-center justify-center"
      aria-roledescription="carousel"
      aria-label="Certificates showcase"
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stacked Card Stage */}
      <div className="relative flex h-[415px] w-full items-center justify-center overflow-hidden py-4 min-[577px]:h-[430px]">
        {certificates.map((cert, index) => {
          const offset = getCircularOffset(index);
          const isActive = offset === 0;
          const isCyan = cert.accentType === 'cyan';

          return (
            <article
              key={cert.id}
              onClick={() => {
                if (!isActive) setActiveIndex(index);
              }}
              aria-hidden={!isActive}
              className={`absolute flex h-[385px] w-[calc(100%-3rem)] max-w-[300px] flex-col rounded-[2px] border border-[#e2e8f0] bg-white ${cert.pdfUrl ? 'p-2' : 'p-[1.5rem]'} text-center transition-all duration-300 ease-in-out min-[577px]:h-[395px] min-[577px]:w-[310px] min-[577px]:max-w-none ${
                isCyan ? 'border-t-4 border-t-[#009FE3]' : 'border-t-4 border-t-[#003B6D]'
              } ${!isActive ? 'cursor-pointer' : ''} ${getCardStyleClass(offset)}`}
            >
              {cert.pdfUrl ? (
                <a
                  href={cert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    if (!isActive) {
                      e.preventDefault();
                    }
                  }}
                  className="relative flex h-full w-full flex-col overflow-hidden bg-[#f8fafc]"
                  title={`Open ${cert.title}`}
                >
                  <iframe
                    src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                    title={cert.title}
                    className="pointer-events-none h-full w-full border-0"
                    loading="lazy"
                  />
                </a>
              ) : (
                <>
              <div className="mb-[0.75rem] flex justify-center">
                <span
                  className={`inline-block rounded-[2px] px-[0.65rem] py-[0.2rem] text-[0.68rem] font-bold uppercase tracking-[1px] ${
                    isCyan
                      ? 'bg-[#009FE3]/10 text-[#009FE3]'
                      : 'bg-[#F4F6F8] text-[#003B6D]'
                  }`}
                >
                  {cert.category}
                </span>
              </div>

              <h3 className="mb-[0.25rem] text-[1.1rem] font-bold leading-[1.25] text-[#003B6D]">
                {cert.title}
              </h3>
              <p className="mb-[0.9rem] text-[0.78rem] text-[#94A3B8]">
                {cert.regNumber}
              </p>

              <div className="border-t border-[#e2e8f0] pt-[0.9rem]">
                <span className="mb-[0.2rem] block text-[0.65rem] font-semibold uppercase tracking-[1px] text-[#94A3B8]">
                  {cert.organizationLabel}
                </span>
                <p className="mb-[0.2rem] text-[1rem] font-bold text-[#003B6D]">
                  {cert.organization}
                </p>
                <p className="mb-[0.7rem] text-[0.85rem] font-bold text-[#009FE3]">
                  {cert.standardCode}
                </p>
                <p className="text-[0.8rem] leading-[1.45] text-[#334155]">
                  {cert.description}
                </p>
              </div>

              <div className="mt-auto flex items-end justify-between border-t border-[#F4F6F8] pt-[0.85rem]">
                <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[#009FE3] px-1 text-center text-[0.55rem] font-bold leading-[1.1] uppercase text-[#003B6D]">
                  {cert.sealLabel}
                </div>
                <div className="text-right">
                  <span className="block text-[0.9rem] font-semibold italic text-[#003B6D]">
                    {cert.signatoryName}
                  </span>
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.6px] text-[#94A3B8]">
                    {cert.signatoryRole}
                  </span>
                </div>
              </div>
                </>
              )}
            </article>
          );
        })}
      </div>

      {/* Controls */}
      <div className="mt-[0.75rem] flex items-center justify-center gap-[0.75rem]">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous certificate"
          className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#003B6D] shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-colors duration-300 hover:border-[#003B6D] hover:bg-[#003B6D] hover:text-white min-[769px]:h-[40px] min-[769px]:w-[40px]"
        >
          <ArrowLeft size={18} strokeWidth={2} aria-hidden="true" />
        </button>

        <span
          aria-live="polite"
          className="min-w-[44px] text-center text-[0.85rem] font-semibold text-[#334155]"
        >
          {activeIndex + 1} / {total}
        </span>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next certificate"
          className="flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#003B6D] shadow-[0_2px_10px_rgba(0,0,0,0.08)] transition-colors duration-300 hover:border-[#003B6D] hover:bg-[#003B6D] hover:text-white min-[769px]:h-[40px] min-[769px]:w-[40px]"
        >
          <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
