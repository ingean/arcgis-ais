import GraphicsLayer from "https://js.arcgis.com/4.22/@arcgis/core/layers/GraphicsLayer.js"
import Sketch from 'https://js.arcgis.com/4.22/@arcgis/core/widgets/Sketch.js'

const sketchLayer = new GraphicsLayer()

const pointSymbol = { 
  type: "simple-marker", 
  color: [255, 0, 0, 1]
}

const lineSymbol = { 
  type: "simple-line", 
  color: [250, 42, 42, 1],
  width: 4  
}

const polygonSymbol = {
  type: "simple-fill",
  outline: {
    color: [255, 0, 0, 1],
    width: 2
  }
}

export default class SketchWidget {
  constructor(view) {
    const sketch = new Sketch({
      layer: sketchLayer,
      view: view,
      creationMode: "single"
    })

    sketch.viewModel.pointSymbol = pointSymbol
    sketch.viewModel.polylineSymbol = lineSymbol
    sketch.viewModel.polygonSymbol = polygonSymbol
    
    view.map.add(sketchLayer)
    view.ui.add(sketch, "top-right");
    return sketch
  }
}

