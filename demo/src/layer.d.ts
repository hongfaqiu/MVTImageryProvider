declare namespace Layer {

  /**
   * 图层元数据
   */
   type BasicLayer = {
    layerName: string;
    id: string;
    url: string;
    sourceLayer?: string; // 真实图层名，wms加载方式需要此字段
    originId?: string;
    boundary?: string; // 地图边界，例：
                       // POLYGON((-167.1072 32.0969,-167.1072 69.834,-104.1519 69.834,-104.1519 32.0969,-167.1072 32.0969))
    viewPort?: number[]; // 地图缩放的范围，如果没有viewPort，从boundary中计算
                         // 默认为[110.60396458865515, 34.54408834959379, 15000000]
    loaderinfo?: LoaderInfo;
    imageURL?: string; // 缩略图
   }

  type LoaderInfo = {
    url?: string;
    srs?: string; // 'EPSG: 4326' | 'EPSG: 3857'，默认为3857
    workSpace?: string;
    layerType?: string;
    layerName?: string;
  }

  /**
   * 栅格图层元数据格式
   */
   type RasterLayerItem = {
    method: 'wms' | 'wmts' | 'tms' | 'arcgis' | 'pic';
    layerType?: 'raster';
    loadParams?: Record<string, any>; // 图层加载所需的一些参数
    loaderinfo?: LoaderInfo;
    renderOptions?: RasterOptions;
  } & BasicLayer;

   /**
   * 以pbf方式加载的矢量图层元数据格式
   */
  type PbfLayerItem = {
    method: 'pbf';
    layerType?: 'vector';
    geoJsonType?: 'point' | 'line' | 'polygon';
    renderOptions?: PbfOptions;
    columns?: {
      column_name: string;
      data_type: "string" | "number";
    }[]; // 列字段信息
    pbfStyle?: any; // pbf style
  } & BasicLayer;

  type LayerItem = RasterLayerItem | PbfLayerItem;

  type LayerMethod = LayerItem['method'];

  type LayerType = LayerItem['layerType'];
}
