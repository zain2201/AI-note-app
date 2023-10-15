"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
const CreateNoteDialog = () => {
  const [input, setInput] = React.useState("");
  const uploadToFirebase = useMutation({
    mutationFn: async (noteId: string) => {
      const response = await axios.post("/api/uploadToFirebase", {
        noteId,
      });
      return response.data;
    },
  });
  const router = useRouter();
  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name: input,
      });
      return response.data;
    },
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input === "") {
      window.alert("please enter a name for your notebook");
      return;
    }
    createNotebook.mutate(undefined, {
      onSuccess: ({ note_id }) => {
        console.log("note created", { note_id });
        //git another endpoint to upload the dalle url to firebase and store the image there and get the link
        uploadToFirebase.mutate(note_id);
        router.push(`/notebook/${note_id}`);
      },
      onError: (error) => {
        console.log(error);
        window.alert("failed to create a new notebook");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New NoteBook</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Name..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createNotebook.isLoading}
            >
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;
