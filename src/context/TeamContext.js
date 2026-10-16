import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TeamContext = createContext(null);

export function TeamProvider({ children }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function loadTeam() {
    try {
      const savedTeam = await AsyncStorage.getItem('pokemonTeam');

      if (savedTeam !== null) {
        setTeam(JSON.parse(savedTeam));
      }
    } catch (error) {
      console.log('Error loading team:', error);
    } finally {
      setLoading(false);
    }
  }

  loadTeam();
}, []);

useEffect(() => {
  if (loading) return;

  async function saveTeam() {
    try {
      await AsyncStorage.setItem(
        'pokemonTeam',
        JSON.stringify(team)
      );
    } catch (error) {
      console.log('Error saving team:', error);
    }
  }

  saveTeam();
}, [team, loading]);

if (loading) {
  return null;
}

  return (
  <TeamContext.Provider value={{ team, setTeam }}>
    {children}
  </TeamContext.Provider>
);
}
