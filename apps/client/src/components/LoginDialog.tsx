import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { signinSchema, signupSchema } from "../lib/zodSchemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {getErrorMessage} from "@repo/errors"
import { Button } from "@/components/ui/button";
import { serverUrl } from "../../envConfig.ts";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

type Props = {
  buttonText: string;
  className: string;
};

const LoginDialog = (props: Props) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const signinForm = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmitSignin = async (values: z.infer<typeof signinSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${serverUrl}/signin`, values);
      if (response.status === 200) {
        navigate("/codespace");
      }
      console.log(response);
    } catch (error) {
      // called if status code is not 2xx
      const message = getErrorMessage(error);
      toast.error(message);
      console.log(message);
    }
    setSubmitting(false);
  };
  const onSubmitSignup = async (values: z.infer<typeof signupSchema>) => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${serverUrl}/signup`, values);
      if (response.status === 200) {
        navigate("/codespace");
      }
      console.log(response);
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
      console.log(message);
    }
    setSubmitting(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className={`${props.className}`}>{props.buttonText}</Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900">
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
