import { GeographicTilingScheme, Resource, WebMercatorTilingScheme } from "cesium";

export declare type MVTImageryProviderOptions = {
  style: string | Resource | StyleSpecification;
  /** accessToken needed if mapbox style not public */
  accessToken?: string;
  /** forceHTTPS defaults false */
  /**
   * A `RequestParameters` object to be returned from Map.options.transformRequest callbacks.
   * @return {Object} RequestParameters
   * @property {string} url The URL to be requested.
   * @property {Object} headers The headers to be sent with the request.
   * @property {string} method Request method `'GET' | 'POST' | 'PUT'`.
   * @property {string} body Request body.
   * @property {string} type Response body type to be returned `'string' | 'json' | 'arrayBuffer'`.
   * @property {string} credentials `'same-origin'|'include'` Use 'include' to send cookies with cross-origin requests.
   * @property {boolean} collectResourceTiming If true, Resource Timing API information will be collected for these transformed requests and returned in a resourceTiming property of relevant data events.
   * @example
   * // use transformRequest to modify requests that begin with `http://myHost`
   * transformRequest: function(url, resourceType) {
   *  if (resourceType === 'Source' && url.indexOf('http://myHost') > -1) {
   *    return {
   *      url: url.replace('http', 'https'),
   *      headers: { 'my-custom-header': true },
   *      credentials: 'include'  // Include cookies for cross-origin requests
   *    }
   *   }
   *  }
   */
  transformRequest?: RequestTransformFunction;
  showCanvas?: boolean;
  tileSize?: number;
  maximumLevel?: number;
  minimumLevel?: number;
  credit?: string;
  hasAlphaChannel?: boolean;
  sourceFilter?: any;
  tilingScheme?: WebMercatorTilingScheme | GeographicTilingScheme;
}

