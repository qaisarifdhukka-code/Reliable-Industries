import { useState } from 'react';
import { Camera, Ruler } from 'lucide-react';

export interface ProductGallerySlide {
  src: string;
  alt: string;
  label: string;
  type: 'photo' | 'diagram';
}

interface ProductGalleryProps {
  slides: ProductGallerySlide[];
}

export default function ProductGallery({ slides }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomOrigin, setZoomOrigin] = useState('center center');
  const [isZoomed, setIsZoomed] = useState(false);

  const current = slides[activeIdx] ?? slides[0];
  if (!current) return null;

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomOrigin('center center');
  };

  return (
    <div className="mb-[2.25rem]">
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-[2px] border border-[#e2e8f0] bg-[#F4F6F8] p-[1.25rem] min-[769px]:cursor-crosshair min-[769px]:max-h-[430px]"
      >
        <img
          src={current.src}
          alt={current.alt}
          style={{
            transformOrigin: zoomOrigin,
            transform: isZoomed ? 'scale(1.85)' : 'scale(1)',
          }}
          className="h-full w-full object-contain transition-transform duration-150 ease-out"
        />
      </div>

      {slides.length > 1 && (
        <div className="mt-[0.9rem] flex flex-wrap justify-center gap-[0.65rem]">
          {slides.map((slide, idx) => {
            const isSelected = idx === activeIdx;
            return (
              <button
                key={`${slide.label}-${idx}`}
                type="button"
                onClick={() => {
                  setActiveIdx(idx);
                  setIsZoomed(false);
                }}
                aria-pressed={isSelected}
                className={`inline-flex min-h-[40px] cursor-pointer items-center gap-[7px] rounded-[2px] border-2 px-[0.9rem] py-[0.45rem] text-[0.84rem] font-semibold transition-colors duration-200 ${isSelected
                  ? 'border-[#009FE3] bg-white text-[#003B6D]'
                  : 'border-[#e2e8f0] bg-[#F4F6F8] text-[#475569] hover:border-[#009FE3]'
                  }`}
              >
                {slide.type === 'diagram' ? (
                  <Ruler
                    size={15}
                    strokeWidth={2}
                    className="text-[#009FE3]"
                    aria-hidden="true"
                  />
                ) : (
                  <Camera
                    size={15}
                    strokeWidth={2}
                    className="text-[#009FE3]"
                    aria-hidden="true"
                  />
                )}
                <span>{slide.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
