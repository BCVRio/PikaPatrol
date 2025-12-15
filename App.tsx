import React, { useState, useEffect } from 'react';
import { Coordinates, DistanceOption, SearchResult } from './types';
import { findPokemonPlaces } from './services/geminiService';
import DistanceSelector from './components/DistanceSelector';
import PlaceCard from './components/PlaceCard';
import { Zap, AlertTriangle, Loader2, Map } from 'lucide-react';

const App: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<DistanceOption>(8);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  // Initial Geolocation Request
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    // Check permission status initially
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      setPermissionStatus(result.state);
      result.onchange = () => setPermissionStatus(result.state);
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        console.error(err);
        setError("We need your location to find nearby Pokemon spots! Please enable location access.");
      },
      { enableHighAccuracy: true }
    );
  }, []);

  const handleSearch = async () => {
    if (!coords) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await findPokemonPlaces(coords, distance);
      setResult(data);
    } catch (err) {
      setError("Failed to fetch Pokemon places. The servers might be overloaded by Team Rocket.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-search when location is first found, but allow manual changes to distance later without auto-triggering if desired,
  // or simply auto-trigger search when distance changes. Let's auto-trigger when distance changes IF we have coords.
  useEffect(() => {
    if (coords) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance, coords]); // Depend on distance and coords

  return (
    <div className="min-h-screen bg-yellow-400 p-4 sm:p-8 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="text-center space-y-2 relative">
          <div className="absolute -top-6 -left-6 text-red-500 opacity-20 transform -rotate-12">
            <Zap className="w-24 h-24" />
          </div>
          <div className="absolute top-0 right-0 text-red-500 opacity-20 transform rotate-12">
            <Zap className="w-16 h-16" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-yellow-400 text-shadow-stroke drop-shadow-xl"
              style={{ 
                WebkitTextStroke: '2px black', 
                textShadow: '4px 4px 0px #000'
              }}>
            PikaPatrol
          </h1>
          <p className="text-lg font-bold text-slate-800 bg-white inline-block px-4 py-1 rounded-full border-2 border-black shadow-md">
            Find Pokemon Events & Shops Nearby!
          </p>
        </header>

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border-4 border-red-500 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-bounce shadow-lg">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <span className="font-bold">{error}</span>
          </div>
        )}

        {/* Permission Request State if not error but no coords yet */}
        {!coords && !error && (
          <div className="bg-white border-4 border-black p-8 rounded-3xl text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-center mb-4">
                <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Locating Trainer...</h2>
            <p className="text-slate-600">Please allow location access to scan for nearby Pokemon activity.</p>
          </div>
        )}

        {/* Main Interface */}
        {coords && (
          <main className="space-y-8 animate-fade-in-up">
            
            {/* Controls */}
            <div className="bg-white p-6 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <DistanceSelector 
                currentDistance={distance} 
                onChange={setDistance} 
                disabled={loading}
              />
              
              {!loading && (
                <div className="text-center text-sm text-slate-500 font-semibold">
                  Scan active at <span className="text-black">{coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}</span>
                </div>
              )}
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 border-8 border-black rounded-full border-t-red-600 border-b-white bg-white animate-spin flex items-center justify-center">
                    <div className="w-6 h-6 bg-black rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-black animate-pulse">Scanning Area...</p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* AI Summary */}
                {result && result.text && (
                   <div className="bg-slate-50 border-4 border-slate-900 p-6 rounded-2xl shadow-lg">
                     <div className="flex items-center gap-2 mb-4">
                        <Map className="w-6 h-6 text-red-500"/>
                        <h2 className="text-2xl font-bold uppercase">Mission Report</h2>
                     </div>
                     <div className="prose prose-slate max-w-none font-medium leading-relaxed">
                        {/* We render the text but remove citations like [1] for cleaner look if desired, 
                            or just display as is. Gemini usually formats nicely. */}
                        <div className="whitespace-pre-wrap">{result.text}</div>
                     </div>
                   </div>
                )}

                {/* Structured Cards from Grounding */}
                {result && result.groundingChunks && result.groundingChunks.length > 0 && (
                   <div className="space-y-4">
                      <h2 className="text-2xl font-black text-white text-shadow-stroke tracking-wider text-center"
                          style={{ WebkitTextStroke: '1.5px black', textShadow: '2px 2px 0px #000' }}>
                        IDENTIFIED LOCATIONS
                      </h2>
                      {result.groundingChunks.map((chunk, index) => (
                        <PlaceCard key={index} chunk={chunk} />
                      ))}
                   </div>
                )}
                
                {result && result.groundingChunks.length === 0 && (
                    <div className="text-center py-8 opacity-75">
                        <p className="font-bold text-xl">No specific map locations linked.</p>
                        <p>Check the report above for details.</p>
                    </div>
                )}

              </div>
            )}
          </main>
        )}
      </div>
      
      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-4 bg-red-600 border-t-4 border-black z-50"></div>
    </div>
  );
};

export default App;
