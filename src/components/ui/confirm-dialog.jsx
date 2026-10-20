import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
import { Alert } from "./alert";
import { Button } from "./button";

/**
 * Confirmation for an action (role="alertdialog"; focus starts on Cancel,
 * Esc cancels). The dialog stays open while `loading`, and shows `error` if
 * the action failed, so the caller closes it only on success.
 *
 *   <ConfirmDialog open={open} onOpenChange={setOpen} tone="danger"
 *     title="Delete customer?" description="…" confirmLabel="Delete"
 *     loading={busy} error={error} onConfirm={remove} />
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "primary",
  loading = false,
  error,
  onConfirm,
}) {
  return (
    <AlertDialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialogPrimitive.Portal>
        <AlertDialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-(--z-overlay) grid place-items-center overflow-y-auto bg-overlay p-4",
            "data-[state=closed]:animate-fade-out data-[state=open]:animate-fade-in",
          )}
        >
          <AlertDialogPrimitive.Content className="relative z-(--z-modal) flex w-full max-w-md flex-col gap-4 rounded-xl bg-surface p-6 text-fg shadow-overlay outline-none data-[state=open]:animate-dialog-in">
            <AlertDialogPrimitive.Title className="font-display text-2xl font-normal tracking-tight">
              {title}
            </AlertDialogPrimitive.Title>
            <AlertDialogPrimitive.Description className="text-base text-muted">
              {description}
            </AlertDialogPrimitive.Description>
            {error && <Alert tone="danger">{error}</Alert>}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <AlertDialogPrimitive.Cancel asChild>
                <Button variant="secondary" disabled={loading}>
                  {cancelLabel}
                </Button>
              </AlertDialogPrimitive.Cancel>
              <Button
                variant={tone === "danger" ? "danger" : "primary"}
                loading={loading}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </div>
          </AlertDialogPrimitive.Content>
        </AlertDialogPrimitive.Overlay>
      </AlertDialogPrimitive.Portal>
    </AlertDialogPrimitive.Root>
  );
}
