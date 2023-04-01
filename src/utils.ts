export function isComponent(element: HTMLElement): boolean {
    // Check for specific naming conventions
    if (
        element.classList.contains("component") ||
        element.classList.contains("ui") ||
        element.classList.contains("widget") ||
        element.classList.contains("btn") ||
        element.classList.contains("form") ||
        element.classList.contains("input") ||
        element.classList.contains("select") ||
        element.classList.contains("textarea") ||
        element.classList.contains("table") ||
        element.classList.contains("card") ||
        element.classList.contains("modal")
    ) {
        return true;
    }

    // Check for specific child elements
    if (
        element.querySelector(".btn") ||
        element.querySelector(".form") ||
        element.querySelector(".input") ||
        element.querySelector(".select") ||
        element.querySelector(".textarea") ||
        element.querySelector(".table") ||
        element.querySelector(".card") ||
        element.querySelector(".modal")
    ) {
        return true;
    }

    // Check for specific styles
    if (
        element.classList.contains("w-full") ||
        element.classList.contains("h-full") ||
        element.classList.contains("bg-gray-200") ||
        element.classList.contains("border") ||
        element.classList.contains("rounded") ||
        element.classList.contains("shadow")
    ) {
        return true;
    }

    // Check for specific behaviors
    if (
        element.dataset.toggle === "modal" ||
        element.dataset.toggle === "collapse"
    ) {
        return true;
    }

    // Check if the element contains text
    if (element.textContent && element.textContent.trim().length > 0) {
        return true;
    }

    // If none of the above conditions are met, return false
    return false;
}


export function findComponents(root: HTMLElement): HTMLElement[] {
    const components: HTMLElement[] = [root];

    // Traverse the DOM and check each element
    const elements = root.querySelectorAll("*");
    elements.forEach((element) => {
        if (isComponent(element as HTMLElement)) {
            components.push(element as HTMLElement);
        }
    });

    return components;
}

export function addBorderOnHover(elements: HTMLElement[], hoverStyle: string, selectedStyle:string): void {
    window.selectedElement = null;
  
    elements.forEach((element) => {
      element.setAttribute("data-selected", "false");
      element.setAttribute("data-has-border", "true");
  
      element.addEventListener("mouseenter", (event) => {
        if (window.selectedElement !== element) {
          element.style.border = hoverStyle;
          let currentElement = element.parentElement;
          while (currentElement) {
            if (currentElement.hasAttribute("data-has-border") && currentElement !== window.selectedElement) {
              currentElement.style.border = "";
            }
            currentElement = currentElement.parentElement;
          }
          event.stopPropagation();
        }
      });
  
      element.addEventListener("mouseleave", (event) => {
        if (element !== window.selectedElement) {
            element.style.border = "";
        }
      });
  
      element.addEventListener("click", (event: MouseEvent) => {
        if (element !== window.selectedElement) {
          if (window.selectedElement) {
            window.selectedElement.style.border = "";
          }
          window.selectedElement = element;
          element.setAttribute("data-selected", "true");
          element.style.border = selectedStyle;
        } 
        elements.forEach((el) => {
            if (el !== element) {
              el.style.border = '';
              el.setAttribute("data-selected", "false");
            }
          });
        event.stopPropagation();
      });
    });
  }
  
  
