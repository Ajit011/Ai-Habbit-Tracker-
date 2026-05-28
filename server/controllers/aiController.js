const Habit = require('../models/Habit');

// Tightly parse the environment Groq authentication vector
const groqKey = process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.trim() : null;

// Helper Engine: Native HTTP Fetch Call to Groq Cloud API Pipeline
const callGroqAI = async (systemPrompt, userPrompt) => {
  if (!groqKey) throw new Error("Groq AI API key missing in environment cluster.");

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${groqKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5, // Lowered to enforce absolute precision and eliminate text trailing
      max_tokens: 250
    })
  });

  const data = await response.json();
  
  if (data.choices && data.choices[0]) {
    return data.choices[0].message.content;
  } else {
    console.error("Groq Engine Response Error Block:", data);
    throw new Error(data.error ? data.error.message : "Matrix empty response");
  }
};

// =========================================================================
// MODULE 6: AI Weekly Report Generator
// =========================================================================
const getWeeklyReport = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    const currentUserName = req.user && req.user.name ? req.user.name : "User";

    if (!habits || habits.length === 0) {
      return res.json({ 
        report: "No operational tracking protocols found. Deploy and check-off habits to ignite the AI Insights Coach stream!" 
      });
    }

    let habitNames = habits.map(h => `'${h.name}'`).join(', ');
    let categories = [...new Set(habits.map(h => h.category))].join(' & ');

    if (groqKey) {
      try {
        let dataPayloadSummary = habits.map(h => `Habit: ${h.name}, Current Streak: ${h.currentStreak} Days.`).join('\n');
        
        // 🔥 STRICT CONSTRAINTS: Prevent text truncation or paragraph overload
        const systemPrompt = `You are a high-performance behavioral data analyst. Speak only in proper, crisp English. Keep your tone completely professional, elite, and objective.`;
        const userPrompt = `
          Analyze this tracking data for user ${currentUserName}:\n${dataPayloadSummary}
          
          STRICT INSTRUCTIONS:
          1. Generate exactly 2 to 3 concise, impactful sentences in total. Do NOT exceed this limit under any condition.
          2. First sentence must evaluate their current completion velocity tightly without introductory filler.
          3. Second/Third sentence must provide an exact data-driven optimization strategy to scale progress.
          4. Address them directly as ${currentUserName} exactly once. Do NOT include generic introductory text.
        `;

        const reply = await callGroqAI(systemPrompt, userPrompt);
        return res.json({ report: reply });
      } catch (apiErr) {
        console.error("Groq Weekly Report Cloud Failure:", apiErr.message);
      }
    }

    const smartInsights = [
      `${currentUserName}, your operational focus across ${categories} vectors is highly commendable, particularly your execution streak on tracks like ${habitNames}.`,
      `Closely guard your daily execution limits so momentum drops do not leak into your software placement preparation workflow.`
    ];
    return res.json({ report: smartInsights.join(' ') });

  } catch (error) {
    console.error("Module 6 Main Crash Trace:", error.message);
    res.status(500).json({ message: 'AI Engine Stream Error', error: error.message });
  }
};

