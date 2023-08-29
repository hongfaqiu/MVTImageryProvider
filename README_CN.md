# MVTImageryProvider

在CesiumJs中渲染Mapbox样式。这个项目非常简单，因为复杂的渲染任务已经由mapbox-gl-js完成，您也应该查看 [Mapbox-vector-tiles-basic-js-renderer ↗](https://github.com/landtechnologies/Mapbox-vector-tiles-basic-js-renderer) 以获取更多细节。

![mvt-basic-render](http://img.badgesize.io/https://unpkg.com/mvt-basic-render?compression=gzip&label=gzip) ![mvt-imagery-provider](http://img.badgesize.io/https://unpkg.com/mvt-imagery-provider?compression=gzip&label=gzip) <a href="https://www.npmjs.com/package/mvt-imagery-provider">![](https://img.shields.io/npm/v/mvt-imagery-provider)</a>

[![CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/sandbox/mvt-imagery-provider-example-gzflyc)

## 安装

```bash
#npm
npm install --save mvt-imagery-provider
#pnpm
pnpm add mvt-imagery-provider
```

## 使用方法

```ts
import * as Cesium from "cesium";
import MVTImageryProvider from 'mvt-imagery-provider';

const cesiumViewer = new Cesium.Viewer("cesiumContainer");

const provider = await MVTImageryProvider.fromUrl('https://demotiles.maplibre.org/style.json', {
  accessToken: MAPBOX_TOKEN
});

cesiumViewer.imageryLayers.addImageryProvider(provider);

```

你也可以使用 New 关键字创建一个新的 MVTImageryProvider，但在 cesium@1.104+ 之后已经不推荐这么做。

```ts
const provider = new MVTImageryProvider({
  style: STYLE_URL,
});
provider.readyPromise.then(() => {
  cesiumViewer.imageryLayers.addImageryProvider(provider);
})
```

## API

```ts
class MVTImageryProvider {
  /**
   * 创建一个 MVTImageryProvider 对象
   * @param {MVTImageryProviderOptions} options 以下是 MVTImageryProvider 的选项:
   * @param {Resource | string | StyleSpecification} options.style - mapbox 样式对象或 url 资源。
   * @param {string} options.accessToken - mapbox 样式访问令牌。
   * @param {RequestTransformFunction} options.transformRequest - 使用 transformRequest 来修改瓦片请求。
   * @param {Number} [options.tileSize = 256] - 可以是 256 或 512。默认值为 256。
   * @param {Number} [options.maximumLevel = 18] - 如果 cesium 缩放级别超过 maximumLevel，图层将变得不可见，默认值为 18。
   * @param {Number} [options.minimumLevel = 0] - 如果 cesium 缩放级别低于 minimumLevel，图层将变得不可见，默认值为 0。
   * @param {Boolean} [options.showCanvas = false] - 是否显示 canvas 进行调试。
   * @param {Boolean} [options.enablePickFeatures = true] - 是否启用 pickFeatures，默认为 true。
   * @param {Function} options.sourceFilter - sourceFilter 用于过滤参与 pickFeature 过程的源。
   * @param {WebMercatorTilingScheme | GeographicTilingScheme} [options.tilingScheme = WebMercatorTilingScheme] - Cesium tilingScheme， 默认为 WebMercatorTilingScheme(EPSG: 3857)，4326数据暂时不支持加载。
   * @param {Credit} options.credit - 信用包含如何在屏幕上显示某些内容的归因/信用的数据。
   * @example
   * const imageryProvider = new MVTImageryProvider({
        style: 'https://demotiles.maplibre.org/style.json'
      });
  */
  constructor(options: MVTImageryProviderOptions & {
      /**
       * 已过时
       *
       * 您可以使用 fromUrl 替代
       * @example
       * const provider = await MVTImageryProvider.fromUrl(url)
       */
      style: string | Resource | StyleSpecification;
  });
  /**
   * 获取 mapbox 样式 json 对象
   */
  get style(): StyleSpecification;
  get isDestroyed(): boolean;
  static fromUrl(url: Resource | string | StyleSpecification, options?: MVTImageryProviderOptions): Promise<MVTImageryProvider>;
  requestImage(x: number, y: number, level: number, releaseTile?: boolean): Promise<HTMLImageElement | HTMLCanvasElement | any> | undefined;
  pickFeatures(x: number, y: number, zoom: number, longitude: number, latitude: number): Promise<ImageryLayerFeatureInfo[]> | undefined;
  destroy(): void;
}

type MVTImageryProviderOptions = {
  /** 如果地图样式不是公共的，需要提供访问令牌 */
  accessToken?: string;
  /** forceHTTPS 默认为 false */
  /**
   * 一个 `RequestParameters` 对象，在 Map.options.transformRequest 回调函数中返回。
   * @return {Object} RequestParameters
   * @property {string} url 要请求的 URL。
   * @property {Object} headers 要与请求一起发送的头信息。
   * @property {string} method 请求方法 `'GET' | 'POST' | 'PUT'`。
   * @property {string} body 请求体。
   * @property {string} type 要返回的响应体类型 `'string' | 'json' | 'arrayBuffer'`。
   * @property {string} credentials `'same-origin'|'include'` 使用 'include' 来在跨域请求中发送 cookies。
   * @property {boolean} collectResourceTiming 如果为 true，则会为这些转换后的请求收集 Resource Timing API 信息，并在相关的数据事件中返回 resourceTiming 属性。
   * @example
   * // 使用 transformRequest 来修改以 `http://myHost` 开头的请求
   * transformRequest: function(url, resourceType) {
   *  if (resourceType === 'Source' && url.indexOf('http://myHost') > -1) {
   *    return {
   *      url: url.replace('http', 'https'),
   *      headers: { 'my-custom-header': true },
   *      credentials: 'include'  // 在跨域请求中包含 cookies
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
};
```

## 样式规范

请查看[Mapbox样式规范](https://docs.mapbox.com/mapbox-gl-js/style-spec/root/), 样式规范版本为v0.43.0

## Demo

[在线demo](https://mvtimageryprovider.pages.dev/)

进入example文件夹，并启动vite demo http://localhost:5173/

```node
pnpm install
cd example
npm start
```

| ![bguCSe.png](https://s1.ax1x.com/2022/07/28/vCk4z9.png) | ![macrostrat.png](https://s1.ax1x.com/2022/07/28/vCkcZV.png) |
| ------- | ------- |

## 感谢

https://github.com/kikitte/MVTImageryProvider
