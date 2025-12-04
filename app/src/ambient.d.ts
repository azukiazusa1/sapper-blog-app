/**
 * These declarations tell TypeScript that we allow import of images, e.g.
 * ```
		<script lang='ts'>
			import successkid from 'images/successkid.jpg';
		</script>

		<img src="{successkid}">
	 ```
 */
declare module "*.gif" {
  const value: string;
  export = value;
}

declare module "*.jpg" {
  const value: string;
  export = value;
}

declare module "*.jpeg" {
  const value: string;
  export = value;
}

declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.svg" {
  const value: string;
  export = value;
}

declare module "*.webp" {
  const value: string;
  export = value;
}

// svelte-inview event types
type Direction = "up" | "down" | "left" | "right";

type ScrollDirection = {
  vertical?: Direction;
  horizontal?: Direction;
};

type ObserverEventDetails = {
  inView: boolean;
  entry: IntersectionObserverEntry;
  scrollDirection: ScrollDirection;
  node: HTMLElement;
  observer: IntersectionObserver;
};

type LifecycleEventDetails = {
  node: HTMLElement;
  observer: IntersectionObserver;
};

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    oninview_change?: (event: CustomEvent<ObserverEventDetails>) => void;
    oninview_enter?: (event: CustomEvent<ObserverEventDetails>) => void;
    oninview_leave?: (event: CustomEvent<ObserverEventDetails>) => void;
    oninview_init?: (event: CustomEvent<LifecycleEventDetails>) => void;
  }
}
