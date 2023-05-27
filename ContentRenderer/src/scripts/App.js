import './externalDependenciesLoader';
import { HashRouter, Route, Routes } from 'react-router-dom';
import ContentView from '../view/ContentView';
import '@disprz/icons/build/index.css';
import '@disprz/components/build/index.css';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<ContentView />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
