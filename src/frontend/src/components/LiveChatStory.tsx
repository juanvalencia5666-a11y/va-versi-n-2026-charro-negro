import {
  LIVE_META,
  LIVE_TITLE,
  STORY_BLOCKS,
  type StoryBlock,
} from "@/lib/leyenda-actualizada";
import { Bell, MessageCircle, Radio, User } from "lucide-react";

function BlockRow({ block }: { block: StoryBlock }) {
  if (block.kind === "narration") {
    return (
      <li
        data-ocid={`leyenda_actualizada.narration.${block.id}`}
        className="border-l-2 border-border pl-5 text-base leading-relaxed text-muted-foreground sm:text-lg"
      >
        {block.text}
      </li>
    );
  }

  if (block.kind === "dialogue") {
    return (
      <li
        data-ocid={`leyenda_actualizada.dialogue.${block.id}`}
        className="flex justify-end"
      >
        <div className="max-w-[85%] rounded-2xl rounded-br-sm border border-accent/40 bg-accent/10 px-5 py-3.5">
          <p className="text-kicker text-ember">{block.author}</p>
          <p className="mt-1.5 text-base leading-relaxed text-foreground">
            {block.text}
          </p>
        </div>
      </li>
    );
  }

  if (block.kind === "notification") {
    return (
      <li
        data-ocid={`leyenda_actualizada.notification.${block.id}`}
        className="flex justify-center"
      >
        <div className="w-full max-w-md rounded-lg border border-warning/50 bg-warning/10 px-5 py-4 shadow-subtle">
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-warning" aria-hidden="true" />
            <p className="text-kicker text-warning">{block.author}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {block.text}
          </p>
        </div>
      </li>
    );
  }

  return (
    <li
      data-ocid={`leyenda_actualizada.comment.${block.id}`}
      className="flex items-start gap-3"
    >
      <span
        className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground"
        aria-hidden="true"
      >
        <User className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm">
          <span className="font-medium text-foreground">{block.author}</span>{" "}
          <span className="font-mono text-xs text-muted-foreground">
            {block.handle}
          </span>
        </p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
          {block.text}
        </p>
      </div>
    </li>
  );
}

/**
 * The Kevin story rendered as a TikTok-style live chat: narration beats,
 * Kevin's dialogue, live comments and the Banco Azteca notification.
 */
export function LiveChatStory() {
  return (
    <div
      data-ocid="leyenda_actualizada.chat_panel"
      className="surface-card overflow-hidden rounded-lg"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/60 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
          </span>
          <div>
            <p className="font-display text-lg leading-tight text-foreground">
              {LIVE_TITLE}
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              {LIVE_META.host} · {LIVE_META.location}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Radio className="size-4 text-ember" aria-hidden="true" />
          <span className="font-mono text-xs">{LIVE_META.viewers} viendo</span>
        </div>
      </header>

      <ol className="space-y-6 px-5 py-7 sm:px-7">
        {STORY_BLOCKS.map((block) => (
          <BlockRow key={block.id} block={block} />
        ))}
      </ol>

      <footer className="flex items-center gap-3 border-t border-border bg-card/60 px-5 py-4">
        <MessageCircle
          className="size-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="truncate text-sm text-muted-foreground">
          Escribe un comentario…
        </p>
      </footer>
    </div>
  );
}
