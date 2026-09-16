import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BingoApp } from './BingoApp';
import '../styles/bingo.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BingoApp />
  </StrictMode>,
);
