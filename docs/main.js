import ContourIntervalControl from "https://cdn.jsdelivr.net/gh/tjmsy/maplibre-gl-contour-interval/src/maplibre-gl-contour-interval.js";

const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [138.7307, 35.3595],
  zoom: 9,
  hash: true,
});

map.on("load", () => {
  const demSource = new mlcontour.DemSource({
    url: "https://gbank.gsj.jp/seamless/elev/terrainRGB/mixed/{z}/{y}/{x}.png",
    encoding: "mapbox",
    minzoom: 0,
    maxzoom: 19,
    worker: true,
    cacheSize: 100,
    timeoutMs: 30_000,
  });
  demSource.setupMaplibre(maplibregl);

  map.addSource("contour-source", {
    type: "vector",
    tiles: [
      demSource.contourProtocolUrl({
        thresholds: {},
        contourLayer: "contours",
        elevationKey: "ele",
        levelKey: "level",
        extent: 4096,
        buffer: 1,
      }),
    ],
    maxzoom: 19,
    attribution:
      "<a href='https://tiles.gsj.jp/tiles/elev/tiles.html#h_mixed' target='_blank'>産総研 シームレス標高タイル(統合DEM)</a>",
  });

  map.addLayer({
    id: "contour-lines",
    type: "line",
    source: "contour-source",
    "source-layer": "contours",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-width": ["match", ["get", "level"], 1, 1, 0.56],
      "line-color": "#D25C00",
    },
  });

  const defaultContourInterval = 10;
  map.addControl(
    new ContourIntervalControl(demSource, defaultContourInterval),
    "top-left"
  );
});
