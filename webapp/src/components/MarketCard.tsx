import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import TradeModal from './TradeModal';

interface MarketCardProps {
  title: string;
  yesPrice: number;
  noPrice: number;
  volume: string;
  traders: number;
  endsIn: string;
  trending?: 'up' | 'down';
  candidate?: string;
  percentage?: number;
}

export default function MarketCard({
  title,
  yesPrice,
  noPrice,
  volume
}: MarketCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no'>('yes');
  const [hoveredButton, setHoveredButton] = useState<'yes' | 'no' | null>(null);

  const handleSideClick = (side: 'yes' | 'no') => {
    setSelectedSide(side);
    setIsModalOpen(true);
  };

  const calculatePayout = (price: number) => {
    const investment = 100;
    const payout = (investment / price) * 100;
    return Math.round(payout);
  };

  return (
    <>
      <div className="sketchy-card bg-white p-6 transition-all hover:shadow-lg border-gray-800 shadow-md">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-12 h-12 bg-gray-200 sketchy-border border-gray-400 flex items-center justify-center flex-shrink-0 text-xl overflow-hidden">
              👤
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 leading-snug">
                {title}
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-center ml-3">
            <div className="relative w-20 h-12">
              <svg className="w-20 h-12" viewBox="0 0 80 48">
                <path
                  d="M 6 42 A 34 34 0 0 1 74 42"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  className="text-gray-200"
                  strokeLinecap="round"
                />
                <path
                  d="M 6 42 A 34 34 0 0 1 74 42"
                  stroke="currentColor"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={`${Math.PI * 34}`}
                  strokeDashoffset={`${Math.PI * 34 * (1 - yesPrice / 100)}`}
                  className="text-green-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center pt-1">
                <span className="text-lg font-bold text-gray-900">{yesPrice}%</span>
              </div>
            </div>
            <span className="text-xs text-gray-500 -mt-1">chance</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onClick={() => handleSideClick('yes')}
            onMouseEnter={() => setHoveredButton('yes')}
            onMouseLeave={() => setHoveredButton(null)}
            className="sketchy-btn bg-[#d1e7dd] hover:bg-[#a3d9a5] py-4 transition-colors border-gray-800 font-bold shadow-md hover:shadow-lg"
          >
            <div className="text-center text-lg font-semibold text-[#155724]">
              {hoveredButton === 'yes' ? `$100 → $${calculatePayout(yesPrice)}` : 'Yes'}
            </div>
          </button>
          <button
            onClick={() => handleSideClick('no')}
            onMouseEnter={() => setHoveredButton('no')}
            onMouseLeave={() => setHoveredButton(null)}
            className="sketchy-btn bg-[#f8d7da] hover:bg-[#f1a7af] py-4 transition-colors border-gray-800 font-bold shadow-md hover:shadow-lg"
          >
            <div className="text-center text-lg font-semibold text-[#721c24]">
              {hoveredButton === 'no' ? `$100 → $${calculatePayout(noPrice)}` : 'No'}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="font-medium">{volume}</span>
          </div>
          <button className="hover:text-gray-700 transition-colors">
            <Bookmark size={20} />
          </button>
        </div>
      </div>

      <TradeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        marketTitle={title}
        side={selectedSide}
        yesPrice={yesPrice}
        noPrice={noPrice}
      />
    </>
  );
}
