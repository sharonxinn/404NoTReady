import { useState, useEffect, useRef } from "react";
import { Mic, Send, History, Image, FileText, BarChart2, Download } from "lucide-react";
import './chatbot.css';

export default function MerchantAIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [image, setImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const recognitionRef = useRef(null);

  // Pizza data for Cyberjaya region
  const pizzaData = {
    merchants: {
      pizzahut: {
        name: "Pizza Hut Cyberjaya",
        topSelling: [
          { name: "Super Supreme", price: "RM 29.90", rating: 4.7 },
          { name: "Meat Lovers", price: "RM 27.90", rating: 4.5 },
          { name: "Hawaiian Chicken", price: "RM 25.90", rating: 4.3 }
        ],
        avgPrice: "RM 25-35"
      },
      domino: {
        name: "Domino's Pizza Cyberjaya",
        topSelling: [
          { name: "ExtravaganZZa", price: "RM 31.90", rating: 4.6 },
          { name: "Cheese Burst Pepperoni", price: "RM 28.90", rating: 4.4 },
          { name: "Veggie Pizza", price: "RM 26.90", rating: 4.2 }
        ],
        avgPrice: "RM 24-32"
      },
      upizz: {
        name: "U Pizz Cyberjaya",
        topSelling: [
          { name: "Truffle Mushroom", price: "RM 33.90", rating: 4.8 },
          { name: "Spicy Chicken Ranch", price: "RM 28.90", rating: 4.5 },
          { name: "Four Cheese", price: "RM 26.90", rating: 4.4 }
        ],
        avgPrice: "RM 26-34"
      }
    },
    similarProducts: ["Calzone", "Focaccia", "Garlic Bread", "Pasta"],
    ingredients: {
      classic: ["Dough", "Tomato sauce", "Mozzarella cheese", "Pepperoni", "Mushrooms", "Bell peppers"],
      premium: ["Dough", "Tomato sauce", "Fresh mozzarella", "Prosciutto", "Arugula", "Parmesan"],
      vegetarian: ["Dough", "Tomato sauce", "Mozzarella", "Bell peppers", "Olives", "Onions", "Mushrooms"]
    }
  };

  // Initialize speech recognition
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

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }
  }, []);

  const generatePizzaReport = (analysis) => {
    const reportContent = `
      PIZZA ANALYSIS REPORT
      ---------------------
      Date: ${new Date().toLocaleDateString()}
      
      Product Identified: ${analysis.product}
      Food Category: ${analysis.category}
      
      Ingredients Analysis:
      ${analysis.ingredients.map(ing => `- ${ing}`).join('\n')}
      
      Merchant Comparison (Cyberjaya):
      ${analysis.merchants.map(m => `
      ${m.name} (Avg Price: ${m.avgPrice})
      Top Selling Pizzas:
      ${m.topSelling.map(p => `      - ${p.name}: ${p.price} (Rating: ${p.rating}/5)`).join('\n')}
      `).join('\n')}
      
      Price Suggestion: ${analysis.priceSuggestion}
      Recommended Tags: ${analysis.tags.join(', ')}
      
      Similar Products:
      ${analysis.similarProducts.join(', ')}
    `;
    
    return reportContent;
  };

  const analyzePizzaImage = () => {
    setIsAnalyzing(true);
    
    // Simulate API call to image recognition service
    setTimeout(() => {
      const analysis = {
        product: "Margherita Pizza",
        category: "Italian Cuisine",
        ingredients: pizzaData.ingredients.classic,
        merchants: Object.values(pizzaData.merchants),
        priceSuggestion: "RM 22-28 (based on local competition)",
        tags: ["Italian", "Fast Food", "Vegetarian Option"],
        similarProducts: pizzaData.similarProducts
      };
      
      const response = {
        text: `Product Detected: ${analysis.product}\n\n` +
              `Category: ${analysis.category}\n\n` +
              `Common Ingredients:\n${analysis.ingredients.map(i => `• ${i}`).join('\n')}\n\n` +
              `Top Local Merchants (Cyberjaya):\n` +
              `1. ${analysis.merchants[0].name} - ${analysis.merchants[0].topSelling[0].name} (Rating: ${analysis.merchants[0].topSelling[0].rating}/5)\n` +
              `2. ${analysis.merchants[1].name} - ${analysis.merchants[1].topSelling[0].name} (Rating: ${analysis.merchants[1].topSelling[0].rating}/5)\n` +
              `3. ${analysis.merchants[2].name} - ${analysis.merchants[2].topSelling[0].name} (Rating: ${analysis.merchants[2].topSelling[0].rating}/5)\n\n` +
              `Price Suggestion: ${analysis.priceSuggestion}\n` +
              `Recommended Tags: ${analysis.tags.join(', ')}\n` +
              `Similar Products: ${analysis.similarProducts.join(', ')}`,
        type: "pizzaAnalysis",
        reportData: generatePizzaReport(analysis)
      };
      
      setMessages(prev => [...prev, { ...response, sender: "ai" }]);
      setIsAnalyzing(false);
      setImage(null);
    }, 2000);
  };

  useEffect(() => {
    if (image) {
      analyzePizzaImage();
    }
  }, [image]);

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user", type: "text" };
      setMessages(prev => [...prev, userMessage]);
      setInput("");

      // Generate simple response
      setTimeout(() => {
        const aiResponse = {
          text: "I'm your Merchant AI Assistant specialized in food products. " ,
          type: "text",
          sender: "ai"
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
    }
  };

  const renderMessageContent = (message) => {
    if (message.type === "pizzaAnalysis") {
      return (
        <div className="message-content">
          <div className="pizza-analysis">
            <div className="analysis-text">{message.text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}</div>
            <button 
              className="download-report-btn"
              onClick={() => {
                const blob = new Blob([message.reportData], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `pizza_analysis_${new Date().toISOString().slice(0,10)}.txt`;
                a.click();
              }}
            >
              <Download size={16} /> Download Full Report
            </button>
          </div>
        </div>
      );
    }
    return <div className="message-content">{message.text}</div>;
  };

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        setMessages(prev => [...prev, { 
          text: "Analyzing uploaded image...", 
          sender: "ai", 
          type: "text" 
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <h2> Merchant AI Detect</h2>
        </div>

        <div className="chat-content">
          {isAnalyzing && (
            <div className="analyzing-overlay">
              <div className="analyzing-spinner"></div>
              <p>Analyzing image...</p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {renderMessageContent(msg)}
            </div>
          ))}
        </div>

        <div className="chat-input-container">
          <div className="chat-input">
            <button 
              className={`icon-button mic-button ${listening ? "listening" : ""}`} 
              onClick={startListening}
              title="Voice input"
            >
              <Mic size={20} />
            </button>
            
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="Ask about something or upload an image..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            
            <label className="icon-button image-button" title="Upload pizza image">
              <Image size={20} />
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleUploadImage}
              />
            </label>
            
            <button className="icon-button send-button" onClick={handleSend} title="Send">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}