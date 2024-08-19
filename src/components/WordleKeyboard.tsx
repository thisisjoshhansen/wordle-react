import './WordleKeyboard.scss';
import IconBackspace from "../icons/icon-backspace";

export enum KeyboardKeyState {
  unused = 'unused',
  absent = 'absent',
  near = 'near',
  correct = 'correct',
}

export default function WordleKeyboard({
  states = {},
  onKeydown = ()=>{},
}:{
  states?: Record<string, KeyboardKeyState>,
  onKeydown?: (key:string) => void,
}={}) {
  
  const keyboardKeys: string[] = [
    'QWERTYUIOP',
    'ASDFGHJKL',
    'ZXCVBNM',
  ];

  function handleClick(key:string) {
    return () => onKeydown(key);
  }

  function toState(c:string) {
    return {
      key: c,
      state: states[c] ?? KeyboardKeyState.unused,
    }
  }

  function toButton(row:number) {
    return ({
      key,
      state,
    }:{
      key: string,
      state: KeyboardKeyState,
    }, i:number) => <button
      key={key}
      className={[
        'keyboard__key',
        `keyboard__key--${state}`,
        key.length > 1 && 'keyboard__key--wide',
        row === 2 && i === 0 && 'keyboard__key--offset-row',
      ].filter(Boolean).join(' ')}
      style={{gridRowStart: row}}
      onClick={handleClick(key)}
    >{ key === 'delete' ? <IconBackspace scale={1.5} /> : key }</button>;
  }

  return <div className="keyboard">
    { keyboardKeys[0].split('').map(toState).map(toButton(1)) }

    { keyboardKeys[1].split('').map(toState).map(toButton(2)) }

    {[
      'enter',
      ...keyboardKeys[2].split(''),
      'delete'
    ].map(toState).map(toButton(3)) }
  </div>;
}
