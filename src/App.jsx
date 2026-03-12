import './App.css'
import {BrowserRouter, Routes, Route } from 'react-router-dom'

//Componentes
import Saludar from './playground/Component'
import HomeHooks from './playground/HomeHooks'
import HookUseNavigate from './playground/HookUseNavigate'
import HookUseState from './playground/HookUseState'

function App() {
  
  return (
      
      // <h1>Keila Nathaly</h1>
      // <img class="logo" src="/Pascal.jpg" alt="Pascal" />
      // <img class="logo" src="/Pascal1.jpg" alt="Pascal" />
      // <Saludar/>
      // <HomeHooks/>
      // <HookUseNavigate/>
      // <HookUseState/> 

      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomeHooks/>}></Route>
          <Route path='/saludar' element={<Saludar/>}></Route>
          <Route path='/usenavigate' element={<HookUseNavigate/>}></Route>
          <Route path='/usestate' element={<HookUseState/>}></Route>
        </Routes>
      </BrowserRouter>
  
  )
}

export default App
