# Device Service & Hook

A simple service and React hook to fetch a list of all existing devices from the backend API.

## Files Created

- `src/services/deviceService.js` - API service for fetching devices
- `src/hooks/useDevices.js` - React hook for device data management

## Device Service

```javascript
import { deviceService } from './services/deviceService';

// Fetch all devices from backend API
const devices = await deviceService.getAllDevices();
```

## React Hook

```javascript
import { useDevices } from './hooks/useDevices';

const MyComponent = () => {
  const { devices, loading, error, refreshDevices } = useDevices();
  
  if (loading) return <div>Loading devices...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <h2>All Devices ({devices.length})</h2>
      {devices.map(device => (
        <div key={device.deviceId}>
          {device.deviceName} - {device.deviceType}
        </div>
      ))}
      <button onClick={refreshDevices}>Refresh</button>
    </div>
  );
};
```

## API Configuration

The service expects the backend API to be available at:
- Default: `http://localhost:8080/api/devices`
- Override with: `REACT_APP_API_BASE_URL` environment variable

## Usage

1. Import the hook in your component
2. Use the returned `devices` array to display device data
3. Handle `loading` and `error` states appropriately
4. Call `refreshDevices()` to manually refresh the data

