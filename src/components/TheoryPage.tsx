import { useState, type ReactNode } from "react";
import { ArrowLeft, Brain, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type TheoryPageProps = { onBack: () => void; onStartQuiz: () => void };
type Lesson = { title: string; content: ReactNode };

const lessons: Lesson[] = [
  { title: "Что показывает дробь", content: <><p>Дробь описывает часть целого, которое разделили на равные части. В записи <b>a/b</b> нижнее число — <b>знаменатель</b>: на сколько равных частей разделили целое. Верхнее число — <b>числитель</b>: сколько таких частей взяли.</p><div className="lesson-example"><strong>Пример: 3/5</strong>Шоколадку разделили на 5 одинаковых долек и взяли 3. Значит, взяли три пятых шоколадки.</div><p>Знаменатель не может быть равен нулю: разделить целое на ноль частей невозможно.</p></> },
  { title: "Равные дроби и сокращение", content: <><p>Одну и ту же часть можно записать разными дробями. Если умножить или разделить числитель и знаменатель на одно и то же ненулевое число, значение дроби не изменится.</p><div className="lesson-example"><strong>1/2 = 2/4 = 3/6</strong>Каждая запись означает половину целого. Чтобы сократить дробь 2/4, раздели числитель и знаменатель на 2: получишь 1/2.</div><h3>Как сократить дробь</h3><ol><li>Найди число, на которое делятся и числитель, и знаменатель.</li><li>Раздели на него оба числа.</li><li>Повторяй, пока дробь можно сокращать.</li></ol><div className="lesson-example"><strong>12/18 = 6/9 = 2/3</strong>Сначала делим верх и низ на 2, потом на 3. Дробь 2/3 уже не сокращается.</div></> },
  { title: "Сравнение дробей", content: <><h3>Одинаковые знаменатели</h3><p>Сравни числители: больше та дробь, в которой взяли больше одинаковых частей.</p><div className="lesson-example"><strong>5/8 &gt; 3/8</strong>Восьмые части одного размера, но пять частей больше трёх.</div><h3>Одинаковые числители</h3><p>Больше та дробь, у которой знаменатель меньше: целое поделили на меньшее число частей, поэтому каждая часть крупнее.</p><div className="lesson-example"><strong>1/3 &gt; 1/5</strong>Треть одного и того же пирога больше, чем пятая часть.</div><h3>Разные числители и знаменатели</h3><p>Приведи дроби к общему знаменателю, а затем сравни числители. Например: 2/3 = 4/6, значит 2/3 &gt; 3/6.</p></> },
  { title: "Сложение дробей", content: <><h3>Знаменатели одинаковые</h3><p>Сложи числители, а знаменатель оставь прежним. В конце сократи ответ, если это возможно.</p><div className="lesson-example"><strong>2/7 + 3/7 = 5/7</strong>Складываем количество седьмых: 2 + 3 = 5. Размер каждой части не меняется.</div><h3>Знаменатели разные</h3><ol><li>Найди общий знаменатель — число, которое делится на оба знаменателя.</li><li>Преобразуй каждую дробь в равную ей дробь с этим знаменателем.</li><li>Сложи числители и сократи результат, если можно.</li></ol><div className="lesson-example"><strong>1/2 + 1/3 = 3/6 + 2/6 = 5/6</strong>Общий знаменатель — 6. Половина равна 3/6, а треть — 2/6.</div><div className="lesson-example"><strong>3/4 + 1/6 = 9/12 + 2/12 = 11/12</strong>Общий знаменатель — 12. Первую дробь умножили на 3/3, вторую — на 2/2.</div></> },
  { title: "Вычитание дробей", content: <><h3>Знаменатели одинаковые</h3><p>Вычти числители, а знаменатель оставь: вычитаем части одинакового размера.</p><div className="lesson-example"><strong>6/9 − 2/9 = 4/9</strong>Из шести девятых убрали две девятых — осталось четыре девятых.</div><h3>Знаменатели разные</h3><p>Сначала приведи дроби к общему знаменателю, затем вычти числители и сократи ответ.</p><div className="lesson-example"><strong>5/6 − 1/4 = 10/12 − 3/12 = 7/12</strong>Общий знаменатель — 12. Пять шестых — это 10/12, одна четверть — 3/12.</div></> },
  { title: "Умножение дробей", content: <><p>Умножь числитель на числитель, а знаменатель на знаменатель. Перед умножением удобно сократить числа крест-накрест.</p><div className="lesson-example"><strong>2/3 × 3/5 = 6/15 = 2/5</strong>Перемножаем верхние числа и нижние, затем сокращаем результат на 3.</div><div className="lesson-example"><strong>3/4 × 2/9 = 1/2 × 1/3 = 1/6</strong>Сократи 3 и 9 на 3, а 2 и 4 на 2 до умножения.</div><p>Целое число можно записать дробью со знаменателем 1: 3 × 2/7 = 3/1 × 2/7 = 6/7.</p></> },
  { title: "Деление дробей", content: <><p>Чтобы разделить на дробь, умножь на обратную дробь. Обратная получается, если поменять местами числитель и знаменатель делителя.</p><div className="lesson-example"><strong>2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6</strong>Дробь 4/5 переворачиваем в 5/4 и выполняем умножение.</div><div className="lesson-example"><strong>3/4 ÷ 2 = 3/4 ÷ 2/1 = 3/4 × 1/2 = 3/8</strong>Целое число тоже можно записать дробью со знаменателем 1.</div><p>Не переворачивай первую дробь: обратной становится только дробь, на которую делят. На ноль делить нельзя.</p></> },
  { title: "Смешанные числа", content: <><p>Смешанное число состоит из целой части и правильной дроби. Например, 2 1/3 — это два целых и ещё одна треть.</p><h3>Из смешанного числа в неправильную дробь</h3><p>Умножь целую часть на знаменатель, прибавь числитель, а знаменатель оставь.</p><div className="lesson-example"><strong>2 1/3 = (2 × 3 + 1)/3 = 7/3</strong>В двух целых шесть третей; вместе с одной третью получается семь третей.</div><h3>Из неправильной дроби в смешанное число</h3><p>Раздели числитель на знаменатель. Частное — целая часть, остаток — числитель дробной части.</p><div className="lesson-example"><strong>11/4 = 2 3/4</strong>11 разделить на 4 — это 2 целых и остаток 3.</div></> },
  { title: "Проверка и памятка", content: <><p>Перед тем как закончить пример, проверь вычисления по короткому списку:</p><ul><li>При сложении и вычитании одинаковых частей знаменатель сохраняется.</li><li>При разных знаменателях сначала найди общий знаменатель.</li><li>При умножении перемножаются верхние числа и нижние числа.</li><li>При делении переворачивается только вторая дробь.</li><li>Сократи ответ и оцени, похож ли он на ожидаемый результат.</li></ul><div className="lesson-example"><strong>Оценка ответа</strong>Если складываешь положительные дроби, результат должен быть больше каждого слагаемого. Если вычитаешь меньшую дробь из большей — ответ должен быть меньше первой дроби.</div></> },
];

export function TheoryPage({ onBack, onStartQuiz }: TheoryPageProps) {
  const [activeLesson, setActiveLesson] = useState(0);
  const lesson = lessons[activeLesson];
  const goTo = (index: number) => { setActiveLesson(index); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <main className="inner-page lesson-page">
      <button className="back-link" onClick={onBack}><ArrowLeft /> На главную</button>
      <div className="lesson-heading"><span className="eyebrow dark">УРОК · 5–7 КЛАСС</span><h1>Обыкновенные дроби</h1><p>Выбирай страницу урока в оглавлении и изучай правила в удобном темпе.</p></div>
      <div className="lesson-layout">
        <article className="lesson-content lesson-page-card">
          <div className="lesson-page-progress"><span style={{ width: `${((activeLesson + 1) / lessons.length) * 100}%` }} /></div>
          <div className="lesson-page-kicker">СТРАНИЦА {activeLesson + 1} ИЗ {lessons.length}</div>
          <h2 className="lesson-page-title">{lesson.title}</h2>
          <div className="lesson-page-body">{lesson.content}</div>
          <div className="lesson-page-navigation"><button className="button outline" disabled={activeLesson === 0} onClick={() => goTo(activeLesson - 1)}><ChevronLeft /> Назад</button><button className="button blue" onClick={() => activeLesson === lessons.length - 1 ? onStartQuiz() : goTo(activeLesson + 1)}>{activeLesson === lessons.length - 1 ? "Пройти квиз" : "Следующая страница"} <ChevronRight /></button></div>
        </article>
        <aside className="lesson-aside">
          <div className="aside-card lesson-toc"><Brain /><h3>Оглавление</h3><nav aria-label="Страницы теории">{lessons.map((item, index) => <button type="button" key={item.title} className={index === activeLesson ? "active" : ""} aria-current={index === activeLesson ? "page" : undefined} onClick={() => goTo(index)}>{item.title}</button>)}</nav></div>
          <div className="aside-card blue-aside"><Sparkles /><h3>Готов потренироваться?</h3><p>Выбери один из тематических квизов по дробям. В большой тренировке 23 вопроса и 1 минута.</p><button onClick={onStartQuiz}>Пройти квиз <ChevronRight /></button></div>
        </aside>
      </div>
    </main>
  );
}
