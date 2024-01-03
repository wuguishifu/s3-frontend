import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './defaults.css';
import "@fontsource/nunito";
import { KeyProvider } from './context/KeyContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <KeyProvider>
            <App />
        </KeyProvider>
    </React.StrictMode>,
);