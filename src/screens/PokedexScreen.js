import { View, Text, FlatList, Image, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { getPokemon, getAllPokemon } from '../api';
import PokemonCard from '../components/PokemonCard';

export default function PokedexScreen({ navigation }) {

    const [pokemon, setPokemon] = useState([]);
    const [offset, setOffset] = useState(152);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const loadingRef = useRef(false);
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [allPokemon, setAllPokemon] = useState([]);

    useEffect(() => {
      getPokemon()
        .then(data => {
           setPokemon(data.results);
        })
        .catch(error => {
            console.log('Error loading Pokémon:', error);
            
            setError('Failed to load Pokémon. Please check your internet connection.');
         })

         .finally(() => {
            setInitialLoading(false);
          });
   
    }, []);

   
useEffect(() => {
  getAllPokemon()
    .then(data => {
        console.log('Total Pokémon loaded:', data.length);
        setAllPokemon(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}, []);


// Wait 300 milliseconds after typing
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(search);
  }, 300);

  return () => clearTimeout(timer);
}, [search]);


async function loadMore() {
  if (loadingRef.current) return;

  loadingRef.current = true;
  setLoadingMore(true);

  try {
    const nextOffset = offset + 20;
    const data = await getPokemon(nextOffset);

    setPokemon(previous => [...previous, ...data.results]);
    setOffset(nextOffset);

  } catch (error) {
    console.log('Error loading more:', error);
  } finally {
  loadingRef.current = false;
  setLoadingMore(false);
}
}

const filteredPokemon = allPokemon.filter(item =>
  item.name.toLowerCase().includes(debouncedSearch.toLowerCase().trim())
);



  return (

    <View style={{ flex: 1, paddingTop: 50, paddingHorizontal: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
  Dorji Yangzom's Pokédex
</Text>

<TextInput
  placeholder="🔍 Search Pokémon..."
  value={search}
  onChangeText={setSearch}
  style={{
    backgroundColor: '#f3e5f5',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 15,
  }}
/>

{error && (
  <View style={{ alignItems: 'center', marginVertical: 20 }}>
    <Text
      style={{
        color: '#DC2626',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
      }}
    >
      {error}
    </Text>

    <Pressable
      onPress={() => {
        setError(null);

        getPokemon()
          .then(data => {
            setPokemon(data.results);
          })
          .catch(() => {
            setError('Failed to load Pokémon. Please try again.');
          });
      }}
      style={{
        backgroundColor: '#D63384',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 15,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>
        🔄 Retry
      </Text>
    </Pressable>
  </View>
)}

{initialLoading && (
  <ActivityIndicator
    size="large"
    color="#EC4899"
    style={{ marginTop: 30 }}
  />
)}

<FlatList
  data={debouncedSearch.trim() ? filteredPokemon : pokemon}
  keyExtractor={(item) => item.name}

  ListEmptyComponent={
  debouncedSearch.trim() !== '' && allPokemon.length > 0 ? (
    <Text style={{ textAlign: 'center', marginTop: 30, fontSize: 18 }}>
      🔍 No Pokémon found
    </Text>
  ) : null
}

  numColumns={2}
  columnWrapperStyle={{ justifyContent: 'space-between' }}

  onEndReached={search.trim() ? undefined : loadMore}
  onEndReachedThreshold={0.2}

ListFooterComponent={
  loadingMore ? <ActivityIndicator size="large" color="#7B2CBF" /> : null
}

renderItem={({ item }) => {
    const id = item.url.split('/').filter(Boolean).pop();
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

return (

<PokemonCard
  name={item.name}
  id={id}
  imageUrl={imageUrl}
  onPress={() =>
    navigation.navigate('PokemonDetail', { pokemonId: id })
  }
/>

    );
  }}

/>
    </View>
  );
}