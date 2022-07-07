declare namespace Layer {

  /**
   * 图层元数据
   */
   type BasicLayer = {
    layerName: string;
    id: string;
    url: string;
    headers?: Record<string, any>; // 请求头
    queryParameters?: Record<string, any>; // 可以传自定义url参数，如token等
    sourceLayer?: string; // 真实图层名，wms加载方式需要此字段
    viewPort?: number[]; // 地图缩放的范围，默认为[110.60396458865515, 34.54408834959379, 15000000]
    loaderinfo?: LoaderInfo;
   }

  type LoaderInfo = {
    srs?: string; // 'EPSG: 4326' | 'EPSG: 3857'，默认为3857
    minimumLevel?: number,
    maximumLevel?: number,
  }

  /**
   * 栅格图层元数据格式
   */
   type RasterLayerItem = {
    method: 'wms' | 'wmts' | 'tms' | 'arcgis';
  } & BasicLayer;

   /**
   * 以pbf方式加载的矢量图层元数据格式
   */
  type PbfLayerItem = {
    method: 'pbf';
    url: string | Object;
    token?: string;
  } & Omit<BasicLayer, 'url'>;

  type LayerItem = RasterLayerItem | PbfLayerItem;

  type LayerMethod = LayerItem['method'];

  type LayerType = LayerItem['layerType'];
}
