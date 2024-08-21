import { GameBoardSnapshot } from "@this-is-josh-hansen/wordle-game-logic";
import "./WordleView.scss";

export default function WordleView({snapshot}:{snapshot:GameBoardSnapshot}) {
  return <>
    <table className="wordle-box flip-container">
      <tbody>
        {
          snapshot.map(({flipped, tiles}, y) => <tr key={`row-${y}`}>{
            tiles.map(({letter, state}, x) => <td key={`char-${y}-${x}`}>{
              <div
                className={`flipper ${flipped ? 'flipper--flipped' : ''}`}
                style={{ transitionDelay:`${x * 250}ms` }}
              >
                <div className={`front character character--${letter ? 'guess' : 'empty'}`}>{ letter }</div>
                <div className={`back  character character--${state}`}>{ letter }</div>
              </div>
            }</td>)
          }</tr>)
        }
      </tbody>
    </table>
  </>;
}
