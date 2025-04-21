import { Button } from "../components/ui/button.tsx";
import { useNavigate } from "react-router";
type Props = {
  text: string;
};

const ProtectedPage = (props: Props) => {
  const navigate = useNavigate();
  return (
    <div className="grainy w-full h-screen flex flex-col gap-5 justify-center items-center">
      <p className="text-2xl font-bold text-purple-50">{props.text}</p>
      <Button
        className="bg-purple-900 border-purple-900 rounded-sm hover:bg-transparent hover:border-1 hover:border-purple-900 font-pp font-light text-xs"
        onClick={() => navigate("/")}
      >
        Go Home
      </Button>
    </div>
  );
};

export default ProtectedPage;
