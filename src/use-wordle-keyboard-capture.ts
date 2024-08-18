import { EventEmitter } from "@this-is-josh-hansen/event-emitter";
import { useEffect, useRef } from "react";
import { debouncedEffect } from "./utils";

type WordleKeyboardEvents = {
  'delete': [],
  'enter': [],
  'char': [ char:string ],
};

export function useWordleKeyboardEvents(): [keyboard:React.MutableRefObject<EventEmitter<WordleKeyboardEvents>>, cleanup:()=>void] {

  // const keyboardEvents = new EventEmitter<WordleKeyboardEvents>();
  const keyboardEvents = useRef<EventEmitter<WordleKeyboardEvents>>(new EventEmitter<WordleKeyboardEvents>());

  const handleKeyPress = (event:KeyboardEvent) => {
    // console.log('event', event);
    if (event.metaKey || event.altKey || event.ctrlKey) {
      return;
    }
  
    if (event.key === 'Backspace') {
      keyboardEvents.current.emit('delete');
      return;
    }
  
    if (event.key === 'Enter') {
      keyboardEvents.current.emit('enter');
      return;
    }
  
    // Filter out non-letters
    if (event.key.length > 1 || !event.key.match(/[a-z]/i)) {
      return;
    }
    
    const char = event.key.toUpperCase();
    keyboardEvents.current.emit('char', char);
  };

  /**
   * Removes all keyboard listeners for Wordle
   */
  const cleanup = () => {
    window.removeEventListener('keydown', handleKeyPress);
    console.log(`No longer listening to keyboard`);
  };

  useEffect(debouncedEffect(() => {
    console.log(`Listening to keyboard`);
    window.addEventListener('keydown', handleKeyPress);
    return cleanup;
  }), []);

  return [ keyboardEvents, cleanup ];
}
