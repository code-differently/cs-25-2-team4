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
        if (address.country) {
            loadStates(address.country);
            // Clear dependent fields
            setAddress(prev => ({ ...prev, state: '', city: '' }));
            setCities([]);
        } else {
            setStates([]);
            setAddress(prev => ({ ...prev, state: '', city: '' }));
            setCities([]);
        }
    }, [address.country]);

    // Load cities when state changes
    useEffect(() => {
        if (address.country && address.state) {
            loadCitiesByState(address.country, address.state);
        } else {
            setCities([]);
        }
    }, [address.country, address.state]);

    // Load cities when zip code changes (as an alternative method)
    useEffect(() => {
        if (address.country && address.zipCode && address.zipCode.length >= 5) {
            loadCitiesByZip(address.country, address.zipCode);
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

    const loadCitiesByState = async (countryCode, stateCode) => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
            const cityList = await addressService.getCitiesByState(countryCode, stateCode);
            setCities(cityList);
        } catch (error) {
            console.error('Failed to load cities:', error);
            setCities([]);
        } finally {
            setLoading(prev => ({ ...prev, cities: false }));
        }
    };

    const loadCitiesByZip = async (countryCode, zipCode) => {
        setLoading(prev => ({ ...prev, cities: true }));
        try {
            const cityList = await addressService.getCitiesByZip(countryCode, zipCode);
            
            // If we got results from zip code lookup
            if (cityList.length > 0) {
                setCities(cityList);
                
                // Auto-fill city and state if only one result
                if (cityList.length === 1) {
                    setAddress(prev => ({
                        ...prev,
                        city: cityList[0].city,
                        state: cityList[0].state
                    }));
                }
            }
        } catch (error) {
            console.error('Failed to load cities by zip:', error);
        } finally {
            setLoading(prev => ({ ...prev, cities: false }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear city when state changes
        if (name === 'state') {
            setAddress(prev => ({ ...prev, [name]: value, city: '' }));
        } else {
            setAddress(prev => ({ ...prev, [name]: value }));
        }
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


            {/* State/Province */}
            {address.country && (
                <>
                    <label>State/Province</label>
                    {states.length > 0 ? (
                        <select
                            className="select"
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                        >
                            <option value="">Select State/Province</option>
                            {states.map(state => (
                                <option key={state.code} value={state.code}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className="input"
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                            placeholder="Enter state/province"
                        />
                    )}
                </>
            )}

            {/* City */}
            <label>City</label>
            {cities.length > 0 ? (
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
                        <option key={index} value={city.name || city.city}>
                            {city.name || city.city}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    className="input"
                    name="city"
                    value={address.city}
                    onChange={handleChange}
                    placeholder={loading.cities ? 'Loading cities...' : 'Enter city'}
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

            {/* Zip Code */}
            <label>Zip Code</label>
            <input
                className="input"
                name="zipCode"
                value={address.zipCode}
                onChange={handleChange}
                placeholder="Enter zip code"
            />
        </div>
    );
}