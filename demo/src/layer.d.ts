declare namespace Layer {
  type LayerMethod =
  | 'wms'
  | 'wmts'
  | 'arcgis'
  | 'tms'
  | 'pbf';

  /**
   * 图层元数据
   */
  type LayerItem = {
    layerName: string;
    id: string;
    method: LayerMethod;
    url: string;
    viewPort?: number[];
    layers?: string; // 栅格图层参数
    loaderinfo?: {
      srs?: string; // EPSG: 4326 || EPSG: 3857
    }
    style?: any;
    headers?: Record<string, any>;
  };
}
