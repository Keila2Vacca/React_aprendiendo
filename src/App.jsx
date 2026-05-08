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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Routes */}
        <Route path='/' element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/forgot-password' element={<ForgotPage />} />
        <Route path='/reset-password' element={<ResetPage />} />

        {/* Dashboard Route */}
        <Route path='/dashboard' element={<Dashboard />} />

        {/* Facebook Compliance Route */}
        <Route path='/delete-data' element={<DeleteDataPage />} />

        {/* Sessions Route */}
        <Route path='/sessions' element={<SessionsPage />} />

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