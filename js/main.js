require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/layers/ImageryTileLayer",
  "esri/layers/GroupLayer",
  "esri/rest/support/MultipartColorRamp",
  "esri/rest/support/AlgorithmicColorRamp",
  "esri/Color",
  "esri/widgets/Legend",
  "esri/widgets/Fullscreen"
  
], 

function (
  Map, 
  MapView,
  FeatureLayer, 
  ImageryTileLayer,
  GroupLayer,
  MultipartColorRamp,
  AlgorithmicColorRamp,
  Color,
  Legend,
  Fullscreen) {

  const colorRamp = new MultipartColorRamp({
    colorRamps: [
  

      new AlgorithmicColorRamp({
        fromColor: new Color([0, 0, 150, 255]),
        toColor: new Color([3000, 0, 120, 255])
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([3000, 0, 120, 255]),
        toColor: new Color([5000, 100, 60, 255])
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([5000, 100, 60, 255]),
        toColor: new Color([10000, 170, 0, 255])
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([10000, 170, 0, 255]),
        toColor: new Color([45000, 255, 0, 255])
      })
    ]
  });

  // sea surface temperature, visualized with raster stretch renderer
  const magnitudeLayer = new ImageryTileLayer({
    url: "https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_2017_supply_count_wgs8/ImageServer",
    //url: "https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_2017_count_wgs84/ImageServer",
    renderer: {
      colorRamp,
      "computeGamma": false,
      "gamma": [1],
      "useGamma": false,
      "stretchType": "min-max",
      "type": "raster-stretch"
    }
  });

  const directionLayer = new ImageryTileLayer({
    url: "https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_2017_supply_wgs84/ImageServer",
    //url: "https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_2017_wgs84/ImageServer",
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
    blendMode: "destination-in", // temperature layer will only display on top of this layer
  });

  const magdirLayer = new GroupLayer({
    effect: "bloom(2, 0.5px, 0.0)", // apply bloom effect to make the colors pop
    layers: [magnitudeLayer, directionLayer]
  });

  const pilotLayer = new FeatureLayer({
    title: "Farled",
    url: "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Farled/FeatureServer/0"
  })

  const map = new Map({
    basemap: "dark-gray-vector",
    layers: [magdirLayer]
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 9,
    center: [4.5, 59.3]
  });
  
  //view.ui.add("controls", "top-right"); # Controls for adjusting animated flow

   // add legend for temperature layer
   const legend = new Legend({
    view: view,
    layerInfos: [{
      layer: magnitudeLayer,
      title: "Antall observasjoner"
    }]
  });
  view.ui.add(legend, "top-right");

  // add fullscreen widget
  const fullscreen = new Fullscreen({
    view: view
  });
  view.ui.add(fullscreen, "top-left");

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