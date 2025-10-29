import { X } from 'lucide-react';
import { useState } from 'react';
import { createPortal } from 'react-dom';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  marketTitle: string;
  side: 'yes' | 'no';
  yesPrice: number;
  noPrice: number;
  image?: string;
}

export default function TradeModal({
  isOpen,
  onClose,
  marketTitle,
  side: initialSide,
  yesPrice,
  noPrice
}: TradeModalProps) {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [side, setSide] = useState<'yes' | 'no'>(initialSide);

  if (!isOpen) return null;

  const currentPrice = side === 'yes' ? yesPrice : noPrice;

  const calculatePayout = () => {
    const amountNum = parseFloat(amount) || 0;
    return Math.round((amountNum / currentPrice) * 100);
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
    >
      <div
        className="sketchy-card bg-white border-gray-800 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gray-200 sketchy-border border-gray-400 flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
                  {marketTitle}
                </h3>
                <p className={`text-lg font-semibold ${side === 'yes' ? 'text-[#155724]' : 'text-[#721c24]'}`}>
                  {tradeType === 'buy' ? 'Buy' : 'Sell'} {side === 'yes' ? 'Yes' : 'No'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setTradeType('buy')}
                className={`px-6 py-2 font-bold transition-all rounded-full ${
                  tradeType === 'buy'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setTradeType('sell')}
                className={`px-6 py-2 font-bold transition-all rounded-full ${
                  tradeType === 'sell'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-500'
                }`}
              >
                Sell
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => setSide('yes')}
              className={`sketchy-btn py-4 text-center font-bold transition-colors shadow-md hover:shadow-lg ${
                side === 'yes'
                  ? 'bg-[#d1e7dd] text-[#155724] border-gray-800'
                  : 'bg-white text-gray-600 border-gray-400'
              }`}
            >
              <div className="text-xl">Yes {yesPrice}¢</div>
            </button>
            <button
              onClick={() => setSide('no')}
              className={`sketchy-btn py-4 text-center font-bold transition-colors shadow-md hover:shadow-lg ${
                side === 'no'
                  ? 'bg-[#f8d7da] text-[#721c24] border-gray-800'
                  : 'bg-white text-gray-600 border-gray-400'
              }`}
            >
              <div className="text-xl">No {noPrice}¢</div>
            </button>
          </div>

          <div className="sketchy-border border-gray-400 bg-gray-50 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Amount</div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="$0"
                className="text-4xl font-bold text-gray-400 text-right w-32 outline-none bg-transparent"
              />
            </div>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="sketchy-border border-gray-400 bg-orange-50 p-4 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Potential payout</span>
                <span className="font-semibold text-gray-900">${calculatePayout()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Potential profit</span>
                <span className="font-semibold text-green-600">
                  ${calculatePayout() - parseFloat(amount)}
                </span>
              </div>
            </div>
          )}

          <button className="sketchy-btn w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 border-gray-800 transition-colors text-lg shadow-md hover:shadow-lg">
            {tradeType === 'buy' ? 'Buy' : 'Sell'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
