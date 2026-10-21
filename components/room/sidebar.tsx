import AddModeratorDialog from "./add-moderator-dialog";
import ManageModeratorsDialog from "./manage-moderators-dialog";
import ShareThroughQrcodeDialog from "./share-through-qrcode-dialog";

interface RoomSidebarProps {
  room: {
    id: string;
    name: string;
    description: string | null;
    is_open: boolean;
  };
  isOwner: boolean;
  canModerate: boolean;
  brand: React.ReactNode;
  stickyOffset: boolean;
}

export default function RoomSidebar({
  room,
  isOwner,
  canModerate,
  brand,
  stickyOffset,
}: RoomSidebarProps) {
  return (
    <aside className="border-b bg-card md:border-b-0 md:border-r">
      <div
        className={`flex flex-col gap-6 px-4 py-6 sm:px-8 md:sticky md:px-6 md:py-10 ${stickyOffset ? "md:top-16" : "md:top-0"}`}
      >
        {brand && <div>{brand}</div>}
        <div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {room.is_open ? (
              <>
                <span className="live-dot h-2 w-2 rounded-full bg-margin" />
                Taking questions
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full border border-muted-foreground" />
                Closed
              </>
            )}
          </p>
          <h1 className="mt-3 text-[1.75rem] font-bold leading-[1.1] tracking-[-0.035em] [overflow-wrap:anywhere]">
            {room.name}
          </h1>
          {room.description && (
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {room.description}
            </p>
          )}
        </div>

        <ShareThroughQrcodeDialog roomId={room.id} roomName={room.name} />

        {canModerate && (
          <div className="border-t pt-5 text-sm text-muted-foreground">
            {isOwner ? (
              <>
                <p>You own this room.</p>
                <div className="mt-2 flex flex-wrap gap-1 -ml-3">
                  <AddModeratorDialog roomId={room.id} />
                  <ManageModeratorsDialog roomId={room.id} />
                </div>
              </>
            ) : (
              <p>You moderate this room.</p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
