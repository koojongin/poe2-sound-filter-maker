import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'
import MakerPage from "@/renderer/maker/maker";

const App = () => {

    return <div>
        <MakerPage/>
    </div>

};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App/>);