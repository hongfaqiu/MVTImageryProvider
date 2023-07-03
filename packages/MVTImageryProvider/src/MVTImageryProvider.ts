
import { Credit, Event, WebMercatorTilingScheme, DefaultProxy, GeographicTilingScheme, Math as CMath, Resource, ImageryLayerFeatureInfo, defined, } from "cesium";
import { Coords, MVTImageryProviderOptions, StyleSpecification } from "./typing";
import * as mapbox from 'mvt-basic-render';

// 创建一个全局变量作为pbfBasicRender渲染模板，避免出现16个canvas上下文的浏览器限制，以便Cesium ImageLayer.destory()正常工作。
// https://github.com/mapbox/mapbox-gl-js/issues/7332
const baseCanv = document.createElement('canvas');
class MVTImageryProvider {
  mapboxRenderer: any;
  ready: boolean;
  readyPromise: Promise<boolean>;
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
  private _error: Event
  private _style: StyleSpecification | undefined;
  private _accessToken: string | undefined;
  private _enablePickFeatures: boolean | undefined;
  /**
   * create a MVTImageryProvider Object
   * @param {MVTImageryProviderOptions} options MVTImageryProvider options as follow:
   * @param {Resource | string | StyleSpecification} options.style - mapbox style object or url Resource.
   * @param {string} options.accessToken - mapbox style accessToken.
   * @param {RequestTransformFunction} options.transformRequest - use transformRequest to modify tile requests.
   * @param {Number} [options.tileSize = 256] - can be 256 or 512. defaults to 256.
   * @param {Number} [options.maximumLevel = 18] - if cesium zoom level exceeds maximumLevel, layer will be invisible, defaults to 18.
   * @param {Number} [options.minimumLevel = 0] - if cesium zoom level belows minimumLevel, layer will be invisible, defaults to 0.
   * @param {Boolean} [options.showCanvas = false] - if show canvas for debug.
   * @param {Boolean} [options.enablePickFeatures = true] - enable pickFeatures or not, defaults to true.
   * @param {Function} options.sourceFilter - sourceFilter is used to filter which source participate in pickFeature process.
   * @param {WebMercatorTilingScheme | GeographicTilingScheme} [options.tilingScheme = WebMercatorTilingScheme] - Cesium tilingScheme, defaults to WebMercatorTilingScheme(EPSG: 3857).
   * @param {Credit} options.credit - A credit contains data pertaining to how to display attributions/credits for certain content on the screen.
   * @example
   * const imageryProvider = new MVTImageryProvider({
        style: 'https://demotiles.maplibre.org/style.json'
      });
   */
  constructor(options: MVTImageryProviderOptions & {
    /**
     * Deprecated
     * 
     * You can use fromUrl instead
     * @example 
     * const provider = await MVTImageryProvider.fromUrl(url)
     */
    style: string | Resource | StyleSpecification;
  }) {

    this.ready = false;
    this.tilingScheme = options.tilingScheme ?? new WebMercatorTilingScheme();;
    this.rectangle = this.tilingScheme.rectangle;
    this.tileSize = this.tileWidth = this.tileHeight = options.tileSize || 256;
    this.maximumLevel = options.maximumLevel ?? 18;
    this.minimumLevel = options.minimumLevel ?? 0;
    this.tileDiscardPolicy = undefined;
    this._error = new Event();
    this.credit = new Credit(options.credit || "", false);
    this.proxy = new DefaultProxy("");
    this.hasAlphaChannel = options.hasAlphaChannel ?? true;
    this.sourceFilter = options.sourceFilter;
    this._accessToken = options.accessToken;
    this._enablePickFeatures = options.enablePickFeatures ?? true

    if (defined(options.style)) {
      this.readyPromise = this._build(options.style, options).then(() => {
        return true;
      })
    }
  }

  /**
   * get mapbox style json obj
   */
  get style() {
    return this._style
  }

  get isDestroyed() {
    return this._destroyed
  }

  /**
   * Gets an event that will be raised if an error is encountered during processing.
   * @memberof GeoJsonDataSource.prototype
   * @type {Event}
   */
  get errorEvent() {
    return this._error
  }

  private async _build(url: Resource | string | StyleSpecification, options: MVTImageryProviderOptions = {}) {
    const style = await this._preLoad(url);

    this._style = style
    this.mapboxRenderer = new mapbox.BasicRenderer({
      style,
      canvas: baseCanv,
      token: options.accessToken,
      transformRequest: options.transformRequest
    })

    if (options.showCanvas) {
      this.mapboxRenderer.showCanvasForDebug();
    }
    await this.mapboxRenderer._style.loadedPromise;
    this.readyPromise = Promise.resolve(true);
    this.ready = true;
  }

  static async fromUrl(url: Resource | string | StyleSpecification, options: MVTImageryProviderOptions = {}) {
    const provider = new MVTImageryProvider(options as any);
    await provider._build(url, options)

    return provider;
  }

