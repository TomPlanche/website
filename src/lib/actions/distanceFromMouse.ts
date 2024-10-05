import type { DistanceEvent } from "$lib/types";
import type { Action } from "svelte/action";

type ReferencePoint =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";

/**
 * Action to calculate the distance from the mouse to a specified point on the element.
 *
 * @param node {HTMLElement} The element to calculate the distance from.
 * @param callback {(event: DistanceEvent) => void} The callback to call when the distance changes.
 * @param referencePoint {ReferencePoint} The point on the element to calculate the distance from.
 */
export const distanceFromMouse: Action<
    HTMLElement,
    [(event: DistanceEvent) => void, ReferencePoint]
> = (
    node: HTMLElement,
    [callback, referencePoint = "center"]: [
        (event: DistanceEvent) => void,
        ReferencePoint,
    ],
) => {
    const handleMouseMove = (event: MouseEvent) => {
        const rect = node.getBoundingClientRect();
        let refX: number;
        let refY: number;

        switch (referencePoint) {
            case "top":
                refX = rect.left + rect.width / 2;
                refY = rect.top;
                break;
            case "bottom":
                refX = rect.left + rect.width / 2;
                refY = rect.bottom;
                break;
            case "left":
                refX = rect.left;
                refY = rect.top + rect.height / 2;
                break;
            case "right":
                refX = rect.right;
                refY = rect.top + rect.height / 2;
                break;
            case "top-left":
                refX = rect.left;
                refY = rect.top;
                break;
            case "top-right":
                refX = rect.right;
                refY = rect.top;
                break;
            case "bottom-left":
                refX = rect.left;
                refY = rect.bottom;
                break;
            case "bottom-right":
                refX = rect.right;
                refY = rect.bottom;
                break;
            default:
                refX = rect.left + rect.width / 2;
                refY = rect.top + rect.height / 2;
        }

        const x = event.clientX - refX;
        const y = event.clientY - refY;
        const distance = Math.sqrt(x * x + y * y);

        callback({ ...event, x, y, distance } as DistanceEvent);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return {
        destroy() {
            document.removeEventListener("mousemove", handleMouseMove);
        },
    };
};
