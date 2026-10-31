import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ChevronRight, Clock3, Trophy, XCircle } from "lucide-react";
import { questions } from "../data/questions";

type QuizPageProps = { onBack: () => void; onTheory: () => void };

export function QuizPage({ onBack, onTheory }: QuizPageProps) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(120);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const timer = window.setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) {
          setDone(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [done]);

  const current = questions[index];
  const time = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  function chooseAnswer(answerIndex: number) {
    if (selected !== null) return;
    setSelected(answerIndex);
    if (answerIndex === current.correctIndex) setScore((value) => value + 1);
  }

  function nextQuestion() {
    if (index === questions.length - 1) setDone(true);
    else {
      setIndex((value) => value + 1);
      setSelected(null);
    }
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSeconds(120);
    setDone(false);
  }

  return (
    <main className="inner-page quiz-page">
      <button className="back-link" onClick={onBack}><ArrowLeft /> На главную</button>
      {!done ? (
        <section className="quiz-shell">
          <div className="quiz-head"><span className="eyebrow dark">ТРЕНИРОВКА · ДРОБИ</span><span className="timer"><Clock3 /> {time}</span></div>
          <div className="quiz-progress"><span style={{ width: `${(index / questions.length) * 100}%` }} /></div>
          <div className="quiz-meta"><span>ВОПРОС {index + 1} ИЗ {questions.length}</span><span>{score} баллов</span></div>
          <h1>{current.question}</h1>
          <div className="answer-grid">{current.answers.map((answer, answerIndex) => {
            const isCorrect = selected !== null && answerIndex === current.correctIndex;
            const isWrong = selected === answerIndex && answerIndex !== current.correctIndex;
            return <button key={answer} disabled={selected !== null} className={`answer ${isCorrect ? "correct" : ""} ${isWrong ? "wrong" : ""}`} onClick={() => chooseAnswer(answerIndex)}>{answer}{isCorrect && <CheckCircle2 />}{isWrong && <XCircle />}</button>;
          })}</div>
          {selected !== null && <div className={`explanation ${selected === current.correctIndex ? "good" : "bad"}`}><b>{selected === current.correctIndex ? "Верно! Отличная работа." : "Почти! Разберёмся."}</b><p>{current.explanation}</p></div>}
          <div className="quiz-bottom"><span>{selected === null ? "Выбери один ответ" : "Ответ засчитан"}</span><button className="button blue" disabled={selected === null} onClick={nextQuestion}>{index === questions.length - 1 ? "Результат" : "Следующий вопрос"} <ChevronRight /></button></div>
        </section>
      ) : (
        <section className="result-card"><div className="result-icon"><Trophy /></div><span className="eyebrow dark">{seconds === 0 ? "ВРЕМЯ ВЫШЛО" : "ТРЕНИРОВКА ЗАВЕРШЕНА"}</span><h1>Ты справился!</h1><div className="score">{score}<small> / {questions.length}</small></div><p>{score >= 7 ? "Прекрасный результат! Ты уверенно разбираешься в дробях." : score >= 4 ? "Хорошая работа! Повтори правила, в которых были ошибки, и попробуй ещё раз." : "Не переживай — ошибки помогают учиться. Загляни в теорию и пройди тренировку ещё раз."}</p><div className="result-actions"><button className="button blue" onClick={restart}>Пройти ещё раз <ChevronRight /></button><button className="button outline" onClick={onTheory}>Повторить теорию</button></div></section>
      )}
    </main>
  );
}
