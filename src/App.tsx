import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Loader } from './components/UI/Loader';

// Lazy load pages for better performance (Code Splitting)
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ExpensesPage = lazy(() => import('./pages/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const GroupsPage = lazy(() => import('./pages/GroupsPage').then(m => ({ default: m.GroupsPage })));
const GroupDetailsPage = lazy(() => import('./pages/GroupDetailsPage').then(m => ({ default: m.GroupDetailsPage })));
const GroupSettingsPage = lazy(() => import('./pages/GroupSettingsPage').then(m => ({ default: m.GroupSettingsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const ExpenseCategoriesPage = lazy(() => import('./pages/ExpenseCategoriesPage').then(m => ({ default: m.ExpenseCategoriesPage })));
const ExpenseEntryPage = lazy(() => import('./pages/ExpenseEntryPage').then(m => ({ default: m.ExpenseEntryPage })));
const ExpenseEditPage = lazy(() => import('./pages/ExpenseEditPage').then(m => ({ default: m.ExpenseEditPage })));
const ExpenseViewPage = lazy(() => import('./pages/ExpenseViewPage').then(m => ({ default: m.ExpenseViewPage })));
const ExpenseSettledPage = lazy(() => import('./pages/ExpenseSettledPage').then(m => ({ default: m.ExpenseSettledPage })));

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader fullScreen size="lg" text="Loading..." />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" replace /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><ExpensesPage /></ProtectedRoute>} />
              <Route path="/groups" element={<ProtectedRoute><GroupsPage /></ProtectedRoute>} />
              <Route path="/expense-categories" element={<ProtectedRoute><ExpenseCategoriesPage /></ProtectedRoute>} />
              {/* <Route path="/non-groups" element={<ProtectedRoute><NonGroupsPage /></ProtectedRoute>} /> */}
              <Route path="/expenses/new" element={<ProtectedRoute><ExpenseEntryPage /></ProtectedRoute>} />
              <Route path="/expenses/new/:groupId" element={<ProtectedRoute><ExpenseEntryPage /></ProtectedRoute>} />
              <Route path="/expenses/edit/:expenseId" element={<ProtectedRoute><ExpenseEditPage /></ProtectedRoute>} />
              <Route path="/expenses/view/:expenseId" element={<ProtectedRoute><ExpenseViewPage /></ProtectedRoute>} />
              <Route path="/expenses/settle/new" element={<ProtectedRoute><ExpenseSettledPage /></ProtectedRoute>} />
              <Route path="/expenses/settle/view/:id" element={<ProtectedRoute><ExpenseSettledPage /></ProtectedRoute>} />
              <Route path="/expenses/settle/edit/:id" element={<ProtectedRoute><ExpenseSettledPage /></ProtectedRoute>} />
              <Route path="/groups/:groupId" element={<ProtectedRoute><GroupDetailsPage /></ProtectedRoute>} />
              <Route path="/groups/:groupId/settings" element={<ProtectedRoute><GroupSettingsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
