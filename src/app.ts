import CesiumMap from './utils/map';

// initialization
const MapObj = new CesiumMap('app')

MapObj.addRasterLayer({
  layerName: 'esri-global',
  id: 'esri-global',
  method: 'arcgis',
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
})

// pbf add example
MapObj.addRasterLayer({
  layerName: 'pbf',
  id: 'pbf',
  method: 'pbf',
  url: 'https://demotiles.maplibre.org/style.json',
  viewPort: [116.3, 39.9, 15000000]
}, {
  zoom: true
})
