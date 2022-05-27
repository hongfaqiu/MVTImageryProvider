/**
 * 根据layer信息获取pbf样式
 * @param layerItem pbfLayer
 * @returns pbfStyle
 */
export const getPbfStyle = async (layerItem: Layer.PbfLayerItem) => {
  if (layerItem.pbfStyle) {
    return layerItem.pbfStyle;
  }
  if (layerItem.url.indexOf('json') !== -1) {
    const res = await fetch(layerItem.url);
    const pbfStyle = await res.json();
    if (pbfStyle) {
        layerItem.pbfStyle = pbfStyle;
        return pbfStyle;
    }
    return null;
  }
}
