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

/**
 * 将包围盒转换为坐标串
 * @param boundary 包围盒字符串
 * @returns {number[][]}
 */
 export function boundary2Coors(boundary: string) {
  const result = boundary.match(/\(\((.+?)\)/);
  if (result) {
    const coors = result[1].split(',').map(item => item.split(' ').map(val => Number(val)));
    return coors
  }
  return null;
}

/**
 * 输入一串经纬度,计算四至
 */
 export function calculateRange(coors: number[][]) {
  return {
    minLon: Math.min(...coors.map(item => item[0])),
    minLat: Math.min(...coors.map(item => item[1])),
    maxLon: Math.max(...coors.map(item => item[0])),
    maxLat: Math.max(...coors.map(item => item[1]))
  }
}
