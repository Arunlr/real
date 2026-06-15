import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Chatbot } from './components/Chatbot';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';

// Suppress Figma-internal warnings that aren't related to our code
import './utils/suppressFigmaWarnings';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RouterProvider router={router} />
        <Chatbot />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;