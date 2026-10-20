import { useState } from "react";
import {
  CircleAlert,
  CircleCheck,
  Clock,
  House,
  Plus,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, IconButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceGroup } from "@/components/ui/choice-group";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DescriptionList } from "@/components/ui/description-list";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Cluster, Grid, Stack } from "@/components/ui/layout";
import { Logo } from "@/components/ui/logo";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState, ErrorState, LoadingRows } from "@/components/ui/state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toaster";

/*
 * Dev-only design system reference (route /design-system, excluded from
 * production builds). Tokens: docs/improvement/phase-3/tokens.md.
 * Conventions: docs/improvement/phase-3/component-api-guidelines.md.
 */

const COLORS = [
  ["bg-canvas", "canvas", "Page background"],
  ["bg-subtle", "subtle", "Tracks, hover rows"],
  ["bg-surface", "surface", "Cards, sidebar, inputs"],
  ["bg-fg", "fg", "Main text"],
  ["bg-muted", "muted", "Secondary text, icons"],
  ["bg-input", "input", "Field borders (3.7:1)"],
  ["bg-focus", "focus", "Focus ring (5.6:1)"],
  ["bg-outline", "outline", "Secondary outline"],
  ["bg-primary", "primary", "Primary button"],
  ["bg-brand", "brand", "Logo tile, active dot"],
  ["bg-danger", "danger", "Destructive, errors"],
  ["bg-success-bg", "success-bg", "Complete / paid"],
  ["bg-warning-bg", "warning-bg", "Pending"],
  ["bg-accent-bg", "accent-bg", "Payment due"],
  ["bg-info-bg", "info-bg", "Info"],
  ["bg-danger-bg", "danger-bg", "Error alerts"],
];

const TYPE = [
  ["text-6xl font-display", "Display 56 · Fraunces"],
  ["text-5xl font-display", "Page title 44 · Fraunces"],
  ["text-4xl font-display", "Page title phone 36"],
  ["text-2xl font-display", "Section 24 · Fraunces"],
  ["text-xl", "Subheading 20 · Lexend"],
  ["text-lg", "Card title 18"],
  ["text-base", "Body 16 · Lexend"],
  ["text-sm", "Label / table 14"],
  ["text-xs", "Caption 12"],
];

const SPACES = ["w-2", "w-3", "w-4", "w-6", "w-8", "w-12", "w-16"];
const RADII = [
  "rounded-sm",
  "rounded-md",
  "rounded-lg",
  "rounded-xl",
  "rounded-full",
];
const SHADOWS = [
  "shadow-xs",
  "shadow-sm",
  "shadow-card",
  "shadow-raised",
  "shadow-overlay",
];

