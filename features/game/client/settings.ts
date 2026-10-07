"use client";
import { useCallback, useSyncExternalStore } from "react";
import { readJson, writeJson } from "./storage";

export const HIGH_CONTRAST_KEY = "it_high_contrast";
const listeners = new Set<() => void>();

function apply(value: boolean) {
  if (value) document.documentElement.setAttribute("data-contrast", "high");
  else document.documentElement.removeAttribute("data-contrast");
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => readJson(HIGH_CONTRAST_KEY, false);

export function useHighContrast(): [boolean, (value: boolean) => void] {
  const value = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const set = useCallback((next: boolean) => {
    writeJson(HIGH_CONTRAST_KEY, next);
    apply(next);
    listeners.forEach((l) => l());
  }, []);
  return [value, set];
}
