export type PhotoCredit = {
  monument: string;
  source: string;
  license: string;
  url?: string;
};

export const photoCredits: PhotoCredit[] = [
  {
    monument: 'All monument images',
    source: 'Images from Wikimedia Commons, individual credits to be added',
    license: 'Various Creative Commons licenses',
  },
  {
    monument: 'Hawa Mahal',
    source: 'Wikimedia Commons contributor (example entry)',
    license: 'CC BY-SA 4.0',
    url: 'https://commons.wikimedia.org',
  },
];

export const dataSources = [
  'Monument details are curated from public heritage references and official sources.',
  'Map directions are provided by Google Maps when you choose Get Directions.',
];
