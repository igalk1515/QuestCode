import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import problemsData from '../../problems.json';

type Question = {
  id: number;
  title: string;
  difficulty: string;
  description: string;
};

type Subject = {
  subject: string;
  questions: Question[];
};

export default function SubjectListScreen() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const router = useRouter();

  useEffect(() => {
    setSubjects(problemsData); // Load subjects and questions from JSON
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Select a Question</Text>
      {subjects.map((subject) => (
        <View key={subject.subject} style={styles.subjectBlock}>
          <Text style={styles.subjectText}>{subject.subject}</Text>
          {subject.questions.map((question) => (
            <TouchableOpacity
              key={question.id}
              style={styles.questionCard}
              onPress={() =>
                router.push({
                  pathname: '/(tabs)/question',
                  params: {
                    id: question.id.toString(),
                    subject: subject.subject,
                  },
                })
              }
            >
              <Text style={styles.questionText}>{question.title}</Text>
              <Text style={styles.difficulty}>{question.difficulty}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subjectBlock: {
    marginBottom: 24,
  },
  subjectText: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  questionCard: {
    backgroundColor: '#f2f2f2',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  difficulty: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
