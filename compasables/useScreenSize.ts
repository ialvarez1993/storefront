// composables/useScreenSize.ts
import { useMediaQuery } from "@vueuse/core";

const mediaQueries = {
  tablet: "(min-width: 768px)",
  desktop: "(min-width: 1024px)",
} as const;

export const useScreenSize = () => {
  const isTablet = useMediaQuery(mediaQueries.tablet);
  const isDesktop = useMediaQuery(mediaQueries.desktop);

  const isMobile = computed(() => !isTablet.value);

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};
