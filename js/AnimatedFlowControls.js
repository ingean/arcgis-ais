let flowLayers = []

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

function activeLayer() {
  for (let layer of flowLayers) {
    if (layer.visible) return layer
  }
  return
}  

function updateEffect(event) {
  let layer = activeLayer() 
  if (!layer) return
  let checkbox = event.target.checked ? "bloom(2, 0.5px, 0)" : null;
   layer.effect = checkbox;
}

function updateRenderer(event) {
  let groupLayer = activeLayer()
  if (!groupLayer) return
  let layer = groupLayer.layers.getItemAt(1)
  let propName = event.target.id;
  let propValue = event.target.value;

  if (propName && propValue != null) {
    let tempRenderer = layer.renderer.clone();

    tempRenderer[propName] = propValue;
    layer.renderer = tempRenderer;
  }
}

export default class AnimatedFlowControls {
  constructor(layers){
    flowLayers = layers
    this.flowLayers = layers
    this.activeLayer = activeLayer()
  }
}