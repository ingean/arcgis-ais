import Bookmarks from 'https://js.arcgis.com/4.22/@arcgis/core/widgets/Bookmarks.js'
import BasemapGallery from 'https://js.arcgis.com/4.22/@arcgis/core/widgets/BasemapGallery.js'
import LayerList from 'https://js.arcgis.com/4.22/@arcgis/core/widgets/LayerList.js'
import Legend from 'https://js.arcgis.com/4.22/@arcgis/core/widgets/Legend.js'
import Print from 'https://js.arcgis.com/4.22/@arcgis/core/widgets/Print.js'
import Fullscreen from "https://js.arcgis.com/4.22/@arcgis/core/widgets/Fullscreen.js"

let activeWidget;

const handleActionBarClick = ({ target }) => {
  if (target.tagName !== "CALCITE-ACTION") {
    return
  }
  if (activeWidget) {
    document.querySelector(`[data-action-id=${activeWidget}]`).active = false
    document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true
  }
  const nextWidget = target.dataset.actionId
  if (nextWidget !== activeWidget) {
    document.querySelector(`[data-action-id=${nextWidget}]`).active = true
    document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false
    activeWidget = nextWidget
  } else {
    activeWidget = null
  }
}

export default class ActionBar {
  constructor(view) {
    this.view = view
    this.init()
  }

  // Methods
  init() {
    let view = this.view
    document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick)
    view.ui.move("zoom", "bottom-right")

    const basemaps = new BasemapGallery({
      view,
      container: "basemaps-container"
    })
    const bookmarks = new Bookmarks({
      view,
      container: "bookmarks-container"
    })
    const layerList = new LayerList({
      view,
      selectionEnabled: true,
      container: "layers-container"
    })
    const legend = new Legend({
      view,
      container: "legend-container"
    })
    const print = new Print({
      view,
      container: "print-container"
    })
    const fullscreen = new Fullscreen({
      view: view
    });
    view.ui.add(fullscreen, "top-right")
  }
}

