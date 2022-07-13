import { ImageryLayer } from 'cesium';
import CesiumMap from './utils/map';


const BaseMap: Layer.LayerItem = {
  layerName: 'esri-global',
  id: 'esri-global',
  method: 'arcgis',
  url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer',
}

const PbfExample1: Layer.LayerItem = {
  layerName: 'pbf',
  id: 'pbf',
  method: 'pbf',
  url: 'https://demotiles.maplibre.org/style.json',
  viewPort: [116.3, 39.9, 15000000]
}

const PbfExample2: Layer.LayerItem = {
  layerName: 'pbf',
  id: 'pbf',
  method: 'pbf',
  url: 'https://vstyles.mapplus.cn/v1.0/styles/bj_500_dz/style.json',
  viewPort: [116.3, 39.9, 100000]
}

// initialization
const MapObj = new CesiumMap('app')

MapObj.addRasterLayer(BaseMap)

// pbf add example
let imageryLayer: ImageryLayer | null = null
MapObj.addRasterLayer(PbfExample1, {
  zoom: true
}).then(obj => {
  imageryLayer = obj
})

const reload = async (newLayer: Layer.LayerItem) => {
  if (imageryLayer) imageryLayer = await MapObj.reLoadImageLayer(imageryLayer, newLayer)
  else imageryLayer = await MapObj.addRasterLayer(newLayer, {
    zoom: true
  })
}

const Btn1 = document.getElementById('reload1')
if (Btn1) {
  Btn1.onclick = () => reload(PbfExample1)
}

const Btn2 = document.getElementById('reload2')
if (Btn2) {
  Btn2.onclick = () => reload(PbfExample2)
}

const removeBtn = document.getElementById('remove')
if (removeBtn) {
  removeBtn.onclick = () => {
    if (imageryLayer) {
      if(MapObj.removeImageLayer(imageryLayer)) imageryLayer = null
    }
  }
}
