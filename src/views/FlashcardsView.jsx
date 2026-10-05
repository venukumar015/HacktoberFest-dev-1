import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Play,
  RotateCw,
  Shuffle,
  Trash2,
  Edit2,
  HelpCircle,
  CheckCircle2,
  ChevronLeft,
  ArrowRight,
  Eye
} from 'lucide-react';
import { useStudyBuddy } from '../context/StudyBuddyContext';
import { Modal } from '../components/common/Modal';
import { audioService } from '../utils/audio';

export const FlashcardsView = () => {
  const {
    flashcardDecks,
    addDeck,
    updateDeck,
    deleteDeck,
    addCardToDeck,
    updateCardInDeck,
    deleteCardFromDeck,
    showToast
  } = useStudyBuddy();

  // Active Deck for Study Mode or Card Management
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Deck Modals
  const [isDeckModalOpen, setIsDeckModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [deckForm, setDeckForm] = useState({ title: '', description: '', category: 'General', color: '#6366f1' });

  // Card Modals
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardForm, setCardForm] = useState({ question: '', answer: '', hint: '' });

  const activeDeck = flashcardDecks.find(d => d.id === activeDeckId);

  // Open Deck Modal
  const handleOpenDeckModal = (deck = null) => {
    if (deck) {
      setEditingDeck(deck);
      setDeckForm({
        title: deck.title,
        description: deck.description || '',
        category: deck.category || 'General',
        color: deck.color || '#6366f1'
      });
    } else {
      setEditingDeck(null);
      setDeckForm({ title: '', description: '', category: 'General', color: '#6366f1' });
    }
    setIsDeckModalOpen(true);
  };

  const handleSaveDeck = (e) => {
    e.preventDefault();
    if (!deckForm.title.trim()) return;

    if (editingDeck) {
      updateDeck(editingDeck.id, deckForm);
    } else {
      addDeck(deckForm);
    }
    setIsDeckModalOpen(false);
  };

  // Open Card Modal
  const handleOpenCardModal = (card = null) => {
    if (card) {
      setEditingCard(card);
      setCardForm({
        question: card.question,
        answer: card.answer,
        hint: card.hint || ''
      });
    } else {
      setEditingCard(null);
      setCardForm({ question: '', answer: '', hint: '' });
    }
    setIsCardModalOpen(true);
  };

  const handleSaveCard = (e) => {
    e.preventDefault();
    if (!cardForm.question.trim() || !cardForm.answer.trim()) return;

    if (editingCard) {
      updateCardInDeck(activeDeckId, editingCard.id, cardForm);
    } else {
      addCardToDeck(activeDeckId, cardForm);
    }
    setIsCardModalOpen(false);
  };

  // Study Practice Handlers
  const startStudyMode = (deckId) => {
    const targetDeck = flashcardDecks.find(d => d.id === deckId);
    if (!targetDeck || !targetDeck.cards || targetDeck.cards.length === 0) {
      showToast('Please add cards to this deck first!', 'info');
      setActiveDeckId(deckId);
      setStudyMode(false);
      return;
    }
    setActiveDeckId(deckId);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowHint(false);
  };

  const handleFlipCard = () => {
    audioService.playPop();
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = (rating = 'good') => {
    audioService.playPop();
    setIsFlipped(false);
    setShowHint(false);

    if (currentCardIndex + 1 < (activeDeck?.cards?.length || 0)) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      showToast('🎉 Deck session completed! Great job.', 'success');
      setCurrentCardIndex(0);
      setStudyMode(false);
    }
  };

  const handleShuffleDeck = () => {
    if (!activeDeck) return;
    const shuffledCards = [...activeDeck.cards].sort(() => Math.random() - 0.5);
    updateDeck(activeDeck.id, { cards: shuffledCards });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    showToast('Deck shuffled!', 'info');
  };

  // --- STUDY MODE VIEW ---
  if (studyMode && activeDeck) {
    const cards = activeDeck.cards || [];
    const currentCard = cards[currentCardIndex];
    const progressPercent = Math.round(((currentCardIndex + 1) / cards.length) * 100);

    return (
      <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Top Control Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setStudyMode(false)}
          >
            <ChevronLeft size={16} />
            <span>Back to Decks</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Card {currentCardIndex + 1} of {cards.length}
            </span>
            <button className="btn-icon" onClick={handleShuffleDeck} title="Shuffle Cards">
              <Shuffle size={16} />
            </button>
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

        {/* 3D Flashcard Flip Scene */}
        <div className="flashcard-scene" onClick={handleFlipCard}>
          <div className={`flashcard-card ${isFlipped ? 'flipped' : ''}`}>
            {/* FRONT */}
            <div className="flashcard-face flashcard-front" style={{ borderTop: `5px solid ${activeDeck.color || '#6366f1'}` }}>
              <div className="flashcard-meta">
                <span className="badge badge-primary">{activeDeck.category}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Eye size={14} /> Click to reveal answer
                </span>
              </div>

              <div className="flashcard-body-text">{currentCard?.question}</div>

              {currentCard?.hint && (
                <div style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                  {showHint ? (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'var(--bg-subtle)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
                      💡 Hint: {currentCard.hint}
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowHint(true)}
                    >
                      <HelpCircle size={14} />
                      <span>Show Hint</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* BACK */}
            <div className="flashcard-face flashcard-back" style={{ borderTop: '5px solid var(--color-success)' }}>
              <div className="flashcard-meta">
                <span className="badge badge-success">Answer</span>
                <span>Click to flip back</span>
              </div>

              <div className="flashcard-body-text" style={{ fontSize: '1.15rem' }}>
                {currentCard?.answer}
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                How well did you recall this concept?
              </div>
            </div>
          </div>
        </div>

        {/* Recall Confidence Rating Actions */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            style={{ color: 'var(--color-danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
            onClick={() => handleNextCard('again')}
          >
            Again (Hard)
          </button>
          <button
            className="btn btn-secondary"
            style={{ color: 'var(--color-warning)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
            onClick={() => handleNextCard('hard')}
          >
            Hard
          </button>
          <button
            className="btn btn-secondary"
            style={{ color: 'var(--accent-primary)', borderColor: 'rgba(99, 102, 241, 0.3)' }}
            onClick={() => handleNextCard('good')}
          >
            Good
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleNextCard('easy')}
          >
            Easy (Mastered)
          </button>
        </div>
      </div>
    );
  }

  // --- DECK DETAILS & CARD MANAGEMENT VIEW ---
  if (activeDeck && !studyMode) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => setActiveDeckId(null)}>
            <ChevronLeft size={16} />
            <span>All Decks</span>
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline btn-sm" onClick={() => handleOpenCardModal()}>
              <Plus size={15} />
              <span>Add Card</span>
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => startStudyMode(activeDeck.id)}
            >
              <Play size={15} fill="currentColor" />
              <span>Study Deck ({activeDeck.cards?.length || 0})</span>
            </button>
          </div>
        </div>

        {/* Deck Banner */}
        <div className="card" style={{ borderLeft: `6px solid ${activeDeck.color || '#6366f1'}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge badge-primary">{activeDeck.category}</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.4rem 0 0.2rem' }}>
                {activeDeck.title}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {activeDeck.description || 'No description provided.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn-icon" onClick={() => handleOpenDeckModal(activeDeck)} title="Edit Deck">
                <Edit2 size={16} />
              </button>
              <button
                className="btn-icon"
                onClick={() => {
                  if (confirm('Delete this deck?')) {
                    deleteDeck(activeDeck.id);
                    setActiveDeckId(null);
                  }
                }}
                title="Delete Deck"
              >
                <Trash2 size={16} color="var(--color-danger)" />
              </button>
            </div>
          </div>
        </div>

        {/* Cards Inside Deck List */}
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
            Cards in this Deck ({activeDeck.cards?.length || 0})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeDeck.cards?.map((card, idx) => (
              <div
                key={card.id}
                className="card card-hoverable"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}
              >
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>#{idx + 1}</span>
                    {card.question}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    {card.answer}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button className="btn-icon" onClick={() => handleOpenCardModal(card)}>
                    <Edit2 size={15} />
                  </button>
                  <button className="btn-icon" onClick={() => deleteCardFromDeck(activeDeck.id, card.id)}>
                    <Trash2 size={15} color="var(--color-danger)" />
                  </button>
                </div>
              </div>
            ))}

            {(!activeDeck.cards || activeDeck.cards.length === 0) && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                No cards created yet. Click "Add Card" above to get started!
              </div>
            )}
          </div>
        </div>

        {/* Card Editor Modal */}
        <Modal
          isOpen={isCardModalOpen}
          onClose={() => setIsCardModalOpen(false)}
          title={editingCard ? 'Edit Flashcard' : 'Add New Flashcard'}
        >
          <form onSubmit={handleSaveCard}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Question (Front)</label>
                <textarea
                  className="form-textarea"
                  required
                  placeholder="e.g. What is the Big-O time complexity of Binary Search?"
                  value={cardForm.question}
                  onChange={(e) => setCardForm({ ...cardForm, question: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Answer (Back)</label>
                <textarea
                  className="form-textarea"
                  required
                  placeholder="e.g. O(log n) because the search range is halved each step."
                  value={cardForm.answer}
                  onChange={(e) => setCardForm({ ...cardForm, answer: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hint (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Think of divide and conquer halving."
                  value={cardForm.hint}
                  onChange={(e) => setCardForm({ ...cardForm, hint: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsCardModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Card
              </button>
            </div>
          </form>
        </Modal>

        {/* Deck Edit Modal */}
        <Modal
          isOpen={isDeckModalOpen}
          onClose={() => setIsDeckModalOpen(false)}
          title="Edit Deck Info"
        >
          <form onSubmit={handleSaveDeck}>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Deck Title</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={deckForm.title}
                  onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  type="text"
                  className="form-input"
                  value={deckForm.category}
                  onChange={(e) => setDeckForm({ ...deckForm, category: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  value={deckForm.description}
                  onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setIsDeckModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // --- DECKS CATALOG VIEW (MAIN) ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Flashcard Decks ({flashcardDecks.length})</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Practice active retrieval with 3D flipcards and spaced review
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => handleOpenDeckModal()}>
          <Plus size={16} />
          <span>Create New Deck</span>
        </button>
      </div>

      {/* Grid of Decks */}
      <div className="grid-3">
        {flashcardDecks.map(deck => (
          <div
            key={deck.id}
            className="card card-hoverable"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: `4px solid ${deck.color || '#6366f1'}`
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge badge-primary">{deck.category}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {deck.cards?.length || 0} cards
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
                {deck.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                {deck.description || 'Comprehensive revision flashcards.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => startStudyMode(deck.id)}
              >
                <Play size={14} fill="currentColor" />
                <span>Study</span>
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setActiveDeckId(deck.id);
                  setStudyMode(false);
                }}
              >
                <span>Cards</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Deck Creation Modal */}
      <Modal
        isOpen={isDeckModalOpen}
        onClose={() => setIsDeckModalOpen(false)}
        title={editingDeck ? 'Edit Deck' : 'Create New Flashcard Deck'}
      >
        <form onSubmit={handleSaveDeck}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Deck Title</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Modern Web Architecture"
                value={deckForm.title}
                onChange={(e) => setDeckForm({ ...deckForm, title: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Subject / Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Computer Science"
                value={deckForm.category}
                onChange={(e) => setDeckForm({ ...deckForm, category: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="What topics does this deck cover?"
                value={deckForm.description}
                onChange={(e) => setDeckForm({ ...deckForm, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setIsDeckModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Deck
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
