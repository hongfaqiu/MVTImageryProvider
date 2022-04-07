import CesiumMap from './utils/map';

// initialization
const MapObj = new CesiumMap('app')

MapObj.addRasterLayer({
  layerName: 'ESRI全球底图',
  id: '底图-ESRI全球底图',
  method: 'arcgis',
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
})

// pbf add example
MapObj.addRasterLayer({
  layerName: 'pbf',
  id: 'pbf',
  method: 'pbf',
  url: 'https://vstyles.mapplus.cn/v1.0/styles/bj_500_dz/style.json',
  viewPort: [116.3, 39.9, 1000000]
}, {
  zoom: true
})
