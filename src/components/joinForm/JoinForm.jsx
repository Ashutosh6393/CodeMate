import React from "react";
import { Input, Button, Logo } from "../index";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { v4 as uid } from "uuid";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
function JoinForm() {
  const { register, handleSubmit, setValue, formState } = useForm();
  const { errors } = formState;
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    navigate(`/room/${data.roomId}`, { state: { username: data.username} });
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
      className="max-w-96 min-w-60 w-2/6 p-6 bg-bg-1 rounded-lg flex flex-col gap-3 justify-center items-center"
    >
      <Logo width="w-40" className="mb-4" />

      <Input
        placeholder="Paste Room ID here"
        className="text-base text-white-0"
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
        className="text-base text-white-0"
        {...register("username", {
          required: { value: true, message: "Username is required" },
          maxLength: {
            value: 20,
            message: "Username should not exceed 20 characters",
          },
        })}
        onKeyUp={handleKeySubmit}
      />
      <p className="text-sm text-secondary w-full text-left">
        {errors.username?.message}
      </p>
      <Button type="submit" className="w-full">
        Join Room
      </Button>
      <Button handlerFunction={handleCreate} className="w-full">
        Create New Room
      </Button>
    </form>
  );
}

export default JoinForm;
