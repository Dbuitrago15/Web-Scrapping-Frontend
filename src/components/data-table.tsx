"use client"

import { useState, useMemo } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown, Search, Star } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"
import { ScrapingResult, BusinessHours } from "@/lib/api"

interface DataTableProps {
  data: ScrapingResult[]
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const { t } = useTranslation()

  const columns: ColumnDef<ScrapingResult>[] = useMemo(
    () => [
      // 1. Business Name
      {
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Business Name
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const name = row.getValue("name") as string | null;
          const hasError = row.original.error;
          return (
            <div className="font-medium max-w-xs">
              {hasError ? (
                <div className="text-red-600">
                  ❌ {row.original.input_data.name}
                  <div className="text-xs text-muted-foreground">
                    {row.original.error}
                  </div>
                </div>
              ) : (
                <div className="truncate" title={name || 'N/A'}>
                  {name || 'N/A'}
                </div>
              )}
            </div>
          );
        },
      },
      // 2. Rating
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            Rating
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const rating = row.getValue("rating") as string | null;
          return rating ? (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
            </div>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      // 3. Reviews Count
      {
        accessorKey: "reviews_count",
        header: "Reviews",
        cell: ({ row }) => {
          const reviews = row.getValue("reviews_count") as string | null;
          return reviews ? (
            <span className="text-muted-foreground">{reviews}</span>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      // 4. Address
      {
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => {
          const address = row.getValue("address") as string | null;
          return (
            <div className="max-w-xs truncate" title={address || 'N/A'}>
              {address || 'N/A'}
            </div>
          );
        },
      },
      // 5. Phone
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => {
          const phone = row.getValue("phone") as string | null;
          return phone ? (
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
              {phone}
            </a>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      // 6. Website
      {
        accessorKey: "website",
        header: "Website",
        cell: ({ row }) => {
          const website = row.getValue("website") as string | null;
          return website ? (
            <a
              href={website.startsWith('http') ? website : `https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline max-w-xs truncate block"
              title={website}
            >
              🌐 Link
            </a>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      // 7-13. Daily Hours (NEW MAIN FEATURE)
      {
        accessorKey: "monday_hours",
        header: "Mon",
        cell: ({ row }) => formatHours(row.getValue("monday_hours") as string | null),
      },
      {
        accessorKey: "tuesday_hours",
        header: "Tue",
        cell: ({ row }) => formatHours(row.getValue("tuesday_hours") as string | null),
      },
      {
        accessorKey: "wednesday_hours",
        header: "Wed",
        cell: ({ row }) => formatHours(row.getValue("wednesday_hours") as string | null),
      },
      {
        accessorKey: "thursday_hours",
        header: "Thu",
        cell: ({ row }) => formatHours(row.getValue("thursday_hours") as string | null),
      },
      {
        accessorKey: "friday_hours",
        header: "Fri",
        cell: ({ row }) => formatHours(row.getValue("friday_hours") as string | null),
      },
      {
        accessorKey: "saturday_hours",
        header: "Sat",
        cell: ({ row }) => formatHours(row.getValue("saturday_hours") as string | null),
      },
      {
        accessorKey: "sunday_hours",
        header: "Sun",
        cell: ({ row }) => formatHours(row.getValue("sunday_hours") as string | null),
      },
      // 14. Category
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
          const category = row.getValue("category") as string | null;
          return category ? (
            <Badge variant="secondary" className="max-w-xs truncate">
              {category}
            </Badge>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
    ],
    [t],
  )

  // Helper function to format hours display
  const formatHours = (hours: string | null): JSX.Element => {
    if (!hours) {
      return <span className="text-muted-foreground text-xs">N/A</span>;
    }
    
    const lowerHours = hours.toLowerCase();
    if (lowerHours.includes('cerrado') || lowerHours.includes('closed')) {
      return <span className="text-red-500 text-xs">🔴 Closed</span>;
    }
    
    if (lowerHours.includes('24')) {
      return <span className="text-green-500 text-xs">🟢 24h</span>;
    }
    
    return (
      <span className="text-blue-600 text-xs max-w-20 truncate block" title={hours}>
        🟡 {hours}
      </span>
    );
  }

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("table.search")}
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="pl-8"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">{t("table.rowsPerPage")}</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t("table.page")} {table.getState().pagination.pageIndex + 1} {t("table.of")} {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            {t("table.showing")} {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{" "}
            {t("table.of")}{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            {t("table.of")} {table.getFilteredRowModel().rows.length} {t("table.entries")}
          </p>
        </div>
      </div>
    </div>
  )
}