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

// Función auxiliar para extraer horarios del objeto opening_hours
function extractDayHours(openingHours: { [day: string]: string } | null | undefined, dayName: string): string | null {
  if (!openingHours || typeof openingHours !== 'object') return null;
  
  // Buscar el día exacto o variaciones comunes
  const dayVariations = {
    'Monday': ['Monday', 'monday', 'Mon', 'mon'],
    'Tuesday': ['Tuesday', 'tuesday', 'Tue', 'tue'],
    'Wednesday': ['Wednesday', 'wednesday', 'Wed', 'wed'],
    'Thursday': ['Thursday', 'thursday', 'Thu', 'thu'],
    'Friday': ['Friday', 'friday', 'Fri', 'fri'],
    'Saturday': ['Saturday', 'saturday', 'Sat', 'sat'],
    'Sunday': ['Sunday', 'sunday', 'Sun', 'sun']
  };
  
  const variations = dayVariations[dayName as keyof typeof dayVariations] || [dayName];
  
  for (const variation of variations) {
    if (openingHours[variation]) {
      return openingHours[variation];
    }
  }
  
  return null;
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")
  const { t } = useTranslation()

  const columns: ColumnDef<ScrapingResult>[] = useMemo(
    () => [
      // 1. Input Business Name (What was sent)
      {
        accessorKey: "originalData.name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            {t('table.input_name')}
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
          const businessName = row.original.originalData.name;
          const scrapedStatus = row.original.scrapedData?.status;
          
          return (
            <div className="font-medium max-w-xs">
              <div className="text-xs text-muted-foreground mb-1">{t('table.input_data')}:</div>
              <div className="truncate font-semibold" title={businessName}>
                {businessName}
              </div>
              <div className="mt-1">
                {scrapedStatus === 'success' && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">✅ Success</Badge>
                )}
                {scrapedStatus === 'partial' && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">⚠️ Partial</Badge>
                )}
                {scrapedStatus === 'failed' && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">❌ Failed</Badge>
                )}
                {!scrapedStatus && (
                  <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">⏳ Processing</Badge>
                )}
              </div>
            </div>
          );
        },
      },
      // 2. Found Business Name (What was actually found on Google Maps)
      {
        accessorFn: (row) => row.scrapedData?.fullName,
        id: "scraped_name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            {t('table.found_name')}
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
          const scrapedData = row.original.scrapedData;
          
          if (!scrapedData || scrapedData.status !== 'success') {
            return <span className="text-muted-foreground text-sm">Not found</span>;
          }
          
          return (
            <div className="font-medium max-w-xs">
              <div className="text-xs text-green-600 mb-1">{t('table.found_on_maps')}:</div>
              <div className="truncate font-semibold" title={scrapedData.fullName}>
                {scrapedData.fullName}
              </div>
              {scrapedData.fullAddress && (
                <div className="text-xs text-green-600 truncate mt-1" title={scrapedData.fullAddress}>
                  📍 {scrapedData.fullAddress}
                </div>
              )}
            </div>
          );
        },
      },

      // 3. 🆕 Rating (New field)
      {
        accessorFn: (row) => row.scrapedData?.rating,
        id: "rating",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            ⭐ Rating
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
          const rating = row.original.scrapedData?.rating;
          const status = row.original.scrapedData?.status;
          
          if (status !== 'success' || !rating) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }
          
          return (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{rating}</span>
            </div>
          );
        },
      },

      // 4. 🆕 Reviews Count (New field)
      {
        accessorFn: (row) => row.scrapedData?.reviewsCount,
        id: "reviews_count",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-auto p-0 font-semibold"
          >
            📊 Reviews
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
          const reviewsCount = row.original.scrapedData?.reviewsCount;
          const status = row.original.scrapedData?.status;
          
          if (status !== 'success' || !reviewsCount) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }
          
          return (
            <div className="text-sm font-medium">
              {reviewsCount}
            </div>
          );
        },
      },

      // 5. 🆕 Website (New field)
      {
        accessorFn: (row) => row.scrapedData?.website,
        id: "website",
        header: () => "🌐 Website",
        cell: ({ row }) => {
          const website = row.original.scrapedData?.website;
          const status = row.original.scrapedData?.status;
          
          if (status !== 'success' || !website) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }
          
          return (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm max-w-xs truncate inline-block"
              title={website}
            >
              {website.replace(/^https?:\/\//, '').split('/')[0]}
            </a>
          );
        },
      },

      // 6. 🆕 Category (New field)
      {
        accessorFn: (row) => row.scrapedData?.category,
        id: "category",
        header: () => "🏷️ Category",
        cell: ({ row }) => {
          const category = row.original.scrapedData?.category;
          const status = row.original.scrapedData?.status;
          
          if (status !== 'success' || !category) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }
          
          return (
            <Badge variant="outline" className="text-xs max-w-xs truncate" title={category}>
              {category}
            </Badge>
          );
        },
      },

      // 7. Input Address (What was sent)
      {
        accessorFn: (row) => row.originalData.address,
        id: "input_address",
        header: () => t('table.input_address'),
        cell: ({ row }) => {
          const inputAddress = row.original.originalData.address || '';
          const inputCity = row.original.originalData.city || '';
          const inputPostalCode = row.original.originalData.postal_code || '';
          
          return (
            <div className="max-w-xs">
              <div className="text-xs text-muted-foreground mb-1">{t('table.input_address')}:</div>
              <div className="truncate font-medium" title={inputAddress || 'N/A'}>
                {inputAddress || 'N/A'}
              </div>
              <div className="text-xs text-muted-foreground truncate mt-1">
                {inputCity && inputPostalCode ? `${inputCity}, ${inputPostalCode}` : 
                 inputCity || inputPostalCode || 'N/A'}
              </div>
            </div>
          );
        },
      },
      // 8. Found Phone (From Google Maps)
      {
        accessorFn: (row) => row.scrapedData?.phone,
        id: "phone",
        header: () => t('table.found_phone'),
        cell: ({ row }) => {
          const phone = row.original.scrapedData?.phone;
          const status = row.original.scrapedData?.status;
          
          if (status !== 'success') {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }
          return phone ? (
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
              {phone}
            </a>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      // 9. Social Media Links (From Google Maps)
      {
        accessorFn: (row) => row.scrapedData?.socialMedia?.facebook || row.scrapedData?.socialMedia?.instagram,
        id: "social_media",
        header: () => "Social",
        cell: ({ row }) => {
          const socialMedia = row.original.scrapedData?.socialMedia;
          const status = row.original.scrapedData?.status;
          
          if (status !== 'success' || !socialMedia) {
            return <span className="text-muted-foreground text-sm">N/A</span>;
          }
          
          const links = [];
          if (socialMedia.facebook) links.push({ name: 'FB', url: socialMedia.facebook });
          if (socialMedia.instagram) links.push({ name: 'IG', url: socialMedia.instagram });
          if (socialMedia.twitter) links.push({ name: 'TW', url: socialMedia.twitter });
          
          return links.length > 0 ? (
            <div className="flex gap-1">
              {links.slice(0, 2).map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs"
                  title={link.url}
                >
                  {link.name}
                </a>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">N/A</span>
          );
        },
      },
      // 10-16. Daily Hours (From Google Maps openingHours)
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Monday"),
        id: "monday_hours",
        header: "Mon",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Tuesday"),
        id: "tuesday_hours",
        header: "Tue",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Wednesday"),
        id: "wednesday_hours",
        header: "Wed",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Thursday"),
        id: "thursday_hours",
        header: "Thu",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Friday"),
        id: "friday_hours",
        header: "Fri",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Saturday"),
        id: "saturday_hours",
        header: "Sat",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
      {
        accessorFn: (row) => extractDayHours(row.scrapedData?.openingHours, "Sunday"),
        id: "sunday_hours",
        header: "Sun",
        size: 120,
        cell: ({ getValue }) => {
          const hours = getValue() as string | null;
          return formatHours(hours);
        },
      },
    ],
    [t],
  )

  // Helper function to format hours display in HH:MM - HH:MM format (24-hour military time)
  const formatHours = (hours: string | null): JSX.Element => {
    if (!hours) {
      return <span className="text-muted-foreground text-xs">N/A</span>;
    }
    
    // Convert to HH:MM - HH:MM format
    const formattedHours = convertToStandardFormat(hours);
    
    // Handle special cases with appropriate styling
    if (formattedHours === 'Closed') {
      return <span className="text-red-500 text-xs font-medium">🔴 Closed</span>;
    }
    
    if (formattedHours === '00:00 - 23:59') {
      return <span className="text-green-500 text-xs font-medium">🟢 24h</span>;
    }
    
    // Determine styling based on content
    const hasMultipleRanges = formattedHours.includes(' & ');
    const isValidTimeFormat = /\d{2}:\d{2}/.test(formattedHours);
    
    if (isValidTimeFormat) {
      return (
        <div 
          className={`text-xs font-mono whitespace-nowrap ${hasMultipleRanges ? 'text-blue-700' : 'text-blue-600'}`}
          title={`Original: ${hours}`}
        >
          {formattedHours}
        </div>
      );
    }
    
    // Fallback for unrecognized formats
    return (
      <div className="text-muted-foreground text-xs" title={`Original: ${hours}`}>
        {formattedHours}
      </div>
    );
  }

  // Function to convert hours to HH:MM - HH:MM format (24-hour military time)
  const convertToStandardFormat = (hours: string): string => {
    if (!hours) return 'N/A';
    
    try {
      let workingHours = hours.trim();
      
      // Handle special cases first
      const lowerHours = workingHours.toLowerCase();
      if (lowerHours.includes('cerrado') || lowerHours.includes('closed')) {
        return 'Closed';
      }
      if (lowerHours.includes('24') || lowerHours.includes('siempre') || lowerHours.includes('always')) {
        return '00:00 - 23:59';
      }
      
      // Convert AM/PM to 24-hour format
      workingHours = workingHours
        // Handle "12:30 AM" -> "00:30"
        .replace(/12:(\d{2})\s*AM/gi, '00:$1')
        // Handle other AM times "9:30 AM" -> "09:30"
        .replace(/(\d{1,2}):(\d{2})\s*AM/gi, (match, h, m) => {
          const hour = parseInt(h);
          return `${hour.toString().padStart(2, '0')}:${m}`;
        })
        // Handle "12:30 PM" -> "12:30"
        .replace(/12:(\d{2})\s*PM/gi, '12:$1')
        // Handle other PM times "9:30 PM" -> "21:30"
        .replace(/(\d{1,2}):(\d{2})\s*PM/gi, (match, h, m) => {
          const hour = parseInt(h) + 12;
          return `${hour.toString().padStart(2, '0')}:${m}`;
        })
        // Handle times without minutes "9 AM" -> "09:00"
        .replace(/(\d{1,2})\s*AM/gi, (match, h) => {
          const hour = parseInt(h);
          return hour === 12 ? '00:00' : `${hour.toString().padStart(2, '0')}:00`;
        })
        .replace(/(\d{1,2})\s*PM/gi, (match, h) => {
          const hour = parseInt(h);
          return hour === 12 ? '12:00' : `${(hour + 12).toString().padStart(2, '0')}:00`;
        });

      // Normalize separators to standard dash
      workingHours = workingHours
        .replace(/\s*[–—−~]\s*/g, ' - ')
        .replace(/\s*to\s*/gi, ' - ')
        .replace(/\s*hasta\s*/gi, ' - ')
        .replace(/\s*a\s*/gi, ' - ')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Ensure single digit hours are padded (9:30 -> 09:30)
      workingHours = workingHours.replace(/\b(\d):(\d{2})/g, '0$1:$2');
      
      // Handle multiple time ranges (lunch breaks, split schedules)
      if (workingHours.includes(',') || workingHours.includes('&') || workingHours.includes(' y ')) {
        workingHours = workingHours
          .replace(/[,&]/g, ' & ')
          .replace(/\s+y\s+/gi, ' & ')
          .replace(/\s+&\s+/g, ' & ');
      }
      
      // Final cleanup and validation
      workingHours = workingHours.replace(/\s+/g, ' ').trim();
      
      // Validate that we have a proper time format
      const timePattern = /\d{2}:\d{2}/;
      if (!timePattern.test(workingHours)) {
        return hours; // Return original if no valid time found
      }
      
      return workingHours;
    } catch (error) {
      console.warn('Error formatting hours:', hours, error);
      return hours; // Return original if any error occurs
    }
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
      <div className="rounded-md border overflow-auto max-h-[60vh]">
        <Table>
          <TableHeader className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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