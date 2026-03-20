export interface MockOffice {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const MOCK_OFFICES: MockOffice[] = [
  {
    name: 'New York HQ',
    address: '1270 Avenue of the Americas, New York, NY 10020, USA',
    lat: 40.7597,
    lng: -73.9798,
  },
  {
    name: 'London Office',
    address: '30 St Mary Axe, London EC3A 8BF, United Kingdom',
    lat: 51.5144,
    lng: -0.0803,
  },
  {
    name: 'Paris Office',
    address: '75 Rue de Rivoli, 75001 Paris, France',
    lat: 48.8604,
    lng: 2.3477,
  },
  {
    name: 'Berlin Office',
    address: 'Unter den Linden 77, 10117 Berlin, Germany',
    lat: 52.5166,
    lng: 13.3806,
  },
  {
    name: 'Tokyo Office',
    address: '1-1 Marunouchi, Chiyoda, Tokyo 100-0005, Japan',
    lat: 35.6812,
    lng: 139.7671,
  },
  {
    name: 'Sydney Office',
    address: '1 Macquarie Place, Sydney NSW 2000, Australia',
    lat: -33.8614,
    lng: 151.2101,
  },
];
