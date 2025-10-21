import UIManager from "./UIManager.js";
import EventManager from "./EventManager.js";

class ContourControlUI {
  constructor(initialContourInterval = 10) {
    this.uiManager = new UIManager();
    this.eventManager = new EventManager();

    this.container = null;
    this.inputElement = null;
    this.showButton = null;
    this.initialContourInterval = initialContourInterval;
    this.isUIVisible = false;
    this.isOutsideClickListenerActive = false;
  }

  createUI() {
    this.container = document.createElement("div");
    this.container.className = "maplibregl-ctrl maplibregl-ctrl-group";
    this.container.style.display = "flex";
    this.container.style.flexDirection = "column";

    this.showButton = this.uiManager.createButton("show-button", "ﾉﾉ");
    this.showButton.style.color = "brown";

    const contourInput = this.uiManager.createInputControl(
      "contour-interval",
      "Contour Interval",
      this.initialContourInterval
    );
    this.inputElement = contourInput.input;

    const adjustCheckbox = this.uiManager.createCheckboxControl(
      "adjust-by-zoom",
      "Adjust by zoom level",
      true
    );
    this.adjustCheckbox = adjustCheckbox.checkbox;

    this.container.appendChild(this.showButton);
    this.container.append(...this.uiManager.controls);
  }

  attachUIEvents(onInputChange, onCheckboxChange) {
    this.eventManager.addClickListener(this.showButton, () => {
      this.isUIVisible = !this.isUIVisible;
      this.uiManager.showHideUI(this.isUIVisible);

      if (this.isUIVisible && !this.isOutsideClickListenerActive) {
        this.eventManager.addOutsideClickListener(this.container, () => {
          this.isUIVisible = false;
          this.uiManager.showHideUI(false);
          this.isOutsideClickListenerActive = false;
        });
        this.isOutsideClickListenerActive = true;
      }
    });

    this.eventManager.addInputListener(this.inputElement, (value) => {
      onInputChange(value);
    });

    this.eventManager.addCheckboxListener(this.adjustCheckbox, (checked) => {
      onCheckboxChange(checked);
    });
  }
}

export default ContourControlUI;
