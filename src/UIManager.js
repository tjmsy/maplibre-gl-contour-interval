class UIManager {
  constructor() {
    this.container = null;
    this.controls = [];
  }

  createInputControl(id, labelText, initialValue = "") {
    const container = document.createElement("div");
    container.style.display = "none";
    container.style.flexDirection = "row";
    container.style.alignItems = "center";
    container.style.margin = "4px 0";
    container.id = `${id}-container`;

    const label = document.createElement("label");
    label.innerText = labelText;

    const input = document.createElement("input");
    input.id = `${id}-input`;
    input.type = "number";
    input.value = initialValue;
    input.style.width = "40px";
    input.style.marginLeft = "4px";

    container.appendChild(label);
    container.appendChild(input);

    this.controls.push(container);
    return { element: container, input };
  }

  createCheckboxControl(id, labelText, initialChecked = true) {
    const container = document.createElement("div");
    container.style.display = "none";
    container.style.flexDirection = "row";
    container.style.alignItems = "center";
    container.style.margin = "4px 0";
    container.id = `${id}-container`;

    const label = document.createElement("label");
    label.innerText = labelText;

    const checkbox = document.createElement("input");
    checkbox.id = `${id}-checkbox`;
    checkbox.type = "checkbox";
    checkbox.checked = initialChecked;
    checkbox.style.marginLeft = "4px";

    container.appendChild(label);
    container.appendChild(checkbox);

    this.controls.push(container);
    return { element: container, checkbox };
  }

  createButton(id, labelText) {
    const button = document.createElement("button");
    button.id = id;
    button.innerText = labelText;
    return button;
  }

  showHideUI(isVisible) {
    this.controls.forEach((control) => {
      control.style.display = isVisible ? "flex" : "none";
    });
  }
}

export default UIManager;
