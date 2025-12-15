import React from 'react';
import { GroundingChunk } from '../types';
import { Navigation, Star } from 'lucide-react';

interface PlaceCardProps {
  chunk: GroundingChunk;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ chunk }) => {
  const mapData = chunk.maps;
  
  if (!mapData || !mapData.title) return null;

  const reviewSnippet = mapData.placeAnswerSources?.[0]?.reviewSnippets?.[0]?.content;

  return (
    <div className="bg-white border-4 border-black rounded-2xl p-4 mb-4 shadow-[6px_6px_0px_0px_rgba(239,68,68,1)] transition-transform hover:scale-[1.02]">
      <div className="flex justify-between items-start gap-3">
        <div>
          <h3 className="text-xl font-black text-slate-900 leading-tight">
            {mapData.title}
          </h3>
          {reviewSnippet && (
            <p className="text-sm text-slate-600 mt-2 italic border-l-4 border-yellow-400 pl-2">
              "{reviewSnippet}"
            </p>
          )}
        </div>
        <div className="bg-yellow-400 p-2 rounded-full border-2 border-black flex-shrink-0">
            <Star className="w-5 h-5 text-black fill-black" />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        {mapData.uri && (
          <a
            href={mapData.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-xl border-2 border-black transition-colors"
          >
            <Navigation className="w-4 h-4" />
            Go to Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default PlaceCard;
