# Weather Extension

A Chrome extension that provides quick and easy access to weather forecasts with a clean, intuitive interface.

## Features

- **Current Weather Display**: Shows current temperature, weather conditions, and high/low temperatures
- **5-Day Forecast**: Displays upcoming weather with icons and temperature ranges
- **City Search**: Search for weather in any city worldwide
- **Saved Locations**: Pin favorite cities for quick access
- **Geolocation Support**: Automatically detects and shows weather for your current location
- **Dynamic Backgrounds**: Background changes based on weather conditions and temperature
- **Weather Icons**: Visual weather icons from OpenWeatherMap

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

## Usage

### Basic Operations
- **Search**: Type a city name in the search box and press Enter
- **Pin Cities**: Click the pin icon next to the city name to save it to your favorites
- **Switch Cities**: Click on any saved city in the slide-out panel on the right
- **Delete Cities**: Click the trash icon next to saved cities to remove them

### Weather Information
The extension displays:
- Current temperature in Celsius
- Weather description (sunny, cloudy, rainy, etc.)
- High and low temperatures for the day
- 5-day forecast with daily highs and lows
- Weather icons representing current conditions

## Dynamic Backgrounds

The extension automatically changes backgrounds based on weather conditions:
- **Thunderstorm**: Dark stormy background
- **Rain/Drizzle**: Rainy day background
- **Snow**: Winter/snowy background
- **Clear Weather**: 
  - Cold background (< 10°C)
  - Hot background (> 30°C)
  - Normal clear background (10-30°C)
- **Clouds**: Cloudy sky background
- **Fog**: Misty/foggy background

## API

This extension uses the [OpenWeatherMap API](https://openweathermap.org/api) to fetch weather data. The extension includes:
- Current weather data endpoint
- One Call API for extended forecasts
- Geocoding support for location-based weather

## File Structure

```
Weather Extension/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Styling for the popup
├── popup.js              # Main JavaScript functionality
├── background.js         # Background script (currently empty)
├── README.md             # This file
├── icon_25.png           # Extension toolbar icon
├── icon_128.png          # Extension store icon
└── Img/                  # Background images and icons
    ├── bg-*.png          # Weather-specific backgrounds
    ├── pin-icon.png      # Location pin icon
    └── trashcan.png      # Delete city icon
```

## Permissions

The extension requires the following permissions:
- **Storage**: To save your favorite cities
- **Geolocation**: To detect your current location (optional)

## Browser Compatibility

- Chrome (Manifest V3)
- Other Chromium-based browsers that support Manifest V3

## Version History

- **v1.0.2**: Current version with full weather functionality

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve this extension.

## License

This project is open source. Please check the repository for license details.

---

**Note**: You'll need to obtain your own OpenWeatherMap API key and replace the existing key in [`popup.js`](popup.js) for the extension to work properly.
