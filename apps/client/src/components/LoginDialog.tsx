import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signinSchema, signupSchema } from "../lib/zodSchemas.ts";
import { AuthContext } from "../context/AuthContext.tsx";
import { MouseEventHandler, useContext } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosConfig } from "../lib/axiosConfig.ts";
import { verifyAuth } from "../lib/verifyAuth.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type Props = {
  buttonText: string;
  className: string;
  onClick: MouseEventHandler;
};

const LoginDialog = (props: Props) => {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);

  const signinForm = useForm<z.infer<typeof signinSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmitSignin = async (values: z.infer<typeof signinSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/signin", values, axiosConfig);
      if (response.status === 200) {
        const res = await verifyAuth();
        setUser(res.data?.data);
        navigate("/codespace");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Error Signing In");
      }
    }
    setSubmitting(false);
  };
  const onSubmitSignup = async (values: z.infer<typeof signupSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post("/signup", values, axiosConfig);
      if (response.status === 200) {
        const res = await verifyAuth();
        setUser(res.data?.data);
        navigate("/codespace");
      }
      console.log(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        error.response
          ? toast.error(error.response.data.message)
          : toast.error("Error Signing Up");
      }
    }
    setSubmitting(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={`${props.className}`} onClick={props.onClick}>{props.buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="mx-auto font-bold text-2xl text-zinc-400">
            CodeMate
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-full mt-4">
          <TabsList className="w-full bg-zinc-800 mb-5">
            <TabsTrigger
              value="signin"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-50 text-muted-foreground "
            >
              Signin
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-50 text-muted-foreground "
            >
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <Form {...signinForm}>
              <form
                onSubmit={signinForm.handleSubmit(onSubmitSignin)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={signinForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe@email.com"
                          className="text-purple-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signinForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Password
                      </FormLabel>
                      <FormControl className="">
                        <Input
                          type="password"
                          placeholder="password"
                          className="text-purple-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-purple-900 border-2 border-purple-900 hover:bg-transparent hover:border-2 hover:border-purple-900"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  SignIn
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="signup">
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(onSubmitSignup)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe@email.com"
                          className="text-purple-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Jonh Doe"
                          {...field}
                          className="text-purple-50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="yourpassword"
                          className="text-purple-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={submitting}
                  type="submit"
                  className="bg-purple-900 hover:bg-transparent hover:border-2 hover:border-purple-900"
                >
                  {submitting && <FaSpinner className="animate-spin" />}
                  SignUp
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
