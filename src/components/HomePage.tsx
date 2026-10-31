import { BookOpen, ChevronRight, Clock3, GraduationCap, Star, Trophy } from "lucide-react";

type HomePageProps = {
  onNavigate: (view: "home" | "theory" | "quiz") => void;
};

export function HomePage({ onNavigate }: HomePageProps) {
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
          <div className="hero-note"><span><Star /> Понятные объяснения</span><span><Clock3 /> Всего 2 минуты</span></div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="floating-note note-a">½ + ¼ = ¾</div>
          <div className="fraction-illustration"><span>3</span><i /><span>4</span></div>
          <div className="floating-note note-b"><Star fill="currentColor" /> Отлично!</div>
          <div className="tiny-spark">✦</div>
        </div>
      </section>
      <section className="course-section">
        <div className="section-title"><div><span className="eyebrow dark">ТВОЙ УЧЕБНЫЙ МАРШРУТ</span><h2>От «не понимаю» к «получилось!»</h2></div><p>Три простых шага, чтобы освоить дроби.</p></div>
        <div className="course-grid">
          <article className="course-card theory-card"><div className="card-top"><span className="step">01 / ТЕОРИЯ</span><span className="icon-bubble"><BookOpen /></span></div><h3>Разберись в правилах</h3><p>Наглядные примеры помогут понять числитель, знаменатель и действия с дробями.</p><button className="text-link" onClick={() => onNavigate("theory")}>Перейти к теории <ChevronRight /></button><div className="mini-fraction">2<span />5</div></article>
          <article className="course-card quiz-card"><div className="card-top"><span className="step">02 / ПРАКТИКА</span><span className="icon-bubble"><Clock3 /></span></div><h3>Проверь себя</h3><p>8 вопросов на время. Выбирай ответ и сразу узнавай, почему он верный.</p><button className="text-link" onClick={() => onNavigate("quiz")}>Начать квиз <ChevronRight /></button><div className="mini-clock">02:00</div></article>
          <article className="course-card progress-card"><div className="card-top"><span className="step">03 / РЕЗУЛЬТАТ</span><span className="icon-bubble"><Trophy /></span></div><h3>Увидь свой прогресс</h3><p>В конце получишь баллы, разбор ошибок и рекомендации, что повторить.</p><button className="text-link" onClick={() => onNavigate("quiz")}>Попробовать сейчас <ChevronRight /></button><div className="star-art">✦</div></article>
        </div>
      </section>
    </main>
  );
}
