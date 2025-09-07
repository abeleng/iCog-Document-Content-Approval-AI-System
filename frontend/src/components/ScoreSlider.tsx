import React from 'react';

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  min?: number;
  max?: number;
}

const ScoreSlider: React.FC<ScoreSliderProps> = ({ 
  value, 
  onChange, 
  disabled = false,
  min = 0,
  max = 100 
}) => {
  const getSliderColor = () => {
    if (value === 100) return 'bg-green-500';
    if (value >= 80) return 'bg-blue-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = () => {
    if (value === 100) return 'Excellent';
    if (value >= 90) return 'Very Good';
    if (value >= 80) return 'Good';
    if (value >= 70) return 'Satisfactory';
    if (value >= 60) return 'Needs Improvement';
    if (value >= 40) return 'Poor';
    return 'Unacceptable';
  };

  return (
    <div className={`space-y-3 ${disabled ? 'opacity-50' : ''}`}>
      {/* Score Display */}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}%</span>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          value === 100 ? 'bg-green-100 text-green-800' :
          value >= 80 ? 'bg-blue-100 text-blue-800' :
          value >= 60 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {getScoreLabel()}
        </span>
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          disabled={disabled}
          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getSliderColor()} 0%, ${getSliderColor()} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
          }}
        />
        
        {/* Tick marks */}
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>

      {/* Score Ranges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="text-center p-2 bg-red-50 rounded">
          <div className="font-medium text-red-800">0-59</div>
          <div className="text-red-600">Needs Work</div>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded">
          <div className="font-medium text-yellow-800">60-79</div>
          <div className="text-yellow-600">Acceptable</div>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <div className="font-medium text-blue-800">80-99</div>
          <div className="text-blue-600">Good</div>
        </div>
        <div className="text-center p-2 bg-green-50 rounded">
          <div className="font-medium text-green-800">100</div>
          <div className="text-green-600">Perfect</div>
        </div>
      </div>

      {/* Approval Note */}
      {value === 100 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            ✓ Score of 100% enables task approval
          </p>
        </div>
      )}
    </div>
  );
};

export default ScoreSlider;