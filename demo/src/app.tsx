import { exampleStyle } from './example-style';
import CesiumMap from './map';

// initialization
const MapObj = new CesiumMap('cesiumContainer')

MapObj.addRasterLayer({
  layerName: 'ESRI全球底图',
  id: '底图-ESRI全球底图',
  method: 'arcgis',
  url: 'http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
})

MapObj.zoomToViewPort([116.3, 39.9, 15000000]);

// pbf add example
MapObj.addRasterLayer({
  layerName: 'pbf',
  id: 'pbf',
  method: 'pbf',
  url: 'https://cdn.rawgit.com/klokantech/mapbox-gl-js-offline-example/v1.0/countries/{z}/{x}/{y}.pbf',
  style: exampleStyle
})
