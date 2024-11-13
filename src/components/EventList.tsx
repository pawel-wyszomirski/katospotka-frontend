import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Event } from '../types/Event';
import { Calendar, MapPin } from 'lucide-react';

interface EventListProps {
  events: Event[];
  showPastEvents: boolean;
}

export default function EventList({ events, showPastEvents }: EventListProps) {
  const filteredEvents = showPastEvents 
    ? events 
    : events.filter(event => !event.isPast);

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <h3 className="font-bold text-lg text-gray-900">{event.name}</h3>
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {event.category}
          </span>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {format(event.date, 'PPP', { locale: pl })}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location.name}</span>
            </div>
            <p className="text-sm text-gray-600">
              Organizator: {event.organizer}
            </p>
            <a
              href={event.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-blue-500 hover:text-blue-700 text-sm"
            >
              Więcej informacji →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}