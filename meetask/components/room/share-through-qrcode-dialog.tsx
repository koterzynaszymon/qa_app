"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ShareIcon, XIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function ShareThroughQrcodeDialog({ roomId }: { roomId: string }) {
  const [open, setOpen] = useState(false);
  const roomUrl = `${process.env.NEXT_PUBLIC_APP_URL}/room/${roomId}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ShareIcon className="w-4 h-4" /> Share room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Share room</DialogTitle>
          <DialogDescription>
            Share the room with your participants.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <div className="flex justify-center items-center bg-white p-4 rounded-lg">
            <QRCodeSVG value={roomUrl} size={256} level="H" />
          </div>
        )}
        <DialogClose asChild>
          <Button type="button" variant="outline">
            <XIcon className="w-4 h-4" /> Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
