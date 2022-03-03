import 'cesium/Widgets/widgets.css';
import * as Cesium from 'cesium/Cesium';

import MVTImageryProvider from 'mvt-imagery-provider';

import type { ImageryLayer, ImageryProvider, Viewer } from 'cesium';

Cesium.Ion.defaultAccessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4OGQwZTM2MC00NjkzLTRkZTgtYTU5MS0xZTA1NTljYWQyN2UiLCJpZCI6NTUwODUsImlhdCI6MTYyMDM5NjQ3NH0.lu_JBwyngYucPsvbCZt-xzmzgfwEKwcRXiYs5uV8uTM';

/**
 * CesiumMap类
 */
export default class CesiumMap {
  readonly viewer: Viewer;
  readonly cesiumContainer: string;

  constructor(cesiumContainer: string) {
    this.viewer = this.initMap(cesiumContainer);
    this.cesiumContainer = cesiumContainer;
  }

  /**
   * 初始化地图
   * @param cesiumContainer 地图容器div id
   */
  protected initMap = (cesiumContainer: string) => {
    const viewer = new Cesium.Viewer(cesiumContainer, {
      baseLayerPicker: false, // 图层选择器
      animation: false, // 左下角仪表
      fullscreenButton: false, // 全屏按钮
      geocoder: false, // 右上角查询搜索
      infoBox: false, // 信息框
      homeButton: false, // home按钮
      sceneModePicker: false, // 3d 2d选择器
      selectionIndicator: false, //
      timeline: false, // 时间轴
      navigationHelpButton: false, // 右上角帮助按钮
      shouldAnimate: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity, // 静止时不刷新,减少系统消耗
    });

    // viewer.scene.globe.enableLighting = true;
    viewer.scene.fog.density = 0.0001; // 雾气中水分含量
    viewer.scene.globe.enableLighting = false;
    viewer.scene.moon.show = false; // 不显示月球
    // eslint-disable-next-line no-underscore-dangle
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    // viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.skyBox.show = false;
    viewer.imageryLayers.remove(viewer.imageryLayers._layers[0]);
    return viewer;
  };

  /**
   * 缩放至, 优先缩放至viewPort
   * @param viewPort 空间经纬度高度
   * @param layer 图层
   */
  zoomToViewPort(viewPort: number[] | undefined) {
    if (viewPort) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(viewPort[0], viewPort[1], viewPort[2]),
        duration: 1,
      });
      return true;
    }
    return false;
  }


  /**
   * 添加栅格图层
   * @param imageLayer 栅格图层参数
   * @param zoom 是否缩放,默认为false
   * @returns ImageryLayer
   */
   addRasterLayer(
    imageLayer: Layer.LayerItem,
    options: {
      index?: number;
      zoom?: boolean;
    } = {},
  ) {
    if (!imageLayer.url) return null;
    const { viewPort } = imageLayer;
    const { index, zoom } = options;
    const imageryProvider = this.generateImageProvider(imageLayer);
    const layer = this.viewer.imageryLayers.addImageryProvider(imageryProvider, index);

    if (zoom) {
      this.zoomToViewPort(viewPort);
    }
    this.viewer.scene.requestRender();
    return layer;
  }

  // 生成ImageryProvider
  protected generateImageProvider(imageLayer: Layer.LayerItem): ImageryProvider {
    const { method, url, layerName, style, loaderinfo } = imageLayer;
    const layers = imageLayer.layers || layerName;
    let imageryProvider = null;
    const tilingScheme4326 = new Cesium.GeographicTilingScheme();
    const tilingScheme3857 = new Cesium.WebMercatorTilingScheme();
    const tilingScheme = (loaderinfo?.srs ?? '').indexOf('4326') !== -1 ? tilingScheme4326 : tilingScheme3857;
    switch (method) {
      case 'wms':
        imageryProvider = new Cesium.WebMapServiceImageryProvider({
          url,
          layers,
          tilingScheme,
          parameters: {
            format: 'image/png', // 显示声明png格式、透明度，让背景区域透明
            transparent: true,
          },
        });
        break;
      case 'wmts':
        imageryProvider = new Cesium.WebMapTileServiceImageryProvider({
          url,
          layer: '',
          style: '',
          tileMatrixSetID: '',
        });
        break;
      case 'arcgis':
        imageryProvider = new Cesium.ArcGisMapServerImageryProvider({
          url,
        });
        break;
      case 'tms':
        imageryProvider = new Cesium.UrlTemplateImageryProvider({
          url,
          tilingScheme,
          maximumLevel: 18,
        });
        break;
      case 'pbf':
        imageryProvider = new MVTImageryProvider({
          style,
          tilingScheme,
          maximumLevel: 18
        });
        break;
      default:
        break;
    }
    return imageryProvider;
  }

  // 移除对应图层
  removeImageLayer(layer: ImageryLayer) {
    return this.viewer.imageryLayers.remove(layer, true);
  }
}
