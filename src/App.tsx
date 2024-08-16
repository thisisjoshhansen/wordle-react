import './App.scss';

import { useEffect, useState } from 'react';
import { AcceptanceError, GameBoardSnapshot, GameState, WordleGameLogic, WordleGameLogicEvent } from '@this-is-josh-hansen/wordle-game-logic';

import ThemeController from './theme-controller';
import { handleKeyPress, keyboardEvents } from './use-wordle-keyboard-capture';
import WordleView from './WordleView';
import { words } from './words';

function App() {

  const [ logic, setLogic ] = useState<WordleGameLogic>();
  const [ snapshot, setSnapshot ] = useState<GameBoardSnapshot>([]);
  // const [ gameState, setGameState ] = useState<GameState>();

  let messageIndex = 0;
  const [ messages, setMessages ] = useState<{
    key: number,
    msg:string,
    style:string,
  }[]>([]);

  function addMessage(message:string, style:string='info', duration=0, dismissCallback:()=>void=()=>{}) {
    const key = ++messageIndex;
    setMessages(existing => [
      ...existing,
      {
        key,
        msg: message,
        style,
      }
    ]);

    const removeMessage = () => {
      setMessages(existing => [...existing].filter(msg => msg.key !== key));
      dismissCallback();
    };

    if (duration) {
      setTimeout(removeMessage, duration*1000);
    }

    return removeMessage;
  }
  
  useEffect(() => {
    if (!logic) {
      const answerIndex = Math.round((new Date().getTime() - new Date('2024/08/15').getTime()) / (1000*60*60*24)) % words.length;
      const answer = words[answerIndex];
      const newLogic = new WordleGameLogic(answer, words);
      setLogic(newLogic);
      setSnapshot(newLogic.board);
      return;
    }
    
    const offBoardUpdate = logic.on(WordleGameLogicEvent.boardUpdate, setSnapshot);
    addMessage('Welcome!', 'info', 3);

    logic.on(WordleGameLogicEvent.stateUpdate, state => {
      if (state !== GameState.playing) {
        offBoardUpdate();
      }

      // setGameState(state);

      if (state === GameState.won) {
        addMessage('You Won!', 'success');
      }

      if (state === GameState.lost) {
        addMessage('Out of Guesses. :(', 'warn');
      }
    });
    
    const offError = logic?.on(WordleGameLogicEvent.error, er => {
      console.warn(`Game Logic Error`);
      console.error(er);

      switch (er) {
        case AcceptanceError.unknown_word:
          addMessage('Not in word list', 'error', 2);
          break;
        
        case AcceptanceError.letter_count:
          if (logic.input === '') {
            addMessage(`Enter ${logic.answer.length} letters to continue`, 'info', 2);
          } else {
            addMessage('Need more letters!', 'error', 2);
          }
          break;
      }
    });
    
    const offChar = keyboardEvents.on('char', (char) => logic.addLetterToInput(char));
    const offEnter = keyboardEvents.on('enter', () => logic.acceptCurrentInput());
    const offDelete = keyboardEvents.on('delete', () => logic.removeLetterFromInput());

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);

      offError && offError();
      offBoardUpdate();
      
      offChar();
      offEnter();
      offDelete();
    };
  }, [logic]);
  
  return <>
    <header>
      <h1>Wordle</h1>
      <ThemeController></ThemeController>
    </header>
    <main>
      {
        logic && <>
          <div className='messages'>{
            messages.map(({msg, style, key}) => <div key={`item-${key}`} className={`messages__message messages__message--${style}`}>{ msg }</div>)
          }</div>
          <WordleView snapshot={snapshot}></WordleView>
        </>
      }
    </main>
    <footer>
      <p>This page was created to demonstrate the skills of Josh Hansen.</p>
    </footer>
  </>;
}

export default App
