// GoogleMapsComponent.js
import React, { useEffect } from 'react';
import { withScriptjs } from 'react-script-loader-hoc';

const GoogleMapsComponent = ({ isScriptLoaded, isScriptLoadSucceed }) => {
  useEffect(() => {
    if (isScriptLoaded && isScriptLoadSucceed) {
      // Google Maps API script has loaded successfully

      // Initialize and add the map
      let map;

      async function initMap() {
        // The location of Uluru
        const position = { lat: -25.344, lng: 131.031 };
        // Request needed libraries.
        const { Map } = await window.google.maps.importLibrary('maps');
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

        // The map, centered at Uluru
        map = new Map(document.getElementById('map'), {
          zoom: 4,
          center: position,
          mapId: 'DEMO_MAP_ID',
        });

        // The marker, positioned at Uluru
        const marker = new AdvancedMarkerElement({
          map: map,
          position: position,
          title: 'Uluru',
        });
      }

      // Call initMap function
      initMap();
    }
  }, [isScriptLoaded, isScriptLoadSucceed]);

  return <div id="map" style={{ height: '400px' }}></div>;
};

export default withScriptjs(GoogleMapsComponent, {
  googleMapURL:
    'https://maps.googleapis.com/maps/api/js?key=AIzaSyCGUntOp39tUa3kNra8KgmVh3IZDDUWUKg&libraries=places&callback=initMap',
});

