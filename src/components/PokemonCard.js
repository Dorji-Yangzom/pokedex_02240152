import { View, Text, Image, Pressable } from 'react-native';

export default function PokemonCard({ name, id, imageUrl, onPress }) {
    return(
        <Pressable

onPress={onPress}
style={{
  width: '48%',
  alignItems: 'center',
  padding: 15,
  marginBottom: 15,
  backgroundColor: '#E9D5FF',
  borderRadius: 20,
  elevation: 3,
}}
>


  <Image
    source={{ uri: imageUrl }}
    style={{ width: 110, height: 110 }}
  />

  <Text
    style={{
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#3c3b3d',
    textTransform: 'capitalize',
}}
  >
    #{id} - {name}
  </Text>
</Pressable>
    )

}