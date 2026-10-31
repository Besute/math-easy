import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, Clock3, Play, RotateCcw, Trophy, XCircle } from "lucide-react";
import { questions } from "../data/questions";

type QuizPageProps = { onBack: () => void; onTheory: () => void };
type QuizDefinition = { id: string; title: string; description: string; questionIds: number[] };
type Attempt = { quizId: string; questionIds: number[]; order: number[]; index: number; score: number; selected: number | null; seconds: number };
const STORAGE_KEY = "matematika-prosto-quiz-attempt";
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
const freshAttempt = (quiz: QuizDefinition): Attempt => ({ quizId: quiz.id, questionIds: quiz.questionIds, order: quiz.questionIds.map((_, index) => index), index: 0, score: 0, selected: null, seconds: 60 });

function readAttempt(): Attempt | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return null;
    const saved = JSON.parse(value) as Partial<Attempt>;
    const quiz = quizDefinitions.find((item) => item.id === saved.quizId) ?? quizDefinitions.find((item) => item.id === "all")!;
    const questionIds = Array.isArray(saved.questionIds) ? saved.questionIds.filter((id) => Number.isInteger(id) && id >= 0 && id < questions.length) : quiz.questionIds;
    const savedOrder = Array.isArray(saved.order) ? saved.order.filter((id) => Number.isInteger(id) && id >= 0 && id < questionIds.length) : [];
    const order = [...savedOrder, ...questionIds.map((_, index) => index).filter((index) => !savedOrder.includes(index))];
    if (!order.length || order.length <= (saved.index ?? -1)) return null;
    return { quizId: quiz.id, questionIds, order, index: saved.index ?? 0, score: Math.min(saved.score ?? 0, questionIds.length), selected: saved.selected ?? null, seconds: Math.max(0, Math.min(saved.seconds ?? 60, 60)) };
  } catch { return null; }
}

