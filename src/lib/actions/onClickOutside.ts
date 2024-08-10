import type { Action } from "svelte/action";

export const onClickOutside: Action<
	HTMLElement,
	(event: MouseEvent) => void
> = (node, callback) => {
	const handleClick = (event: MouseEvent) => {
		if (
			node &&
			!node.contains(event.target as Node) &&
			!event.defaultPrevented
		) {
			callback(event);
		}
	};

	document.addEventListener("click", handleClick, true);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		},
	};
};
