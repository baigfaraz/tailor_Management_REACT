import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Clock, House, Users } from "lucide-react";
import { describe, expect, it } from "vitest";
import { Alert } from "./alert";
import { AppShell } from "./app-shell";
import { Badge } from "./badge";
import { DescriptionList } from "./description-list";
import { PageHeader } from "./page-header";
import { EmptyState, ErrorState, LoadingRows } from "./state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { axeViolations } from "@/test/axe";

describe("Badge and Alert", () => {
  it("badge always shows text; icon is decorative", async () => {
    const { container } = render(
      <Badge tone="warning" icon={Clock}>
        Pending
      </Badge>,
    );
    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("danger alert is announced, info alert is polite", () => {
    render(
      <>
        <Alert tone="danger">Could not save.</Alert>
        <Alert tone="info">Saved earlier.</Alert>
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Could not save.");
    expect(screen.getByRole("status")).toHaveTextContent("Saved earlier.");
  });
});

describe("Table", () => {
  it("keeps table semantics and mobile labels hidden from screen readers", async () => {
    const { container } = render(
      <Table caption="Customers">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead align="right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell label="Name">Ali Raza</TableCell>
            <TableCell label="Total" align="right">
              Rs 5,000
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(
      screen.getByRole("table", { name: "Customers" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Name" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Ali Raza/ })).toBeInTheDocument();
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("States", () => {
  it("empty, error and loading states", async () => {
    const { container } = render(
      <>
        <EmptyState title="No customers yet" description="Add the first one." />
        <ErrorState title="Could not load customers" />
        <LoadingRows label="Loading customers" />
      </>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Could not load customers",
    );
    expect(screen.getByRole("status")).toHaveTextContent("Loading customers");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("PageHeader and DescriptionList", () => {
  it("renders one h1 with back link and a definition list", async () => {
    const { container } = render(
      <MemoryRouter>
        <PageHeader
          title="New customer"
          back={{ to: "/Home", label: "Home" }}
        />
        <DescriptionList items={[{ term: "Waist", value: "32 Inches" }]} />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "New customer" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/Home",
    );
    expect(screen.getByRole("term")).toHaveTextContent("Waist");
    expect(await axeViolations(container)).toEqual([]);
  });
});

describe("AppShell", () => {
  it("has skip link, named nav, current page and main landmark", async () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/Home"]}>
        <AppShell
          nav={[
            { to: "/Home", label: "Home", icon: House, end: true },
            { to: "/Home/AllCustomer", label: "Customers", icon: Users },
          ]}
        >
          <h1>Page</h1>
        </AppShell>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("link", { name: "Skip to content" }),
    ).toHaveAttribute("href", "#main");
    const nav = screen.getByRole("navigation", { name: "Main" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Customers" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(await axeViolations(container)).toEqual([]);
  });
});
