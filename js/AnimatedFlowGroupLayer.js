import ImageryTileLayer from "https://js.arcgis.com/4.22/@arcgis/core/layers/ImageryTileLayer.js"
import GroupLayer from "https://js.arcgis.com/4.22/@arcgis/core/layers/GroupLayer.js"
import MultipartColorRamp from "https://js.arcgis.com/4.22/@arcgis/core/rest/support/MultipartColorRamp.js"
import AlgorithmicColorRamp from "https://js.arcgis.com/4.22/@arcgis/core/rest/support/AlgorithmicColorRamp.js"
import Color from "https://js.arcgis.com/4.22/@arcgis/core/Color.js"

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

function create(title, urlCount, urlMagDir, visible) {
  const countLayer = new ImageryTileLayer({
    title: "Trafikkmengde",
    url: urlCount,
    renderer: {
      colorRamp,
      "computeGamma": false,
      "gamma": [1],
      "useGamma": true,
      "stretchType": "standard-deviation",
      "numberOfStandardDeviations": 2,
      "type": "raster-stretch"
    }
  });

  const magDirLayer = new ImageryTileLayer({
    title: "Trafikkretning",
    url: urlMagDir,
    renderer: {
      type: "animated-flow", // autocasts to new AnimatedFlowRenderer
      lineWidth: "2px",
      lineColor: [50, 120, 240],
      density: 1,
      lineSpeed: 0.02,
      fadeDuration: 0.5,
      lineLength: 50
    },
    blendMode: "destination-in", // count layer will only display on top of this layer
  });

  return new GroupLayer({
    title: title,
    effect: "bloom(2, 0.5px, 0.0)", // apply bloom effect to make the colors pop
    layers: [countLayer, magDirLayer],
    visible: visible
  })
}

export default class AnimatedFlowGroupLayer {
  constructor(title, urlMagnitude, urlMagnitudeDirection, visible = true) {
    this.title = title
    this.urlMagnitude = urlMagnitude
    this.urlMagnitudeDirection = urlMagnitudeDirection
    this.colorRamp = colorRamp
    return create(title, urlMagnitude, urlMagnitudeDirection, visible)
  }
}