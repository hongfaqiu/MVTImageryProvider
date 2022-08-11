import { ArcGisMapServerImageryProvider, Cartesian3, GeographicTilingScheme, ImageryLayer, ImageryProvider, Ion, Resource, UrlTemplateImageryProvider, Viewer, WebMapServiceImageryProvider, WebMapTileServiceImageryProvider, WebMercatorTilingScheme } from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

import MVTImageryProvider from './MVTImageryProvider';

Ion.defaultAccessToken =
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
    const viewer = new Viewer(cesiumContainer, {
      baseLayerPicker: false, // 图层选择器
      animation: false, // 左下角仪表
      fullscreenButton: false, // 全屏按钮
      geocoder: false, // 右上角查询搜索
      // infoBox: false, // 信息框
      homeButton: false, // home按钮
      selectionIndicator: false, //
      timeline: false, // 时间轴
      navigationHelpButton: false, // 右上角帮助按钮
      shouldAnimate: true,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity, // 静止时不刷新,减少系统消耗
      useBrowserRecommendedResolution: false,
    });

    // viewer.scene.globe.enableLighting = true;
    viewer.scene.fog.density = 0.0001; // 雾气中水分含量
    viewer.scene.globe.enableLighting = false;
    viewer.scene.moon.show = false; // 不显示月球
    // @ts-ignore
    viewer._cesiumWidget._creditContainer.style.display = 'none';
    viewer.scene.skyBox.show = false;
    // @ts-ignore
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
        destination: Cartesian3.fromDegrees(viewPort[0], viewPort[1], viewPort[2]),
        duration: 1,
      });
      return true;
    }
    return false;
  }

  protected getResource(options: {
    url: string;
    headers?: any;
    queryParameters?: any;
  }) {
    return new Resource({
      ...options,
      retryAttempts: 1,
    });
  }

  /**
   * 添加栅格图层
   * @param {Layer.LayerItem} imageLayer 栅格图层参数
   * @param {number} [options.index] the index to add the layer at. If omitted, the layer will added on top of all existing layers.
   * @param {boolean} [options.zoom] 是否缩放,默认为false
   * @returns ImageryLayer
   */
  async addRasterLayer(
    imageLayer: Layer.LayerItem,
    options: {
      index?: number;
      zoom?: boolean;
    } = {},
  ) {
    if (!imageLayer.url) return null;
    const { viewPort } = imageLayer;
    const { index, zoom } = options;
    const imageryProvider = await this.generateImageProvider(imageLayer);
    if (!imageryProvider) return null;
    const layer = this.viewer.imageryLayers.addImageryProvider(imageryProvider, index);

    if (zoom) {
      this.zoomToViewPort(viewPort);
    }
    this.viewer.scene.requestRender();
    return layer;
  }

  /**
   * generate ImageProvider Object
   * @param {Layer.LayerItem} imageLayer
   * @returns {Promise<ImageryProvider | null>} ImageProvider
   */
  protected async generateImageProvider(imageLayer: Layer.LayerItem): Promise<ImageryProvider | null> {
    const { url: OriginUrl, method, layerName, headers, queryParameters } = imageLayer;
    const { loaderinfo = {} } = imageLayer as Layer.RasterLayerItem;
    const { minimumLevel = 1, maximumLevel = 18 } = loaderinfo;

    const layer = imageLayer.sourceLayer || layerName;
    const tilingScheme4326 = new GeographicTilingScheme();
    const tilingScheme3857 = new WebMercatorTilingScheme();
    const tilingScheme = (loaderinfo?.srs ?? '').indexOf('4326') !== -1 ? tilingScheme4326 : tilingScheme3857;

    const url: any = typeof OriginUrl === 'string' ? this.getResource({
      url: OriginUrl,
      headers,
      queryParameters
    }) : OriginUrl;

    let imageryProvider: any = null;

    switch (method) {
      case 'wms':
        const { queryParameters } = imageLayer;
        imageryProvider = new WebMapServiceImageryProvider({
          url,
          layers: layer,
          tilingScheme,
          minimumLevel,
          maximumLevel,
          parameters: {
            transparent: true,
            ...queryParameters,
          },
        });
        break;
      case 'wmts':
        imageryProvider = new WebMapTileServiceImageryProvider({
          url,
          layer,
          style: '',
          tileMatrixSetID: '',
          minimumLevel,
          maximumLevel,
        });
        break;
      case 'arcgis':
        imageryProvider = new ArcGisMapServerImageryProvider({
          url,
          maximumLevel,
        });
        break;
      case 'tms':
        imageryProvider = new UrlTemplateImageryProvider({
          url,
          tilingScheme,
          minimumLevel,
          maximumLevel,
        });
        break;
      case 'pbf':
        imageryProvider = new MVTImageryProvider({
          style: url,
          tilingScheme,
          maximumLevel,
          minimumLevel,
          accessToken: imageLayer.token,
        });
        break;
      default:
        break;
    }
    return imageryProvider;
  }

  /**
   * 重载栅格图层
   * @param layerObj 栅格图层对象
   * @param layer 新的栅格图层元数据
   */
  reLoadImageLayer = async (
    layerObj: ImageryLayer,
    layer: Layer.LayerItem,
    index: number | undefined = undefined,
  ) => {
    if (layerObj && !layerObj.isDestroyed()) {
      const objIndex = this.viewer.imageryLayers.indexOf(layerObj);
      const bool = this.viewer.imageryLayers.remove(layerObj, true);
      if (bool) {
        const newImageryLayer = await this.addRasterLayer(layer, { index: objIndex < 0 ? index : objIndex });
        if (newImageryLayer) return newImageryLayer;
      } else {
        const newImageryLayer = await this.addRasterLayer(layer, { index });
        if (newImageryLayer) return newImageryLayer;
      }
    }
    return layerObj;
  }

  /**
   * remove ImageLayer
   * @param {ImageryLayer} layer ImageryLayer Object
   * @returns {boolean} true if the layer was in the collection and was removed, false if the layer was not in the collection.
   */
  removeImageLayer(layer: ImageryLayer) {
    return this.viewer.imageryLayers.remove(layer, true);
  }
}
