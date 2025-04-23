import { AuthContext } from '../context/AuthContext.tsx'
import { useContext } from 'react'
import Navbar from '../components/layout/Navbar.tsx';

const CodeSpace = () => {

  const {user} = useContext(AuthContext);
  return (
    <main className='bg-zinc-500  w-full h-screen'>
      <Navbar/>

      {user?.email}
      {user?.name}
      {user?.id}
    </main>
  )
}

export default CodeSpace