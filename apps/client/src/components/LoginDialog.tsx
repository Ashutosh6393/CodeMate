import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { z, ZodFirstPartyTypeKind } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { on } from "events";

type Props = {
  buttonText: string;
  className: string;
};

const signupSchema = z.object({
  email: z.string().min(3).email().max(50),
  name: z.string().min(2).max(100),
  password: z.string().max(50).min(8),
});

const signinSchema = z.object({
  email: z
    .string()
    .min(3, { message: "Email too short" })
    .email({ message: "Invalid email" })
    .max(50, { message: "Email too long" }),
  password: z
    .string()
    .max(50, { message: "Password too long" })
    .min(8, { message: "Password too short" }),
});

const LoginDialog = (props: Props) => {
  const signinForm = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmitSignin = (values: z.infer<typeof signinSchema>) => {
    // post to /signin
  };
  const onSubmitSignup = (values: z.infer<typeof signupSchema>) => {
    // post to /signup
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
              value="account"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-50 text-muted-foreground "
            >
              Signin
            </TabsTrigger>
            <TabsTrigger
              value="password"
              className="data-[state=active]:bg-zinc-900 data-[state=active]:text-purple-50 text-muted-foreground "
            >
              Signup
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
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
                  className="bg-purple-900 border-2 border-purple-900 hover:bg-transparent hover:border-2 hover:border-purple-900"
                >
                  SignIn
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="password">
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
