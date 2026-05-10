import { useState, useEffect, useCallback } from 'react';
import { POKEMON, getCryUrl } from '../../data/pokemon';
import { getPronunciation } from '../../data/pronunciations';
import { useSound } from '../../hooks/useSound';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import { shuffle } from '../../utils/shuffle';
import { PokemonCard } from './PokemonCard';
import { AnswerButton } from './AnswerButton';
import './Game.css';

function pickChoices(correct, allPokemon) {
  const wrong = shuffle(allPokemon.filter((p) => p.id !== correct.id)).slice(0, 2);
  return shuffle([correct, ...wrong]);
}

export function Game({ favorites, onToggleFavorite, currentPokemon, onAdvance, onScoreUpdate, kidsMode }) {
  const { play } = useSound();

  const [choices, setChoices] = useState(() => pickChoices(currentPokemon, POKEMON));
  const [selectedId, setSelectedId] = useState(null);
  const [answerStatus, setAnswerStatus] = useState('unanswered');
  const [pendingId, setPendingId] = useState(null);

  useEffect(() => {
    setChoices(pickChoices(currentPokemon, POKEMON));
    setSelectedId(null);
    setAnswerStatus('unanswered');
    setPendingId(null);
    window.speechSynthesis?.cancel();
  }, [currentPokemon]);

  function submitAnswer(pokemon) {
    const isCorrect = pokemon.id === currentPokemon.id;
    setSelectedId(pokemon.id);
    setAnswerStatus(isCorrect ? 'correct' : 'wrong');
    onScoreUpdate((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    if (isCorrect) {
      play(getCryUrl(currentPokemon.id), 0.5);
    }
  }

  const handleAnswer = useCallback(
    (pokemon) => {
      if (answerStatus !== 'unanswered') return;

      if (kidsMode) {
        if (pendingId === pokemon.id) {
          setPendingId(null);
          window.speechSynthesis?.cancel();
          submitAnswer(pokemon);
        } else {
          window.speechSynthesis?.cancel();
          const utt = new SpeechSynthesisUtterance(getPronunciation(pokemon.name));
          utt.lang = 'en-US';
          const voices = window.speechSynthesis.getVoices();
          utt.voice = voices.find(v => v.name === 'Samantha') || voices.find(v => v.lang === 'en-US') || null;
          window.speechSynthesis?.speak(utt);
          setPendingId(pokemon.id);
        }
        return;
      }

      submitAnswer(pokemon);
    },
    [answerStatus, currentPokemon, onScoreUpdate, play, kidsMode, pendingId]
  );

  const answered = answerStatus !== 'unanswered';

  const { details, loading: detailsLoading } = usePokemonDetails(currentPokemon.id, answered);

  function getButtonStatus(pokemon) {
    if (!answered) {
      if (kidsMode && pendingId === pokemon.id) return 'pending';
      return 'idle';
    }
    if (pokemon.id === currentPokemon.id) {
      return answerStatus === 'correct' ? 'correct' : 'reveal';
    }
    if (pokemon.id === selectedId) return 'wrong';
    if (answerStatus === 'wrong') return 'dimmed';
    return 'idle';
  }

  return (
    <div className="game">
      <div className="game__content">
        <p className="game__prompt">Who's that Pokémon?</p>

        <PokemonCard
          pokemon={currentPokemon}
          isFavorite={favorites.has(currentPokemon.id)}
          onToggleFavorite={onToggleFavorite}
          answered={answered}
          details={details}
          loading={detailsLoading}
        />

        {answered && (
          <p className={`game__feedback game__feedback--${answerStatus}`}>
            {answerStatus === 'correct'
              ? "🎉 Yes! That's right!"
              : `😢 Nope! It was ${currentPokemon.name}!`}
          </p>
        )}

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
          <button className="game__next-btn" onClick={onAdvance}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
