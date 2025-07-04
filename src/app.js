import Dashboard from './components/Dashboard';
import PaymentForm from './components/PaymentForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// ...etc

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* ...other routes */}
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
      </Routes>
      <Footer />
    </Router>
  );
}
export default App;