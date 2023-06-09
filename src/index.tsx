import { createRoot } from 'react-dom/client';

import '@fortawesome/fontawesome-free/css/all.css';
import './styles/main.scss';

import App from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(<App />);
