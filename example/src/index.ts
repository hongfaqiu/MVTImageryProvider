import { ArcGisMapServerImageryProvider, Viewer } from 'cesium';
import './index.css';
import MVTImageryProvider from 'mvt-imagery-provider';

const viewer = new Viewer('cesiumContainer', {
  baseLayerPicker: false,
  animation: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  selectionIndicator: true,
  timeline: false,
  navigationHelpButton: false,
  shouldAnimate: true,
  useBrowserRecommendedResolution: false,
  orderIndependentTranslucency: false,
});

ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', {
  enablePickFeatures: false
}).then(async imageryProvider => {
  viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
  viewer.imageryLayers.addImageryProvider(imageryProvider)
  const provider: any = await MVTImageryProvider.fromUrl('https://demotiles.maplibre.org/style.json');
  
  const imageryLayer = viewer.imageryLayers.addImageryProvider(provider);
})
