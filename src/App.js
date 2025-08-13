import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomeIcon } from "@heroicons/react/24/solid";
import Dashboard from '../src/pages/Dashboard';
import CreateForm from '../src/pages/CreateForm';
import EditForm from '../src/pages/EditForm';
import ViewForm from '../src/pages/ViewForm';
import FormResponses from '../src/pages/FormResponses';
import LoginPage from '../src/pages/LoginPage';
import Confirmtion from '../src/pages/Confirmation';

function App() {
  return (
    <Router>
      <div>
        {/* <HomeIcon className="h-6 w-6 text-blue-500" /> */}
        <Routes>

          {/* <Route path="/" element={<LoginPage />} /> */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/forms/create" element={<CreateForm />} />
          <Route path="/forms/:id" element={<ViewForm />} />
          <Route path="/confirmation" element={<Confirmtion />} />
          <Route path="/forms/:id/responses" element={<FormResponses />} />
          <Route path="/forms/:id/edit" element={<EditForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
