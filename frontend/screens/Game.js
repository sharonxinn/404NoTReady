import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import he from "he";
import { useTranslation } from "react-i18next";

const API_URL = "https://the-trivia-api.com/api/questions?categories=science&tags=health";

const Game = () => {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(true);
  const [scoreList, setScoreList] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const fetchQuestions = () => {
    setLoading(true);
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        const formattedQuestions = data.map((question) => ({
          question: he.decode(question.question),
          options: [
            ...question.incorrectAnswers.map((answer) => he.decode(answer)),
            he.decode(question.correctAnswer),
          ].sort(() => Math.random() - 0.5),
          answer: he.decode(question.correctAnswer),
        }));
        setQuestions(formattedQuestions);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching quiz questions:", error));
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore((prevScore) => prevScore + 1);
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
    } else {
      setShowResult(true);
      saveScore();
    }
  };

  const saveScore = () => {
    const newScore = { score, date: new Date().toLocaleString() };
    setScoreList((prevScores) => [newScore, ...prevScores].slice(0, 5));
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(300);
    setShowResult(false);
    fetchQuestions();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("game_title")}</Text>
        <TouchableOpacity onPress={() => setShowHistory(!showHistory)}>
        <MaterialIcons name="history" size={28} color="#003366" />
        </TouchableOpacity>
      </View>
      
      {showHistory ? (
        <FlatList
          data={scoreList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.scoreItem}>
              {t("score")}: {item.score} - {item.date}
            </Text>
          )}
        />
      ) : loading ? (
        <ActivityIndicator size="large" color="#003366" />
      ) : showResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{t("your_score")}: {score} / {questions.length} 🎉</Text>
          <TouchableOpacity style={styles.button} onPress={restartQuiz}>
            <Text style={styles.buttonText}>{t("play_again")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.question}>{questions[currentQuestion].question}</Text>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionButton} onPress={() => handleAnswer(option)}>
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  quizContainer: { alignItems: "center", width: "100%" },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#000",
  },
  optionButton: {
    width: "90%",
    padding: 15,
    backgroundColor: "#003366",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  optionText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  resultContainer: { alignItems: "center", marginTop: 20 },
  resultText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  button: {
    backgroundColor: "#003366",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
  scoreItem: { fontSize: 16, marginTop: 5, color: "#000" },
});

export default Game;