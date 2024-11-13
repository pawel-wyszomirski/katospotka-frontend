import React, { useState } from 'react';
import Map from './components/Map';
import EventList from './components/EventList';
import { Calendar, List, MapPin } from 'lucide-react';
import { Event } from './types/Event';

// Temporary mock data - replace with API calls
const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Koncert w NOSPR',
    category: 'Muzyka',
    date: new Date('2024-03-20T19:00:00'),
    location: {
      name: 'NOSPR, plac Wojciecha Kilara 1',
      coordinates: [50.2646, 19.0275]
    },
    organizer: 'NOSPR',
    url: 'https://example.com/event1',
    isPast: false
  },
  // Add more mock events as needed
];

function App() {
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Wydarzenia w Katowicach
            </h1>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPastEvents(!showPastEvents)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  showPastEvents
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Calendar className="w-4 h-4 inline-block mr-2" />
                Archiwalne wydarzenia
              </button>
              <div className="flex rounded-md shadow-sm">
                <button
                  onClick={() => setView('map')}
                  className={`px-4 py-2 rounded-l-md text-sm font-medium ${
                    view === 'map'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <MapPin className="w-4 h-4 inline-block mr-2" />
                  Mapa
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-r-md text-sm font-medium ${
                    view === 'list'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <List className="w-4 h-4 inline-block mr-2" />
                  Lista
                </button>
              </div>
            </div>
          </div>

          {view === 'map' ? (
            <Map events={mockEvents} showPastEvents={showPastEvents} />
          ) : (
            <EventList events={mockEvents} showPastEvents={showPastEvents} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;