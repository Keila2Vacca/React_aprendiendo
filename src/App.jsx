import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Home
import HomeHooks from './playground/HomeHooks'

// Keila
import UseStateEjemplo from './playground/hooks/useState/UseStateEjemplo'
import UseReducerEjemplo from './playground/hooks/useReducer/UseReducerEjemplo'
import UseEffectEjemplo from './playground/hooks/useEffect/UseEffectEjemplo'
import UseLayoutEffectEjemplo from './playground/hooks/useLayoutEffect/UseLayoutEffectEjemplo'
import UseDebugValueEjemplo from './playground/hooks/useDebugValue/UseDebugValueEjemplo'

// // Karen
// import UseRefEjemplo from './playground/hooks/useRef/UseRefEjemplo'
// import UseImperativeHandleEjemplo from './playground/hooks/useImperativeHandle/UseImperativeHandleEjemplo'
// import UseContextEjemplo from './playground/hooks/useContext/UseContextEjemplo'
// import UseTransitionEjemplo from './playground/hooks/useTransition/UseTransitionEjemplo'
// import UseDeferredValueEjemplo from './playground/hooks/useDeferredValue/UseDeferredValueEjemplo'
// import UseOptimisticEjemplo from './playground/hooks/useOptimistic/UseOptimisticEjemplo'
// import UseFormStatusEjemplo from './playground/hooks/useFormStatus/UseFormStatusEjemplo'

// // Gerardo
// import UseSyncExternalStoreEjemplo from './playground/hooks/useSyncExternalStore/UseSyncExternalStoreEjemplo'
// import UseIdEjemplo from './playground/hooks/useId/UseIdEjemplo'
// import UseMemoEjemplo from './playground/hooks/useMemo/UseMemoEjemplo'
// import UseCallbackEjemplo from './playground/hooks/useCallback/UseCallbackEjemplo'
// import UseInsertionEffectEjemplo from './playground/hooks/useInsertionEffect/UseInsertionEffectEjemplo'
// import UseActionStateEjemplo from './playground/hooks/useActionState/UseActionStateEjemplo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomeHooks />} />

        {/* Keila */}
        <Route path='/HookuseState' element={<UseStateEjemplo />} />
        <Route path='/HookuseReducer' element={<UseReducerEjemplo />} />
        <Route path='/HookuseEffect' element={<UseEffectEjemplo />} />
        <Route path='/HookuseLayoutEffect' element={<UseLayoutEffectEjemplo />} />
        <Route path='/HookuseDebugValue' element={<UseDebugValueEjemplo />} />

        {/* Karen */}
        {/* <Route path='/HookuseRef' element={<UseRefEjemplo />} />
        <Route path='/HookuseImperativeHandle' element={<UseImperativeHandleEjemplo />} />
        <Route path='/HookuseContext' element={<UseContextEjemplo />} />
        <Route path='/HookuseTransition' element={<UseTransitionEjemplo />} />
        <Route path='/HookuseDeferredValue' element={<UseDeferredValueEjemplo />} />
        <Route path='/HookuseOptimistic' element={<UseOptimisticEjemplo />} />
        <Route path='/HookuseFormStatus' element={<UseFormStatusEjemplo />} /> */}

        {/* Gerardo */}
        {/* <Route path='/HookuseSyncExternalStore' element={<UseSyncExternalStoreEjemplo />} />
        <Route path='/HookuseId' element={<UseIdEjemplo />} />
        <Route path='/HookuseMemo' element={<UseMemoEjemplo />} />
        <Route path='/HookuseCallback' element={<UseCallbackEjemplo />} />
        <Route path='/HookuseInsertionEffect' element={<UseInsertionEffectEjemplo />} />
        <Route path='/HookuseActionState' element={<UseActionStateEjemplo />} />*/}
      </Routes> 
    </BrowserRouter>
  )
}

export default App