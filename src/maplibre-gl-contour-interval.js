import UIManager from "./UIManager.js";
import EventManager from "./EventManager.js";

class ContourIntervalControl {
  constructor(demSource, initialContourInterval = 10) {
    this.demSource = demSource;
    this.map = null;
    this.container = null;
    this.uiManager = new UIManager();
    this.eventManager = new EventManager();

    this.contourInterval = initialContourInterval;
    this.isOutsideClickListenerActive = false;
    this.isUIVisible = false;
  }

  generateContourTilesURL() {
    const thresholds = {};
    const baseInterval = this.contourInterval;

    for (let zoomLevel = 14; zoomLevel >= 0; zoomLevel--) {
      const interval = baseInterval * Math.pow(2, 14 - zoomLevel);
      thresholds[zoomLevel] = [interval, interval * 5];
    }

    return this.demSource.contourProtocolUrl({
      thresholds,
      contourLayer: "contours",
      elevationKey: "ele",
      levelKey: "level",
      extent: 4096,
      buffer: 1,
    });
  }

  updateContourInterval() {
    const contourSource = this.map.getSource("contour-source");
    if (contourSource) {
      contourSource.setTiles([this.generateContourTilesURL()]);
    }
  }

  attachEventListeners() {
    const inputConfig = [
      {
        elementId: "#contour-interval-input",
        property: "contourInterval",
        updateMethod: this.updateContourInterval.bind(this),
      },
    ];

    const showButton = this.container.querySelector("#show-button");
    this.eventManager.addClickListener(showButton, () => {
      this.isUIVisible = !this.isUIVisible;
      this.uiManager.showHideUI(this.isUIVisible);

      if (this.isUIVisible && !this.isOutsideClickListenerActive) {
        this.eventManager.addOutsideClickListener(this.container, () => {
          this.uiManager.showHideUI(false);
          this.isUIVisible = false;
          this.isOutsideClickListenerActive = false;
        });
        this.isOutsideClickListenerActive = true;
      }
    });

    inputConfig.forEach(({ elementId, property, updateMethod }) => {
      const inputElement = this.container.querySelector(elementId);

      this.eventManager.addInputListener(inputElement, (value) => {
        this[property] = value;
        updateMethod();
      });
    });
  }

  createUI() {
    this.uiManager.createUIElements({contourInterval: this.contourInterval});
    this.container = this.uiManager.container;
  }

  onAdd(map) {
    this.map = map;
    this.createUI();
    this.attachEventListeners();
    this.updateContourInterval();
    return this.container;
  }

  onRemove() {
    this.eventManager.clearAllListeners();
    this.container.remove();
    this.container = null;
    this.map = null;
  }
}

export default ContourIntervalControl;