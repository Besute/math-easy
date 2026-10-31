import { BookOpen, GraduationCap, Menu, X } from "lucide-react";

type HeaderProps = {
  onNavigate: (view: "home" | "theory" | "quiz") => void;
  menuOpen: boolean;
  onToggleMenu: () => void;
};

export function Header({ onNavigate, menuOpen, onToggleMenu }: HeaderProps) {
  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate("home")} aria-label="На главную">
        <span className="brand-icon">½</span>
        <span>Математика<br />просто</span>
      </button>
      <button className="menu-toggle" onClick={onToggleMenu} aria-label="Открыть меню">
        {menuOpen ? <X /> : <Menu />}
      </button>
      <nav className={menuOpen ? "nav open" : "nav"} aria-label="Основная навигация">
        <button onClick={() => onNavigate("home")}>Главная</button>
        <button onClick={() => onNavigate("theory")}><BookOpen size={15} /> Теория</button>
        <button className="nav-cta" onClick={() => onNavigate("quiz")}>Начать урок <GraduationCap size={16} /></button>
      </nav>
    </header>
  );
}
