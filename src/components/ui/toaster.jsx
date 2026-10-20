import { Toaster as SonnerToaster, toast } from "sonner";

/**
 * Short confirmations that disappear on their own ("Customer added").
 * Mount <Toaster /> once in the app; call toast.success("…") anywhere.
 * Persistent or blocking messages belong in an Alert instead.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex w-full items-center gap-3 rounded-lg bg-surface px-4 py-3 font-sans text-base text-fg shadow-overlay",
          title: "font-medium",
          description: "text-sm text-muted",
          success: "[&_[data-icon]]:text-success-dot",
          error: "[&_[data-icon]]:text-danger-fg",
          closeButton:
            "order-last ml-auto rounded-md p-1 text-muted hover:bg-ghost-hover",
        },
      }}
    />
  );
}

export { toast };
