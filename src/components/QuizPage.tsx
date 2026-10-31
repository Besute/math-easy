import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, BookOpen, CheckCircle2, ChevronRight, Clock3, LayoutGrid, Play, RotateCcw, Trophy, XCircle } from "lucide-react";
import { questions } from "../data/questions";

type QuizPageProps = { onBack: () => void; onTheory: () => void };
type QuizDefinition = { id: string; title: string; description: string; questionIds: number[] };
type Attempt = { id: string; quizId: string; questionIds: number[]; order: number[]; index: number; score: number; selected: number | null; seconds: number; elapsedSeconds: number; wrongAnswers: number };
type CompletedQuiz = { id: string; quizId: string; score: number; total: number; elapsedSeconds: number; wrongAnswers: number; completedAt: number };
const STORAGE_KEY = "matematika-prosto-quiz-attempt";
const COMPLETED_KEY = "matematika-prosto-completed-quizzes";
const allIds = questions.map((_, index) => index);
const quizDefinitions: QuizDefinition[] = [
  { id: "basics", title: "Основы дробей", description: "Понимание долей, равные и сокращённые дроби.", questionIds: [2, 4, 7, 11, 12] },
  { id: "compare", title: "Сравнение дробей", description: "Определи, какая дробь больше или меньше.", questionIds: [1, 5, 10, 16] },
  { id: "addition", title: "Сложение дробей", description: "Складывай дроби с одинаковыми и разными знаменателями.", questionIds: [0, 6, 8, 13, 14, 15] },
  { id: "subtraction", title: "Вычитание дробей", description: "Вычитай дроби и приводи их к общему знаменателю.", questionIds: [3, 9] },
  { id: "multiplication", title: "Умножение дробей", description: "Перемножай и сокращай обыкновенные дроби.", questionIds: [17, 18] },
  { id: "division", title: "Деление дробей", description: "Деление на дробь и на целое число.", questionIds: [19, 20] },
  { id: "mixed", title: "Смешанные числа", description: "Переводи смешанные числа в дроби и обратно.", questionIds: [21, 22] },
  { id: "all", title: "Все разделы о дробях", description: "Большая тренировка по всем правилам и действиям.", questionIds: allIds },
];
const quizFilters = ["Все темы", "Основы", "Сравнение", "Сложение", "Вычитание", "Умножение", "Деление", "Смешанные числа"];
const quizFilterIds: Record<string, string[]> = {
  "Основы": ["basics"], "Сравнение": ["compare"], "Сложение": ["addition"], "Вычитание": ["subtraction"],
  "Умножение": ["multiplication"], "Деление": ["division"], "Смешанные числа": ["mixed"],
};
const freshAttempt = (quiz: QuizDefinition): Attempt => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, quizId: quiz.id, questionIds: quiz.questionIds, order: quiz.questionIds.map((_, index) => index), index: 0, score: 0, selected: null, seconds: 60, elapsedSeconds: 0, wrongAnswers: 0 });

