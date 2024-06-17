"use client";

import { Collection, Task } from "@prisma/client";
import React, { useState, useTransition } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { Button } from "./ui/button";
import { CollectionColor, CollectionColors } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  CaretDownIcon,
  CaretUpIcon,
  PlusCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { deleteCollection } from "@/actions/collection";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface Props {
  collection: Collection & {
    tasks: Task[];
  };
}

function CollectionCard({ collection }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();

  const tasks = collection.tasks;

  const removeColleection = async () => {
    try {
      await deleteCollection(collection.id);
      toast({
        title: "success",
        description: "Collection deleted successfully",
      });
      router.refresh();
    } catch (e) {
      toast({
        title: "Error",
        description: "Cannot delete selected collection",
        variant: "destructive",
      });
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            "flex w-full justify-between p-6",
            isOpen && "rounded-b-none",
            CollectionColors[collection.color as CollectionColor]
          )}
        >
          <span className="text-white font-bold">{collection.name}</span>
          {!isOpen && <CaretDownIcon className="h-6 w-6" />}
          {isOpen && <CaretUpIcon className="h-6 w-6" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex rounded-b-md flex-col dark:bg-neutral-950 shadow-lg">
        {tasks.length === 0 && <div>No tasks</div>}
        {tasks.length > 0 && (
          <>
            <Progress className="rounded-none" value={80} />
            <div className="p-4 gap-3 flex flex-col">
              {tasks.map((task) => (
                <div>task</div>
              ))}
            </div>
          </>
        )}
        <Separator />
        <footer className="h-[40px] px-4 p-[2px] text-xs text-neutral-500 flex justify-between items-center">
          <p>Created at {collection.createdAt.toDateString()}</p>
          {isLoading && <div>Deleting ...</div>}
          {!isLoading && (
            <div>
              <Button variant={"ghost"} size={"icon"}>
                <PlusCircledIcon />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant={"ghost"} size={"icon"}>
                    <TrashIcon />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Are you sure???</AlertDialogTitle>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => startTransition(removeColleection)}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </footer>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default CollectionCard;
