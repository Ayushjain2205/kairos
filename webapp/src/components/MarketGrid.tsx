import MarketCard from './MarketCard';
import HeroCarousel from './HeroCarousel';
import { useState } from 'react';

const categories = ['Crypto', 'YouTube', 'Twitter', 'TikTok', 'Zora'];

const marketsByCategory = {
  Crypto: [
    {
      title: "Will Bitcoin reach $100,000 by end of 2025?",
      yesPrice: 67,
      noPrice: 33,
      volume: "$2.4M",
      traders: 1243,
      endsIn: "8 months",
      trending: 'up' as const
    },
    {
      title: "Will Ethereum switch to a new consensus mechanism in 2025?",
      yesPrice: 42,
      noPrice: 58,
      volume: "$1.1M",
      traders: 892,
      endsIn: "7 months",
      trending: 'down' as const
    },
    {
      title: "Will a crypto ETF reach $50B in assets by end of 2025?",
      yesPrice: 78,
      noPrice: 22,
      volume: "$3.2M",
      traders: 2134,
      endsIn: "8 months",
      trending: 'up' as const
    },
    {
      title: "Will Solana flip Ethereum in daily transactions in 2025?",
      yesPrice: 34,
      noPrice: 66,
      volume: "$890K",
      traders: 567,
      endsIn: "6 months"
    },
    {
      title: "Will Coinbase add 10+ new altcoins in 2025?",
      yesPrice: 82,
      noPrice: 18,
      volume: "$1.5M",
      traders: 1023,
      endsIn: "11 months",
      trending: 'up' as const
    }
  ],
  YouTube: [
    {
      title: "Will MrBeast reach 300M subscribers by end of 2025?",
      yesPrice: 71,
      noPrice: 29,
      volume: "$1.8M",
      traders: 1456,
      endsIn: "8 months",
      trending: 'up' as const
    },
    {
      title: "Will YouTube introduce a new monetization model in 2025?",
      yesPrice: 58,
      noPrice: 42,
      volume: "$920K",
      traders: 734,
      endsIn: "6 months",
      trending: 'up' as const
    },
    {
      title: "Will a YouTube Short reach 5B views in 2025?",
      yesPrice: 45,
      noPrice: 55,
      volume: "$1.2M",
      traders: 892,
      endsIn: "9 months"
    },
    {
      title: "Will PewDiePie make a comeback video in 2025?",
      yesPrice: 62,
      noPrice: 38,
      volume: "$2.3M",
      traders: 1987,
      endsIn: "8 months",
      trending: 'up' as const
    },
    {
      title: "Will YouTube Premium subscribers exceed 100M in 2025?",
      yesPrice: 53,
      noPrice: 47,
      volume: "$1.1M",
      traders: 823,
      endsIn: "10 months"
    },
    {
      title: "Will a creator make $10M+ from one video in 2025?",
      yesPrice: 38,
      noPrice: 62,
      volume: "$1.5M",
      traders: 1245,
      endsIn: "7 months",
      trending: 'down' as const
    },
    {
      title: "Will YouTube add blockchain verification for creators in 2025?",
      yesPrice: 47,
      noPrice: 53,
      volume: "$830K",
      traders: 612,
      endsIn: "9 months"
    }
  ],
  Twitter: [
    {
      title: "Will Twitter/X rebrand back to Twitter in 2025?",
      yesPrice: 23,
      noPrice: 77,
      volume: "$2.1M",
      traders: 1876,
      endsIn: "8 months",
      trending: 'down' as const
    },
    {
      title: "Will Elon Musk step down as X CEO in 2025?",
      yesPrice: 41,
      noPrice: 59,
      volume: "$3.4M",
      traders: 2543,
      endsIn: "10 months",
      trending: 'up' as const
    },
    {
      title: "Will X launch a competing product to TikTok in 2025?",
      yesPrice: 67,
      noPrice: 33,
      volume: "$1.7M",
      traders: 1234,
      endsIn: "6 months",
      trending: 'up' as const
    },
    {
      title: "Will X remove character limits completely in 2025?",
      yesPrice: 35,
      noPrice: 65,
      volume: "$890K",
      traders: 678,
      endsIn: "9 months"
    },
    {
      title: "Will X add a cryptocurrency payment feature in 2025?",
      yesPrice: 72,
      noPrice: 28,
      volume: "$2.8M",
      traders: 2134,
      endsIn: "7 months",
      trending: 'up' as const
    },
    {
      title: "Will X user base grow by 20% in 2025?",
      yesPrice: 48,
      noPrice: 52,
      volume: "$1.3M",
      traders: 945,
      endsIn: "11 months"
    },
    {
      title: "Will X launch its own AI chatbot in 2025?",
      yesPrice: 84,
      noPrice: 16,
      volume: "$2.5M",
      traders: 1876,
      endsIn: "5 months",
      trending: 'up' as const
    },
    {
      title: "Will X introduce subscription tiers for verified users in 2025?",
      yesPrice: 69,
      noPrice: 31,
      volume: "$1.9M",
      traders: 1456,
      endsIn: "7 months"
    }
  ],
  TikTok: [
    {
      title: "Will TikTok be banned in the US in 2025?",
      yesPrice: 38,
      noPrice: 62,
      volume: "$4.2M",
      traders: 3456,
      endsIn: "5 months",
      trending: 'down' as const
    },
    {
      title: "Will a TikTok creator reach 500M followers in 2025?",
      yesPrice: 52,
      noPrice: 48,
      volume: "$1.6M",
      traders: 1234,
      endsIn: "8 months",
      trending: 'up' as const
    },
    {
      title: "Will TikTok Shop revenue exceed $50B in 2025?",
      yesPrice: 68,
      noPrice: 32,
      volume: "$2.3M",
      traders: 1789,
      endsIn: "10 months",
      trending: 'up' as const
    },
    {
      title: "Will TikTok max video length increase to 30 min in 2025?",
      yesPrice: 74,
      noPrice: 26,
      volume: "$1.4M",
      traders: 1023,
      endsIn: "6 months",
      trending: 'up' as const
    },
    {
      title: "Will TikTok be sold to a US company in 2025?",
      yesPrice: 44,
      noPrice: 56,
      volume: "$3.1M",
      traders: 2456,
      endsIn: "8 months"
    }
  ],
  Zora: [
    {
      title: "Will Zora daily NFT mints exceed 100K in 2025?",
      yesPrice: 56,
      noPrice: 44,
      volume: "$890K",
      traders: 678,
      endsIn: "8 months",
      trending: 'up' as const
    },
    {
      title: "Will Zora integrate with a major social platform in 2025?",
      yesPrice: 63,
      noPrice: 37,
      volume: "$1.2M",
      traders: 892,
      endsIn: "6 months",
      trending: 'up' as const
    },
    {
      title: "Will a Zora NFT sell for over $1M in 2025?",
      yesPrice: 41,
      noPrice: 59,
      volume: "$1.5M",
      traders: 1123,
      endsIn: "10 months"
    },
    {
      title: "Will Zora launch on 5+ new blockchains in 2025?",
      yesPrice: 78,
      noPrice: 22,
      volume: "$750K",
      traders: 534,
      endsIn: "9 months",
      trending: 'up' as const
    },
    {
      title: "Will Zora total volume exceed $500M in 2025?",
      yesPrice: 49,
      noPrice: 51,
      volume: "$1.1M",
      traders: 823,
      endsIn: "11 months"
    },
    {
      title: "Will Zora acquire another NFT platform in 2025?",
      yesPrice: 34,
      noPrice: 66,
      volume: "$920K",
      traders: 712,
      endsIn: "7 months",
      trending: 'down' as const
    },
    {
      title: "Will Zora partner with a major music label in 2025?",
      yesPrice: 57,
      noPrice: 43,
      volume: "$1.3M",
      traders: 945,
      endsIn: "8 months"
    },
    {
      title: "Will Zora launch a mobile app in 2025?",
      yesPrice: 81,
      noPrice: 19,
      volume: "$680K",
      traders: 489,
      endsIn: "5 months",
      trending: 'up' as const
    }
  ]
};

export default function MarketGrid() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof marketsByCategory>('Crypto');

  const currentMarkets = marketsByCategory[activeCategory];

  const showCarousel = activeCategory === 'Crypto' || activeCategory === 'YouTube';

  return (
    <div className="pt-6 pb-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category as keyof typeof marketsByCategory)}
              className={`sketchy-btn px-4 py-2 border-gray-800 font-bold whitespace-nowrap transition-colors shadow-md hover:shadow-lg ${
                activeCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {showCarousel && (
          <div className="mb-6">
            <HeroCarousel />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentMarkets.map((market, index) => (
            <div
              key={`${activeCategory}-${index}`}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <MarketCard {...market} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
