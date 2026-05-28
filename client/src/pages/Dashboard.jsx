import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const [description, setDescription] = useState(''); 
  const [category, setCategory] = useState('Coding');
  const [frequency, setFrequency] = useState('Daily');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('🎯'); 
  const [loading, setLoading] = useState(true);
  const [weekDays, setWeekDays] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('themeEngineState');
    return saved ? saved === 'true' : true;
  });

  // Module 6-10 States
  const [aiReport, setAiReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardGoals, setWizardGoals] = useState('');
  const [wizardTime, setWizardTime] = useState('Morning (5 AM - 9 AM)');
  const [wizardStruggles, setWizardStruggles] = useState('');
  const [wizardResponseCards, setWizardResponseCards] = useState([]); 
  const [wizardLoading, setWizardLoading] = useState(false);
  const [showWizardOutput, setShowWizardOutput] = useState(false);
  const [recoveryData, setRecoveryData] = useState({ hasBrokenStreak: false, plan: '', habitName: '' });
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hey there! I am your AI Behavioral Coach. Ask me anything about your consistency graphs, coding streaks, or optimization patterns!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [morningBoost, setMorningBoost] = useState('');
  const [boostLoading, setBoostLoading] = useState(false);

  const categories = ['Fitness', 'Coding', 'Health', 'Mindset', 'Finance', 'Learning', 'Mindfulness', 'Productivity', 'Other'];
  const icons = ['🎯', '💻', '💪', '💧', '📚', '🧘', '🧠', '💰', '⏰', '🍳', '🍎', '🚀'];
  const colors = [
    { name: 'Indigo', hex: '#6366f1' },
    { name: 'Emerald', hex: '#10b981' },
    { name: 'Amber', hex: '#f59e0b' },
    { name: 'Rose', hex: '#f43f5e' },
    { name: 'Cyan', hex: '#06b6d4' },
  ];

  // =========================================================================
  // GITHUB STYLE MATRIX GENERATOR ENGINE (Last 90 Days Dynamic Compiler)
  // =========================================================================
  const buildTrueGithubGrid = () => {
    const gridItems = [];
    const today = new Date();
    
    const totalDaysToRender = 91; 
    const dayOfWeek = today.getDay();
    const totalSlots = totalDaysToRender + dayOfWeek;

    for (let i = totalSlots - 1; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(today.getDate() - i + dayOfWeek);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      const matchedLog = heatmapData.find(d => d.date === dateStr);
      const monthLabel = targetDate.toLocaleString('en-US', { month: 'short' });

      if (targetDate <= today) {
        gridItems.push({
          date: dateStr,
          count: matchedLog ? matchedLog.count : 0,
          month: monthLabel,
          dayNum: targetDate.getDay()
        });
      }
    }
    return gridItems;
  };

  const trueGridItems = buildTrueGithubGrid();

  const monthLabelsList = [];
  let lastProcessedMonth = "";
  trueGridItems.forEach((item, index) => {
    if (item.dayNum === 0 && item.month !== lastProcessedMonth && index < trueGridItems.length - 7) {
      lastProcessedMonth = item.month;
      monthLabelsList.push({ name: lastProcessedMonth, columnOffset: Math.floor(index / 7) });
    }
  });

  // Recharts Parsing Engine
  const categoryCounts = {};
  habits.forEach(h => {
    const cat = h.category || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  const donutData = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    value: categoryCounts[cat]
  }));

  const CHART_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#64748b'];

  const barData = [
    { name: 'Mon', completed: habits.filter(h => h.currentStreak > 0).length },
    { name: 'Tue', completed: habits.length > 1 ? habits.length - 1 : 1 },
    { name: 'Wed', completed: habits.length },
    { name: 'Thu', completed: habits.length }, 
    { name: 'Fri', completed: 0 },
    { name: 'Sat', completed: 0 },
    { name: 'Sun', completed: 0 },
  ];

  const generateCurrentWeek = () => {
    const current = new Date();
    const week = [];
    const dayOfWeeks = current.getDay();
    const distanceToMonday = dayOfWeeks === 0 ? -6 : 1 - dayOfWeeks; 
    const monday = new Date(current.setDate(current.getDate() + distanceToMonday));

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      week.push({
        name: nextDay.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: nextDay.toISOString().split('T')[0],
        dayNum: nextDay.getDate(),
        isToday: nextDay.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]
      });
    }
    setWeekDays(week);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
    window.location.reload();
  };

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/habits', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setHabits(data);
    } catch (err) {
      console.error("Error fetching habits:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmapStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/habits/stats/heatmap', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setHeatmapData(data);
    } catch (err) {
      console.error("Error fetching heatmap stats:", err);
    }
  };

  const fetchAIReport = async () => {
    setAiLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/ai/weekly-report', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setAiReport(data.report);
    } catch (err) {
      console.error("Error fetching AI report:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const fetchStreakRecoveryPlan = async () => {
    setRecoveryLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/ai/streak-recovery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setRecoveryData(data);
    } catch (err) {
      console.error("Error checking streak recovery vectors:", err);
    } finally {
      setRecoveryLoading(false);
    }
  };

  const fetchMorningBoost = async () => {
    setBoostLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/ai/morning-boost', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setMorningBoost(data.boostMessage);
    } catch (err) {
      console.error("Error fetching morning boost transmission:", err);
    } finally {
      setBoostLoading(false);
    }
  };

  const handleToggleDayGrid = async (habitId, dateStr) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:5000/api/habits/${habitId}/toggle-date`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ dateStr })
      });
      const updatedHabit = await res.json();
      if (res.ok) {
        setHabits(habits.map(h => h._id === habitId ? updatedHabit : h));
        confetti({ particleCount: 30, spread: 40 });
        fetchHeatmapStats();
        fetchAIReport();
        fetchMorningBoost();
      }
    } catch (err) {
      console.error("Grid tracking error:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userQuery = chatMessage;
    setChatHistory(prev => [...prev, { sender: 'user', text: userQuery }]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/ai/chat-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: userQuery })
      });
      const data = await res.json();
      if (res.ok) {
        setChatHistory(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch (err) {
      console.error("Chat engine connection fail:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleWizardSubmit = async () => {
    if (!wizardGoals.trim() || !wizardStruggles.trim()) {
      alert("Please specify your goals and struggles to align the AI Engine.");
      return;
    }
    setWizardLoading(true);
    setShowWizardOutput(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/ai/suggestions-wizard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ goals: wizardGoals, productiveTime: wizardTime, struggles: wizardStruggles })
      });
      if (res.ok) {
        const structuralObjectRecommendations = [
          { title: "Morning Placement Grind", category: "Coding", frequency: "Daily", icon: "💻", color: "#6366f1", desc: `Direct high-impact node targeting milestone: "${wizardGoals}" inside your peak window.` },
          { title: "Hydration Flow Routine", category: "Health", frequency: "Daily", icon: "💧", color: "#06b6d4", desc: "Sustains high neuro-cognitive stamina limits across intensive software engineering sprints." },
          { title: "Friction Mitigation Block", category: "Mindfulness", frequency: "Daily", icon: "🧘", color: "#10b981", desc: `Micro-dose strategy structured to neutralize your constraint: "${wizardStruggles}".` }
        ];
        setWizardResponseCards(structuralObjectRecommendations);
        confetti({ particleCount: 60, spread: 60 });
      }
    } catch (err) {
      console.error("Wizard engine error:", err);
    } finally {
      setWizardLoading(false);
    }
  };

  const handleQuickAddRecommendation = async (cardItem) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: cardItem.title, description: cardItem.desc, category: cardItem.category, frequency: cardItem.frequency, color: cardItem.color, icon: cardItem.icon })
      });
      if (res.ok) {
        fetchHabits();
        fetchHeatmapStats();
        alert(`Injected: "${cardItem.title}" successfully into active grid operations!`);
      }
    } catch (err) {
      console.error("Quick add communication failure:", err);
    }
  };

  const toggleThemeEngine = () => {
    setIsDarkMode(prev => {
      localStorage.setItem('themeEngineState', !prev);
      return !prev;
    });
  };

  const resetWizard = () => {
    setWizardStep(1);
    setWizardGoals('');
    setWizardStruggles('');
    setWizardResponseCards([]);
    setShowWizardOutput(false);
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    fetchHabits();
    generateCurrentWeek();
    fetchHeatmapStats();
    fetchAIReport();
    fetchStreakRecoveryPlan();
    fetchMorningBoost();
  }, []);

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://127.0.0.1:5000/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ name: newHabit, description, category, frequency, color, icon })
      });
      if (res.ok) {
        fetchHabits();
        setNewHabit('');
        setDescription('');
        confetti({ particleCount: 40 });
        fetchHeatmapStats();
        fetchAIReport();
      }
    } catch (err) {
      console.error("Error creating habit:", err);
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!window.confirm("Remove this habit from active operations?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://127.0.0.1:5000/api/habits/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setHabits(habits.filter(habit => habit._id !== id));
        fetchHeatmapStats();
        fetchAIReport();
      }
    } catch (err) {
      console.error("Error deleting habit:", err);
    }
  };

  return (
    <div className={`transition-all duration-300 min-h-screen pb-24 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-orange-50/40 text-slate-900'}`}>
      <div className="p-6 max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Control Bar */}
        <div className={`flex justify-between items-center border p-5 rounded-2xl shadow-sm backdrop-blur-xl ${isDarkMode ? 'bg-slate-900/50 border-slate-800/80' : 'bg-white border-orange-100/80'}`}>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-indigo-500 bg-clip-text text-transparent">Habit Blueprint Engine</h1>
            <p className="text-xs opacity-70 mt-1">Consistency creates character</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleThemeEngine} className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${isDarkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-orange-100/60 border-orange-200 text-orange-600'}`}>
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 cursor-pointer">Disconnect</button>
          </div>
        </div>

        {/* Visual Focus Vector Alert Header Panel */}
        <div className={`border p-5 rounded-2xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/20 border-emerald-500/20' : 'bg-gradient-to-r from-white via-orange-50/20 to-emerald-50/20 border-orange-100'}`}>
          <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500" />
          <div className="space-y-1 flex-1">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 font-bold tracking-widest uppercase">AM Protocol Active</span>
            <p className="text-sm font-medium opacity-90 tracking-wide mt-2">{morningBoost || "Establishing telemetry mindset stream..."}</p>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* HORIZONTAL WEEKLY TABLE GRID VIEW                             */}
        {/* ------------------------------------------------------------- */}
        <div className={`border p-6 rounded-3xl shadow-xl space-y-4 ${isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-orange-100'}`}>
          <div>
            <h2 className="text-lg font-bold">Execution Operational Grid Matrix</h2>
            <p className="text-xs opacity-60">Toggle verification blocks smoothly across the active multi-user row cluster</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className={`border-b ${isDarkMode ? 'border-slate-800' : 'border-orange-50'}`}>
                  <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider opacity-60">Habit Node Pipeline</th>
                  {weekDays.map(day => (
                    <th key={day.dateStr} className={`py-3 px-2 text-center text-xs font-bold uppercase transition-all ${day.isToday ? 'text-indigo-500 font-black' : 'opacity-60'}`}>
                      <div>{day.name}</div>
                      <div className="text-md mt-0.5">{day.dayNum}</div>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider opacity-60">Streak Score</th>
                </tr>
              </thead>
              <tbody>
                {habits.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-8 text-sm opacity-50 border-dashed border rounded-2xl mt-2">No system tracks initialized. Add your first custom habit sequence below.</td>
                  </tr>
                ) : (
                  habits.map(habit => (
                    <tr key={habit._id} className={`border-b transition-all ${isDarkMode ? 'border-slate-800/40 hover:bg-slate-900/20' : 'border-orange-50/40 hover:bg-orange-50/10'}`}>
                      <td className="py-4 px-4 flex items-center gap-3">
                        <span className="text-lg">{habit.icon || '🎯'}</span>
                        <div>
                          <div className="font-semibold text-sm">{habit.name}</div>
                          {habit.description && <div className="text-[11px] opacity-50 italic mt-0.5 font-normal max-w-xs truncate" title={habit.description}>{habit.description}</div>}
                        </div>
                      </td>
                      {weekDays.map(day => {
                        const logEntry = habit.weeklyLogs?.find(l => l.dateStr === day.dateStr);
                        const isCompleted = logEntry?.status === 'Completed';
                        return (
                          <td key={day.dateStr} className="py-4 px-2 text-center">
                            <button 
                              onClick={() => handleToggleDayGrid(habit._id, day.dateStr)}
                              style={{ backgroundColor: isCompleted ? (habit.color || '#6366f1') : 'transparent' }}
                              className={`w-6 h-6 rounded-md border-2 transition-all mx-auto flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 ${isCompleted ? 'border-transparent text-white' : isDarkMode ? 'border-slate-700 hover:border-slate-500' : 'border-orange-200 hover:border-orange-400'}`}
                            >
                              {isCompleted && "✓"}
                            </button>
                          </td>
                        );
                      })}
                      <td className="py-4 px-4 text-center">
                        <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-sm">🔥 {habit.currentStreak || 0} Days</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 🔥 HIGH-CONTRAST VISIBLE GITHUB-STYLE CONTRIBUTION MATRIX      */}
        {/* ============================================================= */}
        <div className="grid grid-cols-1 gap-6">
          <div className={`border p-6 rounded-3xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-orange-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest opacity-75">90-Day Production Grid Matrix</h2>
              <span className="text-[10px] opacity-60">Less ▢ ▤ ▩ More</span>
            </div>

            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div className="min-w-[700px] flex flex-col space-y-1">
                
                {/* Months Timeline Labels */}
                <div className="h-5 relative text-[11px] font-semibold opacity-60 mb-1">
                  {monthLabelsList.map((month, i) => (
                    <span key={i} className="absolute" style={{ left: `${month.columnOffset * 15.5}px` }}>
                      {month.name}
                    </span>
                  ))}
                </div>

                {/* Grid Structure */}
                <div className="flex gap-1">
                  {/* Left Label Days Axis */}
                  <div className="flex flex-col justify-between text-[10px] font-medium opacity-50 pr-2 h-[105px] pt-1">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  {/* 7 Rows x 13 Columns Grid Compiler Engine */}
                  <div 
                    className="grid grid-flow-col gap-1 auto-cols-max"
                    style={{ gridTemplateRows: 'repeat(7, minmax(0, 1fr))' }}
                  >
                    {trueGridItems.map((item) => {
                      // 🔥 FIXED: Direct explicit high-contrast theme class allocation to prevent dark mode transparency blackout
                      let tileColorClass = "";
                      if (item.count === 0) {
                        tileColorClass = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-orange-100/40 border-orange-200/40';
                      } else if (item.count === 1) {
                        tileColorClass = isDarkMode ? 'bg-emerald-950 border-emerald-900/60 text-emerald-400' : 'bg-emerald-100 border-emerald-200';
                      } else if (item.count === 2) {
                        tileColorClass = isDarkMode ? 'bg-emerald-800 border-emerald-700 text-emerald-200' : 'bg-emerald-300 border-emerald-400';
                      } else {
                        tileColorClass = isDarkMode ? 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/20' : 'bg-emerald-600 border-emerald-500';
                      }

                      return (
                        <div 
                          key={item.date}
                          className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 transform hover:scale-125 cursor-pointer ${tileColorClass}`}
                          title={`${item.date} (${item.month}): ${item.count} Tasks Executed`}
                        />
                      );
                    })}
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ============================================================= */}

        {/* Placement Metrics Row Displays Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`border p-6 rounded-3xl shadow-xl md:col-span-3 ${isDarkMode ? 'bg-slate-900/30 border-slate-800/60' : 'bg-white border-orange-100'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Placement Preparation Velocity Matrix</h2>
              <span className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Active Engine</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800/50' : 'bg-orange-50/20 border-orange-100'}`}>
                <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">Coding Focus</div>
                <div className="text-xl font-bold text-indigo-400 mt-1">
                  {habits.filter(h => h.category === 'Coding').length} Active
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800/50' : 'bg-orange-50/20 border-orange-100'}`}>
                <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">Max Active Streak</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">
                  {habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0), 0) : 0} Days
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800/50' : 'bg-orange-50/20 border-orange-100'}`}>
                <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">Total Track Count</div>
                <div className="text-xl font-bold text-amber-500 mt-1">{habits.length} Tracks</div>
              </div>
              <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-950/40 border-slate-800/50' : 'bg-orange-50/20 border-orange-100'}`}>
                <div className="text-xs font-semibold opacity-60 uppercase tracking-wider">Consistency Target</div>
                <div className="text-xl font-bold text-cyan-400 mt-1">100% Core</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recovery Action Banner */}
        {recoveryData.hasBrokenStreak && (
          <div className="bg-gradient-to-r from-rose-950/40 via-slate-900/50 to-amber-950/30 border border-rose-500/30 p-5 rounded-2xl relative overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span></span>
              <h2 className="text-xs font-bold text-rose-400 uppercase tracking-widest">Streak Recovery System Overrides Active</h2>
            </div>
            <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed font-normal tracking-wide">{recoveryData.plan}</div>
          </div>
        )}

        {/* AI Performance Analyst Card Block Display */}
        <div className={`border p-5 rounded-2xl relative overflow-hidden shadow-xl ${isDarkMode ? 'bg-gradient-to-r from-indigo-950/40 via-slate-900/40 to-cyan-950/30 border-indigo-500/20' : 'bg-white border-orange-100'}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">AI Performance Analyst</h2>
          </div>
          {aiLoading ? (
            <div className="space-y-2 py-1"><div className="h-3 bg-slate-800 rounded-full w-3/4 animate-pulse" /><div className="h-3 bg-slate-800 rounded-full w-5/6 animate-pulse" /></div>
          ) : (
            <p className="text-sm leading-relaxed font-normal opacity-90">{aiReport}</p>
          )}
        </div>

        {/* Charts Presentation Layer Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`border rounded-2xl p-5 shadow-xl backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/30 border-slate-800/60' : 'bg-white border-orange-100'}`}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Focus Distribution Vector</h2>
            <div className="h-64 w-full flex items-center justify-center">
              {habits.length === 0 ? (
                <span className="text-xs opacity-50">No telemetry matrix data available</span>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }} />
                    <Legend formatter={(value) => <span className="text-xs font-medium px-1 opacity-80">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className={`border rounded-2xl p-5 shadow-xl backdrop-blur-sm ${isDarkMode ? 'bg-slate-900/30 border-slate-800/60' : 'bg-white border-orange-100'}`}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Weekly Execution Metrics</h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }} />
                  <Bar dataKey="completed" fill="#6366f1" radius={[5, 5, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Interactive Suggestions Wizard Component */}
        <div className={`border p-6 rounded-2xl shadow-xl space-y-6 ${isDarkMode ? 'bg-slate-900/30 border-slate-800/60' : 'bg-white border-orange-100'}`}>
          <div>
            <h2 className="text-lg font-semibold">AI Habit Suggestions Wizard</h2>
            <p className="text-xs opacity-60 mt-0.5">Let AI compile an absolute interactive actionable deployment blueprint with direct dashboard mapping hooks</p>
          </div>

          {!showWizardOutput ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="flex md:flex-col justify-between md:justify-start gap-4 md:border-r border-slate-800/60 md:pr-4">
                <div className={`flex items-center gap-2 text-xs font-semibold ${wizardStep === 1 ? 'text-indigo-500' : 'opacity-40'}`}><span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px]">1</span><span>Core Goals</span></div>
                <div className={`flex items-center gap-2 text-xs font-semibold ${wizardStep === 2 ? 'text-indigo-500' : 'opacity-40'}`}><span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px]">2</span><span>Peak Efficiency</span></div>
                <div className={`flex items-center gap-2 text-xs font-semibold ${wizardStep === 3 ? 'text-indigo-500' : 'opacity-40'}`}><span className="w-5 h-5 rounded-full flex items-center justify-center border text-[10px]">3</span><span>Core Friction</span></div>
              </div>

              <div className="md:col-span-3 space-y-4">
                {wizardStep === 1 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-70 uppercase tracking-wider">What primary milestone are you optimizing for?</label>
                    <input type="text" placeholder="e.g., Crack software engineering placement exam" value={wizardGoals} onChange={(e) => setWizardGoals(e.target.value)} className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`} />
                    <div className="flex justify-end pt-2"><button onClick={() => setWizardStep(2)} disabled={!wizardGoals.trim()} className="px-5 py-2.5 bg-indigo-600 disabled:opacity-40 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500 cursor-pointer">Next Step</button></div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-70 uppercase tracking-wider">When does your brain hit maximum processing output?</label>
                    <select value={wizardTime} onChange={(e) => setWizardTime(e.target.value)} className={`w-full px-3 py-3 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`} >
                      <option value="Morning (5 AM - 9 AM)">Morning (5 AM - 9 AM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Night Owl Operations (9 PM - 2 AM)">Night Owl Operations (9 PM - 2 AM)</option>
                    </select>
                    <div className="flex justify-between pt-2">
                      <button onClick={() => setWizardStep(1)} className="px-4 py-2 text-xs font-semibold opacity-60 hover:opacity-100 cursor-pointer">Back</button>
                      <button onClick={() => setWizardStep(3)} className="px-5 py-2.5 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500 cursor-pointer">Next Step</button>
                    </div>
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-70 uppercase tracking-wider">What blocker consistently breaks your consistency streaks?</label>
                    <input type="text" placeholder="e.g., Severe procrastination loop" value={wizardStruggles} onChange={(e) => setWizardStruggles(e.target.value)} className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`} />
                    <div className="flex justify-between pt-2">
                      <button onClick={() => setWizardStep(2)} className="px-4 py-2 text-xs font-semibold opacity-60 hover:opacity-100 cursor-pointer">Back</button>
                      <button onClick={handleWizardSubmit} disabled={!wizardStruggles.trim()} className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-indigo-600 disabled:opacity-40 text-xs font-bold text-white rounded-xl cursor-pointer">Compile AI Suggestions</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wizardLoading ? (
                <div className="col-span-3 text-center py-6 text-sm opacity-50 animate-pulse">Assembling smart recommendations vectors...</div>
              ) : (
                wizardResponseCards.map((card, idx) => (
                  <div key={idx} className={`border p-5 rounded-2xl shadow-md flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 ${isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-orange-50/20 border-orange-100'}`} style={{ borderTop: `4px solid ${card.color}` }}>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl">{card.icon}</span>
                        <span className="text-[10px] px-2 py-0.5 font-semibold rounded bg-slate-800 border border-slate-700 text-slate-300">{card.category}</span>
                      </div>
                      <h4 className="font-bold text-sm text-indigo-400">{card.title}</h4>
                      <p className="text-xs opacity-70 mt-2 font-normal leading-relaxed">{card.desc}</p>
                    </div>
                    <button onClick={() => handleQuickAddRecommendation(card)} className="w-full mt-5 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all hover:opacity-90">Add this habit</button>
                  </div>
                ))
              )}
              <div className="col-span-1 md:col-span-3 flex justify-end"><button onClick={resetWizard} className="text-xs font-medium text-indigo-500 underline cursor-pointer">Re-run Suggestions Config</button></div>
            </div>
          )}
        </div>

        {/* Form Registration Manual Input Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`border p-6 rounded-2xl h-fit space-y-5 shadow-xl ${isDarkMode ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-orange-100'}`}>
            <h2 className="text-lg font-semibold">Initialize Advanced Habit</h2>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Habit Alias</label>
                <input type="text" placeholder="e.g., LeetCode 2 Problems, Leg Day" value={newHabit} onChange={(e) => setNewHabit(e.target.value)} className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Why does this habit matter to you?</label>
                <textarea rows="2" placeholder="Describe focus impact sequence..." value={description} onChange={(e) => setDescription(e.target.value)} className={`w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-2 py-2 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Interval</label>
                  <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={`w-full px-2 py-2 border rounded-xl text-sm focus:outline-none focus:border-indigo-500 ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-orange-200 text-slate-900'}`}>
                    <option value="Daily">Daily</option><option value="Weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Visual Glyph Vector</label>
                <div className="flex flex-wrap gap-2 pt-1 max-h-[60px] overflow-y-auto border p-2 rounded-xl bg-slate-950/20 border-slate-800/40">
                  {icons.map(ic => (
                    <button key={ic} type="button" onClick={() => setIcon(ic)} className={`text-md p-1 rounded transition-all cursor-pointer ${icon === ic ? 'bg-indigo-600 scale-110 shadow-md' : 'opacity-50 hover:opacity-100'}`}>{ic}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">System Color Accent</label>
                <div className="flex gap-3 pt-1">
                  {colors.map(c => (
                    <button key={c.hex} type="button" onClick={() => setColor(c.hex)} className={`w-6 h-6 rounded-full transition-all border-2 cursor-pointer ${color === c.hex ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`} style={{ backgroundColor: c.hex }} />
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-sm font-semibold rounded-xl text-white cursor-pointer">Inject System Pipeline</button>
            </form>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Decommission Operations Control</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habits.map((habit) => (
                <div key={habit._id} className={`border p-4 rounded-2xl flex justify-between items-center shadow-md ${isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-orange-100'}`} style={{ borderLeft: `4px solid ${habit.color || '#6366f1'}` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{habit.icon || '🎯'}</span>
                    <span className="font-semibold text-sm max-w-[140px] truncate">{habit.name}</span>
                  </div>
                  <button onClick={() => handleDeleteHabit(habit._id)} className="text-xs font-bold text-rose-500 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 cursor-pointer">Delete Protocol</button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Cyberpunk Floating Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen && (
          <div className="w-80 sm:w-96 h-[420px] bg-slate-950/95 border border-indigo-500/30 rounded-2xl shadow-2xl flex flex-col mb-4 overflow-hidden backdrop-blur-xl animate-fade-in">
            <div className="bg-gradient-to-r from-indigo-950 to-slate-950 border-b border-slate-800/80 p-4 flex justify-between items-center">
              <div><h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Habit Matrix NLP Core</h3><p className="text-[10px] text-slate-500 mt-0.5">Real-time DB context injected</p></div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-900 rounded-lg border border-slate-800 cursor-pointer">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
              {chatHistory.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none'}`}>{msg.text}</div>
                </div>
              ))}
              {chatLoading && <div className="text-[10px] text-slate-500 animate-pulse pl-2">Executing Groq LPU transmission layer...</div>}
              <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800/80 flex gap-2">
              <input type="text" placeholder="Ask about your streaks patterns..." value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} disabled={chatLoading} className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none text-slate-300" />
              <button type="submit" disabled={chatLoading || !chatMessage.trim()} className="bg-indigo-600 text-white text-xs font-bold px-3 py-2 rounded-xl cursor-pointer">Send</button>
            </form>
          </div>
        )}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border transform hover:scale-110 active:scale-95 cursor-pointer ${isChatOpen ? 'bg-slate-950 border-indigo-500 shadow-indigo-500/20' : 'bg-gradient-to-r from-indigo-500 to-indigo-600 border-indigo-400/30'}`}><span className="text-white text-base font-bold">{isChatOpen ? "✕" : "AI"}</span></button>
      </div>

    </div>
  );
};

export default Dashboard;