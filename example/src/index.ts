import { ArcGisMapServerImageryProvider, ImageryLayer, Viewer } from 'cesium';
import './index.css';
import MVTImageryProvider from 'mvt-imagery-provider';

const viewer = new Viewer('cesiumContainer', {
  baseLayer: ImageryLayer.fromProviderAsync(ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer', {
    enablePickFeatures: false
  }), {}),
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

const provider: any = await MVTImageryProvider.fromUrl('https://demotiles.maplibre.org/style.json');

const imageryLayer = viewer.imageryLayers.addImageryProvider(provider);
