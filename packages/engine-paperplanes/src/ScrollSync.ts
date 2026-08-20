export type ScrollSyncHandle = {
  setProgress: (progress: number) => void;
  getActiveLocationIndex: () => number;
};

export function createScrollSync(locationCount: number): ScrollSyncHandle {
  let progress = 0;

  return {
    setProgress(value: number) {
      progress = Math.max(0, Math.min(1, value));
    },
    getActiveLocationIndex() {
      if (locationCount <= 1) return 0;
      const section = 1 / locationCount;
      return Math.min(locationCount - 1, Math.floor(progress / section));
    }
  };
}

export function scrollProgressFromSections(sectionIds: string[]): number {
  if (typeof window === 'undefined') return 0;

  const scrollY = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return 0;

  return scrollY / maxScroll;
}

export function locationIndexFromSection(sectionId: string, mapping: Record<string, number>): number {
  return mapping[sectionId] ?? 0;
}
