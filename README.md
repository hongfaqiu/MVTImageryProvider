# MVTImageryProvider

Render Mapbox style in CesiumJs. This project is very simple, because the complex rendering task is compeleted by mapbox-gl-js, you should also check [pbf-basic-render](https://github.com/hongfaqiu/pbf-basic-render) for more detail.

## Install

```js
npm install --save mvt-imagery-provider

yarn add mvt-imagery-provider
```

## Usage

```ts
import * as Cesium from "cesium/Cesium";
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
        },
        interactive: true
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

## Credit

https://github.com/kikitte/MVTImageryProvider