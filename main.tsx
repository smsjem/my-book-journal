import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
const screens = [
  { name: 'Inicio', slug: 'inicio_my_book_journal' },
  { name: 'Mis lecturas', slug: 'mis_lecturas_my_book_journal' },
  { name: 'Biblioteca', slug: 'biblioteca_virtual_my_book_journal' },
  { name: 'Calendario', slug: 'calendario_de_lectura_my_book_journal' },
];
const alternatives = [
  { name: 'Inicio alternativo', slug: 'inicio_dashboard' },
  { name: 'Mis lecturas alternativo', slug: 'mis_lecturas' },
  { name: 'Biblioteca alternativa', slug: 'biblioteca_virtual' },
];
function App() {
  const [screen, setScreen] = useState(screens[0]);
  return <div className="app">
    <header><div><h1>My Book Journal</h1><p>Vista previa de diseños exportados de Stitch</p></div><span className="pill">Diseño · Etapa 1</span></header>
    <nav aria-label="Pantallas principales">{screens.map(s => <button key={s.slug} className={s.slug === screen.slug ? 'active' : ''} onClick={() => setScreen(s)}>{s.name}</button>)}</nav>
    <main><div className="frame"><iframe key={screen.slug} title={`Diseño de ${screen.name}`} src={`/stitch/${screen.slug}/code.html`}/></div>
      <aside><h2>{screen.name}</h2><p>Esta pantalla muestra el HTML original de Stitch. Los botones dentro de la vista todavía son una maqueta; la navegación superior permite comparar los diseños.</p><h3>Variantes</h3>{alternatives.map(s => <button className="alternative" key={s.slug} onClick={() => setScreen(s)}>{s.name} ↗</button>)}<p className="hint">Siguiente etapa: transformar las pantallas en componentes React conectados a datos reales.</p></aside>
    </main>
  </div>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
