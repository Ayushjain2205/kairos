import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DataPoint {
  date: string;
  value: number;
}

interface Market {
  title: string;
  yesPercentage: number;
  noPercentage: number;
  volume: string;
  yesData: DataPoint[];
  noData: DataPoint[];
}

const generateRealisticData = (baseValue: number, volatility: number = 5): DataPoint[] => {
  const data: DataPoint[] = [];
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let currentValue = baseValue;

  months.forEach((month) => {
    const daysInMonth = 30;
    for (let day = 0; day < daysInMonth; day++) {
      const change = (Math.random() - 0.5) * volatility;
      currentValue = Math.max(5, Math.min(95, currentValue + change));

      data.push({
        date: `${month} ${day + 1}`,
        value: currentValue
      });
    }
  });

  return data;
};

const featuredMarkets: Market[] = [
  {
    title: "Will Bitcoin reach $100,000 by end of 2025?",
    yesPercentage: 67,
    noPercentage: 33,
    volume: "$2,456,789",
    yesData: generateRealisticData(67, 3),
    noData: generateRealisticData(33, 3)
  },
  {
    title: "Will Apple release AR glasses in 2025?",
    yesPercentage: 45,
    noPercentage: 55,
    volume: "$1,823,456",
    yesData: generateRealisticData(45, 5),
    noData: generateRealisticData(55, 5)
  },
  {
    title: "Will SpaceX land humans on Mars by 2030?",
    yesPercentage: 28,
    noPercentage: 72,
    volume: "$3,234,567",
    yesData: generateRealisticData(28, 4),
    noData: generateRealisticData(72, 4)
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; yesValue: number; noValue: number; date: string } | null>(null);
  const [hoveredButton, setHoveredButton] = useState<'yes' | 'no' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMarkets.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredMarkets.length);
    setHoveredPoint(null);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredMarkets.length) % featuredMarkets.length);
    setHoveredPoint(null);
  };

  const currentMarket = featuredMarkets[currentIndex];
  const nextIndex = (currentIndex + 1) % featuredMarkets.length;
  const prevIndex = (currentIndex - 1 + featuredMarkets.length) % featuredMarkets.length;

  const chartWidth = 1200;
  const chartHeight = 400;
  const padding = { left: 40, right: 120, top: 20, bottom: 40 };

  const createPath = (data: DataPoint[]): string => {
    const xScale = (chartWidth - padding.left - padding.right) / (data.length - 1);

    return data.map((point, i) => {
      const x = padding.left + i * xScale;
      const y = chartHeight - padding.bottom - ((point.value / 100) * (chartHeight - padding.top - padding.bottom));
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const relativeX = x - padding.left;

    if (relativeX < 0 || relativeX > chartWidth - padding.left - padding.right) {
      setHoveredPoint(null);
      return;
    }

    const dataLength = currentMarket.yesData.length;
    const xScale = (chartWidth - padding.left - padding.right) / (dataLength - 1);
    const index = Math.round(relativeX / xScale);

    if (index >= 0 && index < dataLength) {
      setHoveredPoint({
        x: padding.left + index * xScale,
        yesValue: currentMarket.yesData[index].value,
        noValue: currentMarket.noData[index].value,
        date: currentMarket.yesData[index].date
      });
    }
  };

  const calculatePayout = (price: number) => {
    const investment = 100;
    const payout = (investment / price) * 100;
    return Math.round(payout);
  };

  const months = ['Feb', 'Apr', 'Jun', 'Aug', 'Oct', 'Dec'];

  return (
    <div className="bg-white mb-6">
        <div className="sketchy-card bg-white shadow-md border-gray-800">
          <div className="grid lg:grid-cols-[300px_1fr]">
            <div className="p-6 bg-gray-50 border-r-2 border-gray-800">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{currentMarket.title}</h3>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">Yes</span>
                    <span className="font-bold text-xl text-[#155724]">
                      {currentMarket.yesPercentage}%
                    </span>
                  </div>
                  <button
                    onMouseEnter={() => setHoveredButton('yes')}
                    onMouseLeave={() => setHoveredButton(null)}
                    className="sketchy-btn w-full px-4 py-2 bg-[#d1e7dd] text-[#155724] hover:bg-[#a3d9a5] transition-colors border-gray-800 font-bold shadow-md hover:shadow-lg"
                  >
                    <div className="text-center text-lg font-semibold">
                      {hoveredButton === 'yes' ? `$100 → $${calculatePayout(currentMarket.yesPercentage)}` : 'Yes'}
                    </div>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">No</span>
                    <span className="font-bold text-xl text-[#721c24]">
                      {currentMarket.noPercentage}%
                    </span>
                  </div>
                  <button
                    onMouseEnter={() => setHoveredButton('no')}
                    onMouseLeave={() => setHoveredButton(null)}
                    className="sketchy-btn w-full px-4 py-2 bg-[#f8d7da] text-[#721c24] hover:bg-[#f1a7af] transition-colors border-gray-800 font-bold shadow-md hover:shadow-lg"
                  >
                    <div className="text-center text-lg font-semibold">
                      {hoveredButton === 'no' ? `$100 → $${calculatePayout(currentMarket.noPercentage)}` : 'No'}
                    </div>
                  </button>
                </div>
              </div>

              <div className="border-t-2 border-gray-300 pt-4">
                <div className="text-lg font-bold text-gray-900">{currentMarket.volume}</div>
                <div className="text-xs text-gray-500">Volume</div>
              </div>
            </div>

            <div className="p-6">
              <div className="relative bg-gray-50 sketchy-border border-gray-300 p-4">
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto cursor-crosshair"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredPoint(null)}
                >
                  {[0, 25, 50, 75, 100].map((percent) => {
                    const y = chartHeight - padding.bottom - ((percent / 100) * (chartHeight - padding.top - padding.bottom));
                    return (
                      <g key={percent}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke="#E5E7EB"
                          strokeWidth="1"
                        />
                        <text
                          x={chartWidth - padding.right + 10}
                          y={y + 4}
                          fill="#9CA3AF"
                          fontSize="12"
                          fontFamily="Neucha, cursive"
                        >
                          {percent}%
                        </text>
                      </g>
                    );
                  })}

                  {months.map((month, index) => {
                    const totalMonths = 11;
                    const x = padding.left + ((index * 2) / totalMonths) * (chartWidth - padding.left - padding.right);
                    return (
                      <text
                        key={month}
                        x={x}
                        y={chartHeight - 10}
                        fill="#9CA3AF"
                        fontSize="12"
                        textAnchor="middle"
                        fontFamily="Neucha, cursive"
                      >
                        {month}
                      </text>
                    );
                  })}

                  <path
                    d={createPath(currentMarket.yesData)}
                    stroke="#16A34A"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d={createPath(currentMarket.noData)}
                    stroke="#DC2626"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {hoveredPoint && (
                    <>
                      <line
                        x1={hoveredPoint.x}
                        y1={padding.top}
                        x2={hoveredPoint.x}
                        y2={chartHeight - padding.bottom}
                        stroke="#6B7280"
                        strokeWidth="1"
                        strokeDasharray="4,4"
                      />

                      <rect
                        x={hoveredPoint.x - 95}
                        y={padding.top - 20}
                        width="190"
                        height="115"
                        fill="white"
                        stroke="#D1D5DB"
                        strokeWidth="3"
                        rx="10"
                      />

                      <text
                        x={hoveredPoint.x}
                        y={padding.top + 8}
                        fill="#6B7280"
                        fontSize="16"
                        textAnchor="middle"
                        fontFamily="Neucha, cursive"
                        fontWeight="600"
                      >
                        {hoveredPoint.date.toUpperCase()}
                      </text>

                      <text
                        x={hoveredPoint.x}
                        y={padding.top + 40}
                        fill="#16A34A"
                        fontSize="20"
                        textAnchor="middle"
                        fontFamily="Neucha, cursive"
                        fontWeight="700"
                      >
                        Yes {hoveredPoint.yesValue.toFixed(1)}%
                      </text>

                      <text
                        x={hoveredPoint.x}
                        y={padding.top + 75}
                        fill="#DC2626"
                        fontSize="20"
                        textAnchor="middle"
                        fontFamily="Neucha, cursive"
                        fontWeight="700"
                      >
                        No {hoveredPoint.noValue.toFixed(1)}%
                      </text>

                      <circle
                        cx={hoveredPoint.x}
                        cy={chartHeight - padding.bottom - ((hoveredPoint.yesValue / 100) * (chartHeight - padding.top - padding.bottom))}
                        r="6"
                        fill="#16A34A"
                        stroke="white"
                        strokeWidth="3"
                      />

                      <circle
                        cx={hoveredPoint.x}
                        cy={chartHeight - padding.bottom - ((hoveredPoint.noValue / 100) * (chartHeight - padding.top - padding.bottom))}
                        r="6"
                        fill="#DC2626"
                        stroke="white"
                        strokeWidth="3"
                      />
                    </>
                  )}
                </svg>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex items-center justify-between border-t-2 border-gray-300 pt-6">
            <button
              onClick={handlePrev}
              className="sketchy-btn flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 transition-colors border-gray-800 shadow-md hover:shadow-lg"
            >
              <ChevronLeft size={16} />
              <span className="font-medium text-gray-700">{featuredMarkets[prevIndex].title.substring(0, 30)}...</span>
            </button>

            <div className="flex gap-2">
              {featuredMarkets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setHoveredPoint(null);
                  }}
                  className={`w-3 h-3 sketchy-border transition-all hover:w-4 hover:h-4 ${
                    index === currentIndex ? 'bg-gray-800 border-gray-800' : 'bg-gray-300 border-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="sketchy-btn flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 transition-colors border-gray-800 shadow-md hover:shadow-lg"
            >
              <span className="font-medium text-gray-700">{featuredMarkets[nextIndex].title.substring(0, 30)}...</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
    </div>
  );
}
