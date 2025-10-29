import { X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface CreateMarketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIAnalysis {
  isResolvable: boolean;
  suggestions: string[];
}

export default function CreateMarketModal({ isOpen, onClose }: CreateMarketModalProps) {
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [category, setCategory] = useState('crypto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!question || !description) return;

    setIsAnalyzing(true);
    setShowAnalysis(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const canResolve = Math.random() > 0.2;
    const mockAnalysis: AIAnalysis = {
      isResolvable: canResolve,
      suggestions: canResolve ? [
        'Oracle can verify this market automatically',
        'Data sources are accessible and reliable',
        'Resolution criteria are clear and objective',
        'Time frame allows for proper verification'
      ] : [
        'Oracle cannot reliably verify this outcome',
        'Data sources are unclear or unavailable',
        'Consider rephrasing for objective verification',
        'Add more specific resolution criteria'
      ]
    };

    setAnalysis(mockAnalysis);
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysis || !analysis.isResolvable) {
      alert('Please run Agent Check and ensure the oracle can resolve this market before creating.');
      return;
    }
    console.log({ question, description, endDate, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="sketchy-border bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Neucha, cursive' }}>
            Create Market
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'Neucha, cursive' }}>
              Market Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Will Bitcoin reach $100k by end of 2024?"
              className="sketchy-border w-full px-4 py-3 text-gray-800 border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
              required
              style={{ fontFamily: 'Neucha, cursive' }}
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'Neucha, cursive' }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context and resolution criteria..."
              rows={4}
              className="sketchy-border w-full px-4 py-3 text-gray-800 border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
              style={{ fontFamily: 'Neucha, cursive' }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'Neucha, cursive' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="sketchy-border w-full px-4 py-3 text-gray-800 border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                style={{ fontFamily: 'Neucha, cursive' }}
              >
                <option value="crypto">Crypto</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2" style={{ fontFamily: 'Neucha, cursive' }}>
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="sketchy-border w-full px-4 py-3 text-gray-800 border-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                style={{ fontFamily: 'Neucha, cursive' }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!question || !description || isAnalyzing}
              className="sketchy-btn flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: 'Neucha, cursive' }}
            >
              <Sparkles size={20} />
              {isAnalyzing ? 'Checking...' : 'Agent Check'}
            </button>
          </div>

          {showAnalysis && (
            <div className="sketchy-border border-gray-800 rounded-lg p-5 bg-gradient-to-br from-blue-50 to-white mt-4">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : analysis && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {analysis.isResolvable ? (
                      <CheckCircle2 className="text-green-600" size={24} />
                    ) : (
                      <AlertCircle className="text-red-600" size={24} />
                    )}
                    <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: 'Neucha, cursive' }}>
                      {analysis.isResolvable ? '✓ Oracle Can Resolve' : '✗ Oracle Cannot Resolve'}
                    </h3>
                  </div>

                  <ul className="space-y-2 pl-1">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: 'Neucha, cursive' }}>
                          {suggestion}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="sketchy-btn flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg"
              style={{ fontFamily: 'Neucha, cursive' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!analysis || !analysis.isResolvable}
              className="sketchy-btn flex-1 bg-primary hover:bg-orange-600 text-white px-6 py-3 border-gray-800 font-bold transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Neucha, cursive' }}
            >
              Create Market
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