export declare type ColorSpecification = string;
export declare type FormattedSpecification = string;
export declare type ResolvedImageSpecification = string;
export declare type PromoteIdSpecification = {
	[_: string]: string;
} | string;
export declare type FilterSpecificationInputType = string | number | boolean;
export declare type FilterSpecification = [
	"at",
	number,
	(number | string)[]
] | [
	"get",
	string,
	Record<string, unknown>?
] | [
	"has",
	string,
	Record<string, unknown>?
] | [
	"in",
	...FilterSpecificationInputType[],
	FilterSpecificationInputType | FilterSpecificationInputType[]
] | [
	"index-of",
	FilterSpecificationInputType,
	FilterSpecificationInputType | FilterSpecificationInputType[]
] | [
	"length",
	string | string[]
] | [
	"slice",
	string | string[],
	number
] | [
	"!",
	FilterSpecification
] | [
	"!=",
	string | FilterSpecification,
	FilterSpecificationInputType
] | [
	"<",
	string | FilterSpecification,
	FilterSpecificationInputType
] | [
	"<=",
	string | FilterSpecification,
	FilterSpecificationInputType
] | [
	"==",
	string | FilterSpecification,
	FilterSpecificationInputType
] | [
	">",
	string | FilterSpecification,
	FilterSpecificationInputType
] | [
	">=",
	string | FilterSpecification,
	FilterSpecificationInputType
] | [
	"all",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"any",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"case",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"coalesce",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"match",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"within",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"!in",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"!has",
	...FilterSpecification[],
	FilterSpecificationInputType
] | [
	"none",
	...FilterSpecification[],
	FilterSpecificationInputType
] | Array<string | FilterSpecification>;
export declare type TransitionSpecification = {
	duration?: number;
	delay?: number;
};
export declare type CameraFunctionSpecification<T> = {
	type: "exponential";
	stops: Array<[
		number,
		T
	]>;
} | {
	type: "interval";
	stops: Array<[
		number,
		T
	]>;
};
export declare type SourceFunctionSpecification<T> = {
	type: "exponential";
	stops: Array<[
		number,
		T
	]>;
	property: string;
	default?: T;
} | {
	type: "interval";
	stops: Array<[
		number,
		T
	]>;
	property: string;
	default?: T;
} | {
	type: "categorical";
	stops: Array<[
		string | number | boolean,
		T
	]>;
	property: string;
	default?: T;
} | {
	type: "identity";
	property: string;
	default?: T;
};
export declare type CompositeFunctionSpecification<T> = {
	type: "exponential";
	stops: Array<[
		{
			zoom: number;
			value: number;
		},
		T
	]>;
	property: string;
	default?: T;
} | {
	type: "interval";
	stops: Array<[
		{
			zoom: number;
			value: number;
		},
		T
	]>;
	property: string;
	default?: T;
} | {
	type: "categorical";
	stops: Array<[
		{
			zoom: number;
			value: string | number | boolean;
		},
		T
	]>;
	property: string;
	default?: T;
};
export declare type ExpressionSpecificationArray = Array<unknown>;
export declare type PropertyValueSpecification<T> = T | CameraFunctionSpecification<T> | ExpressionSpecificationArray;
export declare type DataDrivenPropertyValueSpecification<T> = T | CameraFunctionSpecification<T> | SourceFunctionSpecification<T> | CompositeFunctionSpecification<T> | ExpressionSpecificationArray;
export declare type StyleSpecification = {
	"version": 8;
	"name"?: string;
	"metadata"?: unknown;
	"center"?: Array<number>;
	"zoom"?: number;
	"bearing"?: number;
	"pitch"?: number;
	"light"?: LightSpecification;
	"sources": {
		[_: string]: SourceSpecification;
	};
	"sprite"?: string;
	"glyphs"?: string;
	"transition"?: TransitionSpecification;
	"layers": Array<LayerSpecification>;
};
export declare type LightSpecification = {
	"anchor"?: PropertyValueSpecification<"map" | "viewport">;
	"position"?: PropertyValueSpecification<[
		number,
		number,
		number
	]>;
	"color"?: PropertyValueSpecification<ColorSpecification>;
	"intensity"?: PropertyValueSpecification<number>;
};
export declare type VectorSourceSpecification = {
	"type": "vector";
	"url"?: string;
	"tiles"?: Array<string>;
	"bounds"?: [
		number,
		number,
		number,
		number
	];
	"scheme"?: "xyz" | "tms";
	"minzoom"?: number;
	"maxzoom"?: number;
	"attribution"?: string;
	"promoteId"?: PromoteIdSpecification;
	"volatile"?: boolean;
};
export declare type RasterSourceSpecification = {
	"type": "raster";
	"url"?: string;
	"tiles"?: Array<string>;
	"bounds"?: [
		number,
		number,
		number,
		number
	];
	"minzoom"?: number;
	"maxzoom"?: number;
	"tileSize"?: number;
	"scheme"?: "xyz" | "tms";
	"attribution"?: string;
	"volatile"?: boolean;
};
export declare type RasterDEMSourceSpecification = {
	"type": "raster-dem";
	"url"?: string;
	"tiles"?: Array<string>;
	"bounds"?: [
		number,
		number,
		number,
		number
	];
	"minzoom"?: number;
	"maxzoom"?: number;
	"tileSize"?: number;
	"attribution"?: string;
	"encoding"?: "terrarium" | "mapbox";
	"volatile"?: boolean;
};
export declare type GeoJSONSourceSpecification = {
	"type": "geojson";
	"data"?: unknown;
	"maxzoom"?: number;
	"attribution"?: string;
	"buffer"?: number;
	"filter"?: unknown;
	"tolerance"?: number;
	"cluster"?: boolean;
	"clusterRadius"?: number;
	"clusterMaxZoom"?: number;
	"clusterMinPoints"?: number;
	"clusterProperties"?: unknown;
	"lineMetrics"?: boolean;
	"generateId"?: boolean;
	"promoteId"?: PromoteIdSpecification;
};
export declare type VideoSourceSpecification = {
	"type": "video";
	"urls": Array<string>;
	"coordinates": [
		[
			number,
			number
		],
		[
			number,
			number
		],
		[
			number,
			number
		],
		[
			number,
			number
		]
	];
};
export declare type ImageSourceSpecification = {
	"type": "image";
	"url": string;
	"coordinates": [
		[
			number,
			number
		],
		[
			number,
			number
		],
		[
			number,
			number
		],
		[
			number,
			number
		]
	];
};
export declare type SourceSpecification = VectorSourceSpecification | RasterSourceSpecification | RasterDEMSourceSpecification | GeoJSONSourceSpecification | VideoSourceSpecification | ImageSourceSpecification;
export declare type FillLayerSpecification = {
	"id": string;
	"type": "fill";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"fill-sort-key"?: DataDrivenPropertyValueSpecification<number>;
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"fill-antialias"?: PropertyValueSpecification<boolean>;
		"fill-opacity"?: DataDrivenPropertyValueSpecification<number>;
		"fill-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"fill-outline-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"fill-translate"?: PropertyValueSpecification<[
			number,
			number
		]>;
		"fill-translate-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"fill-pattern"?: DataDrivenPropertyValueSpecification<ResolvedImageSpecification>;
	};
};
export declare type LineLayerSpecification = {
	"id": string;
	"type": "line";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"line-cap"?: PropertyValueSpecification<"butt" | "round" | "square">;
		"line-join"?: DataDrivenPropertyValueSpecification<"bevel" | "round" | "miter">;
		"line-miter-limit"?: PropertyValueSpecification<number>;
		"line-round-limit"?: PropertyValueSpecification<number>;
		"line-sort-key"?: DataDrivenPropertyValueSpecification<number>;
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"line-opacity"?: DataDrivenPropertyValueSpecification<number>;
		"line-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"line-translate"?: PropertyValueSpecification<[
			number,
			number
		]>;
		"line-translate-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"line-width"?: DataDrivenPropertyValueSpecification<number>;
		"line-gap-width"?: DataDrivenPropertyValueSpecification<number>;
		"line-offset"?: DataDrivenPropertyValueSpecification<number>;
		"line-blur"?: DataDrivenPropertyValueSpecification<number>;
		"line-dasharray"?: PropertyValueSpecification<Array<number>>;
		"line-pattern"?: DataDrivenPropertyValueSpecification<ResolvedImageSpecification>;
		"line-gradient"?: ExpressionSpecificationArray;
	};
};
export declare type SymbolLayerSpecification = {
	"id": string;
	"type": "symbol";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"symbol-placement"?: PropertyValueSpecification<"point" | "line" | "line-center">;
		"symbol-spacing"?: PropertyValueSpecification<number>;
		"symbol-avoid-edges"?: PropertyValueSpecification<boolean>;
		"symbol-sort-key"?: DataDrivenPropertyValueSpecification<number>;
		"symbol-z-order"?: PropertyValueSpecification<"auto" | "viewport-y" | "source">;
		"icon-allow-overlap"?: PropertyValueSpecification<boolean>;
		"icon-overlap"?: PropertyValueSpecification<"never" | "always" | "cooperative">;
		"icon-ignore-placement"?: PropertyValueSpecification<boolean>;
		"icon-optional"?: PropertyValueSpecification<boolean>;
		"icon-rotation-alignment"?: PropertyValueSpecification<"map" | "viewport" | "auto">;
		"icon-size"?: DataDrivenPropertyValueSpecification<number>;
		"icon-text-fit"?: PropertyValueSpecification<"none" | "width" | "height" | "both">;
		"icon-text-fit-padding"?: PropertyValueSpecification<[
			number,
			number,
			number,
			number
		]>;
		"icon-image"?: DataDrivenPropertyValueSpecification<ResolvedImageSpecification>;
		"icon-rotate"?: DataDrivenPropertyValueSpecification<number>;
		"icon-padding"?: PropertyValueSpecification<number>;
		"icon-keep-upright"?: PropertyValueSpecification<boolean>;
		"icon-offset"?: DataDrivenPropertyValueSpecification<[
			number,
			number
		]>;
		"icon-anchor"?: DataDrivenPropertyValueSpecification<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
		"icon-pitch-alignment"?: PropertyValueSpecification<"map" | "viewport" | "auto">;
		"text-pitch-alignment"?: PropertyValueSpecification<"map" | "viewport" | "auto">;
		"text-rotation-alignment"?: PropertyValueSpecification<"map" | "viewport" | "auto">;
		"text-field"?: DataDrivenPropertyValueSpecification<FormattedSpecification>;
		"text-font"?: DataDrivenPropertyValueSpecification<Array<string>>;
		"text-size"?: DataDrivenPropertyValueSpecification<number>;
		"text-max-width"?: DataDrivenPropertyValueSpecification<number>;
		"text-line-height"?: PropertyValueSpecification<number>;
		"text-letter-spacing"?: DataDrivenPropertyValueSpecification<number>;
		"text-justify"?: DataDrivenPropertyValueSpecification<"auto" | "left" | "center" | "right">;
		"text-radial-offset"?: DataDrivenPropertyValueSpecification<number>;
		"text-variable-anchor"?: PropertyValueSpecification<Array<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">>;
		"text-anchor"?: DataDrivenPropertyValueSpecification<"center" | "left" | "right" | "top" | "bottom" | "top-left" | "top-right" | "bottom-left" | "bottom-right">;
		"text-max-angle"?: PropertyValueSpecification<number>;
		"text-writing-mode"?: PropertyValueSpecification<Array<"horizontal" | "vertical">>;
		"text-rotate"?: DataDrivenPropertyValueSpecification<number>;
		"text-padding"?: PropertyValueSpecification<number>;
		"text-keep-upright"?: PropertyValueSpecification<boolean>;
		"text-transform"?: DataDrivenPropertyValueSpecification<"none" | "uppercase" | "lowercase">;
		"text-offset"?: DataDrivenPropertyValueSpecification<[
			number,
			number
		]>;
		"text-allow-overlap"?: PropertyValueSpecification<boolean>;
		"text-overlap"?: PropertyValueSpecification<"never" | "always" | "cooperative">;
		"text-ignore-placement"?: PropertyValueSpecification<boolean>;
		"text-optional"?: PropertyValueSpecification<boolean>;
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"icon-opacity"?: DataDrivenPropertyValueSpecification<number>;
		"icon-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"icon-halo-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"icon-halo-width"?: DataDrivenPropertyValueSpecification<number>;
		"icon-halo-blur"?: DataDrivenPropertyValueSpecification<number>;
		"icon-translate"?: PropertyValueSpecification<[
			number,
			number
		]>;
		"icon-translate-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"text-opacity"?: DataDrivenPropertyValueSpecification<number>;
		"text-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"text-halo-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"text-halo-width"?: DataDrivenPropertyValueSpecification<number>;
		"text-halo-blur"?: DataDrivenPropertyValueSpecification<number>;
		"text-translate"?: PropertyValueSpecification<[
			number,
			number
		]>;
		"text-translate-anchor"?: PropertyValueSpecification<"map" | "viewport">;
	};
};
export declare type CircleLayerSpecification = {
	"id": string;
	"type": "circle";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"circle-sort-key"?: DataDrivenPropertyValueSpecification<number>;
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"circle-radius"?: DataDrivenPropertyValueSpecification<number>;
		"circle-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"circle-blur"?: DataDrivenPropertyValueSpecification<number>;
		"circle-opacity"?: DataDrivenPropertyValueSpecification<number>;
		"circle-translate"?: PropertyValueSpecification<[
			number,
			number
		]>;
		"circle-translate-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"circle-pitch-scale"?: PropertyValueSpecification<"map" | "viewport">;
		"circle-pitch-alignment"?: PropertyValueSpecification<"map" | "viewport">;
		"circle-stroke-width"?: DataDrivenPropertyValueSpecification<number>;
		"circle-stroke-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"circle-stroke-opacity"?: DataDrivenPropertyValueSpecification<number>;
	};
};
export declare type HeatmapLayerSpecification = {
	"id": string;
	"type": "heatmap";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"heatmap-radius"?: DataDrivenPropertyValueSpecification<number>;
		"heatmap-weight"?: DataDrivenPropertyValueSpecification<number>;
		"heatmap-intensity"?: PropertyValueSpecification<number>;
		"heatmap-color"?: ExpressionSpecificationArray;
		"heatmap-opacity"?: PropertyValueSpecification<number>;
	};
};
export declare type FillExtrusionLayerSpecification = {
	"id": string;
	"type": "fill-extrusion";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"fill-extrusion-opacity"?: PropertyValueSpecification<number>;
		"fill-extrusion-color"?: DataDrivenPropertyValueSpecification<ColorSpecification>;
		"fill-extrusion-translate"?: PropertyValueSpecification<[
			number,
			number
		]>;
		"fill-extrusion-translate-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"fill-extrusion-pattern"?: DataDrivenPropertyValueSpecification<ResolvedImageSpecification>;
		"fill-extrusion-height"?: DataDrivenPropertyValueSpecification<number>;
		"fill-extrusion-base"?: DataDrivenPropertyValueSpecification<number>;
		"fill-extrusion-vertical-gradient"?: PropertyValueSpecification<boolean>;
	};
};
export declare type RasterLayerSpecification = {
	"id": string;
	"type": "raster";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"raster-opacity"?: PropertyValueSpecification<number>;
		"raster-hue-rotate"?: PropertyValueSpecification<number>;
		"raster-brightness-min"?: PropertyValueSpecification<number>;
		"raster-brightness-max"?: PropertyValueSpecification<number>;
		"raster-saturation"?: PropertyValueSpecification<number>;
		"raster-contrast"?: PropertyValueSpecification<number>;
		"raster-resampling"?: PropertyValueSpecification<"linear" | "nearest">;
		"raster-fade-duration"?: PropertyValueSpecification<number>;
	};
};
export declare type HillshadeLayerSpecification = {
	"id": string;
	"type": "hillshade";
	"metadata"?: unknown;
	"source": string;
	"source-layer"?: string;
	"minzoom"?: number;
	"maxzoom"?: number;
	"filter"?: FilterSpecification;
	"layout"?: {
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"hillshade-illumination-direction"?: PropertyValueSpecification<number>;
		"hillshade-illumination-anchor"?: PropertyValueSpecification<"map" | "viewport">;
		"hillshade-exaggeration"?: PropertyValueSpecification<number>;
		"hillshade-shadow-color"?: PropertyValueSpecification<ColorSpecification>;
		"hillshade-highlight-color"?: PropertyValueSpecification<ColorSpecification>;
		"hillshade-accent-color"?: PropertyValueSpecification<ColorSpecification>;
	};
};
export declare type BackgroundLayerSpecification = {
	"id": string;
	"type": "background";
	"metadata"?: unknown;
	"minzoom"?: number;
	"maxzoom"?: number;
	"layout"?: {
		"visibility"?: "visible" | "none";
	};
	"paint"?: {
		"background-color"?: PropertyValueSpecification<ColorSpecification>;
		"background-pattern"?: PropertyValueSpecification<ResolvedImageSpecification>;
		"background-opacity"?: PropertyValueSpecification<number>;
	};
};
export declare type LayerSpecification = FillLayerSpecification | LineLayerSpecification | SymbolLayerSpecification | CircleLayerSpecification | HeatmapLayerSpecification | FillExtrusionLayerSpecification | RasterLayerSpecification | HillshadeLayerSpecification | BackgroundLayerSpecification;

export interface IResourceType {
  Unknown: keyof this;
  Style: keyof this;
  Source: keyof this;
  Tile: keyof this;
  Glyphs: keyof this;
  SpriteImage: keyof this;
  SpriteJSON: keyof this;
  Image: keyof this;
}
export type ResourceTypeEnum = keyof IResourceType;

export type RequestTransformFunction = (url: string, resourceType?: ResourceTypeEnum) => RequestParameters;

export type RequestParameters = {
  url: string;
  headers?: any;
  method?: 'GET' | 'POST' | 'PUT';
  body?: string;
  type?: 'string' | 'json' | 'arrayBuffer';
  credentials?: 'same-origin' | 'include';
  collectResourceTiming?: boolean;
};