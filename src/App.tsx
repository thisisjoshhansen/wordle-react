import './App.scss';

import { useEffect, useMemo, useState } from 'react';
import { AcceptanceError, GameBoardSnapshot, GameState, TileState, WordleGameLogic, WordleGameLogicEvent } from '@this-is-josh-hansen/wordle-game-logic';

import ThemeController from './theme-controller';
import { useWordleKeyboardEvents } from './custom-hooks/use-wordle-keyboard-events';
import WordleView from './WordleView';
import { words } from './words';
import { useMessaging } from './custom-hooks/use-messaging';
import { daysSince, debouncedEffect, shuffle } from './utils';
import WordleKeyboard, { KeyboardKeyState } from './components/WordleKeyboard';

// seed-shuffle them, so the answer order is not following along alphabetically
shuffle(words, 42);

enum Message {
  welcome = `Welcome!`,
  won = 'You won!',
  lost = `You've lost.`,
  unknownWord = 'Not in word list',
  moreLetters = 'Need more letters',
}

type MessageStyles = 'success' | 'info' | 'error';

function App() {

  const [ gameLogic, setGameLogic ] = useState<WordleGameLogic>();
  const [ snapshot, setSnapshot ] = useState<GameBoardSnapshot>([]);
  
  const [ messages, addMessage ] = useMessaging<MessageStyles, Message>(3000);

  const [ keyboardEvents, cleanupKeyboard ] = useWordleKeyboardEvents();

  function handleKeyboardClick(key:string) {
    if (key === 'enter') {
      gameLogic?.acceptCurrentInput();
      return;
    }

    if (key === 'delete') {
      gameLogic?.removeLetterFromInput();
      return;
    }

    gameLogic?.addLetterToInput(key);
  }

  // const [ keyboardStates, setKeyboardStates ] = useState<Record<string, KeyboardKeyState>>({});

  const keyboardStates = useMemo(() => {
    const states: Record<string, KeyboardKeyState> = {};

    for (const c of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
      states[c] = KeyboardKeyState.unused;
    }
    for (const row of snapshot.filter(row => row.flipped)) {
      for (const tile of row.tiles) {
        switch (tile.state) {
          
          case TileState.correct:
            states[tile.letter] = KeyboardKeyState.correct;
            break;
          
          case TileState.near:
            if (states[tile.letter] !== KeyboardKeyState.correct) {
              states[tile.letter] = KeyboardKeyState.near;
            }
            break;
          
          case TileState.absent:
            if (states[tile.letter] === KeyboardKeyState.unused) {
              states[tile.letter] = KeyboardKeyState.absent;
            }
            break;

        }
      }
    }

    return states;
  }, [snapshot]);
  
  useEffect(debouncedEffect(() => {
    if (!gameLogic) {
      (async () => {
        console.log('Loading new game...');
        await (async () => new Promise(resolve => setTimeout(resolve, 200)))();
        console.log('Starting new game!');
        const answerIndex = daysSince(new Date('2024/08/14')) % words.length;
        const answer = words[answerIndex];
        
        console.log(`Word count: ${words.length.toLocaleString()}`);
        console.groupCollapsed('answer');
        console.log(answer);
        console.groupEnd();
        
        const newLogic = new WordleGameLogic(answer, words);
        setSnapshot(newLogic.board);
        setGameLogic(newLogic);
      })();
      return;
    }
    
    console.log(`Welcoming the user`);
    addMessage('info', Message.welcome);

    const gameEndCallbacks = [

      // stop listening to the keyboard
      cleanupKeyboard,

      // When the game has a new snapshot, pass it on to the GameView
      gameLogic.on(WordleGameLogicEvent.boardUpdate, setSnapshot),

      // When the game has a new state, tell the user
      gameLogic.on(WordleGameLogicEvent.stateUpdate, state => {
        if (state !== GameState.playing) {
          endGame();
        }

        if (state === GameState.won) {
          addMessage('success', Message.won);
        }

        if (state === GameState.lost) {
          addMessage('error', Message.lost);
        }
      }),
      
      // Handle game errors
      gameLogic.on(WordleGameLogicEvent.error, er => {
        console.warn(er);

        switch (er) {
          case AcceptanceError.unknown_word:
            addMessage('error', Message.unknownWord);
            break;
          
          case AcceptanceError.letter_count:
            addMessage('error', Message.moreLetters);
            break;
        }
      }),
      
      // Bind keyboard events to the game logic
      keyboardEvents.current.on('char', (char) => gameLogic.addLetterToInput(char)),
      keyboardEvents.current.on('enter', () => gameLogic.acceptCurrentInput()),
      keyboardEvents.current.on('delete', () => gameLogic.removeLetterFromInput()),
    ];
    
    /**
     * Removes all listeners that were created during game setup
     */
    function endGame() {
      for (const cb of gameEndCallbacks) {
        cb();
      }
    }

    return endGame;
  }), [gameLogic]);
  
  return <>
    <header>
      <h1>Wordle</h1>
      <ThemeController></ThemeController>
    </header>
    <main>
      {
        !gameLogic && <>
          <div className='loading'>loading...</div>
        </>
      }
      {
        gameLogic && <>
          <div className='messages'>{
            messages.map(({content, style, key}) => <div key={`item-${key}`} className={`messages__message messages__message--${style}`}>{ content }</div>)
          }</div>
          <WordleView snapshot={snapshot}></WordleView>
          <WordleKeyboard states={keyboardStates} onKeydown={handleKeyboardClick}></WordleKeyboard>
        </>
      }
    </main>
    <footer>
      <p>This page was created to demonstrate the skills of Josh Hansen.</p>
    </footer>
  </>;
}

export default App
