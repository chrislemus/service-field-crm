import './styles/App.css';
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/Home';
import Login from './pages/Login';

import Overview from './pages/Overview';
import MainLayout from './Layout/MainLayout';

function App() {
  return (
    <Router>
      <MainLayout>
        <Route exact path="/" component={HomePage} />
        <PrivateRoute exact path="/overview" component={Overview} />
        <Route exact path="/login" component={Login} />
      </MainLayout>
    </Router>
  );
}

export default App;
