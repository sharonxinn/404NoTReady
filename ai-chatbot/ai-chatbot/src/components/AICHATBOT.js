import { useState, useEffect, useRef } from "react";
import { Mic, Send, History, Image, FileText, X } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './chatbot.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Language responses
const languageResponses = {
  en: {
    introduction: "Hello! My name is Munch. How can I help you with your business today?",
    help: "I'm your Assistant Munch. How can I help with your business today?\n\nTry asking me to:\n- Generate a business report\n- Show total sales today/this week/this month\n- Give price suggestions\n- Provide marketing strategy advice\n- Share customer engagement tips\n- Analyze product images for marketing suggestions",
    report: "Business Performance Report",
    download: "Download Report",
    error: "Sorry, I couldn't understand that. Could you please rephrase?",
  },
  ms: {
    introduction: "Helo! Nama saya Munch. Bagaimana saya boleh membantu anda hari ini?",
    help: "Saya Pembantu AI Pedagang anda. Bagaimana saya boleh membantu perniagaan anda hari ini?\n\nCuba minta saya:\n- Hasilkan laporan perniagaan\n- Tunjukkan jumlah jualan hari/minggu/bulan ini\n- Beri cadangan harga\n- Berikan nasihat strategi pemasaran\n- Kongsi tip penglibatan pelanggan\n- Analisa imej produk untuk cadangan pemasaran",
    report: "Laporan Prestasi Perniagaan",
    download: "Muat Turun Laporan",
    error: "Maaf, saya tidak faham. Boleh anda nyatakan semula?",
  },
  zh: {
    introduction: "你好！我叫 Munch。今天有什么可以帮您的吗？",
    help: "我是您的商业AI助手。今天有什么可以帮您的吗？\n\n您可以让我：\n- 生成业务报告\n- 显示今天/本周/本月的总销售额\n- 提供价格建议\n- 提供营销策略建议\n- 分享客户参与技巧\n- 分析产品图片获取营销建议",
    report: "业务表现报告",
    download: "下载报告",
    error: "抱歉，我不太明白。请您重新表述一下好吗？",
  }
};

// Detect language function
const detectLanguage = (text) => {
  // Simple detection based on common words
  const chineseChars = /[\u4e00-\u9fff]/;
  const malayWords = /\b(saya|anda|hari|ini|boleh|dengan)\b/i;
  
  if (chineseChars.test(text)) return 'zh';
  if (malayWords.test(text)) return 'ms';
  return 'en'; // default to English
};

