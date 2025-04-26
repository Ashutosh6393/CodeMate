import { FaSpinner } from 'react-icons/fa'

type Props = {}

const Loader:React.FC<Props> = (props) => {
  return (
    <FaSpinner className="animate-spin text-white" />
  )
}

export default Loader