import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "./button";
import { Icon } from "./icon";

// Adapted from shadcn/ui Dialog (Radix): focus is trapped, Esc closes, focus
// returns to the trigger. The overlay scrolls, so tall dialogs work on phones.

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

const SIZES = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
};

/**
 * Dialog panel. Must contain a DialogTitle (accessible name).
 * `size`: sm | md | lg. `showClose` adds the X button (default true).
 */
export function DialogContent({
  size = "md",
  showClose = true,
  className,
  children,
  ...props
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-(--z-overlay) grid place-items-center overflow-y-auto bg-overlay p-4",
          "data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
        )}
      >
        <DialogPrimitive.Content
          data-slot="dialog"
          className={cn(
            "relative z-(--z-modal) flex w-full flex-col rounded-xl bg-surface text-fg shadow-overlay outline-none",
            "data-[state=open]:animate-dialog-in",
            SIZES[size],
            className,
          )}
          {...props}
        >
          {children}
          {showClose && (
            <DialogPrimitive.Close asChild>
              <IconButton
                label="Close"
                size="icon-sm"
                className="absolute top-4 right-4"
              >
                <Icon icon={X} />
              </IconButton>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
}

export function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-6 pt-6 pr-16", className)}
      {...props}
    />
  );
}

export function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-display text-2xl font-normal tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted", className)}
      {...props}
    />
  );
}

export function DialogBody({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-4 px-6 py-5", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
