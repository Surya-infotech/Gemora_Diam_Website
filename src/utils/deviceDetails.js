// Helper to get browser GPS / Wi-Fi coordinates with a short timeout
const getBrowserCoordinates = () => {
    return new Promise((resolve) => {
        if (typeof window === 'undefined' || !navigator.geolocation) {
            return resolve(null);
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (position?.coords) {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                } else {
                    resolve(null);
                }
            },
            () => resolve(null),
            {
                enableHighAccuracy: true,
                timeout: 3500,
                maximumAge: 300000 // 5 minutes cache
            }
        );
    });
};

// Helper to reverse geocode latitude and longitude into Country name
const reverseGeocodeCountry = async (latitude, longitude) => {
    // Primary: BigDataCloud Reverse Geocoding API (Fast, Free, Client-side)
    try {
        const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (response.ok) {
            const data = await response.json();
            if (data.countryName) {
                return {
                    countryname: data.countryName,
                    countrycode: data.countryCode || ''
                };
            }
        }
    } catch {
        // Fallback to Nominatim
    }

    // Fallback: OpenStreetMap Nominatim
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
        );
        if (response.ok) {
            const data = await response.json();
            const country = data.address?.country || '';
            const countryCode = data.address?.country_code ? data.address.country_code.toUpperCase() : '';
            if (country) {
                return {
                    countryname: country,
                    countrycode: countryCode
                };
            }
        }
    } catch {
        // Fallback to IP geolocation
    }

    return null;
};

/**
 * World-wide country name detection
 * Detects country for any customer across the entire world:
 * 1. Browser coordinates reverse-geocoding (if permitted)
 * 2. BigDataCloud IP reverse-geocode
 * 3. ipwho.is IP lookup
 * 4. freeipapi IP lookup
 * 5. geojs IP lookup
 */
export const getCountryDetails = async () => {
    // 1. Try accurate browser geolocation
    try {
        const coords = await getBrowserCoordinates();
        if (coords) {
            const geo = await reverseGeocodeCountry(coords.latitude, coords.longitude);
            if (geo?.countryname) {
                return geo;
            }
        }
    } catch {
        // proceed to IP fallback
    }

    // 2. High-accuracy reverse geocode client via BigDataCloud (works via client IP)
    try {
        const response = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en');
        if (response.ok) {
            const data = await response.json();
            if (data.countryName) {
                return {
                    countryname: data.countryName,
                    countrycode: data.countryCode || ''
                };
            }
        }
    } catch {
        // proceed to next fallback
    }

    // 3. High-accuracy IP Geolocation via ipwho.is
    try {
        const response = await fetch('https://ipwho.is/');
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.country) {
                return {
                    countryname: data.country,
                    countrycode: data.country_code || ''
                };
            }
        }
    } catch {
        // proceed to next fallback
    }

    // 4. Fallback IP Geolocation via freeipapi
    try {
        const response = await fetch('https://freeipapi.com/api/json/');
        if (response.ok) {
            const data = await response.json();
            if (data.countryName) {
                return {
                    countryname: data.countryName,
                    countrycode: data.countryCode || ''
                };
            }
        }
    } catch {
        // proceed to next fallback
    }

    // 5. Fallback to GeoJS
    try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (response.ok) {
            const data = await response.json();
            if (data.country) {
                return {
                    countryname: data.country,
                    countrycode: data.country_code || ''
                };
            }
        }
    } catch {
        // end of fallbacks
    }

    return {
        countryname: '',
        countrycode: ''
    };
};
