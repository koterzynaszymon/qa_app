"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function ShareThroughQrcodeDialog({
  roomId,
  roomName,
}: {
  roomId: string;
  roomName: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [roomUrl, setRoomUrl] = useState(
    `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/room/${roomId}`,
  );

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      setRoomUrl(`${window.location.origin}/room/${roomId}`);
    }
  }, [roomId]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy. Select the link and copy it manually.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <QrCodeIcon /> Share room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share {roomName}</DialogTitle>
          <DialogDescription>
            Put the code on screen or send the link. Anyone with it can ask a
            question.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <div className="mx-auto rounded-md bg-white p-5">
            <QRCodeSVG
              value={roomUrl}
              size={248}
              level="H"
              fgColor="#141B3A"
              className="h-auto w-full max-w-[248px]"
            />
          </div>
        )}
        <div className="flex gap-2">
          <input
            readOnly
            value={roomUrl}
            aria-label="Room link"
            onFocus={(e) => e.target.select()}
            className="h-9 min-w-0 flex-1 rounded-md border bg-muted px-3 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <Button onClick={copyLink} className="shrink-0">
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
