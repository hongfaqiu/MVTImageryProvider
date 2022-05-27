
import { Credit, WebMercatorTilingScheme, DefaultProxy, GeographicTilingScheme, ImageryLayer, Math as CMath, Cartographic,  } from "cesium";
const mapbox = require('./mapbox-gl');

type MVTImageryProviderOptions = {
  style: any;
  showCanvas?: boolean;
  tileSize?: number;
  tileWidth?: number;
  tileHeight?: number;
  maximumLevel?: number;
  minimumLevel?: number;
  tileDiscardPolicy?: undefined;
  credit?: string;
  hasAlphaChannel?: boolean;
  sourceFilter?: any;
  headers?: HeadersInit;
  tilingScheme?: WebMercatorTilingScheme | GeographicTilingScheme;
}

// 创建一个全局变量作为pbfBasicRenderer渲染模板，避免出现16个canvas上下文的浏览器限制，以便Cesium ImageLayer.destory()正常工作。
// https://github.com/mapbox/mapbox-gl-js/issues/7332
const OFFSCREEN_CANV_SIZE = 1024;
const baseCanv = document.createElement('canvas');
baseCanv.style.imageRendering = 'pixelated';
baseCanv.addEventListener('webglcontextlost', () => console.log("webglcontextlost"), false);
baseCanv.width = OFFSCREEN_CANV_SIZE;
baseCanv.height = OFFSCREEN_CANV_SIZE;
class MVTImageryProvider {
  mapboxRenderer: any;
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
  private _destroyed = false;

  /**
   * create a MVTImageryProvider Object
   * @param {MVTImageryProviderOptions} options MVTImageryProvider options
   * @param {Object} options.style - mapbox style object
   * @param {Function} options.sourceFilter - sourceFilter is used to filter which source participate in pickFeature process.
   * @param {Number} options.maximumLevel - if cesium zoom level exceeds maximumLevel, layer will be invisible.
   * @param {Number} options.minimumLevel - if cesium zoom level belows minimumLevel, layer will be invisible.
   * @param {Number} options.tileSize - can be 256 or 512. 512 default
   * @param {WebMercatorTilingScheme | GeographicTilingScheme} options.tilingScheme - Cesium tilingScheme, default WebMercatorTilingScheme(EPSG: 3857)
   * @example
   * const imageryProvider = new MVTImageryProvider({
        style: {
          version: 8,
          sources: {
            layer1: {
              type: "vector",
              tiles: ['https://api.mapbox.com/v4/mapbox.82pkq93d/{z}/{x}/{y}.vector.pbf?sku=1012RMlsjWj1O&access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg'],
            },
          },
          layers: [
            {
              id: "background",
              type: "background",
              paint: {
                "background-color": "transparent",
              },
            },
            {
              id: "polygon",
              source: "layer1",
              "source-layer": "original",
              type: "fill",
              paint: {
                "fill-color": "#00ffff",
                'fill-outline-color': 'rgba(0,0,0,0.1)',
              }
            }
          ],
        },
      }
      });
   */
  constructor(options: MVTImageryProviderOptions) {

    this.mapboxRenderer = new mapbox.BasicRenderer({
      style: options.style,
    });

    this.mapboxRenderer._canvas = baseCanv;
    this.mapboxRenderer._canvas.addEventListener('webglcontextrestored', () => this.mapboxRenderer._createGlContext(), false);
    this.mapboxRenderer._createGlContext();

    if (options.showCanvas) {
      this.mapboxRenderer.showCanvasForDebug();
    }

    this.ready = false;
    this.readyPromise = this.mapboxRenderer._style.loadedPromise.then(() => {
      this.ready = true;
    });

    this.tilingScheme = options.tilingScheme ?? new WebMercatorTilingScheme();;
    this.rectangle = this.tilingScheme.rectangle;
    this.tileSize = this.tileWidth = this.tileHeight = options.tileSize || 512;
    this.maximumLevel = options.maximumLevel ?? 18;
    this.minimumLevel = options.minimumLevel ?? 0;
    this.tileDiscardPolicy = undefined;
    //this.errorEvent = new Event();
    this.credit = new Credit(options.credit || "", false);
    this.proxy = new DefaultProxy("");
    this.hasAlphaChannel = options.hasAlphaChannel ?? true;
    this.sourceFilter = options.sourceFilter;
  }

  get isDestroyed() {
    return this._destroyed
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

  /**
   * reset tile cache
   */
  private _resetTileCache() {
    Object.values(this.mapboxRenderer._style.sourceCaches).forEach((cache: any) => cache._tileCache.reset());
  }

  requestImage(
    x: number,
    y: number,
    zoom: number,
    releaseTile = true
  ): Promise<HTMLImageElement | HTMLCanvasElement | any> | undefined {
    if (zoom > this.maximumLevel || zoom < this.minimumLevel) {
      return Promise.reject(undefined);
    }

    this.mapboxRenderer.filterForZoom(zoom);
    const tilesSpec: { source: string; z: number; x: number; y: number; left: number; top: number; size: number; }[] = [];
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
              this._resetTileCache();
            } else {
              // releaseTile为false时在由pickFeature手动调用，在渲染完成之后在pickFeature里边手动释放tile
              resolve(renderRef);
            }
          }
        }
      );
    });
  }

  pickFeatures(x: number, y: number, zoom: number, longitude: number, latitude: number){
    return this.requestImage(x, y, zoom, false)?.then((renderRef) => {
      let targetSources = this.mapboxRenderer.getVisibleSources(zoom);
      targetSources = this.sourceFilter
        ? this.sourceFilter(targetSources)
        : targetSources;

      const queryResult: {
        data: Object;
        iamgeryLayer?: ImageryLayer | undefined;
        position?: Cartographic | undefined;
      }[] = [];

      const lng = CMath.toDegrees(longitude);
      const lat = CMath.toDegrees(latitude);

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
      this._resetTileCache();
      return queryResult;
    });
  }
  
  destroy() {
    this.mapboxRenderer._cancelAllPendingRenders();
    this._resetTileCache();
    this.mapboxRenderer._gl.getExtension('WEBGL_lose_context').loseContext();
    this._destroyed = true;
  }
}

export default MVTImageryProvider;
