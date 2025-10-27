import axios from 'axios';

// Address service for third-party API integration
export const addressService = {
    // Get all countries
    getCountries: async () => {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,cca2');
            return response.data
                .map(country => ({
                    code: country.cca2,
                    name: country.name.common
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
        } catch (error) {
            console.error('Error fetching countries:', error);
            throw new Error('Failed to load countries');
        }
    },

    // Get states/provinces for a country (using US states as example)
    getStates: async (countryCode) => {
        if (countryCode === 'US') {
            // US states list
            return [
                { code: 'AL', name: 'Alabama' },
                { code: 'AK', name: 'Alaska' },
                { code: 'AZ', name: 'Arizona' },
                { code: 'AR', name: 'Arkansas' },
                { code: 'CA', name: 'California' },
                { code: 'CO', name: 'Colorado' },
                { code: 'CT', name: 'Connecticut' },
                { code: 'DE', name: 'Delaware' },
                { code: 'FL', name: 'Florida' },
                { code: 'GA', name: 'Georgia' },
                { code: 'HI', name: 'Hawaii' },
                { code: 'ID', name: 'Idaho' },
                { code: 'IL', name: 'Illinois' },
                { code: 'IN', name: 'Indiana' },
                { code: 'IA', name: 'Iowa' },
                { code: 'KS', name: 'Kansas' },
                { code: 'KY', name: 'Kentucky' },
                { code: 'LA', name: 'Louisiana' },
                { code: 'ME', name: 'Maine' },
                { code: 'MD', name: 'Maryland' },
                { code: 'MA', name: 'Massachusetts' },
                { code: 'MI', name: 'Michigan' },
                { code: 'MN', name: 'Minnesota' },
                { code: 'MS', name: 'Mississippi' },
                { code: 'MO', name: 'Missouri' },
                { code: 'MT', name: 'Montana' },
                { code: 'NE', name: 'Nebraska' },
                { code: 'NV', name: 'Nevada' },
                { code: 'NH', name: 'New Hampshire' },
                { code: 'NJ', name: 'New Jersey' },
                { code: 'NM', name: 'New Mexico' },
                { code: 'NY', name: 'New York' },
                { code: 'NC', name: 'North Carolina' },
                { code: 'ND', name: 'North Dakota' },
                { code: 'OH', name: 'Ohio' },
                { code: 'OK', name: 'Oklahoma' },
                { code: 'OR', name: 'Oregon' },
                { code: 'PA', name: 'Pennsylvania' },
                { code: 'RI', name: 'Rhode Island' },
                { code: 'SC', name: 'South Carolina' },
                { code: 'SD', name: 'South Dakota' },
                { code: 'TN', name: 'Tennessee' },
                { code: 'TX', name: 'Texas' },
                { code: 'UT', name: 'Utah' },
                { code: 'VT', name: 'Vermont' },
                { code: 'VA', name: 'Virginia' },
                { code: 'WA', name: 'Washington' },
                { code: 'WV', name: 'West Virginia' },
                { code: 'WI', name: 'Wisconsin' },
                { code: 'WY', name: 'Wyoming' }
            ];
        }
        // For other countries, return empty array or implement other country states
        return [];
    },

    // Get cities by state (using GeoNames API)
    getCitiesByState: async (countryCode, stateCode) => {
        const GEONAMES_USERNAME = 'demo'; //TBR
        
        if (!countryCode || !stateCode) return [];

        try {
            const response = await axios.get(
                `http://api.geonames.org/searchJSON`, {
                    params: {
                        country: countryCode,
                        adminCode1: stateCode,
                        featureCode: 'PPL,PPLA,PPLA2,PPLA3,PPLA4',
                        maxRows: 1000,
                        username: GEONAMES_USERNAME,
                        orderby: 'name'
                    }
                }
            );

            if (response.data.geonames) {
                return response.data.geonames
                    .map(place => ({
                        name: place.name,
                        code: place.name,
                        population: place.population
                    }))
                    // Remove duplicates
                    .filter((city, index, self) => 
                        index === self.findIndex(c => c.name === city.name)
                    )
                    .sort((a, b) => a.name.localeCompare(b.name));
            }
            return [];
        } catch (error) {
            console.error('Error fetching cities:', error);
            return [];
        }
    },

    // Get cities by zip code (using Zippopotam.us API)
    getCitiesByZip: async (countryCode, zipCode) => {
        if (!zipCode || zipCode.length < 3) return [];

        try {
            const response = await axios.get(`https://api.zippopotam.us/${countryCode.toLowerCase()}/${zipCode}`);
            return response.data.places.map(place => ({
                city: place['place name'],
                state: place['state abbreviation'] || place.state,
                latitude: place.latitude,
                longitude: place.longitude
            }));
        } catch (error) {
            // If zip code not found, return empty array
            return [];
        }
    },

    // Validate address components
    validateAddress: (address) => {
        const errors = [];

        if (!address.country) errors.push('Country is required');
        if (!address.state) errors.push('State is required');
        if (!address.city) errors.push('City is required');
        if (!address.streetAddress) errors.push('Street address is required');
        if (!address.zipCode) errors.push('Zip code is required');

        // Basic zip code validation for US
        if (address.country === 'US' && address.zipCode) {
            const zipRegex = /^\d{5}(-\d{4})?$/;
            if (!zipRegex.test(address.zipCode)) {
                errors.push('Invalid US zip code format');
            }
        }

        return errors;
    }
};

export default addressService;