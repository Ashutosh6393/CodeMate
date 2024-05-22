import React from "react";
import { Input, Button, Logo } from "../index";

function JoinForm() {
  const handleCreate = () => {
    console.log("create room");
  };
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="max-w-96 min-w-60 w-2/6 p-6 bg-bg-1 rounded-lg flex flex-col gap-3 justify-center items-center"
    >
      <Logo width="w-40" className="mb-4" />

      <Input
        placeholder="Paste Room ID here"
        className="text-base text-white-0"
      />
      <Input placeholder="Username" className="text-base text-white-0" />
      <Button type="submit" className="w-full">
        Join Room
      </Button>
      <Button handlerFunction={handleCreate} className="w-full">
        Create Room
      </Button>
    </form>
  );
}

export default JoinForm;
