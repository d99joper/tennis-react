import { useState, useEffect } from "react";

let loadingPromise = null;

const useGoogleMapsApi = () => {
  const [mapApi, setMapApi] = useState(null);

  useEffect(() => {
    async function loadGoogleMapsAPI() {
      if (window.google && window.google.maps) {
        setMapApi(window.google.maps);
        return;
      }

      if (loadingPromise) {
        loadingPromise.then(setMapApi);
        return;
      }

      loadingPromise = new Promise((resolve, reject) => {
        const apiKey = process.env.REACT_APP_PLACES_API_KEY;
        if (!apiKey) {
          console.error("Google Maps API Key is missing");
          reject(new Error("API Key is required"));
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (window.google && window.google.maps) {
            resolve(window.google.maps);
            setMapApi(window.google.maps);
          } else {
            reject(new Error("Google Maps API failed to load"));
          }
        };

        script.onerror = () => reject(new Error("Error loading Google Maps API"));

        document.body.appendChild(script);
      });

      loadingPromise.then(setMapApi).catch((error) => console.error(error));
    }

    loadGoogleMapsAPI();
  }, []);

  return mapApi;
};

export default useGoogleMapsApi;
