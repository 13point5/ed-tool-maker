import { Button } from "@/components/ui/button";
import { ApikeyDialog } from "@/components/user-menu/api-key-dialog";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

export const MenuButton = () => {
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);

  const handleOpenApiKeyDialog = () => setIsApiKeyDialogOpen(true);

  return (
    <>
      <Button
        onClick={handleOpenApiKeyDialog}
        size="icon"
        variant="ghost"
        className="absolute top-4 right-4"
      >
        <MenuIcon className="" />
      </Button>

      <ApikeyDialog
        open={isApiKeyDialogOpen}
        onOpenChange={setIsApiKeyDialogOpen}
      />
    </>
  );
};
