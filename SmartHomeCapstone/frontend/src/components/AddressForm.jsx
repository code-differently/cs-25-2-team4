import { useState, useEffect } from 'react';
import { addressService } from '../services/addressService';

export default function AddressForm({ onAddressChange, initialAddress = {} }) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState({ countries: false, cities: false });
    const [address, setAddress] = useState({
        country: '',
        state: '',
        city: '',
        streetAddress: '',
        zipCode: '',
        ...initialAddress
    });

    // Load countries on component mount
    useEffect(() => {
        loadCountries();
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (address.country === 'US') {
            loadStates(address.country);
            // Clear dependent fields
            setAddress(prev => ({ ...prev, state: '', city: '' }));
            setCities([]);
        } else {
            // Clear states for non-US countries
            setStates([]);
            setAddress(prev => ({ ...prev, state: '', city: '' }));
            setCities([]);
        }
    }, [address.country]);

    // Load cities when zip code changes
    useEffect(() => {
        if (address.country && address.zipCode && address.zipCode.length >= 5) {
            loadCities(address.country, address.zipCode);
        } else {
            setCities([]);
        }
    }, [address.country, address.zipCode]);

    // Notify parent of address changes
    useEffect(() => {
        onAddressChange(address);
    }, [address, onAddressChange]);

    const loadCountries = async () => {
        setLoading(prev => ({ ...prev, countries: true }));
        try {
            const countryList = await addressService.getCountries();
            setCountries(countryList);
        } catch (error) {
            console.error('Failed to load countries:', error);
        } finally {
            setLoading(prev => ({ ...prev, countries: false }));
        }
    };

    const loadStates = async (countryCode) => {
        try {
            const stateList = await addressService.getStates(countryCode);
            setStates(stateList);
        } catch (error) {
            console.error('Failed to load states:', error);
            setStates([]);
        }
    };

    const loadCities = async (countryCode, zipCode) => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
            const cityList = await addressService.getCitiesByZip(countryCode, zipCode);
            setCities(cityList);

            // Auto-fill city and state if only one result
            if (cityList.length === 1) {
                setAddress(prev => ({
                    ...prev,
                    city: cityList[0].city,
                    state: cityList[0].state
                }));
            }
        } catch (error) {
            console.error('Failed to load cities:', error);
        } finally {
            setLoading(prev => ({ ...prev, cities: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="address-form">
            {/* Country */}
            <label>Country</label>
            <select
                className="select"
                name="country"
                value={address.country}
                onChange={handleChange}
                disabled={loading.countries}
            >
                <option value="">
                    {loading.countries ? 'Loading countries...' : 'Select Country'}
                </option>
                {countries.map(country => (
                    <option key={country.code} value={country.code}>
                        {country.name}
                    </option>
                ))}
            </select>

            {/* Zip Code */}
            <label>Zip Code</label>
            <input
                className="input"
                name="zipCode"
                value={address.zipCode}
                onChange={handleChange}
                placeholder="Enter zip code"
            />

            {/* State - Only show for United States */}
            {address.country === 'US' && (
                <>
                    <label>State</label>
                    <select
                        className="select"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                    >
                        <option value="">Select State</option>
                        {states.map(state => (
                            <option key={state.code} value={state.code}>
                                {state.name}
                            </option>
                        ))}
                    </select>
                </>
            )}

            {/* State/Province for other countries */}
            {address.country && address.country !== 'US' && (
                <>
                    <label>State/Province</label>
                    <input
                        className="input"
                        name="state"
                        value={address.state}
                        onChange={handleChange}
                        placeholder="Enter state/province"
                    />
                </>
            )}

            {/* City */}
            <label>City</label>
            {cities.length > 1 ? (
                <select
                    className="select"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    disabled={loading.cities}
                >
                    <option value="">
                        {loading.cities ? 'Loading cities...' : 'Select City'}
                    </option>
                    {cities.map((city, index) => (
                        <option key={index} value={city.city}>
                            {city.city}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    className="input"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    disabled={loading.cities}
                />
            )}

            {/* Street Address */}
            <label>Street Address</label>
            <input
                className="input mb16"
                name="streetAddress"
                value={address.streetAddress}
                onChange={handleChange}
                placeholder="Enter street address"
            />
        </div>
    );
}
