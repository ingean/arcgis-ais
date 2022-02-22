import WebMap from 'https://js.arcgis.com/4.22/@arcgis/core/WebMap.js'
import MapView from 'https://js.arcgis.com/4.22/@arcgis/core/views/MapView.js'
import FeatureLayer from "https://js.arcgis.com/4.22/@arcgis/core/layers/FeatureLayer.js"
import ActionBar from './ActionBar.js'
import AnimatedFlowGroupLayer from './AnimatedFlowGroupLayer.js'
import AnimatedFlowControls from './AnimatedFlowControls.js'
import AnimatedFlowSwitch from './AnimatedFlowSwitch.js'
import SketchWidget from './SketchWidget.js'

const webmapId = '5fcb0140b42843eda9e2c12e5c2cc6ac' // Web Mercator

const map = new WebMap({
  portalItem: {
    id: webmapId
  }
});

const animatedFlowLayers = [
  new AnimatedFlowGroupLayer(
    'Alle fartøy 2021',
    'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2021_count_web/ImageServer', // Web Mercator
    'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2021_web/ImageServer' // Web Mercator
  ),
  new AnimatedFlowGroupLayer(
    'Supplybåter 2021',
    'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2020_supply_count/ImageServer', // Web Mercator
    'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2020_supply/ImageServer', // Web Mercator
    false
  ),
  new AnimatedFlowGroupLayer(
    'Fiskebåter 2021',
    'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2020_fish_count/ImageServer', // Web Mercator
    'https://tiledimageservices.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/ais_18_2020_fish_magdir/ImageServer', // Web Mercator
    false
  )
]

const aoiLayer = new FeatureLayer({
  title: "Utsira nord",
  url: "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Konsesjonsomraade/FeatureServer/0"
})

map.addMany(animatedFlowLayers)
map.add(aoiLayer)

await map.load();

const view = new MapView({
  map,
  container: "viewDiv",
  zoom: 9,
  center: [4.5, 59.3],
  padding: {
    left: 49
  }
})

view.when(() => {
  const sketch = new SketchWidget(view)
})

const actionBar = new ActionBar(view)
const flowCtrs = new AnimatedFlowControls(animatedFlowLayers)
const flowSwitch = new AnimatedFlowSwitch(animatedFlowLayers)

const { title, description, thumbnailUrl, avgRating } = map.portalItem
document.querySelector("#header-title").textContent = title
document.querySelector("calcite-shell").hidden = false
document.querySelector("calcite-loader").active = false