import { useState, useEffect } from "react";

let loadingPromise = null;

const useGoogleMapsApi = () => {
  const [mapApi, setMapApi] = useState(null);

  useEffect(() => {
    async function loadGoogleMapsAPI() {
      // Already fully loaded (marker + places attached)
      if (window.google?.maps?.marker && window.google?.maps?.places?.PlaceAutocompleteElement) {
        setMapApi(window.google.maps);
        return;
      }

      if (loadingPromise) {
        loadingPromise.then(setMapApi).catch(console.error);
        return;
      }

      const apiKey = process.env.REACT_APP_PLACES_API_KEY;
      const mapId = process.env.REACT_APP_MAP_ID;
      if (!apiKey) {
        console.error("Google Maps API Key is missing");
        return;
      }

      // With loading=async the script only bootstraps google.maps.importLibrary.
      // Libraries must be loaded via importLibrary() — NOT via the libraries= param.
      // We use a named callback so we know when the bootstrap is ready.
      loadingPromise = new Promise((resolve, reject) => {
        window.__googleMapsReady = async () => {
          try {
            // importLibrary populates google.maps.* namespaces in addition to returning them
            await Promise.all([
              window.google.maps.importLibrary("maps"),
              window.google.maps.importLibrary("marker"),
              window.google.maps.importLibrary("places"),
            ]);
            resolve(window.google.maps);
          } catch (err) {
            reject(err);
          }
        };

        const script = document.createElement("script");
        script.async = true;
        script.src =
          `https://maps.googleapis.com/maps/api/js` +
          `?key=${apiKey}` +
          `&loading=async` +
          `&callback=__googleMapsReady` +
          `&map_ids=${mapId}`;
        script.onerror = () => reject(new Error("Error loading Google Maps API script"));
        document.body.appendChild(script);
      });

      loadingPromise.then(setMapApi).catch((err) => console.error("Google Maps load error:", err));
    }

    loadGoogleMapsAPI();
  }, []);

  return mapApi;
};

export default useGoogleMapsApi;