export default function MerchantAIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [image, setImage] = useState(null);
  const [salesData, setSalesData] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [recognitionError, setRecognitionError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initial introduction
  useEffect(() => {
    const introMessage = {
      text: languageResponses[currentLanguage].introduction,
      sender: "ai",
      type: "text",
      timestamp: new Date().toISOString()
    };
    setMessages([introMessage]);
  }, [currentLanguage]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const initializeSpeechRecognition = () => {
      if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
        setRecognitionError(
          currentLanguage === 'zh' ? "您的浏览器不支持语音识别" :
          currentLanguage === 'ms' ? "Pelayar anda tidak menyokong pengenalan suara" :
          "Speech recognition is not supported in your browser"
        );
        return;
      }
  
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set initial language based on currentLanguage state
      recognitionRef.current.lang = 
        currentLanguage === 'zh' ? 'zh-CN' :
        currentLanguage === 'ms' ? 'ms-MY' :
        'en-US';
  
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setRecognitionError(null);
        
        // Detect language from voice input
        const detectedLang = detectLanguage(transcript);
        setCurrentLanguage(detectedLang);
        
        // Update recognition language for next use
        recognitionRef.current.lang = 
          detectedLang === 'zh' ? 'zh-CN' :
          detectedLang === 'ms' ? 'ms-MY' :
          'en-US';
      };
  
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setListening(false);
        setRecognitionError(
          currentLanguage === 'zh' ? `语音识别错误: ${getRecognitionError(event.error)}` :
          currentLanguage === 'ms' ? `Ralat pengenalan suara: ${getRecognitionError(event.error)}` :
          `Speech recognition error: ${getRecognitionError(event.error)}`
        );
      };
  
      recognitionRef.current.onend = () => {
        setListening(false);
      };
    };
  
    initializeSpeechRecognition();

    // Load history from localStorage
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    // Mock sales data - replace with your API call
    setSalesData({
      today: 1250,
      thisWeek: 8750,
      thisMonth: 32500
    });
  }, []);

  const getRecognitionError = (errorCode) => {
    const errors = {
      'no-speech': 'No speech was detected',
      'audio-capture': 'No microphone was found',
      'not-allowed': 'Permission to use microphone was denied',
      'aborted': 'Listening was aborted',
      'network': 'Network communication failed',
      'not-allowed': 'User denied permission',
      'service-not-allowed': 'Browser doesn\'t support speech recognition',
      'bad-grammar': 'Error in speech recognition grammar',
      'language-not-supported': 'Language not supported'
    };
    return errors[errorCode] || `Error occurred (${errorCode})`;
  };

  const generateBusinessReport = (lang = 'en') => {
    const reports = {
      en: {
        title: "Business Performance Report",
        date: new Date().toLocaleDateString(),
        sales: salesData,
        topProducts: ["BMW Taper", "Model X", "Product Z"],
        customerGrowth: "12% increase this month",
        inventoryStatus: "85% of products in stock",
        recommendations: [
          "Increase marketing for BMW Taper during weekends",
          "Consider bundle deals for Model X",
          "Restock Product Z within 2 weeks"
        ]
      },
      ms: {
        title: "Laporan Prestasi Perniagaan",
        date: new Date().toLocaleDateString(),
        sales: salesData,
        topProducts: ["BMW Taper", "Model X", "Product Z"],
        customerGrowth: "Peningkatan 12% bulan ini",
        inventoryStatus: "85% produk dalam stok",
        recommendations: [
          "Tingkatkan pemasaran untuk BMW Taper pada hujung minggu",
          "Pertimbangkan tawaran pakej untuk Model X",
          "Isi semula stok Product Z dalam masa 2 minggu"
        ]
      },
      zh: {
        title: "业务表现报告",
        date: new Date().toLocaleDateString(),
        sales: salesData,
        topProducts: ["BMW Taper", "Model X", "Product Z"],
        customerGrowth: "本月增长12%",
        inventoryStatus: "85%的产品有库存",
        recommendations: [
          "在周末增加BMW Taper的营销",
          "考虑为Model X提供捆绑交易",
          "两周内补货Product Z"
        ]
      }
    };
    return reports[lang] || reports.en;
  };

  const getVisualizationData = (timeframe, lang = 'en') => {
    const now = new Date();
    let labels = [];
    let values = [];
    let title = '';
    let backgroundColor = 'rgba(54, 162, 235, 0.5)';
    let borderColor = 'rgba(54, 162, 235, 1)';

    const titles = {
      today: {
        en: "Today's Sales by Hour",
        ms: "Jualan Mengikut Jam Hari Ini",
        zh: "今日每小时销售额"
      },
      week: {
        en: "This Week's Sales",
        ms: "Jualan Minggu Ini",
        zh: "本周销售额"
      },
      month: {
        en: "This Month's Sales",
        ms: "Jualan Bulan Ini",
        zh: "本月销售额"
      }
    };

    if (timeframe === 'today') {
      title = titles.today[lang];
      labels = Array.from({length: 24}, (_, i) => `${i}:00`);
      values = Array.from({length: 24}, (_, i) => {
        if (i < 8) return Math.floor(Math.random() * 100) + 50;
        if (i < 12) return Math.floor(Math.random() * 300) + 200;
        if (i < 17) return Math.floor(Math.random() * 500) + 300;
        if (i < 20) return Math.floor(Math.random() * 400) + 200;
        return Math.floor(Math.random() * 100) + 50;
      });
    } else if (timeframe === 'week') {
      title = titles.week[lang];
      const days = lang === 'en' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] :
                  lang === 'ms' ? ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'] :
                  ['日', '一', '二', '三', '四', '五', '六'];
      labels = days;
      values = days.map((_, i) => {
        if (i === 0 || i === 6) return Math.floor(Math.random() * 2000) + 1500;
        return Math.floor(Math.random() * 1500) + 800;
      });
      backgroundColor = 'rgba(75, 192, 192, 0.5)';
      borderColor = 'rgba(75, 192, 192, 1)';
    } else {
      title = titles.month[lang];
      const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
      labels = Array.from({length: daysInMonth}, (_, i) => 
        lang === 'zh' ? `${i+1}日` : `Day ${i+1}`);
      values = Array.from({length: daysInMonth}, (_, i) => {
        if (i === 14 || i === 29) return Math.floor(Math.random() * 2500) + 2000;
        return Math.floor(Math.random() * 1500) + 800;
      });
      backgroundColor = 'rgba(153, 102, 255, 0.5)';
      borderColor = 'rgba(153, 102, 255, 1)';
    }

    return {
      labels,
      datasets: [{
        label: lang === 'en' ? 'Sales ($)' : 
               lang === 'ms' ? 'Jualan ($)' : '销售额 ($)',
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      }],
      title
    };
  };

  const handleAIResponse = (userInput, lang = 'en') => {
    let response = { text: "", type: "text" };
    const inputLower = userInput.toLowerCase();
    const langResponses = languageResponses[lang] || languageResponses.en;

    // Business report generation
    if (inputLower.includes("report") || inputLower.includes("laporan") || inputLower.includes("报告")) {
      const report = generateBusinessReport(lang);
      response = {
        text: JSON.stringify(report, null, 2),
        type: "report",
        download: true,
        timestamp: new Date().toISOString()
      };
    }
    // Sales visualization
    else if (inputLower.includes("today") || inputLower.includes("hari ini") || inputLower.includes("今天")) {
      const data = getVisualizationData('today', lang);
      response = {
        text: lang === 'en' ? `Today's sales: $${salesData.today}` :
              lang === 'ms' ? `Jualan hari ini: $${salesData.today}` :
              `今日销售额: $${salesData.today}`,
        type: "chart",
        chartData: data,
        timestamp: new Date().toISOString()
      };
    }
    else if (inputLower.includes("week") || inputLower.includes("minggu") || inputLower.includes("周")) {
      const data = getVisualizationData('week', lang);
      response = {
        text: lang === 'en' ? `This week's sales: $${salesData.thisWeek}` :
              lang === 'ms' ? `Jualan minggu ini: $${salesData.thisWeek}` :
              `本周销售额: $${salesData.thisWeek}`,
        type: "chart",
        chartData: data,
        timestamp: new Date().toISOString()
      };
    }
    else if (inputLower.includes("month") || inputLower.includes("bulan") || inputLower.includes("月")) {
      const data = getVisualizationData('month', lang);
      response = {
        text: lang === 'en' ? `This month's sales: $${salesData.thisMonth}` :
              lang === 'ms' ? `Jualan bulan ini: $${salesData.thisMonth}` :
              `本月销售额: $${salesData.thisMonth}`,
        type: "chart",
        chartData: data,
        timestamp: new Date().toISOString()
      };
    }
    // Price suggestion
    else if (inputLower.includes("price") || inputLower.includes("harga") || inputLower.includes("价格")) {
      response = {
        text: lang === 'en' ? 
          "Based on current market trends, I recommend:\n\n" +
          "- BMW Taper: $12,500-$13,200 (competitor range $11,800-$13,500)\n" +
          "- Model X: $9,800-$10,500 (consider bundle deals)\n\n" +
          "Holiday season premium: +15% recommended\n" +
          "Volume discount: 5% for orders over 10 units" :
        lang === 'ms' ?
          "Berdasarkan trend pasaran semasa, saya cadangkan:\n\n" +
          "- BMW Taper: $12,500-$13,200 (harga pesaing $11,800-$13,500)\n" +
          "- Model X: $9,800-$10,500 (pertimbangkan tawaran pakej)\n\n" +
          "Premium musim perayaan: +15% disyorkan\n" +
          "Diskaun volum: 5% untuk pesanan melebihi 10 unit" :
          "根据当前市场趋势，我建议：\n\n" +
          "- BMW Taper: $12,500-$13,200 (竞争对手范围 $11,800-$13,500)\n" +
          "- Model X: $9,800-$10,500 (考虑捆绑交易)\n\n" +
          "假日季节溢价: 推荐+15%\n" +
          "批量折扣: 超过10个订单5%折扣",
        type: "advice",
        timestamp: new Date().toISOString()
      };
    }
    // Marketing strategy
    else if (inputLower.includes("marketing") || inputLower.includes("pemasaran") || inputLower.includes("营销")) {
      response = {
        text: lang === 'en' ? 
          "Marketing Strategy Recommendations:\n\n" +
          "1. Social Media: Run targeted Instagram/Facebook ads\n" +
          "2. Email Campaign: Offer 10% discount to repeat customers\n" +
          "3. Local Partnerships: Collaborate with nearby businesses\n" +
          "4. Holiday Promo: Bundle products with free accessories\n" +
          "5. Influencer Marketing: Partner with micro-influencers" :
        lang === 'ms' ?
          "Cadangan Strategi Pemasaran:\n\n" +
          "1. Media Sosial: Jalankan iklan Instagram/Facebook\n" +
          "2. Kempen Email: Tawarkan diskaun 10% kepada pelanggan tetap\n" +
          "3. Perkongsian Tempatan: Bekerjasama dengan perniagaan berdekatan\n" +
          "4. Promosi Perayaan: Tawarkan produk bundle dengan aksesori percuma\n" +
          "5. Pemasaran Influencer: Bekerjasama dengan mikro-influencer" :
          "营销策略建议:\n\n" +
          "1. 社交媒体: 在Instagram/Facebook上投放定向广告\n" +
          "2. 电子邮件营销: 为回头客提供10%折扣\n" +
          "3. 本地合作: 与附近企业合作\n" +
          "4. 节日促销: 提供附带免费配件的产品套装\n" +
          "5. 网红营销: 与微型网红合作",
        type: "advice",
        timestamp: new Date().toISOString()
      };
    }
    // Customer engagement
    else if (inputLower.includes("customer") || inputLower.includes("pelanggan") || inputLower.includes("客户")) {
      response = {
        text: lang === 'en' ? 
          "Customer Engagement Tips:\n\n" +
          "• Personalize follow-up emails after purchases\n" +
          "• Implement a loyalty rewards program\n" +
          "• Respond to all reviews within 24 hours\n" +
          "• Host monthly Q&A sessions on social media\n" +
          "• Create a referral program with incentives" :
        lang === 'ms' ?
          "Tip Penglibatan Pelanggan:\n\n" +
          "• Hantar email susulan yang diperibadikan selepas pembelian\n" +
          "• Laksanakan program ganjaran kesetiaan\n" +
          "• Balas semua ulasan dalam masa 24 jam\n" +
          "• Adakan sesi soal jawab bulanan di media sosial\n" +
          "• Buat program rujukan dengan insentif" :
          "客户参与技巧:\n\n" +
          "• 购买后发送个性化跟进邮件\n" +
          "• 实施忠诚度奖励计划\n" +
          "• 24小时内回复所有评价\n" +
          "• 在社交媒体上举办月度问答环节\n" +
          "• 创建带有激励的推荐计划",
        type: "advice",
        timestamp: new Date().toISOString()
      };
    }
    // Product image analysis
    else if (image) {
      response = {
        text: lang === 'en' ? 
          "Analyzing product image...\n\n" +
          "Detected: BMW Taper 2023 Model\n" +
          "Recommended Price: $12,750\n" +
          "Key Selling Points:\n" +
          "- Fuel efficient (35 mpg)\n" +
          "- Premium interior package\n" +
          "- Advanced safety features\n\n" +
          "Marketing Tagline Suggestion: 'Luxury that doesn't compromise on efficiency'" :
        lang === 'ms' ?
          "Menganalisis imej produk...\n\n" +
          "Dikesan: BMW Taper Model 2023\n" +
          "Harga Disyorkan: $12,750\n" +
          "Ciri Jualan Utama:\n" +
          "- Jimat minyak (35 mpg)\n" +
          "- Pakej interior premium\n" +
          "- Ciri keselamatan canggih\n\n" +
          "Cadangan Slogan Pemasaran: 'Mewah tanpa kompromi kecekapan'" :
          "正在分析产品图片...\n\n" +
          "检测到: BMW Taper 2023款\n" +
          "推荐价格: $12,750\n" +
          "主要卖点:\n" +
          "- 燃油效率高(35 mpg)\n" +
          "- 高级内饰套装\n" +
          "- 先进安全功能\n\n" +
          "营销标语建议: '不妥协效率的奢华'",
        type: "imageAnalysis",
        timestamp: new Date().toISOString()
      };
    }
    // Default response
    else {
      response = {
        text: langResponses.help,
        type: "help",
        timestamp: new Date().toISOString()
      };
    }

    return response;
  };

  const handleSend = () => {
    if (input.trim()) {
      const detectedLang = detectLanguage(input);
      setCurrentLanguage(detectedLang);
      
      const userMessage = { 
        text: input, 
        sender: "user", 
        type: "text",
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setInput("");

      // Generate AI response
      setTimeout(() => {
        const aiResponse = handleAIResponse(input, detectedLang);
        const newMessages = [...messages, userMessage, { ...aiResponse, sender: "ai" }];
        
        setMessages(newMessages);
        setHistory(prev => [...prev, { 
          user: input, 
          ai: aiResponse.text, 
          timestamp: new Date().toISOString(),
          language: detectedLang
        }]);
        localStorage.setItem('chatHistory', JSON.stringify([...history, { 
          user: input, 
          ai: aiResponse.text, 
          timestamp: new Date().toISOString(),
          language: detectedLang
        }]));
        
        // Clear image after analysis
        if (image) setImage(null);
      }, 800);
    }
  };

  const renderMessageContent = (message) => {
    if (message.type === "chart") {
      return (
        <div className="message-content">
          <div className="chart-title">{message.chartData.title}</div>
          <div className="chart-message">{message.text}</div>
          <div className="chart-container">
            <Bar
              data={message.chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `$${context.raw}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return `$${value}`;
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      );
    }
    else if (message.type === "report") {
      return (
        <div className="message-content">
          <div className="report-title">{languageResponses[currentLanguage].report}</div>
          <pre className="report-content">{message.text}</pre>
          {message.download && (
            <button 
              className="download-button"
              onClick={() => {
                const blob = new Blob([message.text], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `business_report_${new Date().toISOString().slice(0,10)}.txt`;
                a.click();
              }}
              aria-label="Download report"
            >
              <FileText size={16} /> {languageResponses[currentLanguage].download}
            </button>
          )}
        </div>
      );
    }
    return <div className="message-content">{message.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}</div>;
  };

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      try {
        setListening(true);
        setRecognitionError(null);
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setRecognitionError("Error starting voice input. Please try again.");
        setListening(false);
      }
    }
  };

  const handleUploadImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setRecognitionError(currentLanguage === 'en' ? "Image size too large. Please upload an image under 5MB." :
                          currentLanguage === 'ms' ? "Saiz imej terlalu besar. Sila muat naik imej di bawah 5MB." :
                          "图片太大。请上传小于5MB的图片。");
        return;
      }
      if (!file.type.match('image.*')) {
        setRecognitionError(currentLanguage === 'en' ? "Please upload an image file (JPEG, PNG, etc.)" :
                          currentLanguage === 'ms' ? "Sila muat naik fail imej (JPEG, PNG, dll.)" :
                          "请上传图片文件(JPEG, PNG等)");
        return;
      }
      setImage(URL.createObjectURL(file));
      setRecognitionError(null);
    }
  };

  const loadHistoryItem = (item) => {
    setMessages([
      { text: item.user, sender: "user", type: "text", timestamp: item.timestamp },
      { text: item.ai, sender: "ai", type: "text", timestamp: item.timestamp }
    ]);
    setCurrentLanguage(item.language || 'en');
    setShowHistory(false);
  };

  const clearHistory = () => {
    const confirmMessage = currentLanguage === 'en' ? "Are you sure you want to clear all chat history?" :
                         currentLanguage === 'ms' ? "Adakah anda pasti mahu memadam semua sejarah sembang?" :
                         "您确定要清除所有聊天记录吗？";
    
    if (window.confirm(confirmMessage)) {
      setHistory([]);
      localStorage.removeItem('chatHistory');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-card">
        <div className="chat-header">
          <h2>Munch</h2>
          <button 
            className="history-button" 
            onClick={() => setShowHistory(!showHistory)}
            aria-label="Chat history"
          >
            <History />
          </button>
        </div>

        {showHistory && (
          <div className="history-panel">
            <div className="history-header">
              <h3>Chat History</h3>
              <button onClick={() => setShowHistory(false)} className="close-history">
                <X size={20} />
              </button>
            </div>
            <div className="history-content">
              {history.length === 0 ? (
                <p className="no-history">
                  {currentLanguage === 'en' ? "No history yet" :
                   currentLanguage === 'ms' ? "Tiada sejarah lagi" :
                   "暂无历史记录"}
                </p>
              ) : (
                <>
                  <button onClick={clearHistory} className="clear-history">
                    {currentLanguage === 'en' ? "Clear All History" :
                     currentLanguage === 'ms' ? "Padam Semua Sejarah" :
                     "清除所有历史"}
                  </button>
                  <ul>
                    {history.map((item, index) => (
                      <li key={index} onClick={() => loadHistoryItem(item)}>
                        <div className="history-item">
                          <div className="history-question">{item.user.slice(0, 50)}{item.user.length > 50 ? '...' : ''}</div>
                          <div className="history-date">
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        )}

        <div className={`chat-content ${showHistory ? 'history-open' : ''}`}>
          {recognitionError && (
            <div className="error-message">
              {recognitionError}
              <button onClick={() => setRecognitionError(null)} className="close-error">
                <X size={16} />
              </button>
            </div>
          )}

          {image && (
            <div className="image-preview">
              <img src={image} alt="Uploaded product" />
              <button 
                onClick={() => setImage(null)} 
                className="close-image"
                aria-label={currentLanguage === 'en' ? "Remove image" :
                          currentLanguage === 'ms' ? "Buang imej" :
                          "移除图片"}
              >
                <X size={16} />
              </button>
            </div>
          )}

          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.sender}`}>
              {renderMessageContent(msg)}
              <div className="message-time">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input">
          <button 
            className={`mic-button ${listening ? "listening" : ""}`} 
            onClick={startListening}
            title={currentLanguage === 'en' ? "Voice input" :
                  currentLanguage === 'ms' ? "Input suara" :
                  "语音输入"}
            aria-label={listening ? 
              (currentLanguage === 'en' ? "Stop listening" :
               currentLanguage === 'ms' ? "Berhenti mendengar" :
               "停止聆听") : 
              (currentLanguage === 'en' ? "Start voice input" :
               currentLanguage === 'ms' ? "Mula input suara" :
               "开始语音输入")}
            disabled={recognitionError && recognitionError.includes("not supported")}
          >
            <Mic />
          </button>
          
          <button className="image-button" 
            title={currentLanguage === 'en' ? "Upload product image" :
                  currentLanguage === 'ms' ? "Muat naik imej produk" :
                  "上传产品图片"}>
            <label htmlFor="image-upload" aria-label={currentLanguage === 'en' ? "Upload product image" :
                                                  currentLanguage === 'ms' ? "Muat naik imej produk" :
                                                  "上传产品图片"}>
              <Image />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUploadImage}
            />
          </button>
          
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-field"
            placeholder={currentLanguage === 'en' ? "Ask for reports, sales data, or business advice..." :
                     currentLanguage === 'ms' ? "Minta laporan, data jualan, atau nasihat perniagaan..." :
                     "询问报告、销售数据或商业建议..."}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            aria-label={currentLanguage === 'en' ? "Type your message" :
                      currentLanguage === 'ms' ? "Taip mesej anda" :
                      "输入您的消息"}
          />
          
          <button 
            className="send-button" 
            onClick={handleSend} 
            title={currentLanguage === 'en' ? "Send" :
                  currentLanguage === 'ms' ? "Hantar" :
                  "发送"}
            aria-label={currentLanguage === 'en' ? "Send message" :
                      currentLanguage === 'ms' ? "Hantar mesej" :
                      "发送消息"}
            disabled={!input.trim()}
          >
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}