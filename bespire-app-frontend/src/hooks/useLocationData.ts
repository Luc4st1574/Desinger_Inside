import { useState, useEffect, useCallback } from "react";

// --- Tipos de Datos ---
interface Country {
  country: string;
  iso2: string;
}

interface State {
  name: string;
  state_code: string;
}

// --- Estructura de nuestro objeto de caché unificado ---
interface LocationCache {
  countries: Country[];
  states: {
    [countryName: string]: State[];
  };
  cities: {
    [countryAndState: string]: string[]; // Clave será "País-Estado", ej: "United States-Florida"
  };
}

// --- Constante para la clave de localStorage ---
const CACHE_KEY = "locationDataV2"; // Usamos V2 para evitar conflictos con la caché antigua

export function useLocationData() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  
  // 1. Cargar Países (y la caché inicial) - Solo una vez
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        if (cachedRaw) {
          const data: LocationCache = JSON.parse(cachedRaw);
          if (data.countries && data.countries.length > 0) {
            setCountries(data.countries);
            return; // Salimos si ya están en caché
          }
        }

        const response = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await response.json();
        if (data.data) {
          const mappedCountries: Country[] = data.data.map((c: any) => ({
            country: c.country,
            iso2: c.iso2,
          }));
          setCountries(mappedCountries);
          
          const initialCache: LocationCache = {
            countries: mappedCountries,
            states: {},
            cities: {},
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(initialCache));
        }
      } catch (error) {
        console.error("Error al cargar países:", error);
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  // 2. Cargar Estados para un País específico
  const loadStates = useCallback(async (countryName: string) => {
    if (!countryName) {
      setStates([]);
      setCities([]); // Limpia también las ciudades
      return;
    }
    
    setLoadingStates(true);
    setStates([]); // Resetea los estados mientras se cargan los nuevos
    setCities([]);

    try {
      const cache: LocationCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      
      if (cache.states && cache.states[countryName]) {
        setStates(cache.states[countryName]);
      } else {
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries/states`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: countryName }),
        });
        const data = await response.json();
        const loadedStates = data.data?.states || [];
        setStates(loadedStates);

        const updatedCache = { ...cache, states: { ...cache.states, [countryName]: loadedStates } };
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }
    } catch (error) {
      console.error(`Error al cargar estados para ${countryName}:`, error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  }, []);
  
  // 3. Cargar Ciudades para un Estado y País específicos
  const loadCities = useCallback(async (countryName: string, stateName: string) => {
    if (!countryName || !stateName) {
      setCities([]);
      return;
    }
    
    setLoadingCities(true);
    setCities([]); // Resetea las ciudades mientras se cargan las nuevas

    try {
      const cacheKey = `${countryName}-${stateName}`;
      const cache: LocationCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      
      if (cache.cities && cache.cities[cacheKey]) {
        setCities(cache.cities[cacheKey]);
      } else {
        const response = await fetch(`https://countriesnow.space/api/v0.1/countries/state/cities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country: countryName, state: stateName }),
        });
        const data = await response.json();
        const loadedCities = data.data || [];
        setCities(loadedCities.sort());

        const updatedCache = { ...cache, cities: { ...cache.cities, [cacheKey]: loadedCities } };
        localStorage.setItem(CACHE_KEY, JSON.stringify(updatedCache));
      }
    } catch (error) {
      console.error(`Error al cargar ciudades para ${countryName}, ${stateName}:`, error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);


  return {
    countries,
    states,
    cities,
    loadingCountries,
    loadingStates,
    loadingCities,
    loadStates,
    loadCities,
  };
}