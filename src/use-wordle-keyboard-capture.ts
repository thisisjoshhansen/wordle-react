import { EventEmitter } from "@this-is-josh-hansen/event-emitter";

export const keyboardEvents = new EventEmitter<{
  'delete': [],
  'enter': [],
  'char': [ char:string ],
}>();

export const handleKeyPress = (event:KeyboardEvent) => {
  // console.log('event', event);
  if (event.metaKey || event.altKey || event.ctrlKey) {
    return;
  }

  if (event.key === 'Backspace') {
    keyboardEvents.emit('delete');
    return;
  }

  if (event.key === 'Enter') {
    keyboardEvents.emit('enter');
    return;
  }

  // Filter out non-letters
  if (event.key.length > 1 || !event.key.match(/[a-z]/i)) {
    return;
  }
  
  const char = event.key.toUpperCase();
  keyboardEvents.emit('char', char);
};