export function QuizPage({ onBack, onTheory }: QuizPageProps) {
  const [attempt, setAttempt] = useState<Attempt | null>(() => readAttempt());
  const [activeQuiz, setActiveQuiz] = useState<QuizDefinition | null>(null);
  const [activeFilter, setActiveFilter] = useState("Все темы");
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running || done || !attempt) return;
    const timer = window.setTimeout(() => {
      if (attempt.seconds <= 1) {
        setAttempt((value) => value ? { ...value, seconds: 0 } : value);
        setRunning(false);
      } else {
        setAttempt((value) => value ? { ...value, seconds: value.seconds - 1 } : value);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [running, done, attempt?.seconds]);

  useEffect(() => {
    if (done || !attempt) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(attempt));
  }, [attempt, done]);

  const filteredQuizzes = activeFilter === "Все темы" ? quizDefinitions : quizDefinitions.filter((quiz) => quizFilterIds[activeFilter]?.includes(quiz.id));
  const currentQuiz = attempt ? quizDefinitions.find((quiz) => quiz.id === attempt.quizId) ?? quizDefinitions[quizDefinitions.length - 1] : null;
  const current = attempt ? questions[attempt.questionIds[attempt.order[attempt.index]]] : null;
  const time = attempt ? `${String(Math.floor(attempt.seconds / 60)).padStart(2, "0")}:${String(attempt.seconds % 60).padStart(2, "0")}` : "01:00";
  const progress = attempt ? Math.round((attempt.score / attempt.questionIds.length) * 100) : 0;

  function startQuiz(quiz: QuizDefinition) {
    setAttempt(freshAttempt(quiz));
    setActiveQuiz(quiz);
    setDone(false);
    setRunning(true);
  }

  function resume() {
    if (!attempt) return;
    setAttempt((value) => value ? { ...value, seconds: value.seconds === 0 ? 60 : value.seconds } : value);
    setActiveQuiz(currentQuiz);
    setRunning(true);
  }

  function startOver() {
    const quiz = activeQuiz ?? currentQuiz ?? quizDefinitions[quizDefinitions.length - 1];
    startQuiz(quiz);
  }

  function chooseAnswer(answerIndex: number) {
    if (!attempt || !current || attempt.selected !== null || !running) return;
    setAttempt((value) => value ? ({ ...value, selected: answerIndex, score: answerIndex === current.correctIndex ? value.score + 1 : value.score }) : value);
  }

  function nextQuestion() {
    if (!attempt || !current) return;
    const isCorrect = attempt.selected === current.correctIndex;
    const remaining = attempt.order.slice(attempt.index + 1);
    if (!remaining.length && isCorrect && attempt.score >= attempt.questionIds.length - 1) {
      setDone(true);
      setRunning(false);
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
      setDone(true);
      setRunning(false);
      return;
    }
    setAttempt((value) => value ? { ...value, order, index: nextIndex, selected: null } : value);
  }

  return (
    <main className="inner-page quiz-page">
      <button className="back-link" onClick={onBack}><ArrowLeft /> На главную</button>
      {!attempt && !done ? (
        <section className="quiz-catalog">
          <div className="lesson-heading"><span className="eyebrow dark">ТРЕНИРОВКА · ВЫБЕРИ ТЕМУ</span><h1>Какую тему повторим?</h1><p>Отфильтруй квизы по разделу и выбери подходящую тренировку.</p></div>
          <div className="catalog-filters quiz-filters" role="group" aria-label="Фильтр квизов">{quizFilters.map((filter) => <button key={filter} type="button" aria-pressed={activeFilter === filter} className={`catalog-filter ${activeFilter === filter ? "active" : ""}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div>
          <div className="course-grid">{filteredQuizzes.map((quiz) => <article className="course-card quiz-topic-card" key={quiz.id}><div className="card-top"><span className="step">ДРОБИ · {quiz.questionIds.length} ВОПРОСОВ</span><span className="icon-bubble"><BookOpen /></span></div><h3>{quiz.title}</h3><p>{quiz.description}</p><button className="text-link" onClick={() => startQuiz(quiz)}>Пройти квиз <ChevronRight /></button></article>)}</div>
        </section>
      ) : !running && !done && attempt ? (
        <section className="result-card paused-card"><div className="result-icon"><Clock3 /></div><span className="eyebrow dark">ТРЕНИРОВКА НА ПАУЗЕ</span><h1>Продолжим?</h1><p>Сохранён квиз «{currentQuiz?.title}»: правильных ответов {attempt.score} из {attempt.questionIds.length}. Можно продолжить с того же места или начать заново.</p><div className="result-actions"><button className="button blue" onClick={resume}><Play /> Продолжить</button><button className="button outline" onClick={startOver}><RotateCcw /> Начать заново</button></div></section>
      ) : running && attempt && current ? (
        <section className="quiz-shell">
          <div className="quiz-head"><span className="eyebrow dark">{currentQuiz?.title.toUpperCase()}</span><span className="timer"><Clock3 /> {time}</span></div>
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
        <section className="result-card"><div className="result-icon"><Trophy /></div><span className="eyebrow dark">ТРЕНИРОВКА ЗАВЕРШЕНА</span><h1>Ты справился!</h1><div className="score">{attempt.score}<small> / {attempt.questionIds.length}</small></div><p>{attempt.score >= Math.ceil(attempt.questionIds.length * 0.75) ? "Прекрасный результат! Ты уверенно разбираешься в теме." : "Хорошая работа! Повтори правила и попробуй квиз ещё раз."}</p><div className="result-actions"><button className="button blue" onClick={startOver}>Пройти ещё раз <ChevronRight /></button><button className="button outline" onClick={onTheory}>Повторить теорию</button><button className="button outline" onClick={() => { setDone(false); setAttempt(null); }}>Выбрать другую тему</button></div></section>
      ) : null}
    </main>
  );
}
