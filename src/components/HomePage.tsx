import { useState } from "react";
import { BookOpen, ChevronRight, Clock3, GraduationCap, Star, Calculator, Shapes, Sigma } from "lucide-react";

type HomePageProps = {
  onNavigate: (view: "home" | "theory" | "quiz") => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState("Все темы");
  const topics = [
    { title: "Обыкновенные дроби", category: "Арифметика", description: "Научись понимать дроби и складывать части целого.", icon: <BookOpen />, available: true },
    { title: "Десятичные дроби", category: "Арифметика", description: "Скоро появятся уроки и тренировка по теме.", icon: <Calculator />, available: false },
    { title: "Фигуры и углы", category: "Геометрия", description: "Скоро появятся уроки и тренировка по теме.", icon: <Shapes />, available: false },
    { title: "Выражения и уравнения", category: "Алгебра", description: "Скоро появятся уроки и тренировка по теме.", icon: <Sigma />, available: false },
  ];
  const categories = ["Все темы", "Арифметика", "Геометрия", "Алгебра"];
  const visibleTopics = activeCategory === "Все темы" ? topics : topics.filter((topic) => topic.category === activeCategory);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><GraduationCap size={16} /> МАТЕМАТИКА · 5–7 КЛАСС</span>
          <h1>Математика для тех,<br /><em>кто хочет понять</em></h1>
          <p>Дроби — это проще, чем кажется. Разберись в теме, потренируйся на коротких заданиях и почувствуй уверенность в математике.</p>
          <div className="hero-actions">
            <button className="button blue" onClick={() => onNavigate("quiz")}>Начать тренировку <ChevronRight /></button>
            <button className="button outline" onClick={() => onNavigate("theory")}><BookOpen /> Изучить теорию</button>
          </div>
          <div className="hero-note"><span><Star /> Понятные объяснения</span><span><Clock3 /> 30 секунд на вопрос</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="floating-note note-a">½ + ¼ = ¾</div>
          <div className="fraction-illustration"><span>3</span><i /><span>4</span></div>
          <div className="floating-note note-b"><Star fill="currentColor" /> Отлично!</div>
          <div className="tiny-spark">✦</div>
        </div>
      </section>
      <section className="course-section topic-catalog">
        <div className="section-title"><div><span className="eyebrow dark">БИБЛИОТЕКА ТЕМ</span><h2>Что будем изучать?</h2></div><p>Выбирай тему и двигайся вперёд в удобном темпе.</p></div>
        <div className="catalog-filters" aria-label="Категории тем" role="group">{categories.map((category) => <button key={category} type="button" aria-pressed={activeCategory === category} className={`catalog-filter ${activeCategory === category ? "active" : ""}`} onClick={() => setActiveCategory(category)}>{category}{category === "Все темы" && <span>{topics.length}</span>}</button>)}</div>
        <div className="course-grid">
          {visibleTopics.map((topic) => <article key={topic.title} className={`course-card catalog-card ${topic.available ? "theory-card" : "placeholder-card"}`}><div className="card-top"><span className="step">{topic.category.toUpperCase()}{topic.available ? " · 5–7 КЛАСС" : ""}</span><span className="icon-bubble">{topic.icon}</span></div><h3>{topic.title}</h3><p>{topic.description}</p>{topic.available ? <><div className="catalog-meta"><span>Теория</span><span>23 вопроса</span></div><button className="text-link" onClick={() => onNavigate("theory")}>Открыть тему <ChevronRight /></button><div className="mini-fraction">2<span />5</div></> : <span className="coming-soon">Скоро</span>}</article>)}
        </div>
      </section>
    </main>
  );
}
