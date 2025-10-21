class EventManager {
  addClickListener(element, callback) {
    if (element) {
      element.addEventListener("click", callback);
    }
  }

  addInputListener(element, callback) {
    if (element) {
      element.addEventListener("input", (event) => {
        const rawValue = event.target.value;
        const parsed = parseFloat(rawValue);
        if (rawValue === "" || rawValue.endsWith(".")) return;
        if (!isNaN(parsed)) {
          callback(parsed);
        }
      });
    }
  }

  addCheckboxListener(element, callback) {
    if (element) {
      element.addEventListener("change", (event) => {
        callback(event.target.checked);
      });
    }
  }

  addOutsideClickListener(container, callback) {
    const handleClickOutside = (event) => {
      if (!container.contains(event.target)) {
        callback();
        document.removeEventListener("click", handleClickOutside);
      }
    };
    document.addEventListener("click", handleClickOutside);
  }
}

export default EventManager;
