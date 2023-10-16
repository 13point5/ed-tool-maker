"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  password: z.string(),
});

enum FormStatus {
  Idle,
  Loading,
  Error,
  Success,
}

const UpdatePasswordForm = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  // state for signin progress, error, and success
  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Idle);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setFormStatus(FormStatus.Loading);

    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      console.error(error);
      setFormStatus(FormStatus.Error);
      toast.error(error.message, {
        position: "bottom-center",
      });
      return;
    }

    setFormStatus(FormStatus.Success);
    toast.success("Updated your password!", {
      position: "bottom-center",
    });
    router.push("/dashboard");
  };

  return (
    <main className="flex flex-col gap-6 items-center w-full h-screen pt-8 px-4">
      <h1 className="text-4xl font-bold">ATM</h1>
      <Card className="max-w-sm w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Update Password</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                {formStatus === FormStatus.Loading && (
                  <>
                    <Loader2Icon className="animate-spin mr-2" /> Updating
                  </>
                )}

                {formStatus !== FormStatus.Loading && "Update"}
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </main>
  );
};

export default UpdatePasswordForm;
