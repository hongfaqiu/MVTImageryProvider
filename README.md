# MVTImageryProvider

Render Mapbox style in CesiumJs. This project is very simple, because the complex rendering task is compeleted by mapbox-gl-js, you should also check [pbf-basic-render](https://github.com/hongfaqiu/pbf-basic-render) for more detail.

## Install

This module `can't work well` in production environment, please copy [demo's code](https://github.com/hongfaqiu/MVTImageryProvider/blob/main/demo/src/MVTImageryProvider/index.ts) instead of install the npm package.

```js
npm install --save mvt-imagery-provider

yarn add mvt-imagery-provider
```

## Usage

```ts
import * as Cesium from "cesium";
import MVTImageryProvider from 'mvt-imagery-provider';

const cesiumViewer = new Cesium.Viewer("cesiumContainer");
const exampleStyle = {
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

const provider = new MVTImageryProvider({
  style: exampleStyle,
});

provider.readyPromise.then(() => {
  cesiumViewer.imageryLayers.addImageryProvider(provider);
});

```

## Demo

[online Demo](https://mvti-magery-provider.vercel.app/)

Launch the app in the demo folder, and then visit http://localhost:8080/

```node
cd demo
yarn
npm start
```

| [![bguCSe.png](https://s1.ax1x.com/2022/03/08/bguCSe.png)](https://imgtu.com/i/bguCSe) | [![bguQyj.png](https://s1.ax1x.com/2022/03/08/bguQyj.png)](https://imgtu.com/i/bguQyj) |
| ------- | ------- |

## Bugs

[pbf-basic-render](https://github.com/hongfaqiu/pbf-basic-render) caused the following bugs, you could use [kikitte's MVTImageryProvider](https://github.com/kikitte/MVTImageryProvider) instead, or wait for me to fix them.

- Can't render line&symbol&sprites.

- When the tileSize option is small, the rendering quality is poor.

## Credit

https://github.com/kikitte/MVTImageryProvider
