import { View, Text, ScrollView, Pressable } from 'react-native';
import { useContext } from 'react';
import { TeamContext } from '../context/TeamContext';

export default function MyTeamScreen() {
    const { team, setTeam } = useContext(TeamContext);

    const combinedStats = {};

team.forEach(pokemon => {
  pokemon.stats.forEach(item => {
    const statName = item.stat.name;

    combinedStats[statName] =
      (combinedStats[statName] || 0) + item.base_stat;
  });
});

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#FFF5F8',
      }}
      contentContainerStyle={{
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 120,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={true}
    >

<Text
  style={{
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D63384',
    textAlign: 'center',
  }}
>
  💗 My Pokémon Team
</Text>

<Text
  style={{
    fontSize: 18,
    color: '#C2185B',
    textAlign: 'center',
    marginTop: 10,
  }}
>
  Team Members: {team.length}/6
</Text>

{team.length > 0 && (
  <View
    style={{
      backgroundColor: '#FFE0EC',
      padding: 15,
      borderRadius: 20,
      marginTop: 20,
    }}
  >
    <Text
      style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D63384',
        textAlign: 'center',
        marginBottom: 10,
      }}
    >
      📊 Combined Base Stats
    </Text>

    {Object.entries(combinedStats).map(([name, total]) => (
      <Text
        key={name}
        style={{
          fontSize: 16,
          color: '#880E4F',
          marginBottom: 6,
          textTransform: 'capitalize',
        }}
      >
        {name.replace(/-/g, ' ')}: {total}
      </Text>
    ))}
  </View>
)}

{team.map(pokemon => (
  <View
    key={pokemon.id}
    style={{
      backgroundColor: '#FFE0EC',
      padding: 15,
      borderRadius: 20,
      marginTop: 15,
      alignItems: 'center',
    }}
  >
    <Text
      style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: '#D63384',
        textTransform: 'capitalize',
      }}
    >
      {pokemon.name}
    </Text>

<Pressable
  onPress={() => {
    setTeam(previousTeam =>
      previousTeam.filter(item => item.id !== pokemon.id)
    );
  }}
  style={{
    backgroundColor: '#121912',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    marginTop: 15,
    alignItems: 'center',
  }}
>
  <Text
    style={{
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    }}
  >
    ❌ Remove
  </Text>
</Pressable>

  </View>
))}

    </ScrollView>
  );
}