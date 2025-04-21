import { AuthContext } from '../context/AuthContext.tsx'
import { useContext } from 'react'

type Props = {}

const CodeSpace = (props: Props) => {

  const {user} = useContext(AuthContext);
  return (
    <div>
      <h1>CodeSpace</h1>
      {user?.email}
      {user?.name}
      {user?.id}
    </div>
  )
}

export default CodeSpace