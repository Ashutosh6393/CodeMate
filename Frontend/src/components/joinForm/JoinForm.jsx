import React from "react";
import { v4 as uid } from "uuid";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Input, Button, Logo } from "../index";
function JoinForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState } = useForm();
  const { errors } = formState;

  const onSubmit = (data) => {
    navigate(`/room/${data.roomId}`, { state: { username: data.username } });
  };

  const handleKeySubmit = (e) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit);
    }
  };

  const handleCreate = () => {
    setValue("roomId", uid(), { shouldDirty: true, shouldTouch: true });
    toast.success("New room created!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="sm:max-w-96 sm:min-w-60 w-4/6 p-6 bg-bg-1 rounded-lg flex flex-col gap-3 justify-center items-center"
    >
      <Logo width="w-40" className="mb-4" />

      <Input
        placeholder="Paste Room ID here"
        className="sm:text-lg text-xs text-white-0"
        {...register("roomId", {
          required: { value: true, message: "Room Id is required" },
        })}
        onKeyUp={handleKeySubmit}
      />
      <p className="text-sm text-secondary w-full text-left">
        {errors.roomId?.message}
      </p>
      <Input
        placeholder="Username"
        className="sm:text-lg text-xs text-white-0"
        {...register("username", {
          required: { value: true, message: "Username is required" },
          maxLength: {
            value: 20,
            message: "Username should not exceed 20 characters",
          },
          pattern: {
            value: /^[a-zA-Z][a-zA-Z0-9]*$/,
            message:
              "The string must start with a letter and contain only letters and numbers.",
          },
        })}
        onKeyUp={handleKeySubmit}
      />
      <p className="text-sm text-secondary w-full text-left">
        {errors.username?.message}
      </p>
      <Button type="submit" className="text-sm sm:text-lg w-full">
        Join Room
      </Button>
      <Button
        handlerFunction={handleCreate}
        className="text-sm sm:text-lg w-full"
      >
        Create New Room
      </Button>
    </form>
  );
}

export default JoinForm;
