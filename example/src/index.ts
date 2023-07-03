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

const imageryProvider = await ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', {
  enablePickFeatures: false
});

viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
viewer.imageryLayers.addImageryProvider(imageryProvider)

const provider: any = new MVTImageryProvider({
  style: 'https://demotiles.maplibre.org/style.json',
});

const imageryLayer = viewer.imageryLayers.addImageryProvider(provider);