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
declare type MVTImageryProviderOptions = {
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
};
declare class MVTImageryProvider {
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
    options: MVTImageryProviderOptions;
    /**
     * create a MVTImageryProvider Object
     * @param options MVTImageryProvider options
     * @param options.style - mapbox style object
     * @param options.sourceFilter - sourceFilter is used to filter which source participate in pickFeature process.
     * @param options.maximumLevel - if cesium zoom level exceeds maximumLevel, layer will be invisible.
     * @param options.minimumLevel - if cesium zoom level belows minimumLevel, layer will be invisible.
     * @param options.tileSize - can be 256 or 512. 256 default
     * @param options.headers - url fetch request headers
     * @param options.tilingScheme - Cesium tilingScheme, default WebMercatorTilingScheme(EPSG: 3857)
     */
    constructor(options: MVTImageryProviderOptions);
    transformRequest: (url: string) => {
        url: string;
        headers: HeadersInit;
    } | {
        url: string;
        headers?: undefined;
    };
    createTile(): HTMLCanvasElement;
    canvasToImage(canvas: HTMLCanvasElement): Promise<HTMLImageElement>;
    requestImage(x: any, y: any, zoom: number, releaseTile?: boolean): Promise<HTMLImageElement | HTMLCanvasElement | any> | undefined;
    pickFeatures(x: any, y: any, zoom: number, longitude: any, latitude: any): Promise<any[]>;
}
export default MVTImageryProvider;
