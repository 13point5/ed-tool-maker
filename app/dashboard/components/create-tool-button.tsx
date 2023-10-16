import { Button } from "@/components/ui/button";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Database } from "@/app/database.types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getProjectTypeLabel } from "@/lib/constants";

const formSchema = z.object({
  name: z.string(),
});

enum FormStatus {
  Idle,
  Loading,
  Error,
  Success,
}

type Props = {
  type: string;
};

export const CreateToolButton = ({ type }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const [formStatus, setFormStatus] = useState<FormStatus>(FormStatus.Idle);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("sup");
    setFormStatus(FormStatus.Loading);

    const res = await supabase
      .from("tools")
      .insert({
        name: values.name,
        type,
      })
      .select();

    const toolId = res.data?.[0]?.id;

    if (res.error || !toolId) {
      console.error(res.error);
      setFormStatus(FormStatus.Error);
      toast.error("Error creating tool");
      return;
    }

    setFormStatus(FormStatus.Success);

    router.push(`/tool-builder/${toolId}`);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-700">
          <PlusIcon className="mr-1 w-5 h-5" /> Create{" "}
          {getProjectTypeLabel(type)}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New {getProjectTypeLabel(type)}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <DialogFooter> */}
            <Button type="submit">
              {formStatus === FormStatus.Loading && (
                <>
                  <Loader2Icon className="animate-spin mr-2" />
                  Creating
                </>
              )}

              {formStatus !== FormStatus.Loading && "Create"}
            </Button>
            {/* </DialogFooter> */}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
