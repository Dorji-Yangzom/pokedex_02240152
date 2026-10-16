import { View, Text, Image, ScrollView, Pressable } from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { getPokemonDetails } from '../api';
import { TeamContext } from '../context/TeamContext';

export default function PokemonDetailScreen({ route }) {

  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState(null);
  const { team, setTeam } = useContext(TeamContext);
  const isInTeam = team.some(item => item.id === pokemon?.id);
  const isTeamFull = team.length >= 6;

  useEffect(() => {
  getPokemonDetails(pokemonId)
    .then(data => {
      setPokemon(data);
      console.log('Pokémon name:', data.name);
    })
    .catch(error => {
      console.log('Error loading details:', error);
    });
}, [pokemonId]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#FFF5F8',
      }}
    contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 25,
        paddingBottom: 40,
      }}
    >
      <Text>Pokémon Details Screen</Text> 

      <Text
        style={{
          fontSize: 16,
          color: '#AD6787',
          marginTop: 15,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        #{pokemonId}
      </Text>

      {pokemon && (
  <>
    <Text
      style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: '#D63384',
        textTransform: 'capitalize',
        textAlign: 'center',
        marginTop: 8,
      }}
    >
      {pokemon.name}
    </Text>

    <Image
      source={{
        uri: pokemon.sprites.other['official-artwork'].front_default,
      }}

      style={{
        width: 210,
        height: 210,
        alignSelf: 'center',
        marginVertical: 12,
      }}
    />

<Text
  style={{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 15,
    textAlign: 'center',
  }}
>
  ✨ Hello There!
</Text>

<View
  style={{
    backgroundColor: '#FFE0EC',
    padding: 22,
    borderRadius: 25,
    width: '90%',
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB6D2',
    elevation: 4,
  }}
>

<Text
  style={{
    fontSize: 18,
    color: '#880E4F',
    textAlign: 'center',
    marginBottom: 14,
  }}
>
  ⚡ Type: {pokemon.types.map(item => item.type.name).join(', ')}
</Text>

<Text
  style={{
    fontSize: 18,
    color: '#880E4F',
    textAlign: 'center',
    marginBottom: 14,
  }}
>
  📏 Height: {pokemon.height / 10} m
</Text>

<Text
  style={{
    fontSize: 18,
    color: '#880E4F',
    textAlign: 'center',
    marginBottom: 5,
  }}
>
  ⚖️ Weight: {pokemon.weight / 10} kg
</Text>

</View>

<View
  style={{
    backgroundColor: '#FFE0EC',
    width: '90%',
    padding: 20,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFB6D2',
  }}
>
  <Text
    style={{
      fontSize: 22,
      fontWeight: 'bold',
      color: '#C2185B',
      textAlign: 'center',
      marginBottom: 20,
    }}
  >
    🌸 Base Stats
  </Text>

  {pokemon.stats.map(item => (
    <View key={item.stat.name} style={{ marginBottom: 15 }}>
      <Text style={{ color: '#880E4F', fontSize: 16 }}>
        {item.stat.name}: {item.base_stat}
      </Text>

      <View
  style={{
    height: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginTop: 8,
    overflow: 'hidden',
  }}
>
  <View
    style={{
      height: '100%',
      width: `${Math.min((item.base_stat / 255) * 100, 100)}%`,
      backgroundColor: '#EC4899',
      borderRadius: 10,
    }}
  />
</View>



    </View>
  ))}

  <Pressable
  disabled={isTeamFull && !isInTeam}
  onPress={() => {
    if (isInTeam) {
      setTeam(previousTeam =>
        previousTeam.filter(item => item.id !== pokemon.id)
      );
    } else if (!isTeamFull) {
      setTeam(previousTeam => [...previousTeam, pokemon]);
  }
}}

style={{
  backgroundColor:
    isTeamFull && !isInTeam ? '#9CA3AF' : '#EC4899',

  paddingVertical: 16,
  paddingHorizontal: 35,
  borderRadius: 25,
  marginTop: 25,
  marginBottom: 20,
  alignItems: 'center',
  width: '90%',
}}

>
  <Text
    style={{
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    }}
  >
    {isInTeam ? '❌ Remove from Team' : '💗 Add to Team'}

  </Text>
</Pressable>

</View>

  </>
)}


    </ScrollView>
  );
}