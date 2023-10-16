import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ApikeyDialog } from "@/components/user-menu/api-key-dialog";
import { SignOutDialog } from "@/components/user-menu/sign-out-dialog";
import { openAiApiKeyStorageKey } from "@/lib/constants";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const UserMenu = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [isSignoutDialogOpen, setIsSignoutDialogOpen] = useState(false);

  const handleOpenSignoutDialog = () => setIsSignoutDialogOpen(true);
  const handleCloseSignoutDialog = () => setIsSignoutDialogOpen(false);

  const handleSignOut: React.MouseEventHandler<HTMLButtonElement> = async (
    e
  ) => {
    e.preventDefault();

    try {
      const res = await supabase.auth.signOut();

      if (res.error) throw new Error(res.error.message);

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error signing out");
    } finally {
      handleCloseSignoutDialog();
    }
  };

  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  const handleOpenApiKeyDialog = () => setIsApiKeyDialogOpen(true);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleOpenApiKeyDialog}>
            API Keys
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenSignoutDialog}>
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ApikeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
      />

      <SignOutDialog
        open={isSignoutDialogOpen}
        onOpenChange={setIsSignoutDialogOpen}
        handleSignOut={handleSignOut}
      />
    </>
  );
};
