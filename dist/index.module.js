import*as e from"cesium/Cesium";import{BasicRenderer as i}from"pbf-basic-render";var t=/*#__PURE__*/function(){function t(t){var r,o,s=this;this.mapboxRenderer=void 0,this.ready=void 0,this.readyPromise=void 0,this.rectangle=void 0,this.tileSize=void 0,this.tileWidth=void 0,this.tileHeight=void 0,this.maximumLevel=void 0,this.minimumLevel=void 0,this.tileDiscardPolicy=void 0,this.proxy=void 0,this.hasAlphaChannel=void 0,this.sourceFilter=void 0,this.tilingScheme=void 0,this.options=void 0,this.transformRequest=function(e,i){return"Source"===i&&s.options.header?{url:e,headers:s.options.header}:{url:e}},this.options=t,this.mapboxRenderer=new i({style:t.style,transformRequest:function(e,i){return s.transformRequest(e,i)}}),t.showCanvas&&this.mapboxRenderer.showCanvasForDebug(),this.ready=!1,this.readyPromise=this.mapboxRenderer._style.loadedPromise.then(function(){s.ready=!0}),this.tilingScheme=null!=(r=t.tilingScheme)?r:new e.WebMercatorTilingScheme,this.rectangle=this.tilingScheme.rectangle,this.tileSize=this.tileWidth=this.tileHeight=t.tileSize||512,this.maximumLevel=t.maximumLevel||Number.MAX_SAFE_INTEGER,this.minimumLevel=t.minimumLevel||0,this.tileDiscardPolicy=void 0,this.proxy=new e.DefaultProxy(""),this.hasAlphaChannel=null==(o=t.hasAlphaChannel)||o,this.sourceFilter=t.sourceFilter,this.options=t}var r=t.prototype;return r.getTileCredits=function(e,i,t){return[]},r.createTile=function(){var e=document.createElement("canvas");e.width=this.tileSize,e.height=this.tileSize,e.style.imageRendering="pixelated";var i=e.getContext("2d");return i&&(i.globalCompositeOperation="copy"),e},r.requestImage=function(e,i,t,r){var o=this;if(void 0===r&&(r=!0),t>this.maximumLevel||t<this.minimumLevel)return Promise.reject(void 0);this.mapboxRenderer.filterForZoom(t);var s=[];return this.mapboxRenderer.getVisibleSources(t).forEach(function(r){s.push({source:r,z:t,x:e,y:i,left:0,top:0,size:o.tileSize})}),console.log("tilesSpec",s),new Promise(function(e,i){var t=o.createTile(),n=o.mapboxRenderer.renderTiles(t.getContext("2d"),{srcLeft:0,srcTop:0,width:o.tileSize,height:o.tileSize,destLeft:0,destTop:0},s,function(s){s?(console.error(s),i(void 0)):r?(n.consumer.ctx=void 0,e(t),o.mapboxRenderer.releaseRender(n)):e(n)})})},r.pickFeatures=function(i,t,r,o,s){var n,a=this;return null==(n=this.requestImage(i,t,r,!1))?void 0:n.then(function(i){var t=a.mapboxRenderer.getVisibleSources(r);t=a.sourceFilter?a.sourceFilter(t):t;var n=[],h=e.Math.toDegrees(o),l=e.Math.toDegrees(s);return t.forEach(function(e){n.push({data:a.mapboxRenderer.queryRenderedFeatures({source:e,renderedZoom:r,lng:h,lat:l,tileZ:r})})}),i.consumer.ctx=void 0,a.mapboxRenderer.releaseRender(i),n})},t}();export{t as default};
//# sourceMappingURL=index.module.js.map
