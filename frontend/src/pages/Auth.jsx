import { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from "../components/RegisterForm"

function Auth() {

  const  [login, setLogin] = useState(true)


  return (




    
    <main className="min-h-screen flex items-center justify-center bg-gray-800 p-4">
             {login ? <LoginForm state={setLogin}/> : <RegisterForm state={setLogin}/>} 
    
    </main>


  )
}

export default Auth