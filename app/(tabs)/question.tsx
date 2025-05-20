import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import rawProblems from '../../problems.json';
import solutionData from '../../solutions.json';

import { Gesture } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import * as Speech from 'expo-speech';
import { Button } from 'react-native';

const MIN_SCALE = 0.8;

type Question = {
  id: number;
  title: string;
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

  const pinchGesture = Gesture.Pinch().onUpdate((e) => {
    scale.value = e.scale;
  });

  const animatedStyle = useAnimatedStyle(() => {
    const clampedScale = Math.max(scale.value, 1); // prevent zooming out too far
    return {
      transform: [{ scale: clampedScale }],
      width: `${clampedScale * 100}%`, // scale layout width
      height: `${clampedScale * 100}%`, // scale layout height
    };
  });

  const { id, subject } = useLocalSearchParams<{
    id: string;
    subject: string;
  }>();

  const subjectData = problemsData.find((s) => s.subject === subject);
  const question = subjectData?.questions.find((q) => q.id === parseInt(id));

  const [visibleHints, setVisibleHints] = useState<boolean[]>(
    question?.hints?.map(() => false) || []
  );

  const solution = question
    ? solutionData.find((entry) => entry.code === question.code)
    : undefined;
  const [showCode, setShowCode] = React.useState(false);

  const toggleHint = (index: number) => {
    setVisibleHints((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  const speakExplanation = () => {
    const description = question ? question.description : '';
    const approach = solution?.solution?.approach;

    let toSpeak = `Problem: ${description}.`;
    if (approach) {
      toSpeak += ` Here's how to solve it: ${approach}`;
    }

    Speech.speak(toSpeak, {
      rate: 0.85, // ✅ 0.5 is slow, 1.0 is normal
      pitch: 1.5, // optional: adjust tone
    });
  };

  if (!subjectData || !question) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>❌ Question not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <GestureDetector gesture={pinchGesture}>
          <Animated.View style={[styles.zoomContainer, animatedStyle]}>
            <Text style={styles.title}>{question.title}</Text>
            <Text style={styles.meta}>Difficulty: {question.difficulty}</Text>
            <Text style={styles.description}>{question.description}</Text>

            {question.examples?.length && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>🧪 Examples</Text>
                {question.examples.map((ex, idx) => (
                  <View key={idx} style={styles.example}>
                    <Text style={styles.exampleText}>👉 Input: {ex.input}</Text>
                    <Text style={styles.exampleText}>
                      ✅ Output: {ex.output}
                    </Text>
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
                {question.hints.map((hint, index) => (
                  <View key={index} style={styles.hintBlock}>
                    <Text
                      style={styles.hintToggle}
                      onPress={() => toggleHint(index)}
                    >
                      {visibleHints[index]
                        ? `🔽 Hint ${index + 1}`
                        : `▶️ Hint ${index + 1}`}
                    </Text>
                    {visibleHints[index] && (
                      <Text style={styles.hint}>{hint}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {solution?.solution?.codeSnippet && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>💻 JavaScript Solution</Text>
                <Text
                  style={styles.hintToggle}
                  onPress={() => setShowCode(!showCode)}
                >
                  {showCode ? '🔽 Hide Code' : '▶️ Show Code'}
                </Text>
                {showCode && (
                  <View style={styles.codeBlock}>
                    <Text style={styles.codeText}>
                      {solution.solution.codeSnippet}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <Button
              title="🔊 Read Problem & Solution"
              onPress={speakExplanation}
            />
          </Animated.View>
        </GestureDetector>
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
    minWidth: '100%',
  },
  zoomContainer: {
    padding: 16,
    minWidth: '100%',
    minHeight: '100%',
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
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
  hintBlock: {
    marginBottom: 10,
  },
  hintToggle: {
    fontSize: 16,
    color: '#007bff',
    marginBottom: 4,
  },
  hint: {
    fontSize: 16,
    marginBottom: 4,
  },

  codeBlock: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  codeText: {
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
    fontSize: 14,
    color: '#333',
  },
});
