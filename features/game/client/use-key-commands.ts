"use client";
import { useEffect } from "react";
import { mapKeyEvent, type KeyCommand } from "./key-commands";

const EDITABLE = "input, textarea, select, [contenteditable='true']";
const ACTIVATABLE = "button, a, [role='button']:not([data-tile])";

export function useKeyCommands(onCommand: (command: KeyCommand) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handle = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest(EDITABLE)) return;
      if (document.querySelector("[role='dialog']")) return;
      const command = mapKeyEvent(event);
      if (!command) return;
      if (command.type === "enter" && event.target instanceof Element && event.target.closest(ACTIVATABLE)) return;
      event.preventDefault();
      onCommand(command);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onCommand, enabled]);
}
