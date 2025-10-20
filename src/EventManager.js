class EventManager {
    addClickListener(element, callback) {
      if (element) {
        element.addEventListener("click", callback);
      }
    }
  
    addInputListener(element, callback) {
      if (element) {
        element.addEventListener("input", (event) => {
          const value = parseFloat(event.target.value).toFixed(1);
          if (!isNaN(value)) {
            callback(value);
          }
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
  