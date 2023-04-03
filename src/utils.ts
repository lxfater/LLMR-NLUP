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
    console.log(root)
    // Traverse the DOM and check each element
    const elements = root.querySelectorAll("*");
    elements.forEach((element) => {
        if (isComponent(element as HTMLElement)) {
            components.push(element as HTMLElement);
        }
    });

    return components;
}

export function addSelectableBorders(elements: HTMLElement[], selectableStyle: string, selectedStyle: string): void {
    elements.forEach((element) => {
        element.addEventListener("mouseenter", (event) => {
            console.log(element)
            if (window.selectedElement !== element) {
                element.classList.add(selectableStyle);
                elements.forEach((el) => {
                    if (el !== element) {
                        el.classList.remove(selectableStyle);
                    }
                });
                event.stopPropagation();
            }
        });
        element.addEventListener("mouseleave", (event) => {
            if (element !== window.selectedElement) {
                element.classList.remove(selectableStyle);
            }
        });
        element.addEventListener("click", (event: MouseEvent) => {
            if (element !== window.selectedElement) {
                if (window.selectedElement) {
                    window.selectedElement.classList.remove(selectedStyle);
                }
                window.selectedElement = element;
                window.selectedElement.classList.add(selectedStyle);
            }
            elements.forEach((el) => {
                if (el !== element) {
                    el.classList.remove(selectedStyle);
                }
            });
            event.stopPropagation();
        });
    });
}

export function extractHtmlCodeFromMd(mdText: string) {
    const htmlBlocks = mdText.match(/```html\n([\s\S]+?)\n```/g);
    if (!htmlBlocks) return [mdText];
    const cleanedBlocks = htmlBlocks.map((block) => block.replace(/```(html|htm|HTML)\n|```/g, ""));
    return cleanedBlocks;
}

export function replaceElement(originalElement: HTMLElement, replacementHtml: string) {
    const containerElement = document.createElement("div");
    containerElement.innerHTML = replacementHtml;
    const newElement = containerElement.children[0] as HTMLElement;
    originalElement.replaceWith(newElement);
    window.selectedElement = newElement;
}