function Section({ title, children }) {
  return (
    <section className="flex flex-col gap-4 border-t border-border pt-8">
      <h2 className="font-display text-3xl tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [dress, setDress] = useState("Kurta");
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-canvas">
      <main className="mx-auto flex max-w-(--content-max) flex-col gap-10 px-4 py-10 sm:px-6 lg:px-10">
        <PageHeader
          title="Design system"
          description="Tokens, components and patterns. Dev only."
          actions={<Logo />}
        />

        <Section title="Colors">
          <Grid cols={4} gap={3}>
            {COLORS.map(([cls, name, use]) => (
              <div
                key={name}
                className="flex items-center gap-3 rounded-lg bg-surface p-3 shadow-card"
              >
                <span
                  className={`block size-10 shrink-0 rounded-md shadow-sm ${cls}`}
                />
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{name}</span>
                  <span className="text-xs text-muted">{use}</span>
                </span>
              </div>
            ))}
          </Grid>
        </Section>

        <Section title="Typography">
          <Stack gap={3}>
            {TYPE.map(([cls, label]) => (
              <p key={label} className={`${cls} tracking-tight`}>
                {label}
              </p>
            ))}
          </Stack>
        </Section>

        <Section title="Spacing, radius, elevation">
          <Cluster gap={4} align="end">
            {SPACES.map((w) => (
              <div key={w} className="flex flex-col items-center gap-1">
                <span className={`block ${w} h-6 rounded-sm bg-primary`} />
                <span className="text-xs text-muted">{w}</span>
              </div>
            ))}
          </Cluster>
          <Cluster gap={4}>
            {RADII.map((r) => (
              <span
                key={r}
                className={`flex size-20 items-center justify-center bg-surface text-xs shadow-card ${r}`}
              >
                {r}
              </span>
            ))}
          </Cluster>
          <Cluster gap={6}>
            {SHADOWS.map((s) => (
              <span
                key={s}
                className={`flex h-20 w-32 items-center justify-center rounded-lg bg-surface text-xs ${s}`}
              >
                {s}
              </span>
            ))}
          </Cluster>
        </Section>

        <Section title="Buttons">
          <Cluster>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Saving…</Button>
            <Button disabled>Disabled</Button>
          </Cluster>
          <Cluster>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button>
              <Icon icon={Plus} /> With icon
            </Button>
            <IconButton label="Delete customer">
              <Icon icon={Trash2} />
            </IconButton>
            <IconButton label="Search" variant="secondary">
              <Icon icon={Search} />
            </IconButton>
          </Cluster>
          <p className="text-sm text-muted">
            One primary button per view. Danger only for destructive
            confirmations.
          </p>
        </Section>

        <Section title="Form controls">
          <Card>
            <CardContent>
              <Grid cols={3}>
                <Field label="Full name" required>
                  <Input placeholder="e.g. Hina Shah" />
                </Field>
                <Field label="Waist" required hint="In inches">
                  <Input suffix="in" inputMode="decimal" defaultValue="32" />
                </Field>
                <Field
                  label="Leg length"
                  required
                  error="Leg length is required"
                >
                  <Input suffix="in" inputMode="decimal" />
                </Field>
                <Field label="Price per suit">
                  <Input prefix="Rs" inputMode="numeric" defaultValue="2500" />
                </Field>
                <Field label="Disabled">
                  <Input disabled defaultValue="Read only" />
                </Field>
              </Grid>
              <Cluster gap={6} align="end">
                <ChoiceGroup
                  legend="Dress"
                  required
                  value={dress}
                  onValueChange={setDress}
                  options={[
                    { value: "Kurta", label: "Kurta" },
                    { value: "Shalwar", label: "Shalwar" },
                  ]}
                />
                <Checkbox label="Upper pocket" defaultChecked />
              </Cluster>
            </CardContent>
          </Card>
        </Section>

        <Section title="Badges and alerts">
          <Cluster>
            <Badge tone="warning" icon={Clock}>
              Pending
            </Badge>
            <Badge tone="success" icon={CircleCheck}>
              Complete
            </Badge>
            <Badge tone="accent" icon={CircleAlert}>
              Due
            </Badge>
            <Badge tone="danger">Error</Badge>
            <Badge tone="info">Info</Badge>
            <Badge>Neutral</Badge>
          </Cluster>
          <Stack gap={3}>
            <Alert tone="danger" title="Could not save the customer.">
              Check the connection to the shop computer.
            </Alert>
            <Alert tone="success">Customer added.</Alert>
            <Alert tone="info">Measurements are in inches.</Alert>
          </Stack>
          <Cluster>
            <Button
              variant="secondary"
              onClick={() => toast.success("Customer added: Hina Shah")}
            >
              Show toast
            </Button>
            <Spinner label="Loading" />
          </Cluster>
        </Section>

        <Section title="Dialogs">
          <Cluster>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Hina Shah</DialogTitle>
                  <DialogDescription>Customer No 12</DialogDescription>
                </DialogHeader>
                <DialogBody>
                  <DescriptionList
                    items={[
                      { term: "Waist", value: "32 Inches" },
                      { term: "Bust", value: "38 Inches" },
                      { term: "Total", value: "7500 Rs" },
                    ]}
                  />
                </DialogBody>
                <DialogFooter>
                  <Button variant="secondary">Complete payment</Button>
                  <Button>Order complete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="danger" onClick={() => setConfirmOpen(true)}>
              Delete…
            </Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              tone="danger"
              title="Delete Hina Shah?"
              description="Customer No 12 and all measurements will be removed. This cannot be undone."
              confirmLabel="Delete"
              onConfirm={() => setConfirmOpen(false)}
            />
          </Cluster>
        </Section>

        <Section title="Cards, table, states">
          <Grid cols={3}>
            {[
              [UserPlus, "Add customer", "Measurements and order"],
              [Users, "All customers", "Status and payments"],
              [House, "Dashboard", "Overview"],
            ].map(([icon, title, text]) => (
              <Card key={title}>
                <CardHeader>
                  <Icon icon={icon} size="xl" className="text-muted" />
                  <CardTitle as="h3">{title}</CardTitle>
                  <CardDescription>{text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary">Open</Button>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Table caption="Customers">
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Order</TableHead>
                <TableHead align="right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell label="No.">12</TableCell>
                <TableCell label="Name" className="font-medium">
                  Hina Shah
                </TableCell>
                <TableCell label="Order">
                  <Badge tone="warning" icon={Clock}>
                    Pending
                  </Badge>
                </TableCell>
                <TableCell label="Total" align="right">
                  7500 Rs
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell label="No.">11</TableCell>
                <TableCell label="Name" className="font-medium">
                  Bilal Ahmed
                </TableCell>
                <TableCell label="Order">
                  <Badge tone="success" icon={CircleCheck}>
                    Complete
                  </Badge>
                </TableCell>
                <TableCell label="Total" align="right">
                  5000 Rs
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Grid cols={3}>
            <EmptyState
              title="No customers yet"
              description="Add the first customer to see them here."
              action={<Button>Add customer</Button>}
            />
            <ErrorState
              title="Could not load customers"
              description="Check the connection to the shop computer."
              action={<Button variant="secondary">Retry</Button>}
            />
            <LoadingRows label="Loading customers" />
          </Grid>
          <Skeleton className="h-6 w-1/2" />
        </Section>

        <Section title="Patterns">
          <ul className="flex list-disc flex-col gap-2 pl-5 text-base text-muted">
            <li>
              Page = PageHeader (one h1) + content cards; one primary action.
            </li>
            <li>
              Forms: Field around every control; errors under the field and in
              an Alert at the top of the dialog.
            </li>
            <li>
              Destructive actions: ConfirmDialog with tone danger, naming what
              is removed.
            </li>
            <li>
              Short confirmations: toast.success; persistent problems: Alert or
              ErrorState with Retry.
            </li>
            <li>Status: Badge with text and icon (never color alone).</li>
            <li>
              Loading lists: LoadingRows; nothing yet: EmptyState with the next
              step.
            </li>
          </ul>
        </Section>
      </main>
    </div>
  );
}