// =========================================================================
// MODULE 7: AI Habit Suggestions 3-Step Wizard
// =========================================================================
const getHabitSuggestions = async (req, res) => {
  try {
    const { goals, productiveTime, struggles } = req.body;
    const currentUserName = req.user && req.user.name ? req.user.name : "User";

    if (!goals || !productiveTime || !struggles) {
      return res.status(400).json({ message: 'Missing telemetry metrics configuration vectors.' });
    }

    if (groqKey) {
      try {
        const systemPrompt = "You are an elite productivity strategist and human behavior engineer. Converse exclusively in high-level, clear English.";
        const userPrompt = `Analyze this profile for user ${currentUserName}:\n- Core Goal: ${goals}\n- Peak Productive Window: ${productiveTime}\n- Primary Operational Struggle: ${struggles}\n\nGenerate a highly strategic, customized 3-step actionable habit deployment blueprint. Format it with clean headers. Keep it concise, completely direct, and restricted to under 4 sentences total. Address them directly as ${currentUserName}.`;

        const reply = await callGroqAI(systemPrompt, userPrompt);
        return res.json({ suggestions: reply });
      } catch (apiErr) {
        console.error("Groq Wizard Cloud Failure:", apiErr.message);
      }
    }

    const dynamicFallbackSuggestions = [
      `### 🎯 Step 1: Optimized Core Alignment\n${currentUserName}, anchor a high-impact micro-habit specifically targeting "${goals}" inside your peak execution window (${productiveTime}).`,
      `### ⚡ Step 2: Friction Mitigation Protocol\nTo counter your struggle with "${struggles}", implement strict environment control: remove distractions 15 minutes before this session starts.`,
      `### 📊 Step 3: Minimal Viable Progress Array\nCommit to a strict 15-minute daily block to lock this behavioral milestone.`
    ];
    return res.json({ suggestions: dynamicFallbackSuggestions.join('\n\n') });

  } catch (error) {
    console.error("Module 7 Main Crash Trace:", error.message);
    res.status(500).json({ message: 'AI Suggestion Engine Error', error: error.message });
  }
};

// =========================================================================
// MODULE 8: AI Streak Recovery Coach (3-DAY GAP DETECTION MODE)
// =========================================================================
const getStreakRecoveryPlan = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    const currentUserName = req.user && req.user.name ? req.user.name : "User";

    if (!habits || habits.length === 0) return res.json({ hasBrokenStreak: false, plan: "" });

    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);
    const threeDaysAgoStr = threeDaysAgo.toISOString().split('T')[0];

    const brokenHabit = habits.find(h => {
      if (h.history.length === 0) return true;
      const sortedHistory = [...h.history].sort((a, b) => new Date(b.date) - new Date(a.date));
      return sortedHistory[0].date < threeDaysAgoStr;
    });

    if (!brokenHabit) {
      return res.json({ 
        hasBrokenStreak: false, 
        message: `${currentUserName}, all your operational system tracks are well within the safe consistency window! No recovery protocol needed.` 
      });
    }

    if (groqKey) {
      try {
        const systemPrompt = "You are a hardcore behavioral optimization coach. Speak only in proper English with extreme crispness.";
        const userPrompt = `The user ${currentUserName} has broken his tracking consistency streak for the habit "${brokenHabit.name}" in the "${brokenHabit.category}" category. He has not tracked it in over 3 days. Generate a highly strategic 3-day comeback plan titled "OPERATION STREAK RESURRECTION". Provide exactly 1 short action item for Day 1, Day 2, and Day 3. Keep the tone tactical and ultra-motivating. Direct address them as ${currentUserName}. Keep it within 3-4 lines maximum.`;

        const reply = await callGroqAI(systemPrompt, userPrompt);
        return res.json({ hasBrokenStreak: true, habitName: brokenHabit.name, plan: reply });
      } catch (apiErr) {
        console.error("Groq Recovery Cloud Failure:", apiErr.message);
      }
    }

    const localRecoveryPlan = `### 🚨 OPERATION STREAK RESURRECTION: '${brokenHabit.name.toUpperCase()}'\n${currentUserName}, your telemetry stream indicates an inactive gap of 3+ days on this track. Initiating automatic recovery protocol.`;
    return res.json({ hasBrokenStreak: true, habitName: brokenHabit.name, plan: localRecoveryPlan });

  } catch (error) {
    console.error("Module 8 Main Crash Trace:", error.message);
    res.status(500).json({ message: 'AI Recovery Engine Error', error: error.message });
  }
};

