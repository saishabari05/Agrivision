export const mockProfile = {
  id: 'user-001',
  name: 'Aarav Patel',
  email: 'aarav@agrivision.ai',
  avatar:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
  location: 'Nashik, Maharashtra',
  farmName: 'Green Horizon Farms',
  joinedAt: '2026-02-11',
};

export const mockUploads = [
  {
    id: 'upl-101',
    crop: 'Tomato',
    disease: 'Early Blight',
    severity: 'Moderate',
    confidence: 94,
    locationName: 'Nashik North Plot',
    coordinates: [20.011, 73.79],
    uploadedAt: '2026-03-30T10:15:00',
  },
  {
    id: 'upl-102',
    crop: 'Apple',
    disease: 'Apple Scab',
    severity: 'High',
    confidence: 91,
    locationName: 'Shimla Orchard',
    coordinates: [31.105, 77.173],
    uploadedAt: '2026-03-28T14:20:00',
  },
  {
    id: 'upl-103',
    crop: 'Grape',
    disease: 'Black Rot',
    severity: 'Low',
    confidence: 87,
    locationName: 'Pune Vineyard',
    coordinates: [18.52, 73.856],
    uploadedAt: '2026-03-24T09:00:00',
  },
];

export const mockReports = [
  {
    id: 'rep-500',
    crop: 'Tomato',
    disease: 'Early Blight',
    severity: 'Moderate',
    confidence: 94,
    reportDate: '2026-03-30',
    locationName: 'Nashik North Plot',
    recommendations: [
      'Prune affected lower leaves and improve airflow.',
      'Apply a labeled fungicide rotation within 48 hours.',
      'Reduce overhead irrigation for the next 5 days.',
    ],
    summary: 'Disease spread is limited to the lower canopy and should respond well to early intervention.',
  },
  {
    id: 'rep-499',
    crop: 'Apple',
    disease: 'Apple Scab',
    severity: 'High',
    confidence: 91,
    reportDate: '2026-03-28',
    locationName: 'Shimla Orchard',
    recommendations: [
      'Isolate highly affected branches for sanitation pruning.',
      'Increase monitoring frequency across adjacent rows.',
      'Schedule a follow-up scan after the next spray cycle.',
    ],
    summary: 'High severity detected with probable spread across moisture-prone clusters.',
  },
  {
    id: 'rep-498',
    crop: 'Grape',
    disease: 'Black Rot',
    severity: 'Low',
    confidence: 87,
    reportDate: '2026-03-24',
    locationName: 'Pune Vineyard',
    recommendations: [
      'Continue weekly visual inspection.',
      'Remove infected berries promptly to lower inoculum.',
      'Log weather conditions to correlate with risk.',
    ],
    summary: 'Localized disease signs indicate low-level infection suitable for preventive management.',
  },
];

export const chatbotSeed = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      'Hello, I am your AgriVision crop assistant. Ask about disease trends, treatment planning, or report summaries.',
  },
];

