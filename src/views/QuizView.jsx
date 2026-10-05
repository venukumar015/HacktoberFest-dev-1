import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Play,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronRight,
  Trash2,
  Award,
  BookOpen
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { Modal } from '../components/common/Modal';
import { audioService } from '../utils/audio';

export const QuizView = () => {
  const { quizzes, addQuiz, deleteQuiz, recordQuizResult, showToast } = useStudyBuddy();

  // Active Quiz Playing State
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionIndex]: optionIndex }
  const [quizFinished, setQuizFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // New Quiz Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuizForm, setNewQuizForm] = useState({
    title: '',
    category: 'Computer Science',
    timeLimitPerQuestion: 30,
    description: '',
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    ]
  });

  // Question Timer Countdown
  useEffect(() => {
    let timer = null;
    if (activeQuiz && !quizFinished) {
      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else {
        // Time expired for this question, auto move next
        handleNextQuestion();
      }
    }
    return () => clearInterval(timer);
  }, [activeQuiz, quizFinished, timeLeft]);

  // Start Playing Quiz
  const startQuiz = (quiz) => {
    if (!quiz.questions || quiz.questions.length === 0) {
      showToast('This quiz does not have questions yet!', 'info');
      return;
    }
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizFinished(false);
    setTimeLeft(quiz.timeLimitPerQuestion || 30);
  };

  const handleSelectOption = (optionIndex) => {
    audioService.playPop();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    audioService.playPop();
    const questions = activeQuiz?.questions || [];
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(activeQuiz.timeLimitPerQuestion || 30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const questions = activeQuiz?.questions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    recordQuizResult({
      quizId: activeQuiz.id,
      quizTitle: activeQuiz.title,
      score: correctCount,
      total: questions.length,
      percentage
    });

    setQuizFinished(true);
    if (percentage >= 75) {
      audioService.playBell();
      showToast('Outstanding score on the quiz! 🌟', 'success');
    } else {
      showToast('Quiz finished! Review the explanations below.', 'info');
    }
  };

  // Custom Quiz Creator Handlers
  const handleAddQuestionField = () => {
    setNewQuizForm(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  const handleRemoveQuestionField = (idx) => {
    if (newQuizForm.questions.length <= 1) return;
    setNewQuizForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  const handleQuestionTextChange = (idx, text) => {
    const updated = [...newQuizForm.questions];
    updated[idx].question = text;
    setNewQuizForm({ ...newQuizForm, questions: updated });
  };

  const handleOptionChange = (qIdx, optIdx, val) => {
    const updated = [...newQuizForm.questions];
    updated[qIdx].options[optIdx] = val;
    setNewQuizForm({ ...newQuizForm, questions: updated });
  };

  const handleCorrectIndexChange = (qIdx, optIdx) => {
    const updated = [...newQuizForm.questions];
    updated[qIdx].correctIndex = optIdx;
    setNewQuizForm({ ...newQuizForm, questions: updated });
  };

  const handleExplanationChange = (qIdx, val) => {
    const updated = [...newQuizForm.questions];
    updated[qIdx].explanation = val;
    setNewQuizForm({ ...newQuizForm, questions: updated });
  };

  const handleSaveNewQuiz = (e) => {
    e.preventDefault();
    if (!newQuizForm.title.trim()) return;

    // Basic validation
    const validQuestions = newQuizForm.questions.filter(
      q => q.question.trim() && q.options.every(opt => opt.trim())
    );

    if (validQuestions.length === 0) {
      showToast('Please fill out at least one complete question with 4 options!', 'danger');
      return;
    }

    addQuiz({
      title: newQuizForm.title,
      category: newQuizForm.category,
      timeLimitPerQuestion: parseInt(newQuizForm.timeLimitPerQuestion) || 30,
      description: newQuizForm.description,
      questions: validQuestions.map((q, i) => ({ ...q, id: 'q-' + Date.now() + '-' + i }))
    });

    setIsModalOpen(false);
    setNewQuizForm({
      title: '',
      category: 'Computer Science',
      timeLimitPerQuestion: 30,
      description: '',
      questions: [
        { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' }
      ]
    });
  };

  // --- QUIZ RESULTS VIEW ---
  if (activeQuiz && quizFinished) {
    const questions = activeQuiz.questions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) correctCount += 1;
    });
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Results Banner */}
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '2.5rem 1.5rem',
            background: 'var(--accent-gradient-subtle)',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: percentage >= 70 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: percentage >= 70 ? 'var(--color-success)' : 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Award size={38} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            {percentage >= 80 ? 'Mastery Achieved! 🎉' : percentage >= 60 ? 'Good Effort! 👏' : 'Keep Practicing! 💪'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '1rem' }}>
            You scored <strong>{correctCount}</strong> out of <strong>{questions.length}</strong> questions ({percentage}%)
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.75rem' }}>
            <button className="btn btn-primary" onClick={() => startQuiz(activeQuiz)}>
              <RotateCcw size={16} />
              <span>Retake Quiz</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setActiveQuiz(null)}>
              <BookOpen size={16} />
              <span>Back to Quizzes</span>
            </button>
          </div>
        </div>

        {/* Detailed Question Review Breakdown */}
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
            Detailed Solutions & Explanations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {questions.map((q, idx) => {
              const userAnswer = selectedAnswers[idx];
              const isCorrect = userAnswer === q.correctIndex;

              return (
                <div
                  key={idx}
                  className="card"
                  style={{
                    borderLeft: `5px solid ${isCorrect ? 'var(--color-success)' : 'var(--color-danger)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      Question #{idx + 1}
                    </span>
                    <span className={`badge ${isCorrect ? 'badge-success' : 'badge-danger'}`}>
                      {isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  </div>

                  <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '1rem' }}>
                    {q.question}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAnswer === optIdx;
                      const isOptionCorrect = optIdx === q.correctIndex;

                      return (
                        <div
                          key={optIdx}
                          style={{
                            padding: '0.65rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                            border: '1px solid',
                            borderColor: isOptionCorrect
                              ? 'var(--color-success)'
                              : isSelected
                              ? 'var(--color-danger)'
                              : 'var(--border-color)',
                            background: isOptionCorrect
                              ? 'var(--color-success-bg)'
                              : isSelected
                              ? 'var(--color-danger-bg)'
                              : 'var(--bg-subtle)',
                            color: isOptionCorrect
                              ? 'var(--color-success)'
                              : isSelected
                              ? 'var(--color-danger)'
                              : 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}
                        >
                          {isOptionCorrect ? (
                            <CheckCircle2 size={16} />
                          ) : isSelected ? (
                            <XCircle size={16} />
                          ) : (
                            <span style={{ opacity: 0.5 }}>{String.fromCharCode(65 + optIdx)}.</span>
                          )}
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-subtle)',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <strong style={{ color: 'var(--accent-primary)' }}>💡 Key Takeaway: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE QUIZ QUESTION PLAYER ---
  if (activeQuiz && !quizFinished) {
    const questions = activeQuiz.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
    const selectedOption = selectedAnswers[currentQuestionIndex];

    return (
      <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        {/* Header Stats */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="badge badge-primary">{activeQuiz.category}</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.3rem' }}>
              {activeQuiz.title}
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: timeLeft <= 5 ? 'var(--color-danger-bg)' : 'var(--bg-subtle)',
              border: '1px solid var(--border-color)',
              color: timeLeft <= 5 ? 'var(--color-danger)' : 'var(--text-primary)',
              fontWeight: 700
            }}
          >
            <Clock size={16} />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'var(--accent-gradient)',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        {/* Question Card */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.6rem' }}>
            QUESTION {currentQuestionIndex + 1} OF {questions.length}
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.4, marginBottom: '1.75rem' }}>
            {currentQ.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(idx)}
                >
                  <span
                    className="option-badge"
                    style={{
                      background: isSelected ? 'var(--accent-primary)' : 'var(--bg-subtle)',
                      color: isSelected ? '#fff' : 'inherit'
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 500, flex: 1 }}>{opt}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                if (confirm('Exit quiz? Your progress will be lost.')) setActiveQuiz(null);
              }}
            >
              Exit Quiz
            </button>

            <button
              className="btn btn-primary"
              disabled={selectedOption === undefined}
              onClick={handleNextQuestion}
            >
              <span>{currentQuestionIndex + 1 === questions.length ? 'Submit Quiz' : 'Next Question'}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ CATALOG VIEW (MAIN) ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>MCQ Quiz Arena ({quizzes.length})</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Timed multiple-choice tests with instantaneous feedback & comprehensive answer reviews
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          <span>Create New Quiz</span>
        </button>
      </div>

      {/* Grid of Quizzes */}
      <div className="grid-2">
        {quizzes.map(quiz => (
          <div
            key={quiz.id}
            className="card card-hoverable"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <span className="badge badge-primary">{quiz.category}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} />
                  <span>{quiz.timeLimitPerQuestion || 30}s / question</span>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {quiz.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                {quiz.description || 'Test your knowledge on this subject.'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                {quiz.questions?.length || 0} Questions
              </span>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-icon"
                  onClick={() => {
                    if (confirm('Delete this quiz?')) deleteQuiz(quiz.id);
                  }}
                  title="Delete Quiz"
                >
                  <Trash2 size={16} color="var(--color-danger)" />
                </button>
                <button className="btn btn-primary btn-sm" onClick={() => startQuiz(quiz)}>
                  <Play size={14} fill="currentColor" />
                  <span>Start Challenge</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create New Quiz Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New MCQ Quiz"
        maxWidth="680px"
      >
        <form onSubmit={handleSaveNewQuiz}>
          <div className="modal-body" style={{ maxHeight: '68vh' }}>
            <div className="form-group">
              <label className="form-label">Quiz Title</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Data Structures & Algorithms Benchmark"
                value={newQuizForm.title}
                onChange={(e) => setNewQuizForm({ ...newQuizForm, title: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Computer Science"
                  value={newQuizForm.category}
                  onChange={(e) => setNewQuizForm({ ...newQuizForm, category: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Time Per Question (Secs)</label>
                <input
                  type="number"
                  min="10"
                  max="180"
                  className="form-input"
                  value={newQuizForm.timeLimitPerQuestion}
                  onChange={(e) =>
                    setNewQuizForm({ ...newQuizForm, timeLimitPerQuestion: parseInt(e.target.value) || 30 })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Brief summary of what this quiz covers"
                value={newQuizForm.description}
                onChange={(e) => setNewQuizForm({ ...newQuizForm, description: e.target.value })}
              />
            </div>

            {/* Questions Section */}
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  Questions ({newQuizForm.questions.length})
                </h4>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleAddQuestionField}
                >
                  <Plus size={14} />
                  <span>Add Question</span>
                </button>
              </div>

              {newQuizForm.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-subtle)',
                    marginBottom: '1rem',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-primary)' }}>
                      Question #{qIdx + 1}
                    </span>
                    {newQuizForm.questions.length > 1 && (
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleRemoveQuestionField(qIdx)}
                        style={{ padding: '2px' }}
                      >
                        <Trash2 size={15} color="var(--color-danger)" />
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      className="form-input"
                      required
                      placeholder="Enter question text..."
                      value={q.question}
                      onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                    />
                  </div>

                  {/* 4 Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correctIndex === optIdx}
                          onChange={() => handleCorrectIndexChange(qIdx, optIdx)}
                          title="Mark as correct answer"
                          style={{ cursor: 'pointer', accentColor: 'var(--color-success)' }}
                        />
                        <input
                          type="text"
                          className="form-input"
                          required
                          placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                          style={{ padding: '0.45rem 0.75rem' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Explanation / Key Takeaway for students..."
                      value={q.explanation}
                      onChange={(e) => handleExplanationChange(qIdx, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Quiz
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
