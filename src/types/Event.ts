export interface Event {
  id: string;
  name: string;
  category: string;
  date: Date;
  location: {
    name: string;
    coordinates: [number, number]; // [latitude, longitude]
  };
  organizer: string;
  url: string;
  isPast: boolean;
}