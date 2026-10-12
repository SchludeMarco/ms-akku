import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Die Stitch-Schriftgrößen (text-label-md …) sind eigene Tokens. Ohne diesen
// Hinweis hält tailwind-merge sie für Textfarben und entfernt sie, sobald eine
// echte Farbe wie text-on-surface folgt.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "headline-xl",
            "headline-xl-mobile",
            "headline-lg",
            "headline-lg-mobile",
            "headline-md",
            "headline-sm",
            "body-lg",
            "body-md",
            "body-sm",
            "label-lg",
            "label-md",
            "label-sm",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