function readCompletedQuizzes(): CompletedQuiz[] {
  try {
    const value = localStorage.getItem(COMPLETED_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as CompletedQuiz[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return minutes ? `${minutes} мин ${String(remainder).padStart(2, "0")} сек` : `${remainder} сек`;
}

function readSavedAttempts(): Attempt[] {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return [];
    const parsed = JSON.parse(value) as Partial<Attempt> | Partial<Attempt>[];
    const entries = Array.isArray(parsed) ? parsed : [parsed];
    return entries.flatMap((saved, savedIndex) => {
      const quiz = quizDefinitions.find((item) => item.id === saved.quizId) ?? quizDefinitions.find((item) => item.id === "all")!;
      const questionIds = Array.isArray(saved.questionIds) ? saved.questionIds.filter((id) => Number.isInteger(id) && id >= 0 && id < questions.length) : quiz.questionIds;
      const savedOrder = Array.isArray(saved.order) ? saved.order.filter((id) => Number.isInteger(id) && id >= 0 && id < questionIds.length) : [];
      const order = [...savedOrder, ...questionIds.map((_, index) => index).filter((index) => !savedOrder.includes(index))];
      const index = Math.max(0, saved.index ?? 0);
      if (!order.length || order.length <= index) return [];
      return [{ id: saved.id ?? `restored-${savedIndex}-${quiz.id}`, quizId: quiz.id, questionIds, order, index, score: Math.min(saved.score ?? 0, questionIds.length), selected: saved.selected ?? null, seconds: Math.max(0, Math.min(saved.seconds ?? 60, 60)), elapsedSeconds: saved.elapsedSeconds ?? Math.max(0, 60 - (saved.seconds ?? 60)), wrongAnswers: saved.wrongAnswers ?? 0 }];
    });
  } catch { return []; }
}

export function QuizPage({ onBack, onTheory }: QuizPageProps) {
  const [savedAttempts, setSavedAttempts] = useState<Attempt[]>(() => readSavedAttempts());
  const [completedQuizzes, setCompletedQuizzes] = useState<CompletedQuiz[]>(() => readCompletedQuizzes());
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizDefinition | null>(null);
  const [activeFilter, setActiveFilter] = useState("Все темы");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [showCatalog, setShowCatalog] = useState(true);

  function saveAttempt(next: Attempt) {
    setAttempt(next);
    setSavedAttempts((current) => [...current.filter((item) => item.id !== next.id), next]);
  }

  useEffect(() => {
    if (!running || done || !attempt) return;
    const timer = window.setTimeout(() => {
      if (attempt.seconds <= 1) {
        setAttempt((currentAttempt) => currentAttempt ? { ...currentAttempt, seconds: 0, elapsedSeconds: currentAttempt.elapsedSeconds + 1 } : currentAttempt);
        setRunning(false);
      } else {
        setAttempt((currentAttempt) => currentAttempt ? { ...currentAttempt, seconds: currentAttempt.seconds - 1, elapsedSeconds: currentAttempt.elapsedSeconds + 1 } : currentAttempt);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [running, done, attempt?.seconds]);

  useEffect(() => {
    if (!attempt) return;
    setSavedAttempts((current) => {
      const existing = current.find((item) => item.id === attempt.id);
      if (existing === attempt) return current;
      return [...current.filter((item) => item.id !== attempt.id), attempt];
    });
  }, [attempt]);

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(savedAttempts)); }, [savedAttempts]);
  useEffect(() => { localStorage.setItem(COMPLETED_KEY, JSON.stringify(completedQuizzes)); }, [completedQuizzes]);

  const filteredQuizzes = activeFilter === "Все темы" ? quizDefinitions : quizDefinitions.filter((quiz) => quizFilterIds[activeFilter]?.includes(quiz.id));
  const currentQuiz = attempt ? quizDefinitions.find((quiz) => quiz.id === attempt.quizId) ?? quizDefinitions[quizDefinitions.length - 1] : null;
  const current = attempt ? questions[attempt.questionIds[attempt.order[attempt.index]]] : null;
  const time = attempt ? `${String(Math.floor(attempt.seconds / 60)).padStart(2, "0")}:${String(attempt.seconds % 60).padStart(2, "0")}` : "01:00";
  const progress = attempt ? Math.round((attempt.score / attempt.questionIds.length) * 100) : 0;

  function completeAttempt(completedAttempt: Attempt) {
    setDone(true);
    setRunning(false);
    setSavedAttempts((saved) => saved.filter((item) => item.id !== completedAttempt.id));
    setCompletedQuizzes((completed) => [...completed, {
      id: `${completedAttempt.id}-${Date.now()}`,
      quizId: completedAttempt.quizId,
      score: completedAttempt.score,
      total: completedAttempt.questionIds.length,
      elapsedSeconds: completedAttempt.elapsedSeconds,
      wrongAnswers: completedAttempt.wrongAnswers,
      completedAt: Date.now(),
    }]);
  }

  function startQuiz(quiz: QuizDefinition, attemptId?: string) {
    const fresh = freshAttempt(quiz);
    if (attemptId) fresh.id = attemptId;
    saveAttempt(fresh);
    setActiveQuiz(quiz);
    setDone(false);
    setShowCatalog(false);
    setRunning(true);
  }

  function resume(savedAttempt: Attempt) {
    const quiz = quizDefinitions.find((item) => item.id === savedAttempt.quizId) ?? quizDefinitions[quizDefinitions.length - 1];
    saveAttempt({ ...savedAttempt, seconds: savedAttempt.seconds === 0 ? 60 : savedAttempt.seconds });
    setActiveQuiz(quiz);
    setShowCatalog(false);
    setDone(false);
    setRunning(true);
  }

  function startOver() {
    const quiz = activeQuiz ?? currentQuiz ?? quizDefinitions[quizDefinitions.length - 1];
    startQuiz(quiz, !done ? attempt?.id : undefined);
  }

  function chooseAnswer(answerIndex: number) {
    if (!attempt || !current || attempt.selected !== null || !running) return;
    const correct = answerIndex === current.correctIndex;
    saveAttempt({ ...attempt, selected: answerIndex, score: correct ? attempt.score + 1 : attempt.score, wrongAnswers: correct ? attempt.wrongAnswers : attempt.wrongAnswers + 1 });
  }

  function nextQuestion() {
    if (!attempt || !current) return;
    const isCorrect = attempt.selected === current.correctIndex;
    const remaining = attempt.order.slice(attempt.index + 1);
    if (!remaining.length && isCorrect && attempt.score >= attempt.questionIds.length - 1) {
      completeAttempt(attempt);
      return;
    }
    let order = attempt.order;
    if (!isCorrect) {
      const retryPosition = attempt.index + 1 + Math.floor(Math.random() * (remaining.length + 1));
      order = [...attempt.order.slice(0, attempt.index + 1), ...remaining];
      order.splice(retryPosition, 0, attempt.order[attempt.index]);
    }
    const nextIndex = attempt.index + 1;
    if (nextIndex >= order.length) {
      completeAttempt(attempt);
      return;
    }
    saveAttempt({ ...attempt, order, index: nextIndex, selected: null });
  }

  function returnToCatalog() {
    if (attempt) setSavedAttempts((saved) => [...saved.filter((item) => item.id !== attempt.id), attempt]);
    setRunning(false);
    setShowCatalog(true);
  }

  return (
    <main className="inner-page quiz-page">
      <button className="back-link" onClick={onBack}><ArrowLeft /> На главную</button>
      {showCatalog ? (
        <section className="quiz-catalog">
          <div className="lesson-heading"><span className="eyebrow dark">ТРЕНИРОВКА · ВЫБЕРИ ТЕМУ</span><h1>Какую тему повторим?</h1><p>Отфильтруй квизы по разделу и выбери подходящую тренировку.</p></div>
          {savedAttempts.length > 0 && <section className="saved-quizzes"><h2>Продолжить позже</h2><div className="saved-quiz-grid">{savedAttempts.map((saved) => {
            const savedQuiz = quizDefinitions.find((quiz) => quiz.id === saved.quizId) ?? quizDefinitions[quizDefinitions.length - 1];
            return <article className="saved-quiz-card" key={saved.id}><div><span className="step">СОХРАНЕНО · {saved.score}/{saved.questionIds.length} ВЕРНО</span><h3>{savedQuiz.title}</h3><p>Ошибок: {saved.wrongAnswers} · Время: {formatDuration(saved.elapsedSeconds)} · осталось {String(Math.floor(saved.seconds / 60)).padStart(2, "0")}:{String(saved.seconds % 60).padStart(2, "0")}</p></div><button className="button blue" onClick={() => resume(saved)}><Play /> Продолжить</button></article>;
          })}</div></section>}
          <div className="catalog-filters quiz-filters" role="group" aria-label="Фильтр квизов">{quizFilters.map((filter) => <button key={filter} type="button" aria-pressed={activeFilter === filter} className={`catalog-filter ${activeFilter === filter ? "active" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
          <div className="course-grid">{filteredQuizzes.map((quiz) => {
            const bestResult = completedQuizzes.filter((result) => result.quizId === quiz.id).sort((a, b) => b.score / b.total - a.score / a.total || a.wrongAnswers - b.wrongAnswers || a.elapsedSeconds - b.elapsedSeconds)[0];
            return <article className={`course-card quiz-topic-card ${bestResult ? "quiz-passed" : ""}`} key={quiz.id}><div className="card-top"><span className="step">ДРОБИ · {quiz.questionIds.length} ВОПРОСОВ</span>{bestResult ? <span className="quiz-completed-badge"><BadgeCheck /> Пройден</span> : <span className="icon-bubble"><BookOpen /></span>}</div><h3>{quiz.title}</h3><p>{quiz.description}</p>{bestResult && <div className="quiz-best-result">Лучший результат: {bestResult.score}/{bestResult.total} · ошибок {bestResult.wrongAnswers} · {formatDuration(bestResult.elapsedSeconds)}</div>}<button className="text-link" onClick={() => startQuiz(quiz)}>{bestResult ? "Пройти ещё раз" : "Пройти квиз"} <ChevronRight /></button></article>;
          })}</div>
        </section>
      ) : !running && !done && attempt ? (
        <section className="result-card paused-card"><div className="result-icon"><Clock3 /></div><span className="eyebrow dark">ТРЕНИРОВКА НА ПАУЗЕ</span><h1>Продолжим?</h1><p>Квиз «{currentQuiz?.title}» сохранён: правильных ответов {attempt.score} из {attempt.questionIds.length}. Можно продолжить сейчас или вернуться к нему позже.</p><div className="result-actions"><button className="button blue" onClick={() => resume(attempt)}><Play /> Продолжить</button><button className="button outline" onClick={startOver}><RotateCcw /> Начать заново</button><button className="button outline" onClick={returnToCatalog}><LayoutGrid /> Выбрать другой квиз</button></div></section>
      ) : running && attempt && current ? (
        <section className="quiz-shell">
          <div className="quiz-head"><span className="eyebrow dark">{currentQuiz?.title.toUpperCase()}</span><div className="quiz-head-actions"><span className="timer"><Clock3 /> {time}</span><button className="quiz-menu-link" onClick={returnToCatalog}><LayoutGrid /> Все квизы</button></div></div>
          <div className="quiz-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="quiz-meta"><span>РЕШЕНО {attempt.score} ИЗ {attempt.questionIds.length}</span></div>
          <h1>{current.question}</h1>
          <div className="answer-grid">{current.answers.map((answer, answerIndex) => {
            const isCorrect = attempt.selected !== null && answerIndex === current.correctIndex;
            const isWrong = attempt.selected === answerIndex && answerIndex !== current.correctIndex;
            return <button key={answer} disabled={attempt.selected !== null} className={`answer ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => chooseAnswer(answerIndex)}>{answer}{isCorrect && <CheckCircle2 />}{isWrong && <XCircle />}</button>;
          })}</div>
          {attempt.selected !== null && <div className={`explanation ${attempt.selected === current.correctIndex ? "good" : "bad"}`}><b>{attempt.selected === current.correctIndex ? "Верно! Отличная работа." : "Почти! Этот вопрос встретится ещё раз."}</b><p>{current.explanation}</p></div>}
          <div className="quiz-bottom"><span>{attempt.selected === null ? "Выбери один ответ" : "Ответ засчитан"}</span><button className="button blue" disabled={attempt.selected === null} onClick={nextQuestion}>Следующий вопрос <ChevronRight /></button></div>
        </section>
      ) : done && attempt ? (
        <section className="result-card"><div className="result-icon"><Trophy /></div><span className="eyebrow dark">ТРЕНИРОВКА ЗАВЕРШЕНА</span><h1>Ты справился!</h1><div className="score">{attempt.score}<small> / {attempt.questionIds.length}</small></div><div className="quiz-result-stats"><div><span>Затраченное время</span><strong>{formatDuration(attempt.elapsedSeconds)}</strong></div><div><span>Неправильные ответы</span><strong>{attempt.wrongAnswers}</strong></div></div><p>{attempt.score >= Math.ceil(attempt.questionIds.length * 0.75) ? "Прекрасный результат! Ты уверенно разбираешься в теме." : "Хорошая работа! Повтори правила и попробуй квиз ещё раз."}</p><div className="result-actions"><button className="button blue" onClick={startOver}>Пройти ещё раз <ChevronRight /></button><button className="button outline" onClick={onTheory}>Повторить теорию</button><button className="button outline" onClick={() => { setDone(false); setAttempt(null); setShowCatalog(true); }}>Выбрать другую тему</button></div></section>
      ) : null}
    </main>
  );
}