// =========================================================================
// MODULE 9: 100% PURE DYNAMIC NATURAL LANGUAGE NLP CHAT ENGINE
// =========================================================================
const analyzeHabitChat = async (req, res) => {
  try {
    const { message } = req.body;
    const currentUserName = req.user && req.user.name ? req.user.name : "User";

    if (!message) return res.status(400).json({ message: 'Input text frame missing.' });

    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    let telemetryContext = habits.map(h => {
      return `- Habit Name: "${h.name}", Category: "${h.category}", Current Streak: ${h.currentStreak} Days.`;
    }).join('\n');

    if (groqKey) {
      try {
        const systemPrompt = `
          You are a highly sophisticated, elite personal AI executive assistant and engineering co-pilot.
          
          CURRENT USER DATABASE LOGS FOR CONTEXT:
          ${telemetryContext}

          STRICT INSTRUCTIONS:
          1. Converse exclusively in proper, fluent, high-level English. Do not use Hinglish or slang.
          2. Maintain a sleek, supportive, and professional tone. 
          3. Address the user as "${currentUserName}" naturally. Do NOT repeat their name in every sentence. Mention it at most once per response, only if it fits organically.
          4. Keep your response concise, intelligent, and completely adaptive to their message (strictly limited to 2-3 clean sentences).
          5. Only reference the habit logs context if they explicitly ask about their habits, statistics, or progress.
        `;
        const userPrompt = `USER'S DIRECT INPUT MESSAGE: "${message}"`;

        const reply = await callGroqAI(systemPrompt, userPrompt);
        return res.json({ reply: reply });
      } catch (geminiErr) {
        console.error("Groq Chat Cloud Failure:", geminiErr.message);
      }
    }

    const cleanMsg = message.trim().toLowerCase();
    if (['hey', 'hi', 'hello', 'yo', 'wassup'].includes(cleanMsg)) {
      return res.json({ reply: `Hello ${currentUserName}! I am your AI Coach. Feel free to ask me anything about your tracks or performance analytics.` });
    }
    return res.json({ reply: `I understand your message, ${currentUserName}. Local standby fallback loop is active.` });

  } catch (error) {
    console.error("Module 9 Main Crash Trace:", error.message);
    res.status(500).json({ message: 'AI Chat Engine Error', error: error.message });
  }
};

// =========================================================================
// MODULE 10: AI MINDSET & WAKE-UP BOOST ENGINE
// =========================================================================
const getMorningBoost = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    const currentUserName = req.user && req.user.name ? req.user.name : "User";

    const totalHabits = habits.length;
    const activeStreaksCount = habits.reduce((acc, h) => acc + (h.currentStreak || 0), 0);
    
    let statusContext = `The user has ${totalHabits} active tracks with a combined streak score of ${activeStreaksCount}.`;
    if (totalHabits > 0 && activeStreaksCount === 0) {
      statusContext += " WARNING: All active consistency vectors are currently sitting at zero days. They are in a slump.";
    }

    if (groqKey) {
      try {
        // 🔥 STRICT CONSTRAINTS: Force 2 sharp structured sentences
        const systemPrompt = `You are an elite productivity strategist. Speak exclusively in high-level, clear English. Maintain an absolute zero-fluff, uncompromising tone.`;
        const userPrompt = `
          User Profile: ${currentUserName}
          Current Metrics Matrix: ${statusContext}

          STRICT INSTRUCTIONS:
          1. Generate exactly 2 punchy, strategic sentences. Do NOT include paragraphs or long lists.
          2. Sentence 1: State their current streak momentum with extreme clarity based on their status matrix.
          3. Sentence 2: Issue a direct priority execution order for their morning execution block to optimize their day.
          4. Address them naturally as ${currentUserName}. Do NOT repeat their name. No generic placeholder text or greeting text.
        `;

        const reply = await callGroqAI(systemPrompt, userPrompt);
        return res.json({ boostMessage: reply });
      } catch (apiErr) {
        console.error("Groq Module 10 Boost Failure:", apiErr.message);
      }
    }

    const fallbackBoosts = [
      `Morning protocol initiated, ${currentUserName}. All system tracking metrics are online—pick your highest cognitive load programming block and execute it first.`,
      `${currentUserName}, data array indicates it is time to establish focus variables. Eliminate environment latency and execute your priorities before distractions peak.`
    ];
    return res.json({ boostMessage: fallbackBoosts[Math.floor(Math.random() * fallbackBoosts.length)] });

  } catch (error) {
    console.error("Module 10 Core Engine Crash:", error.message);
    res.status(500).json({ message: 'AI Morning Boost Failure', error: error.message });
  }
};

module.exports = { getWeeklyReport, getHabitSuggestions, getStreakRecoveryPlan, analyzeHabitChat, getMorningBoost };