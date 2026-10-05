import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../utils/initialData';

const StudyBuddyContext = createContext();

const STORAGE_KEYS = {
  GOALS: 'study_buddy_goals',
  DECKS: 'study_buddy_decks',
  QUIZZES: 'study_buddy_quizzes',
  NOTES: 'study_buddy_notes',
  PLANNER: 'study_buddy_planner',
  SETTINGS: 'study_buddy_settings',
  STATS: 'study_buddy_stats'
};

const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

export const StudyBuddyProvider = ({ children }) => {
  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => (prev && prev.id === toast?.id ? null : prev));
    }, 3500);
  };

  const closeToast = () => setToast(null);

  // Core App States
  const [goals, setGoals] = useState(() => getStoredItem(STORAGE_KEYS.GOALS, INITIAL_DATA.goals));
  const [flashcardDecks, setFlashcardDecks] = useState(() => getStoredItem(STORAGE_KEYS.DECKS, INITIAL_DATA.flashcardDecks));
  const [quizzes, setQuizzes] = useState(() => getStoredItem(STORAGE_KEYS.QUIZZES, INITIAL_DATA.quizzes));
  const [notes, setNotes] = useState(() => getStoredItem(STORAGE_KEYS.NOTES, INITIAL_DATA.notes));
  const [plannerEvents, setPlannerEvents] = useState(() => getStoredItem(STORAGE_KEYS.PLANNER, INITIAL_DATA.plannerEvents));
  const [pomodoroSettings, setPomodoroSettings] = useState(() => getStoredItem(STORAGE_KEYS.SETTINGS, INITIAL_DATA.pomodoroSettings));
  const [stats, setStats] = useState(() => getStoredItem(STORAGE_KEYS.STATS, INITIAL_DATA.stats));

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(flashcardDecks));
  }, [flashcardDecks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANNER, JSON.stringify(plannerEvents));
  }, [plannerEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(pomodoroSettings));
  }, [pomodoroSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }, [stats]);

  // Streak verification on load
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate !== todayStr) {
      // Check if last active was yesterday or older
      const lastDate = new Date(stats.lastActiveDate);
      const today = new Date(todayStr);
      const diffTime = Math.abs(today - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 2) {
        // Streak lost if inactive for more than 1 day gap
        setStats(prev => ({
          ...prev,
          todayStudyMinutes: 0,
          streakDays: 1,
          lastActiveDate: todayStr
        }));
      } else if (diffDays === 1) {
        // Incremented streak
        setStats(prev => ({
          ...prev,
          todayStudyMinutes: 0,
          lastActiveDate: todayStr
        }));
      }
    }
  }, []);

  // --- GOAL ACTIONS ---
  const addGoal = (newGoal) => {
    const goal = {
      id: 'g-' + Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      ...newGoal
    };
    setGoals(prev => [goal, ...prev]);
    showToast('Goal added successfully!', 'success');
  };

  const updateGoal = (id, updatedFields) => {
    setGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updatedFields } : g)));
    showToast('Goal updated', 'info');
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
    showToast('Goal deleted', 'info');
  };

  const toggleGoal = (id) => {
    setGoals(prev =>
      prev.map(g => {
        if (g.id === id) {
          const nextState = !g.completed;
          if (nextState) {
            showToast('Goal marked complete! 🎉', 'success');
          }
          return { ...g, completed: nextState };
        }
        return g;
      })
    );
  };

  // --- FLASHCARD ACTIONS ---
  const addDeck = (deckData) => {
    const newDeck = {
      id: 'deck-' + Date.now(),
      cards: [],
      color: '#6366f1',
      ...deckData
    };
    setFlashcardDecks(prev => [newDeck, ...prev]);
    showToast(`Created deck "${newDeck.title}"`, 'success');
  };

  const updateDeck = (id, updatedFields) => {
    setFlashcardDecks(prev => prev.map(d => (d.id === id ? { ...d, ...updatedFields } : d)));
    showToast('Deck updated', 'info');
  };

  const deleteDeck = (id) => {
    setFlashcardDecks(prev => prev.filter(d => d.id !== id));
    showToast('Deck deleted', 'info');
  };

  const addCardToDeck = (deckId, cardData) => {
    const newCard = {
      id: 'c-' + Date.now(),
      ...cardData
    };
    setFlashcardDecks(prev =>
      prev.map(deck => {
        if (deck.id === deckId) {
          return { ...deck, cards: [...deck.cards, newCard] };
        }
        return deck;
      })
    );
    showToast('Flashcard added', 'success');
  };

  const updateCardInDeck = (deckId, cardId, updatedCard) => {
    setFlashcardDecks(prev =>
      prev.map(deck => {
        if (deck.id === deckId) {
          return {
            ...deck,
            cards: deck.cards.map(c => (c.id === cardId ? { ...c, ...updatedCard } : c))
          };
        }
        return deck;
      })
    );
    showToast('Flashcard updated', 'info');
  };

  const deleteCardFromDeck = (deckId, cardId) => {
    setFlashcardDecks(prev =>
      prev.map(deck => {
        if (deck.id === deckId) {
          return { ...deck, cards: deck.cards.filter(c => c.id !== cardId) };
        }
        return deck;
      })
    );
    showToast('Card deleted', 'info');
  };

  // --- QUIZ ACTIONS ---
  const addQuiz = (quizData) => {
    const newQuiz = {
      id: 'quiz-' + Date.now(),
      ...quizData
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    showToast('New Quiz created!', 'success');
  };

  const updateQuiz = (id, updatedFields) => {
    setQuizzes(prev => prev.map(q => (q.id === id ? { ...q, ...updatedFields } : q)));
    showToast('Quiz updated', 'info');
  };

  const deleteQuiz = (id) => {
    setQuizzes(prev => prev.filter(q => q.id !== id));
    showToast('Quiz deleted', 'info');
  };

  const recordQuizResult = (result) => {
    setStats(prev => {
      const history = prev.quizScores || [];
      return {
        ...prev,
        quizScores: [
          {
            ...result,
            date: new Date().toISOString()
          },
          ...history
        ]
      };
    });
  };

  // --- NOTE ACTIONS ---
  const addNote = (noteData) => {
    const newNote = {
      id: 'n-' + Date.now(),
      pinned: false,
      color: '#6366f1',
      updatedAt: new Date().toISOString(),
      ...noteData
    };
    setNotes(prev => [newNote, ...prev]);
    showToast('Note saved!', 'success');
  };

  const updateNote = (id, updatedFields) => {
    setNotes(prev =>
      prev.map(n => (n.id === id ? { ...n, ...updatedFields, updatedAt: new Date().toISOString() } : n))
    );
    showToast('Note updated', 'info');
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    showToast('Note deleted', 'info');
  };

  const togglePinNote = (id) => {
    setNotes(prev => prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n)));
  };

  // --- PLANNER ACTIONS ---
  const addPlannerEvent = (eventData) => {
    const newEvent = {
      id: 'p-' + Date.now(),
      status: 'scheduled',
      ...eventData
    };
    setPlannerEvents(prev => [...prev, newEvent]);
    showToast('Study session scheduled', 'success');
  };

  const updatePlannerEvent = (id, updatedFields) => {
    setPlannerEvents(prev => prev.map(e => (e.id === id ? { ...e, ...updatedFields } : e)));
    showToast('Schedule updated', 'info');
  };

  const deletePlannerEvent = (id) => {
    setPlannerEvents(prev => prev.filter(e => e.id !== id));
    showToast('Session removed', 'info');
  };

  const toggleEventStatus = (id) => {
    setPlannerEvents(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextStatus =
            e.status === 'scheduled' ? 'in-progress' : e.status === 'in-progress' ? 'completed' : 'scheduled';
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  // --- POMODORO & STATS ACTIONS ---
  const updatePomodoroSettings = (newSettings) => {
    setPomodoroSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Timer settings updated', 'info');
  };

  const addStudyMinutes = (minutes) => {
    setStats(prev => {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayDay = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      
      const updatedHistory = [...(prev.dailyStudyHistory || [])];
      const todayIndex = updatedHistory.findIndex(h => h.date === todayStr);

      if (todayIndex >= 0) {
        updatedHistory[todayIndex] = {
          ...updatedHistory[todayIndex],
          minutes: (updatedHistory[todayIndex].minutes || 0) + minutes
        };
      } else {
        updatedHistory.push({
          day: todayDay,
          minutes: minutes,
          date: todayStr
        });
        if (updatedHistory.length > 7) {
          updatedHistory.shift();
        }
      }

      return {
        ...prev,
        totalStudyMinutes: (prev.totalStudyMinutes || 0) + minutes,
        todayStudyMinutes: (prev.todayStudyMinutes || 0) + minutes,
        lastActiveDate: todayStr,
        dailyStudyHistory: updatedHistory
      };
    });
  };

  const incrementPomodoroCount = () => {
    setStats(prev => ({
      ...prev,
      completedPomodoros: (prev.completedPomodoros || 0) + 1
    }));
  };

  const resetAllData = () => {
    setGoals(INITIAL_DATA.goals);
    setFlashcardDecks(INITIAL_DATA.flashcardDecks);
    setQuizzes(INITIAL_DATA.quizzes);
    setNotes(INITIAL_DATA.notes);
    setPlannerEvents(INITIAL_DATA.plannerEvents);
    setPomodoroSettings(INITIAL_DATA.pomodoroSettings);
    setStats(INITIAL_DATA.stats);
    showToast('Reset data to initial templates', 'info');
  };

  return (
    <StudyBuddyContext.Provider
      value={{
        toast,
        showToast,
        closeToast,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoal,
        flashcardDecks,
        addDeck,
        updateDeck,
        deleteDeck,
        addCardToDeck,
        updateCardInDeck,
        deleteCardFromDeck,
        quizzes,
        addQuiz,
        updateQuiz,
        deleteQuiz,
        recordQuizResult,
        notes,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        plannerEvents,
        addPlannerEvent,
        updatePlannerEvent,
        deletePlannerEvent,
        toggleEventStatus,
        pomodoroSettings,
        updatePomodoroSettings,
        stats,
        addStudyMinutes,
        incrementPomodoroCount,
        resetAllData
      }}
    >
      {children}
    </StudyBuddyContext.Provider>
  );
};

export const useStudyBuddy = () => useContext(StudyBuddyContext);
