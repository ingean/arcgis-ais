require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/ImageryTileLayer"
], function (Map, MapView, ImageryTileLayer) {
  const layer = new ImageryTileLayer({
    //url: "https://tiledimageservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/NLDAS2011_daily_wind_magdir/ImageServer",
    //url: "https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/AIS_MagDir/ImageServer",
    url: "https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/fishnet_1km_conv_1000/ImageServer",
    title: "Ship traffic",
    renderer: {
      type: "animated-flow", // autocasts to new AnimatedFlowRenderer
      lineWidth: "2px",
      lineColor: [50, 120, 240],
      density: 1,
      lineSpeed: 0.02,
      fadeDuration: 0.5,
      lineLength: 50
    },
    effect: "bloom(2, 0.5px, 0)"
  });

  const map = new Map({
    basemap: "dark-gray-vector",
    layers: [layer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 9,
    center: [4.5, 59.3]
  });
  view.ui.add("controls", "top-right");

  document
    .getElementById("lineWidth")
    .addEventListener("calciteSliderChange", updateRenderer);
  document
    .getElementById("lineColor")
    .addEventListener("calciteInputInput", updateRenderer);
  document
    .getElementById("density")
    .addEventListener("calciteSliderChange", updateRenderer);
  document
    .getElementById("lineLength")
    .addEventListener("calciteSliderChange", updateRenderer);
  document
    .getElementById("lineSpeed")
    .addEventListener("calciteSliderChange", updateRenderer);
  document
    .getElementById("fadeDuration")
    .addEventListener("calciteSliderChange", updateRenderer);
  document
    .getElementById("effectsEnabled")
    .addEventListener("calciteCheckboxChange", updateEffect);

  function updateEffect(event) {
    let checkbox = event.target.checked ? "bloom(2, 0.5px, 0)" : null;
    layer.effect = checkbox;
  }

  function updateRenderer(event) {
    let propName = event.target.id;
    let propValue = event.target.value;

    if (propName && propValue != null) {
      let tempRenderer = layer.renderer.clone();

      tempRenderer[propName] = propValue;
      layer.renderer = tempRenderer;
    }
  }
});