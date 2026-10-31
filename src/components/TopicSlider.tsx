import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen } from "lucide-react";

const topics = [
  {
    title: "Что такое дробь?",
    description: "Дробь показывает, сколько равных частей целого мы взяли.",
    example: "3/4",
    detail: "Если целое разделили на 4 равные части и взяли 3, это три четверти.",
  },
  {
    title: "Числитель и знаменатель",
    description: "Знаменатель записывается снизу, числитель — сверху.",
    example: "3 / 4",
    detail: "Числитель 3 говорит, сколько частей взяли. Знаменатель 4 — на сколько частей разделили целое.",
  },
  {
    title: "Сравнение дробей",
    description: "При одинаковых знаменателях сравниваем числители.",
    example: "3/7 > 2/7",
    detail: "Если числители одинаковы, больше дробь с меньшим знаменателем: 1/3 > 1/5.",
  },
  {
    title: "Сложение дробей",
    description: "С одинаковыми знаменателями складываем числители.",
    example: "2/5 + 1/5 = 3/5",
    detail: "Если знаменатели разные, сначала приведи дроби к общему знаменателю: 1/2 + 1/4 = 2/4 + 1/4 = 3/4.",
  },
];

export function TopicSlider() {
  const [active, setActive] = useState(0);
  const topic = topics[active];

  const previous = () => setActive((current) => (current - 1 + topics.length) % topics.length);
  const next = () => setActive((current) => (current + 1) % topics.length);

  return (
    <section className="topic-slider" aria-label="Теория по дробям">
      <div className="slider-heading"><span className="eyebrow dark"><BookOpen size={15} /> КОРОТКО О ГЛАВНОМ</span><span className="slider-count">{active + 1} / {topics.length}</span></div>
      <div className="topic-slide" key={active}>
        <div className="topic-number">ТЕМА {String(active + 1).padStart(2, "0")}</div>
        <h2>{topic.title}</h2>
        <p>{topic.description}</p>
        <div className="topic-example">{topic.example}</div>
        <div className="topic-detail">{topic.detail}</div>
      </div>
      <div className="slider-controls">
        <button className="slider-arrow" onClick={previous} aria-label="Предыдущая тема"><ChevronLeft /></button>
        <div className="slider-dots">{topics.map((item, index) => <button key={item.title} className={index === active ? "dot active" : "dot"} onClick={() => setActive(index)} aria-label={`Тема ${index + 1}`} />)}</div>
        <button className="slider-arrow" onClick={next} aria-label="Следующая тема"><ChevronRight /></button>
      </div>
    </section>
  );
}
