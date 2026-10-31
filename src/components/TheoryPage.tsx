import { ArrowLeft, Brain, ChevronRight, Sparkles } from "lucide-react";
import { TopicSlider } from "./TopicSlider";

type TheoryPageProps = { onBack: () => void; onStartQuiz: () => void };

export function TheoryPage({ onBack, onStartQuiz }: TheoryPageProps) {
  return (
    <main className="inner-page">
      <button className="back-link" onClick={onBack}><ArrowLeft /> На главную</button>
      <div className="lesson-heading"><span className="eyebrow dark">УРОК · 5–7 КЛАСС</span><h1>Обыкновенные дроби</h1><p>Изучай тему по шагам: сначала правило, затем короткий пример.</p></div>
      <div className="lesson-layout">
        <div className="lesson-content"><TopicSlider /><button className="button blue" onClick={onStartQuiz}>Проверить знания <ChevronRight /></button></div>
        <aside className="lesson-aside"><div className="aside-card"><Brain /><h3>Запомни</h3><p>Знаменатель — сколько частей. Числитель — сколько взяли.</p></div><div className="aside-card blue-aside"><Sparkles /><h3>Готов потренироваться?</h3><p>8 вопросов, 2 минуты и понятный разбор каждого ответа.</p><button onClick={onStartQuiz}>Начать квиз <ChevronRight /></button></div></aside>
      </div>
    </main>
  );
}
