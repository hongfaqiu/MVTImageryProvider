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
declare type MVTImageryProviderOptions = {
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
};
declare class MVTImageryProvider {
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
    constructor(options: MVTImageryProviderOptions);
    transformRequest: (url: string, resourceType: string) => {
        url: string;
        headers: any;
    } | {
        url: string;
        headers?: undefined;
    };
    getTileCredits(x: any, y: any, level: any): any[];
    createTile(): HTMLCanvasElement;
    requestImage(x: any, y: any, zoom: number, releaseTile?: boolean): Promise<HTMLImageElement | HTMLCanvasElement | any> | undefined;
    pickFeatures(x: any, y: any, zoom: number, longitude: any, latitude: any): Promise<any[]>;
}
export default MVTImageryProvider;
