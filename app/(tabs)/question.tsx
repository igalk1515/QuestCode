import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import rawProblems from '../../problems.json';

import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

type Question = {
  id: number;
  problem: string;
  difficulty: string;
  description: string;
  code?: string;
  hints?: string[];
  examples?: {
    input: string;
    output: string;
    explanation: string;
  }[];
};

type Subject = {
  subject: string;
  questions: Question[];
};

const problemsData = rawProblems as Subject[];

export default function QuestionScreen() {
  const scale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      // scale.value = withTiming(1); // smoothly reset to original size
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const { id, subject } = useLocalSearchParams<{
    id: string;
    subject: string;
  }>();

  const subjectData = problemsData.find((s) => s.subject === subject);
  const question = subjectData?.questions.find((q) => q.id === parseInt(id));

  if (!subjectData || !question) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Question not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={animatedStyle}>
          <Text style={styles.title}>{question.problem}</Text>
          <Text style={styles.meta}>Difficulty: {question.difficulty}</Text>
          <Text style={styles.description}>{question.description}</Text>

          {question.examples?.length && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🧪 Examples</Text>
              {question.examples.map((ex, idx) => (
                <View key={idx} style={styles.example}>
                  <Text style={styles.exampleText}>👉 Input: {ex.input}</Text>
                  <Text style={styles.exampleText}>✅ Output: {ex.output}</Text>
                  <Text style={styles.exampleExplanation}>
                    📝 {ex.explanation}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {question.hints?.length && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 Hints</Text>
              {question.hints.map((hint, index) => {
                const [visible, setVisible] = React.useState(false);
                return (
                  <View key={index} style={styles.hintBlock}>
                    <Text
                      style={styles.hintToggle}
                      onPress={() => setVisible(!visible)}
                    >
                      {visible
                        ? `🔽 Hint ${index + 1}`
                        : `▶️ Hint ${index + 1}`}
                    </Text>
                    {visible && <Text style={styles.hint}>{hint}</Text>}
                  </View>
                );
              })}
            </View>
          )}
        </Animated.View>
      </GestureDetector>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  hintBlock: {
    marginBottom: 10,
  },
  hintToggle: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 4,
  },

  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  hint: {
    fontSize: 16,
    marginBottom: 4,
  },
  example: {
    marginBottom: 16,
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 6,
  },
  exampleText: {
    fontSize: 15,
  },
  exampleExplanation: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
    color: '#555',
  },
});
