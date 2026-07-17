"use client";

import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ColumnDef,
  getCoreRowModel,
  HeaderContext,
  PaginationState,
  SortingState
} from "@tanstack/table-core";
import { ArrowUp, CheckCircle, Clock, XCircle, Plus, SearchX } from "lucide-react";
import { flexRender, useReactTable } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input"
import { DataTablePagination } from "@/features/dashboard/components/data-table-pagination";
import { Report } from "../types";
import { Button } from "@/components/ui/button";
import { cn, debounce } from "@/lib/utils";
import { DEFAULT_REPOTS_PER_PAGE } from "@/features/dashboard/constants";

const createHeader = (title: string) => {
  return ({ column }: HeaderContext<Report, unknown>) => {
    return (
      <div className="flex items-center gap-1 w-full">
        <span>{title}</span>
        <Button
          variant="ghost"
          className="size-auto p-1"
          onClick={() => column.toggleSorting()}
        >
          <ArrowUp className={cn(
              "h-4 w-4 transition duration-150 ease-in-out",
              column.getIsSorted() && "text-blue-600",
              (column.getIsSorted() === "desc") && "rotate-180"
            )} />
        </Button>
      </div>
    );
  }
}

const columns: ColumnDef<Report>[] = [
  { accessorKey: "id", header: createHeader("ID"), size: 80 },
  { accessorKey: "make", header: createHeader("Make"), size: 140 },
  { accessorKey: "model", header: createHeader("Model"), size: 140 },
  { accessorKey: "year", header: createHeader("Year"), size: 100 },
  { accessorKey: "mileage", header: createHeader("Mileage"), size: 120 },
  {
    accessorKey: "approved",
    header: createHeader("Status"),
    cell: ({ getValue }) => {
      const approved = getValue<boolean | null>();
      if (approved === true) return (
        <div className="flex gap-2 items-center">
          <CheckCircle className="size-4 text-green-500" />
          <span>Approved</span>
        </div>
      );
      if (approved === false) return (
        <div className="flex gap-2 items-center">
          <XCircle className="size-4 text-red-400" />
          <span>Rejected</span>
        </div>
      );
      return (
          <div className="flex gap-2 items-center">
          <Clock className="size-4 text-zinc-400" />
          <span>Pending</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: createHeader("Created"),
    size: 160,
    cell: ({ getValue }) => {
      const createdAt = getValue<string>();
      return new Date(createdAt).toLocaleString("en-US");
    }
  },
];

type QueryFields = "page" | "search" | "sort" | "pageSize";

interface ReportsTableProps {
  reports: Report[]
  total: number,
  unfilteredTotal: number,
}

export function ReportsTable({ reports, total, unfilteredTotal }: ReportsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sortParam = searchParams.get("sort");
  const sorting: SortingState = sortParam
    ? [{ id: sortParam.split(":")[0], desc: sortParam.split(":")[1] === "desc" }]
    : [];
  const pagination: PaginationState = {
    pageIndex: Number(searchParams.get("page") ?? 1) - 1,
    pageSize: Number(searchParams.get("pageSize") ?? DEFAULT_REPOTS_PER_PAGE),
  };

  const table = useReactTable({
    data: reports,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      const sort = next.length ? `${next[0].id}:${next[0].desc ? "desc" : "asc"}` : "";
      syncQueryField({ sort });
    },
    manualPagination: true,
    onPaginationChange: (updater) => {
      const next = typeof updater === "function" ? updater(pagination) : updater;
      const pageSizeChanged = next.pageSize !== pagination.pageSize;
      syncQueryField({
        page: pageSizeChanged ? "1" : String(next.pageIndex + 1),
        pageSize: String(next.pageSize),
      });
    },
    rowCount: total,
    state: {
      pagination,
      sorting,
    },
  });

  const searchValue = searchParams.get("search") ?? "";

  const updateParams = (updates: Partial<Record<QueryFields, string>>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [field, value] of Object.entries(updates)) {
      if (value) params.set(field, value);
      else params.delete(field);
    }
    router.replace(`?${params}`);
  };

  const updateParamsDebounced = React.useCallback(debounce(updateParams, 1000), []);

  const syncQueryField = (updates: Partial<Record<QueryFields, string>>, withDebounce = false) => {
    withDebounce ? updateParamsDebounced(updates) : updateParams(updates);
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="w-full flex justify-between">
          <Input
            placeholder="Find your report..."
            defaultValue={searchValue}
            size="sm"
            onChange={(event) => syncQueryField({ search: event.target.value, page: "1" }, true)}
            onKeyDown={(event) => {
              const currentValue = event.currentTarget.value;
              if(event.key === "Enter" && searchValue !== currentValue) {
                syncQueryField({ search: currentValue, page: "1" }, false)
              }
            }}
            className="max-w-sm text-sm"
          />
          <Link
            href="/reports/submit"
            className="flex gap-2 items-center rounded-md bg-amber-400 hover:bg-amber-300 text-black px-3 py-2 text-xs font-medium"
          >
            <Plus className="size-4" />
            New Report
          </Link>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} style={{ width: header.getSize() }}>
                  {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-zinc-400">
                  <SearchX className="size-6" />
                  <span>No reports found. Try adjusting your search.</span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center my-3">
        <span className="flex-1 text-sm text-muted-foreground">
          {total} {"of"} {unfilteredTotal} {"reports match your filters"}
        </span>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}