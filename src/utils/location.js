export const defaultLocations = [
  'Nashik, Maharashtra',
  'Shimla, Himachal Pradesh',
  'Pune, Maharashtra',
  'Bengaluru, Karnataka',
];

export async function detectCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          label: `Detected (${coords.latitude.toFixed(3)}, ${coords.longitude.toFixed(3)})`,
          coordinates: [coords.latitude, coords.longitude],
        });
      },
      () => reject(new Error('Unable to detect current location.')),
    );
  });
}

