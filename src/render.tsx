import React from 'react';
import ReactDOM from 'react-dom/client';
import MakerPage from "@/maker/maker";
import './index.css'
const App = () => {

    return <div>
        <MakerPage/>
    </div>

};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App/>);