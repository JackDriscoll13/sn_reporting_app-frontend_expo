// React Imports
import { useEffect, useRef, useState } from 'react';
// Mapbox Imports
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Custom Imports
import { backendUrl, mapboxAccessToken } from '../config.js';
// import { CoverageMapResponse } from '../types/backend_responses.ts';  -> exluding this for now as its not neccesary for Functionality of this page
// Set the mapbox access token
mapboxgl.accessToken = mapboxAccessToken;

// Define types for the legend
interface Category {
  label: string;
  startColor: string;
  endColor: string;
  mapGroups: string[];
}

interface LegendProps {
  handleClick: (label: string) => void;
}

// Legend component
function Legend({ handleClick }: LegendProps) {
  const categories: Category[] = [
    { label: 'SN Linear Footprint', startColor: '#d3f2ff', endColor: '#003057', mapGroups: ['1', '2', '3', '4', '5'] },
    { label: 'SN Digital Footprint', startColor: '#e9c8fc', endColor: '#500778', mapGroups: ['6'] },
    { label: 'SN Plus', startColor: '#dcfffb', endColor: '#009E8C', mapGroups: ['7'] }
  ];

  return ( 
    <div className='flex flex-row'>
      {categories.map((category, index) => (
        <div key={index} className="flex items-center mr-2 hover:bg-gray-200 cursor-pointer" onClick={() => handleClick(category.label)}>
          <span className="w-4 h-4 mr-2" style={{ background: `linear-gradient(90deg, ${category.startColor}, ${category.endColor})` }} />
          <span className="text-sm">{category.label}</span>
        </div>
      ))}
    </div>
  )
}


function CoverageMap({ isNavBarCollapsed }: { isNavBarCollapsed: boolean }) {
  // Page style depending on the navbar
  const pageStyle = {
    width: isNavBarCollapsed ? '93%' : '80%', 
    marginLeft: isNavBarCollapsed ? '6%' : '17%', 
  }

  // Want to add state to determine what colors/Footprints are showing on the map
  const [selectedMapGroups, setSelectedMapGroups] = useState<string[]>(['1','2','3','4','5','6','7']);

  // Update the selected map groups based on the legend click
  function handleLegendClick (label: string) {
    switch (label) {
      case 'SN Linear Footprint':
        if (["1", "2", "3", "4", "5"].every(group => selectedMapGroups.includes(group))) {
          setSelectedMapGroups(selectedMapGroups.filter(group => !["1", "2", "3", "4", "5"].includes(group)));
        }
        else {  
          setSelectedMapGroups([...selectedMapGroups, "1", "2", "3", "4", "5"]);
        }
        break;
      case 'SN Digital Footprint':
        if (selectedMapGroups.includes('6')) {
          setSelectedMapGroups(selectedMapGroups.filter(group => group !== '6'));
        } else {
          setSelectedMapGroups([...selectedMapGroups, '6']);
        }
        break;
      case 'SN Plus':
        if (selectedMapGroups.includes('7')) {
          setSelectedMapGroups(selectedMapGroups.filter(group => group !== '7'));
        } else {
          setSelectedMapGroups([...selectedMapGroups, '7']);
        }
        break;
      }
      console.log(selectedMapGroups);
    } 

  // Refs for the map container and map object
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // JSX for the map container, will be injected later
  <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Main map load effect
  useEffect(() => {
    setIsLoading(true);


    // Fetch the coverage map data from the backend
    fetch(`${backendUrl}/api/map/coverage_snzips`)
      .then(response => response.json())
      .then(response => {
        const data = response.data;

        if (mapContainerRef.current) {
          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [-95.7129, 37.0902],
            zoom: 3,
          });

          mapRef.current.on('load', function () {
            if (mapRef.current) {
              mapRef.current.addSource('geojson', {
                type: 'geojson',
                data: data
              });

              mapRef.current.addLayer({
                id: 'geojson',
                type: 'fill',
                source: 'geojson',
                layout: {},
                paint: {
                  'fill-color': [
                    'case',
                    ['any', ['==', ['get', 'mapgroup'], '1'], ['==', ['get', 'mapgroup'], '2'], ['==', ['get', 'mapgroup'], '3'], ['==', ['get', 'mapgroup'], '4'], ['==', ['get', 'mapgroup'], '5']],
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'video_subs_dens_log'],
                      0, '#d3f2ff',
                      5, '#003057',
                    ],
                    ['==', ['get', 'mapgroup'], '6'],
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'video_subs_dens_log'],
                      0, '#e9c8fc',
                      5, '#500778',
                    ],
                    ['==', ['get', 'mapgroup'], '7'],
                    [
                      'interpolate',
                      ['linear'],
                      ['get', 'video_subs_dens_log'],
                      0, '#dcfffb',
                      5, '#009E8C',
                    ],
                    'black'
                  ],
                  'fill-opacity': 0.5
                }
              });

              mapRef.current.on('click', 'geojson', function (e) {
                if (mapRef.current && e.features && e.features.length > 0) {
                  new mapboxgl.Popup()
                    .setLngLat(e.lngLat)
                    .setHTML(`<h2><b><span class="text-[#2B5CAF]">${e.features[0].properties?.PO_NAME}</span></b></h2>
                              <p><b>Feed:</b> ${e.features[0].properties?.Feed}</p>
                              <p><b>DMA:</b> ${e.features[0].properties?.dma}</p>
                              <p><b>County:</b> ${e.features[0].properties?.county}</p>
                              <p><b>Video Subs Density:</b> ${parseFloat(e.features[0].properties?.video_subs_dens_log).toFixed(2)}</p>`)
                    .addTo(mapRef.current);

                  if (mapRef.current.getLayer('selectedFeature')) {
                    mapRef.current.removeLayer('selectedFeature');
                    mapRef.current.removeSource('selectedFeature');
                  }

                  mapRef.current.addSource('selectedFeature', {
                    type: 'geojson',
                    data: e.features[0].geometry
                  });

                  mapRef.current.addLayer({
                    id: 'selectedFeature',
                    type: 'line',
                    source: 'selectedFeature',
                    paint: {
                      'line-color': '#ff0000',
                      'line-width': 2
                    }
                  });
                }
              });
            }
            setIsLoading(false);
          });
        }
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        setIsLoading(false);
      });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Resize the map when the sidebar expands/collapses
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [isNavBarCollapsed]);

  // This is called when the selectedMapGroups state changes
  useEffect(() => {
    if (mapRef.current) {
      // Apply the filter to the 'geojson' layer
      mapRef.current.setFilter('geojson', ['in', 'mapgroup'].concat(selectedMapGroups));
    }
  }, [selectedMapGroups]);

  return ( 
    <div className='min-h-screen top-0 left-0 mt-0 right-0 bg-custom-gray-background'>
        <img src="/SN_APP_LOGO_2023.png" alt="Logo" className="absolute top-0 right-0 mt-4 mr-4 w-20 h-18" />
        <div style={pageStyle} className='flex flex-col justify-end w-full pt-24' > {/* Our main content container, adjusts to width of navbar*/}
        <Legend handleClick={handleLegendClick}/>
          <div className='border-red-300 border-2 items-center w-full overflow-hidden h-full flex relative'> {/* Our map container*/}
              {/* Legend */}
              <div ref={mapContainerRef} style={{ width: '100%', height: '80vh' }} />
              {isLoading && 
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
                  <div className="w-64 h-64 border-t-8 border-blue-500 rounded-full animate-spin"></div>
                </div>
              }
        </div>
    </div>
  </div>
  ) 
};

export default CoverageMap;