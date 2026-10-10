export async function fetchStores(location: string, crop: string) {
  // Mock API call to backend service
  return [
    { id: 1, name: 'Sri Lakshmi Cold Storage', location: 'Guntur · 6 km', rate: 38, total: 2280, tag: 'Registered' },
    { id: 2, name: 'Vijaya Warehousing Corp', location: 'Tenali · 18 km', rate: 24, total: 1440, tag: 'Registered' },
    { id: 3, name: 'Kisan Agri Godown', location: 'Mangalagiri · 27 km', rate: 19, total: 1340, tag: 'Filling fast' },
  ];
}