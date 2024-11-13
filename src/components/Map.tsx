import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Event } from '../types/Event';
import 'leaflet/dist/leaflet.css';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface MapProps {
  events: Event[];
  showPastEvents: boolean;
}

export default function Map({ events, showPastEvents }: MapProps) {
  const filteredEvents = showPastEvents 
    ? events 
    : events.filter(event => !event.isPast);

  return (
    <MapContainer
      center={[50.2649, 19.0238]} // Katowice center
      zoom={13}
      className="w-full h-[600px] rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredEvents.map((event) => (
        <Marker
          key={event.id}
          position={event.location.coordinates}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.category}</p>
              <p className="text-sm">
                {format(event.date, 'PPP', { locale: pl })}
              </p>
              <p className="text-sm">{event.location.name}</p>
              <p className="text-sm text-gray-600">
                Organizator: {event.organizer}
              </p>
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Więcej informacji
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}