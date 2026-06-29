"use client";

import React from "react";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel, getPaginationRowModel, getSortedRowModel, HeaderContext, PaginationState,
  SortingState
} from "@tanstack/table-core";
import { ArrowUp, CheckCircle, Clock, XCircle, Plus } from "lucide-react";
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
import { cn } from "@/lib/utils";

const createHeader = (title: string) => {
  return ({ column }: HeaderContext<Report, unknown>) => {
    return (
      <Button
        variant="ghost"
        className="size-auto px-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {title}
        <ArrowUp className={cn("ml-2 h-4 w-4 transition duration-150 ease-in-out", (column.getIsSorted() === "desc") && "rotate-180")} />
      </Button>
    );
  }
}

const columns: ColumnDef<Report>[] = [
  { accessorKey: "id", header: createHeader("ID") },
  { accessorKey: "make", header: createHeader("Make") },
  { accessorKey: "model", header: createHeader("Model") },
  { accessorKey: "year", header: createHeader("Year") },
  { accessorKey: "mileage", header: createHeader("Mileage") },
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
          <span>Not Approved</span>
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
];

interface ReportsTableProps {
  reports: Report[]
}

export function ReportsTable({ reports }: ReportsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const totalRows = reports.length;

  const table = useReactTable({
    data: reports,
    columns,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount: totalRows,
    state: {
      pagination,
      sorting,
      columnFilters
    }
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <div className="w-full flex justify-between">
          <Input
            placeholder="Find your report..."
            value={(table.getColumn("make")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
                table.getColumn("make")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
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
                <TableHead key={header.id}>
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  );
}