  private _preLoad(data: string | Resource | StyleSpecification): Promise<StyleSpecification> {
    let promise: any = data
    if (typeof data === 'string') {
      data = new Resource({
        url: data,
        queryParameters: {
          access_token: this._accessToken
        }
      })
    }
    if (data instanceof Resource) {
      const prefix = "https://api.mapbox.com/";
      if (data.url.startsWith("mapbox://"))
        data.url = data.url.replace("mapbox://", prefix);
      if (this._accessToken)
        data.appendQueryParameters({
          access_token: this._accessToken
        })
      promise = data.fetchJson()
    }
    return Promise.resolve(promise)
      .catch(error => {
        this._error.raiseEvent(error);
        throw error;
      });
  }

  private _createTile() {
    const canv = document.createElement("canvas");
    canv.width = this.tileSize;
    canv.height = this.tileSize;
    canv.style.imageRendering = "pixelated";
    return canv;
  }

  /**
   * reset tile cache
   */
  private _resetTileCache() {
    Object.values(this.mapboxRenderer._style.sourceCaches).forEach((cache: any) => cache._tileCache.reset());
  }

  private _getTilesSpec(coord: Coords, source: string) {
    const { x, y, level } = coord
    const TILE_SIZE = this.tileSize
    // 3x3 grid of source tiles, where the region of interest is that corresponding to the central source tile
    const ret = []
    // cesium tile request's coords preview: https://s1.ax1x.com/2022/08/02/vEmnzt.jpg
    const maxX = this.tilingScheme.getNumberOfXTilesAtLevel(level) - 1
    const maxY = this.tilingScheme.getNumberOfYTilesAtLevel(level) - 1
    for (let xx = -1; xx <= 1; xx++) {
      let newx = x + xx
      if (newx < 0) newx = maxX
      if (newx > maxX) newx = 0
      for (let yy = -1; yy <= 1; yy++) {
        let newy = y + yy
        if (newy < 0 || newy > maxY) continue
        ret.push({
          source,
          z: level,
          x: newx,
          y: newy,
          left: 0 + xx * TILE_SIZE,
          top: 0 + yy * TILE_SIZE,
          size: TILE_SIZE
        });
      }
    }
    return ret;
  }

  requestImage(
    x: number,
    y: number,
    level: number,
    releaseTile = true
  ): Promise<HTMLImageElement | HTMLCanvasElement | any> | undefined {
    if (level < this.minimumLevel || level > this.maximumLevel) return undefined

    this.mapboxRenderer.filterForZoom(level);
    const tilesSpec = this.mapboxRenderer
      .getVisibleSources(level)
      .reduce((a: any[], s: string) => a.concat(this._getTilesSpec({ x, y, level }, s)), [])

    return new Promise((resolve, reject) => {
      const canv = this._createTile()
      const ctx = canv.getContext("2d")
      if (ctx) ctx.globalCompositeOperation = 'copy'
      const renderRef = this.mapboxRenderer.renderTiles(
        ctx,
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
          /**
           * In case of err ends with 'tiles not available', the canvas will still be painted.
           * relate url: https://github.com/landtechnologies/Mapbox-vector-tiles-basic-js-renderer/blob/master/src/basic/renderer.js#L341-L405
           */
          if (typeof err === 'string' && !err.endsWith('tiles not available')) {
            reject(undefined);
          } else if (releaseTile) {
            renderRef.consumer.ctx = null;
            resolve(canv);
            // releaseTile默认为true，对应Cesium请求图像的情形
            this.mapboxRenderer.releaseRender(renderRef);
            this._resetTileCache();
          } else {
            // releaseTile为false时在由pickFeature手动调用，在渲染完成之后在pickFeature里边手动释放tile
            resolve(renderRef);
          }
        }
      );
    });
  }

  pickFeatures(x: number, y: number, zoom: number, longitude: number, latitude: number) {
    if (!this._enablePickFeatures) return undefined

    return this.requestImage(x, y, zoom, false)?.then((renderRef) => {
      let targetSources = this.mapboxRenderer.getVisibleSources(zoom);
      targetSources = this.sourceFilter
        ? this.sourceFilter(targetSources)
        : targetSources;

      const queryResult: ImageryLayerFeatureInfo[] = [];

      const lng = CMath.toDegrees(longitude);
      const lat = CMath.toDegrees(latitude);

      targetSources.forEach((s: any) => {
        const featureInfo = new ImageryLayerFeatureInfo()
        featureInfo.data = this.mapboxRenderer.queryRenderedFeatures({
          source: s,
          renderedZoom: zoom,
          lng,
          lat,
          tileZ: zoom,
        })
        const name = Object.keys(featureInfo.data)[0]
        featureInfo.name = name
        const properties: Record<string, any>[] = featureInfo.data[name]
        if (properties) {
          featureInfo.configureDescriptionFromProperties(properties?.length === 1 ? properties[0] : properties)
          queryResult.push(featureInfo);
        }
      });

      // release tile
      renderRef.consumer.ctx = undefined;
      this.mapboxRenderer.releaseRender(renderRef);
      this._resetTileCache();
      return queryResult.length ? queryResult : undefined;
    });
  }

  destroy() {
    this.mapboxRenderer._cancelAllPendingRenders();
    this._resetTileCache();
    this._destroyed = true;
  }
}

export default MVTImageryProvider;