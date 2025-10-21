import ContourControlUI from "./ContourControlUI.js";

class ContourIntervalControl {
  constructor(demSource, initialContourInterval = 10, baseZoom = 14) {
    this.demSource = demSource;
    this.map = null;

    this.baseZoom = baseZoom;
    this.baseContourInterval = initialContourInterval;
    this.currentContourInterval = null;

    this.contourUI = new ContourControlUI(initialContourInterval);
  }

  getClippedCurrentZoom() {
    let z = Math.floor(this.map.getZoom());
    return z > this.baseZoom ? this.baseZoom : z;
  }

  getScale(zoomLevel) {
    return Math.pow(2, this.baseZoom - zoomLevel);
  }

  generateContourTilesURL() {
    const thresholds = {};
    for (let zoomLevel = this.baseZoom; zoomLevel >= 0; zoomLevel--) {
      let interval;

      if (this.adjustByZoom) {
        interval = this.baseContourInterval * this.getScale(zoomLevel);
      } else {
        interval = this.currentContourInterval ?? this.baseContourInterval;
      }

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

  updateBaseContourIntervalFromCurrent() {
    if (this.currentContourInterval == null) return;
    const currentZoom = this.getClippedCurrentZoom();
    const scale = this.getScale(currentZoom);
    this.baseContourInterval = this.currentContourInterval / scale;
  }

  updateInputValue() {
    const currentZoom = this.getClippedCurrentZoom();
    const scale = this.getScale(currentZoom);
    this.currentContourInterval = this.baseContourInterval * scale;
    this.contourUI.inputElement.value = this.currentContourInterval;
  }

  onAdd(map) {
    this.map = map;

    this.contourUI.createUI();
    this.adjustByZoom = true;

    this.contourUI.attachUIEvents(
      () => {
        const raw = this.contourUI.inputElement.value;
        const value = parseFloat(raw);
        if (!isNaN(value) && value > 0) {
          this.currentContourInterval = value;

          if (this.adjustByZoom) {
            const currentZoom = this.getClippedCurrentZoom();
            const scale = this.getScale(currentZoom);
            this.baseContourInterval = value / scale;
          }
          this.updateContourInterval();
        }
      },
      (checked) => {
        this.adjustByZoom = checked;

        if (checked) {
          this.updateBaseContourIntervalFromCurrent();
        }

        this.updateContourInterval();

        if (this.adjustByZoom) {
          this.updateInputValue();
        } else {
          if (this.currentContourInterval != null) {
            this.contourUI.inputElement.value = this.currentContourInterval;
          }
        }
      }
    );

    this.map.on("zoom", () => {
      if (this.adjustByZoom) {
        this.updateInputValue();
        this.updateContourInterval();
      }
    });

    this.updateContourInterval();

    if (this.adjustByZoom) {
      this.updateInputValue();
    } else if (this.currentContourInterval != null) {
      this.contourUI.inputElement.value = this.currentContourInterval;
    }

    return this.contourUI.container;
  }

  onRemove() {
    if (this.map) this.map.off("zoom");
    this.contourUI.container.remove();
    this.map = null;
  }
}

export default ContourIntervalControl;
