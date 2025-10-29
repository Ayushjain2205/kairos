import { useState } from 'react';
import Logo from './Logo';
import CreateMarketModal from './CreateMarketModal';

export default function Header() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <>
      <header className="border-b-4 border-gray-800 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="sketchy-btn bg-white hover:bg-gray-50 text-gray-800 px-5 py-2.5 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg"
              >
                Create Market
              </button>
              <button className="sketchy-btn bg-primary hover:bg-orange-600 text-white px-5 py-2.5 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>

      <CreateMarketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  );
}
