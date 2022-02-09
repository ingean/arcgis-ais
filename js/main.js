
import WebMap from "https://js.arcgis.com/4.22/@arcgis/core/WebMap.js"
import MapView from "https://js.arcgis.com/4.22/@arcgis/core/views/MapView.js"
import Bookmarks from "https://js.arcgis.com/4.22/@arcgis/core/widgets/Bookmarks.js"
import LayerList from "https://js.arcgis.com/4.22/@arcgis/core/widgets/LayerList.js"
import Legend from "https://js.arcgis.com/4.22/@arcgis/core/widgets/Legend.js"
import Fullscreen from "https://js.arcgis.com/4.22/@arcgis/core/widgets/Fullscreen.js"
import FeatureLayer from "https://js.arcgis.com/4.22/@arcgis/core/layers/FeatureLayer.js"
import {createFlowGroupLayer} from "./AnimatedFlowLayer.js"

const flowAllLayer21 = createFlowGroupLayer(
  'Alle fartøy 2021',
  'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2021_count_web/ImageServer', // Web Mercator
  'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2021_web/ImageServer' // Web Mercator
)

const flowSupplyLayer21 = createFlowGroupLayer(
  'Supply-fartøy 2021',
  'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2020_supply_count/ImageServer', // Web Mercator
  'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2020_supply/ImageServer' // Web Mercator
)

flowSupplyLayer21.visible = false

const aoiLayer = new FeatureLayer({
  title: "Utsira nord",
  url: "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Konsesjonsomraade/FeatureServer/0"
})

const map = new WebMap({
  portalItem: {
    id: '5fcb0140b42843eda9e2c12e5c2cc6ac' // Web Mercator
  }
});

map.add(flowAllLayer21)
map.add(flowSupplyLayer21)
map.add(aoiLayer)

await map.load()

const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 9,
  center: [4.5, 59.3]
});

view.ui.move("zoom", "bottom-right");

const bookmarks = new Bookmarks({
  view,
  container: "bookmarks-container"
});
const layerList = new LayerList({
  view,
  selectionEnabled: true,
  container: "layers-container"
});
const legend = new Legend({
  view,
  container: "legend-container",
  layerInfos: [{
    layer: flowAllLayer21.layers.getItemAt(0),
    title: "Antall observasjoner"
  }]
});

// add fullscreen widget
const fullscreen = new Fullscreen({
  view: view
});
view.ui.add(fullscreen, "top-right");

// Controls events
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

// Filter button events
document
  .getElementById("flowAllLayer")
  .addEventListener("click", updateFilter);
document
  .getElementById("flowSupplyLayer")
  .addEventListener("click", updateFilter);

function updateFilter(event) {
  let layerName = event.target.id
  if (layerName == "flowAllLayer") {
    flowSupplyLayer21.visible = false
    flowAllLayer21.visible = true
  } else {
    flowAllLayer21.visible = false
    flowSupplyLayer21.visible = true
  }
}

function activeLayer() {
  return (flowAllLayer21.visible) ? flowAllLayer21 : flowSupplyLayer21
}

function updateEffect(event) {
  let layer = activeLayer() 
  let checkbox = event.target.checked ? "bloom(2, 0.5px, 0)" : null;
   layer.effect = checkbox;
}

function updateRenderer(event) {
  let groupLayer = activeLayer()
  let layer = groupLayer.layers.getItemAt(1)
  let propName = event.target.id;
  let propValue = event.target.value;

  if (propName && propValue != null) {
    let tempRenderer = layer.renderer.clone();

    tempRenderer[propName] = propValue;
    layer.renderer = tempRenderer;
  }
}

const { title, description, thumbnailUrl, avgRating } = map.portalItem;
document.querySelector("#header-title").textContent = 'Skipstrafikk ved Utsira nord';
let activeWidget;

const handleActionBarClick = ({ target }) => {
  if (target.tagName !== "CALCITE-ACTION") {
    return;
  }
  if (activeWidget) {
    document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
    document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
  }
  const nextWidget = target.dataset.actionId;
  if (nextWidget !== activeWidget) {
    document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
    document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
    activeWidget = nextWidget;
  } else {
    activeWidget = null;
  }
};

document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);
document.querySelector("calcite-shell").hidden = false;
document.querySelector("calcite-loader").active = false;
