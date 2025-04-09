import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Chat from "./Chat/Chat";
import Home from "./Home/Home";
import Layout from "./Layout";
import QNote from "./QNote/QNote";

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/qnote" element={<QNote />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
