import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AIChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
      };
    }
  }, []);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate AI response (replace with API call)
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: "AI response", sender: "ai" }]);
      }, 1000);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Card className="w-full max-w-2xl h-[80vh] flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div key={index} className={`p-2 rounded-lg ${msg.sender === "user" ? "bg-blue-500 self-end" : "bg-gray-700 self-start"}`}>
              {msg.text}
            </div>
          ))}
        </CardContent>
        <div className="flex items-center p-4 border-t border-gray-700">
          <Button variant="ghost" onClick={startListening} className={listening ? "text-red-500" : "text-gray-400"}>
            <Mic />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 mx-2 text-black"
            placeholder="Type a message..."
          />
          <Button onClick={handleSend}>
            <Send />
          </Button>
        </div>
      </Card>
    </div>
  );
}
