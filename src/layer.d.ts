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
    boundary?: string; // 地图边界，例：
                       // POLYGON((-167.1072 32.0969,-167.1072 69.834,-104.1519 69.834,-104.1519 32.0969,-167.1072 32.0969))
    viewPort?: number[]; // 地图缩放的范围，如果没有viewPort，从boundary中计算
                         // 默认为[110.60396458865515, 34.54408834959379, 15000000]
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
    pbfStyle?: any; // pbf style
  } & BasicLayer;

  type LayerItem = RasterLayerItem | PbfLayerItem;

  type LayerMethod = LayerItem['method'];

  type LayerType = LayerItem['layerType'];
}
