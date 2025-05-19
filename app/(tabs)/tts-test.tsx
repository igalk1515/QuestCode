import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Speech from 'expo-speech';

export default function TTSTestScreen() {
  const speakText = () => {
    Speech.speak(
      'This is a test of the QuestCode voice system. Let’s see how it sounds.',
      {
        language: 'en-US',
        pitch: 1,
        rate: 1,
      }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Click the button to test TTS</Text>
      <Button title="Speak" onPress={speakText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, marginBottom: 20 },
});
