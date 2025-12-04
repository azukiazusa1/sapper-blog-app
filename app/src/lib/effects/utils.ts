export type DeviceProfile = "low" | "medium" | "high";

export interface DeviceSettings {
  confettiParticles: number;
  backgroundParticles: number;
  enable3D: boolean;
  enableParallax: boolean;
}

export const DEVICE_SETTINGS: Record<DeviceProfile, DeviceSettings> = {
  low: {
    confettiParticles: 20,
    backgroundParticles: 10,
    enable3D: false,
    enableParallax: false,
  },
  medium: {
    confettiParticles: 40,
    backgroundParticles: 20,
    enable3D: true,
    enableParallax: false,
  },
  high: {
    confettiParticles: 70,
    backgroundParticles: 35,
    enable3D: true,
    enableParallax: true,
  },
};

export function getDeviceProfile(): DeviceProfile {
  if (typeof window === "undefined") return "medium";

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory || 4;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
    navigator.userAgent,
  );

  if (cores < 4 || memory < 4 || isMobile) {
    return "low";
  } else if (cores < 8 || memory < 8) {
    return "medium";
  } else {
    return "high";
  }
}

export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
}

export function getDeviceSettings(): DeviceSettings {
  const profile = getDeviceProfile();
  const reducedMotion = getPrefersReducedMotion();

  if (reducedMotion) {
    // Disable all advanced effects if reduced motion is preferred
    return {
      confettiParticles: 0,
      backgroundParticles: 0,
      enable3D: false,
      enableParallax: false,
    };
  }

  return DEVICE_SETTINGS[profile];
}
