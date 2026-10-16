import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PokedexScreen from '../screens/PokedexScreen';
import PokemonDetailScreen from '../screens/PokemonDetailScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import GameScreen from '../screens/GameScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#D63384',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#FFF0F5',
          height: 65,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Pokédex"
        component={PokedexScreen}
      />

      <Tab.Screen
        name="My Team"
        component={MyTeamScreen}
      />

      <Tab.Screen name="Game" component={GameScreen} />
      
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
            name="Main"
            component={MainTabs}
            options={{ headerShown: false }}
        />
        <Stack.Screen name="PokemonDetail" component={PokemonDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}