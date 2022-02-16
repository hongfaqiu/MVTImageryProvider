
import * as Cesium from "cesium/Cesium";
import { BasicRenderer } from "pbf-basic-render";

import type { Credit, WebMercatorTilingScheme, DefaultProxy, GeographicTilingScheme } from "cesium";

/**
 *
 * @param {Object} options
 * @param {Object} options.style - mapbox style object
 * @param {Function} [options.sourceFilter] - sourceFilter is used to filter which source participate in pickFeature process.
 * @param {Number} [options.maximumLevel] - if cesium zoom level exceeds maximumLevel, layer will be invisible.
 * @param {Number} [options.minimumLevel] - if cesium zoom level belows minimumLevel, layer will be invisible.
 * @param {Number} [options.tileSize] - can be 256 or 512.
 * @param {Boolean} [options.hasAlphaChannel] -
 * @param {String} [options.credit] -
 *
 */
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
  header?: any;
  tilingScheme?: WebMercatorTilingScheme | GeographicTilingScheme;
}

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
  proxy: DefaultProxy;
  hasAlphaChannel: boolean;
  sourceFilter: any;
  tilingScheme: WebMercatorTilingScheme | GeographicTilingScheme;
  options: MVTImageryProviderOptions;

  constructor(options: MVTImageryProviderOptions) {
    this.options = options;

    this.mapboxRenderer = new BasicRenderer({
      style: options.style,
      transformRequest: (url: string, type: any) => this.transformRequest(url, type),
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
    this.proxy = new Cesium.DefaultProxy("");
    this.hasAlphaChannel = options.hasAlphaChannel ?? true;
    this.sourceFilter = options.sourceFilter;
    this.options = options;
  }

  transformRequest = (url: string, resourceType: string) => {
    if (resourceType === 'Source' && this.options.header) {
      return {
        url,
        headers: this.options.header
      }
    }
    return {
      url
    };
  }

  // @ts-ignore
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
        (err: any) => {
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
              renderRef.consumer.ctx = undefined;
              resolve(canv);
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
