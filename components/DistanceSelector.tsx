import React from 'react';
import { DistanceOption } from '../types';
import { MapPin } from 'lucide-react';

interface DistanceSelectorProps {
  currentDistance: DistanceOption;
  onChange: (distance: DistanceOption) => void;
  disabled: boolean;
}

const DistanceSelector: React.FC<DistanceSelectorProps> = ({
  currentDistance,
  onChange,
  disabled,
}) => {
  const options: DistanceOption[] = [3, 8, 15];

  return (
    <div className="flex flex-col items-center space-y-3 mb-6 w-full">
      <h3 className="text-xl font-bold text-red-600 tracking-wider uppercase drop-shadow-sm">
        Search Radius
      </h3>
      <div className="flex justify-center gap-4 w-full max-w-md">
        {options.map((dist) => {
          const isActive = currentDistance === dist;
          return (
            <button
              key={dist}
              onClick={() => onChange(dist)}
              disabled={disabled}
              className={`
                relative group flex-1 py-3 px-2 rounded-2xl border-4 font-bold text-lg transition-all transform duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${
                  isActive
                    ? 'bg-red-500 border-black text-white scale-105 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white border-black text-slate-800 hover:bg-yellow-100 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                }
              `}
            >
              <div className="flex flex-col items-center justify-center">
                <MapPin className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-red-500'}`} />
                <span>{dist} km</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DistanceSelector;
