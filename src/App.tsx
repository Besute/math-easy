import { useState } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { TheoryPage } from "./components/TheoryPage";
import { QuizPage } from "./components/QuizPage";

export type View = "home" | "theory" | "quiz";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(nextView: View) {
    setView(nextView);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="site">
      <div className="page-loader" aria-hidden="true"><span className="loader-mark">½</span></div>
      <Header onNavigate={navigate} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((open) => !open)} />
      <div className={`page-content view-${view}`} key={view}>
        {view === "home" && <HomePage onNavigate={navigate} />}
        {view === "theory" && <TheoryPage onBack={() => navigate("home")} onStartQuiz={() => navigate("quiz")} />}
        {view === "quiz" && <QuizPage onBack={() => navigate("home")} onTheory={() => navigate("theory")} />}
      </div>
      <footer><div className="footer-brand"><span className="brand-icon">½</span><b>Математика просто</b></div><span>Учись в своём темпе · Тренажёр для 5–7 классов</span></footer>
    </div>
  );
}
