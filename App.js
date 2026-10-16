import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { getPokemon } from './src/api';
import AppNavigator from './src/navigation/AppNavigator';
import { TeamProvider } from './src/context/TeamContext';

export default function App() {

  useEffect(() => {
  getPokemon()
    .then(data => {
      console.log(data.results);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}, []);


  return (
    <View style={styles.container}>

<TeamProvider>
  <AppNavigator />
</TeamProvider>

      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
