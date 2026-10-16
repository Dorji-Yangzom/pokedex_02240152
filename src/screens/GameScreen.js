import { View, Text, Image, Pressable, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { getPokemonDetails } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';


function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

function getLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function isNextDay(previousDate, today) {
  const [year, month, day] = previousDate.split('-').map(Number);

  const nextDate = new Date(year, month - 1, day);
  nextDate.setDate(nextDate.getDate() + 1);

  return getLocalDate(nextDate) === today;
}

export default function GameScreen() {
    const [pokemonId, setPokemonId] = useState(null);
    const [pokemon, setPokemon] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lastPlayedDate, setLastPlayedDate] = useState(null);
    const [gameLoaded, setGameLoaded] = useState(false);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    useEffect(() => {
  async function loadGameProgress() {
    try {
      const savedProgress = await AsyncStorage.getItem('pokemonGameProgress');

      if (savedProgress !== null) {
        const data = JSON.parse(savedProgress);

        setScore(data.score ?? 0);
        setStreak(data.streak ?? 0);
        setLastPlayedDate(data.lastPlayedDate ?? null);
        setCurrentStreak(data.currentStreak ?? 0);
        setBestStreak(data.bestStreak ?? 0);
      }

    } catch (error) {
      console.log('Error loading game progress:', error);
    } finally {
      setGameLoaded(true);
    }
  }

  loadGameProgress();
}, []);

useEffect(() => {
  if (!gameLoaded) return;

  async function saveGameProgress() {
    try {
      const progress = {
        score: score,
        streak: streak,
        lastPlayedDate: lastPlayedDate,
        currentStreak: currentStreak,
        bestStreak: bestStreak,
      };

      await AsyncStorage.setItem(
        'pokemonGameProgress',
        JSON.stringify(progress)
      );

      console.log('SAVED GAME PROGRESS:', progress);

    } catch (error) {
      console.log('Error saving game progress:', error);
    }
  }

  saveGameProgress();
}, [score, streak, lastPlayedDate, currentStreak, bestStreak, gameLoaded]);


    useEffect(() => {
    const randomId = getRandomPokemonId();
    setPokemonId(randomId);
    }, []);

    useEffect(() => {
    if (pokemonId === null) return;

  async function loadPokemon() {
    try {
      const data = await getPokemonDetails(pokemonId);
      setPokemon(data);
      const wrongIds = new Set();

    while (wrongIds.size < 3) {
      const randomId = getRandomPokemonId();

      if (randomId !== pokemonId) {
      wrongIds.add(randomId);
      }
    }

    const wrongPokemon = await Promise.all(
  [...wrongIds].map(id => getPokemonDetails(id))
);

const answerOptions = [
  data.name,
  ...wrongPokemon.map(item => item.name),
];

answerOptions.sort(() => Math.random() - 0.5);

setOptions(answerOptions);

    } catch (error) {
      console.log('Error loading Pokémon:', error);
    }
  }

  loadPokemon();
}, [pokemonId]);

function checkAnswer(name) {
  if (selectedAnswer !== null || !pokemon || !gameLoaded) return;

  const correct = name === pokemon.name;

  setSelectedAnswer(name);
  setIsCorrect(correct);

  if (correct) {
  // Increase consecutive correct answers
  const newStreak = currentStreak + 1;

  setCurrentStreak(newStreak);

  // Update best streak only when a new record is reached
  if (newStreak > bestStreak) {
    setBestStreak(newStreak);
  }
} else {
  // A wrong answer breaks the current guessing streak
  setCurrentStreak(0);
}

  if (correct) {
    // Every correct answer earns one point
    setScore(previousScore => previousScore + 1);

    const today = getLocalDate();

    // Only update the streak once per day
    if (lastPlayedDate !== today) {
      if (lastPlayedDate && isNextDay(lastPlayedDate, today)) {
        setStreak(previousStreak => previousStreak + 1);
      } else {
        setStreak(1);
      }

      setLastPlayedDate(today);
    }
  }
}

function nextPokemon() {
  setSelectedAnswer(null);
  setIsCorrect(null);
  setPokemon(null);
  setOptions([]);

  let newId = getRandomPokemonId();

  while (newId === pokemonId) {
    newId = getRandomPokemonId();
  }

  setPokemonId(newId);
}

return (
  <ScrollView
    style={{
      flex: 1,
      backgroundColor: '#FFF5F8',
    }}
    contentContainerStyle={{
      alignItems: 'center',
      paddingTop: 60,
      paddingBottom: 100,
    }}
  >

    <Text
      style={{
        fontSize: 28,
        fontWeight: 'bold',
        color: '#D63384',
        textAlign: 'center',
      }}
    >
      🎮 Who's That Pokémon?
    </Text>

    <Text
  style={{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D63384',
    marginTop: 15,
    marginBottom: 10,
  }}
>
  🏆 Score: {score}     🔥 Daily Streak: {streak}
</Text>

<Text
  style={{
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D63384',
    marginBottom: 15,
    textAlign: 'center',
  }}
>
  🎯 Current Streak: {currentStreak}
  {'\n'}
  🥇 Best Streak: {bestStreak}
</Text>


{pokemon && (
  <Image
    source={{
      uri: pokemon.sprites.other['official-artwork'].front_default,
    }}
    style={{
      width: 250,
      height: 250,
      marginTop: 30,
      tintColor: selectedAnswer === null ? '#000000' : undefined,
    }}
    resizeMode="contain"
  />
)}

<Text
  style={{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D63384',
    marginTop: 20,
    marginBottom: 15,
  }}
>
  Who am I?
</Text>

{pokemon && selectedAnswer === null && !showHint && (
  <Pressable
    onPress={() => setShowHint(true)}
    style={{
      backgroundColor: '#E9D5FF',
      paddingVertical: 10,
      paddingHorizontal: 25,
      borderRadius: 20,
      marginBottom: 15,
    }}
  >
    <Text style={{ color: '#7B2CBF', fontWeight: 'bold' }}>
      💡 Show Hint
    </Text>
  </Pressable>
)}

{showHint && pokemon && selectedAnswer === null && (
  <Text
    style={{
      fontSize: 18,
      fontWeight: 'bold',
      color: '#7B2CBF',
      marginBottom: 15,
    }}
  >
    💡 Hint: Starts with {pokemon.name.charAt(0).toUpperCase()}
  </Text>
)}

{options.map((name) => (
  <Pressable
    key={name}
    onPress={() => checkAnswer(name)}
    disabled={selectedAnswer !== null}

    style={{
      backgroundColor:
        selectedAnswer !== null && name === pokemon?.name
            ? '#22C55E'
            : selectedAnswer === name && !isCorrect
            ? '#EF4444'
            : '#F472B6',

      padding: 12,
      borderRadius: 20,
      marginBottom: 10,
      width: 230,
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        color: '#0d0c10',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
      }}
    >
      {name}
    </Text>
  </Pressable>
))}

{selectedAnswer !== null && (
  <Text
    style={{
      fontSize: 22,
      fontWeight: 'bold',
      color: isCorrect ? '#16A34A' : '#DC2626',
      marginTop: 15,
    }}
  >
    {isCorrect
  ? '🎉 Correct!'
  : `😢 Wrong! It's ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}!`}
  </Text>
)}

{selectedAnswer !== null && (
  <Pressable
    onPress={nextPokemon}
    style={{
      backgroundColor: '#D63384',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 20,
      marginTop: 15,
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      }}
    >
      Next Pokémon ➡️
    </Text>
  </Pressable>
)}

    </ScrollView>
  );
}