import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Home
import LandingPage from './pages/LandingPage'
import HomeHooks from './playground/HomeHooks'

// Auth Pages
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ForgotPage from './pages/auth/ForgotPage'
import ResetPage from './pages/auth/ResetPage'

// Pages
import SessionsPage from './pages/SessionsPage'
import Dashboard from './pages/Dashboard'
import DeleteDataPage from './pages/DeleteDataPage'

// Keila
import UseStateEjemplo from './playground/hooks/useState/UseStateEjemplo'
import UseReducerEjemplo from './playground/hooks/useReducer/UseReducerEjemplo'
import UseEffectEjemplo from './playground/hooks/useEffect/UseEffectEjemplo'
import UseLayoutEffectEjemplo from './playground/hooks/useLayoutEffect/UseLayoutEffectEjemplo'
import UseDebugValueEjemplo from './playground/hooks/useDebugValue/UseDebugValueEjemplo'

// Karen
import UseContextEjemplo from './playground/Hooks/UseContext/UseContextEjemplo'
import UseTransitionEjemplo from './playground/Hooks/UseTransition/UseTransitionEjemplo'
import UseImperativeHandleEjemplo from './playground/Hooks/UseImperativeHandle/UseImperativeHandleEjemplo'
import UseDeferredValueEjemplo from './playground/Hooks/UseDeferredValue/UseDeferredValueEjemplo'
import UseRefEjemplo from './playground/Hooks/UseRef/UseRefEjemplo'
import UseOptimisticEjemplo from './playground/Hooks/UseOptimistic/UseOptimisticEjemplo'
import UseFormStatusEjemplo from './playground/Hooks/UseFormStatus/UseFormStatusEjemplo'

// Gerardo
import UseSyncExternalStoreEjemplo from './playground/Hooks/UseSyncExternalStore/UseSyncExternalStore'
import UseIdEjemplo from './playground/Hooks/UseId/useId'
import UseMemoEjemplo from './playground/Hooks/UseMemo/UseMemo'
import UseCallbackEjemplo from './playground/Hooks/UseCallback/UseCallback'
import UseInsertionEffectEjemplo from './playground/Hooks/UseInsertionEffect/UseInsertionEffect'
import UseActionStateEjemplo from './playground/Hooks/UseActionState/UseActionState'

// Auth wrappers
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import DashboardLayout from './components/DashboardLayout'

// Tickets CRUD Pages
import TicketsListPage from './pages/tickets/TicketsListPage'
import BookTicketPage from './pages/tickets/BookTicketPage'
import EditTicketPage from './pages/tickets/EditTicketPage'
import ViewTicketPage from './pages/tickets/ViewTicketPage'

// Drivers CRUD Pages
import DriversListPage from './pages/drivers/DriversListPage'
import AddDriverPage from './pages/drivers/AddDriverPage'
import EditDriverPage from './pages/drivers/EditDriverPage'
import ViewDriverPage from './pages/drivers/ViewDriverPage'
// Clients CRUD Pages
import ClientsListPage from './pages/clients/ClientsListPage'
import AddClientPage from './pages/clients/AddClientPage'
import EditClientPage from './pages/clients/EditClientPage'
import ViewClientPage from './pages/clients/ViewClientPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path='/' element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path='/login' element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path='/register' element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path='/forgot-password' element={
          <PublicRoute>
            <ForgotPage />
          </PublicRoute>
        } />
        <Route path='/reset-password' element={
          <PublicRoute>
            <ResetPage />
          </PublicRoute>
        } />

        {/* Dashboard Route */}
        <Route path='/dashboard' element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Tickets CRUD Routes */}
        <Route path='/tickets' element={
          <ProtectedRoute>
            <DashboardLayout>
              <TicketsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path='/tickets/new' element={
          <ProtectedRoute>
            <DashboardLayout>
              <BookTicketPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path='/tickets/edit/:id' element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditTicketPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path='/tickets/view/:id' element={
          <ProtectedRoute>
            <DashboardLayout>
              <ViewTicketPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Clients CRUD Routes */}
        <Route path='/clients' element={
          <ProtectedRoute>
            <DashboardLayout>
              <ClientsListPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path='/clients/new' element={
          <ProtectedRoute>
            <DashboardLayout>
              <AddClientPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path='/clients/edit/:id' element={
          <ProtectedRoute>
            <DashboardLayout>
              <EditClientPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />
        <Route path='/clients/view/:id' element={
          <ProtectedRoute>
            <DashboardLayout>
              <ViewClientPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Drivers CRUD Routes */}
        <Route path='/drivers' element={
          <ProtectedRoute>
            <DriversListPage />
          </ProtectedRoute>
        } />
        <Route path='/drivers/new' element={
          <ProtectedRoute>
            <AddDriverPage />
          </ProtectedRoute>
        } />
        <Route path='/drivers/edit/:id' element={
          <ProtectedRoute>
            <EditDriverPage />
          </ProtectedRoute>
        } />
        <Route path='/drivers/view/:id' element={
          <ProtectedRoute>
            <ViewDriverPage />
          </ProtectedRoute>
        } />

        {/* Facebook Compliance Route */}
        <Route path='/delete-data' element={<DeleteDataPage />} />

        {/* Sessions Route */}
        <Route path='/sessions' element={
          <ProtectedRoute>
            <DashboardLayout>
              <SessionsPage />
            </DashboardLayout>
          </ProtectedRoute>
        } />

        {/* Existing Hooks Home */}
        <Route path='/hooks' element={<HomeHooks />} />

        {/* Keila */}
        <Route path='/HookuseState' element={<UseStateEjemplo />} />
        <Route path='/HookuseReducer' element={<UseReducerEjemplo />} />
        <Route path='/HookuseEffect' element={<UseEffectEjemplo />} />
        <Route path='/HookuseLayoutEffect' element={<UseLayoutEffectEjemplo />} />
        <Route path='/HookuseDebugValue' element={<UseDebugValueEjemplo />} />

        {/* Karen */}
        <Route path='/HookuseContext' element={<UseContextEjemplo />} />
        <Route path='/HookuseTransition' element={<UseTransitionEjemplo />} />
        <Route path='/HookuseImperativeHandle' element={<UseImperativeHandleEjemplo />} />
        <Route path='/HookuseDeferredValue' element={<UseDeferredValueEjemplo />} />
        <Route path='/HookuseRef' element={<UseRefEjemplo />} />
        <Route path='/HookuseOptimistic' element={<UseOptimisticEjemplo />} />
        <Route path='/HookuseFormStatus' element={<UseFormStatusEjemplo />} />

        {/* Gerardo */}
        <Route path='/HookuseSyncExternalStore' element={<UseSyncExternalStoreEjemplo />} />
        <Route path='/HookuseId' element={<UseIdEjemplo />} />
        <Route path='/HookuseMemo' element={<UseMemoEjemplo />} />
        <Route path='/HookuseCallback' element={<UseCallbackEjemplo />} />
        <Route path='/HookuseInsertionEffect' element={<UseInsertionEffectEjemplo />} />
        <Route path='/HookuseActionState' element={<UseActionStateEjemplo />} />
      </Routes> 
    </BrowserRouter>
  )
}

export default App