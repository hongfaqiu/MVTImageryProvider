
import * as Cesium from "cesium/Cesium";
import { BasicRenderer } from "pbf-basic-render";

import type { Credit, WebMercatorTilingScheme, DefaultProxy, GeographicTilingScheme } from "cesium";

type MVTImageryProviderOptions = {
  style: any;
  showCanvas?: boolean;
  tileSize?: number;
  tileWidth?: number;
  tileHeight?: number;
  maximumLevel?: number;
  minimumLevel?: number;
  tileDiscardPolicy?: undefined;
  credit?: Credit;
  hasAlphaChannel?: boolean;
  sourceFilter?: any;
  headers?: HeadersInit;
  tilingScheme?: WebMercatorTilingScheme | GeographicTilingScheme;
}
// 创建一个全局变量作为pbfBasicRenderer渲染模板，避免出现16个canvas上下文的浏览器限制，以便Cesium ImageLayer.destory()正常工作。
// https://github.com/mapbox/mapbox-gl-js/issues/7332
const baseCanv = document.createElement('canvas');
class MVTImageryProvider {
  mapboxRenderer: BasicRenderer;
  ready: boolean;
  readyPromise: Promise<void>;
  rectangle: any;
  tileSize: number;
  tileWidth: number;
  tileHeight: number;
  maximumLevel: number;
  minimumLevel: number;
  tileDiscardPolicy: undefined;
  credit: Credit;
  proxy: DefaultProxy;
  hasAlphaChannel: boolean;
  sourceFilter: any;
  tilingScheme: WebMercatorTilingScheme | GeographicTilingScheme;
  options: MVTImageryProviderOptions;

 
  /**
   * create a MVTImageryProvider Object
   * @param options MVTImageryProvider options
   * @param options.style - mapbox style object
   * @param options.sourceFilter - sourceFilter is used to filter which source participate in pickFeature process.
   * @param options.maximumLevel - if cesium zoom level exceeds maximumLevel, layer will be invisible.
   * @param options.minimumLevel - if cesium zoom level belows minimumLevel, layer will be invisible.
   * @param options.tileSize - can be 256 or 512. 512 default
   * @param options.headers - url fetch request headers
   * @param options.tilingScheme - Cesium tilingScheme, default WebMercatorTilingScheme(EPSG: 3857)
   */
  constructor(options: MVTImageryProviderOptions) {
    this.options = options;

    this.mapboxRenderer = new BasicRenderer({
      style: options.style,
      canvas: baseCanv,
      transformRequest: (url: string) => this.transformRequest(url),
    });

    if (options.showCanvas) {
      this.mapboxRenderer.showCanvasForDebug();
    }

    this.ready = false;
    this.readyPromise = this.mapboxRenderer._style.loadedPromise.then(() => {
      this.ready = true;
    });

    this.tilingScheme = options.tilingScheme ?? new Cesium.WebMercatorTilingScheme();;
    this.rectangle = this.tilingScheme.rectangle;
    this.tileSize = this.tileWidth = this.tileHeight = options.tileSize || 512;
    this.maximumLevel = options.maximumLevel || Number.MAX_SAFE_INTEGER;
    this.minimumLevel = options.minimumLevel || 0;
    this.tileDiscardPolicy = undefined;
    //this.errorEvent = new Cesium.Event();
    this.credit = new Cesium.Credit(options.credit || "", false);
    this.proxy = new Cesium.DefaultProxy("");
    this.hasAlphaChannel = options.hasAlphaChannel ?? true;
    this.sourceFilter = options.sourceFilter;
  }

  transformRequest = (url: string) => {
    if (this.options.headers) {
      return {
        url,
        headers: this.options.headers
      }
    }
    return {
      url
    };
  }

  getTileCredits(x, y, level) {
    return [];
  }

  createTile() {
    const canv = document.createElement("canvas");
    canv.width = this.tileSize;
    canv.height = this.tileSize;
    canv.style.imageRendering = "pixelated";
    const ctx = canv.getContext("2d");
    if (ctx) {
      ctx.globalCompositeOperation = "copy";
    }
    return canv;
  }

  async canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement> {
    const img = new Image();
    return new Promise((resolve) => {
      img.onload = function () {
        resolve(img);
      };
      img.crossOrigin = "";
      img.src = canvas.toDataURL("image/png");
    });
  }

  requestImage(
    x: any,
    y: any,
    zoom: number,
    releaseTile = true
  ): Promise<HTMLImageElement | HTMLCanvasElement | any> | undefined {
    if (zoom > this.maximumLevel || zoom < this.minimumLevel) {
      return Promise.reject(undefined);
    }

    this.mapboxRenderer.filterForZoom(zoom);
    const tilesSpec: { source: string; z: number; x: any; y: any; left: number; top: number; size: number; }[] = [];
    this.mapboxRenderer.getVisibleSources(zoom).forEach((s: any) => {
      tilesSpec.push({
        source: s,
        z: zoom,
        x: x,
        y: y,
        left: 0,
        top: 0,
        size: this.tileSize,
      });
    });

    return new Promise((resolve, reject) => {
      const canv = this.createTile();
      const renderRef = this.mapboxRenderer.renderTiles(
        canv.getContext("2d"),
        {
          srcLeft: 0,
          srcTop: 0,
          width: this.tileSize,
          height: this.tileSize,
          destLeft: 0,
          destTop: 0,
        },
        tilesSpec,
        async (err: any) => {
          if (!!err) {
            switch (err) {
              case "canceled":
              case "fully-canceled":
                reject(undefined);
                break;
              default:
                reject(undefined);
            }
          } else {
            if (releaseTile) {
              renderRef.consumer.ctx = null;
              const img = await this.canvasToImage(canv);
              resolve(img);
              // releaseTile默认为true，对应Cesium请求图像的情形
              this.mapboxRenderer.releaseRender(renderRef);
            } else {
              // releaseTile为false时在由pickFeature手动调用，在渲染完成之后在pickFeature里边手动释放tile
              resolve(renderRef);
            }
          }
        }
      );
    });
  }

  pickFeatures(x: any, y: any, zoom: number, longitude: any, latitude: any) {
    return this.requestImage(x, y, zoom, false)?.then((renderRef) => {
      let targetSources = this.mapboxRenderer.getVisibleSources(zoom);
      targetSources = this.sourceFilter
        ? this.sourceFilter(targetSources)
        : targetSources;

      const queryResult: any[] | PromiseLike<any[]> = [];

      const lng = Cesium.Math.toDegrees(longitude);
      const lat = Cesium.Math.toDegrees(latitude);

      targetSources.forEach((s: any) => {
        queryResult.push({
          data: this.mapboxRenderer.queryRenderedFeatures({
            source: s,
            renderedZoom: zoom,
            lng,
            lat,
            tileZ: zoom,
          }),
        });
      });

      // release tile
      renderRef.consumer.ctx = undefined;
      this.mapboxRenderer.releaseRender(renderRef);
      return queryResult;
    });
  }
}

export default MVTImageryProvider;
