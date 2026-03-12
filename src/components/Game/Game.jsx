import { useState, useEffect, useCallback } from 'react';
import { POKEMON, getCryUrl } from '../../data/pokemon';
import { useGameQueue } from '../../hooks/useGameQueue';
import { useSound } from '../../hooks/useSound';
import { shuffle } from '../../utils/shuffle';
import { PokemonCard } from './PokemonCard';
import { AnswerButton } from './AnswerButton';
import { ScoreBar } from './ScoreBar';
import './Game.css';

function pickChoices(correct, allPokemon) {
  const wrong = shuffle(allPokemon.filter((p) => p.id !== correct.id)).slice(0, 2);
  return shuffle([correct, ...wrong]);
}

export function Game({ favorites, onToggleFavorite }) {
  const { currentPokemon, advance } = useGameQueue();
  const { play } = useSound();

  const [choices, setChoices] = useState(() => pickChoices(currentPokemon, POKEMON));
  const [selectedId, setSelectedId] = useState(null);
  const [answerStatus, setAnswerStatus] = useState('unanswered');
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    setChoices(pickChoices(currentPokemon, POKEMON));
    setSelectedId(null);
    setAnswerStatus('unanswered');
  }, [currentPokemon]);

  const handleAnswer = useCallback(
    (pokemon) => {
      if (answerStatus !== 'unanswered') return;
      const isCorrect = pokemon.id === currentPokemon.id;
      setSelectedId(pokemon.id);
      setAnswerStatus(isCorrect ? 'correct' : 'wrong');
      setScore((prev) => ({
        correct: prev.correct + (isCorrect ? 1 : 0),
        total: prev.total + 1,
      }));
      if (isCorrect) {
        play(getCryUrl(currentPokemon.id));
      }
    },
    [answerStatus, currentPokemon, play]
  );

  const handleNext = useCallback(() => {
    advance();
  }, [advance]);

  const answered = answerStatus !== 'unanswered';

  function getButtonStatus(pokemon) {
    if (!answered) return 'idle';
    if (pokemon.id === currentPokemon.id) {
      return answerStatus === 'correct' && selectedId === pokemon.id ? 'correct' : 'reveal';
    }
    if (pokemon.id === selectedId) return 'wrong';
    return 'idle';
  }

  return (
    <div className="game">
      <ScoreBar correct={score.correct} total={score.total} />

      <div className="game__content">
        <p className="game__prompt">Who's that Pokémon?</p>

        <PokemonCard
          pokemon={currentPokemon}
          isFavorite={favorites.has(currentPokemon.id)}
          onToggleFavorite={onToggleFavorite}
        />

        <div className="game__buttons">
          {choices.map((pokemon) => (
            <AnswerButton
              key={pokemon.id}
              pokemon={pokemon}
              status={getButtonStatus(pokemon)}
              onClick={() => handleAnswer(pokemon)}
              disabled={answered}
            />
          ))}
        </div>

        {answered && (
          <button className="game__next-btn" onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
