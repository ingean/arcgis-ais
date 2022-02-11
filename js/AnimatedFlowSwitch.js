let flowLayers = []

document
  .querySelectorAll('.filter-list')
  .forEach(e => e.addEventListener('calciteListChange', updateFilter))

async function updateFilter(event) {
  let selectedItems = await event.target.getSelectedItems()
  selectedItems = [...selectedItems]
  let layerIndex = parseInt(selectedItems[0][0])
  
  if (layerIndex >= flowLayers.length) return
  flowLayers.forEach(layer => layer.visible = false)
  flowLayers[layerIndex].visible = true
}

export default class AnimatedFlowSwitch {
  constructor(layers){
    flowLayers = layers
    this.flowLayers = layers
  }
}