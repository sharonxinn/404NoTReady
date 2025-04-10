import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Image,
} from "react-native";

const Chatbot = () => {
  const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const fetchAIResponse = async (userInput) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a business AI assistant." },
              { role: "user", content: userInput },
            ],
            max_tokens: 150,
          }),
        }
      );

      const data = await response.json();
      return (
        data.choices?.[0]?.message?.content ||
        "I'm sorry, I couldn't process your request."
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Network error. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    const response = await fetchAIResponse(input);
    setMessages([...newMessages, { text: response, sender: "bot" }]);
  };


  return (
    <View style={styles.container}>
      <Image source={require("../assets/robot.png")} style={styles.logo} />
      <Text style={styles.title}>MEX Assistant</Text>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity>
            <View
              style={[
                styles.messageBubble,
                item.sender === "user" ? styles.userBubble : styles.botBubble,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Describe your question..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold" },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  userBubble: { backgroundColor: "#007bff", alignSelf: "flex-end" },
  botBubble: { backgroundColor: "#e9ecef", alignSelf: "flex-start" },
  messageText: { color: "#000", fontSize: 16 },
});

export default Chatbot;
