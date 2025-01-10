import * as React from "react";
import { useQuery } from "react-query";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import ProductsServices from "@/services/Products";
import StockUpdateDialog from "./StockUpdate";

export type Product = {
  id: string;
  product_id: number;
  product_code: string;
  product_name: string;
  product_image: string;
  total_stock: string;
  hsn_code: string;
  is_favourite: boolean;
  variants: { variant_name: string; options: string[] }[];
};
export function DataTable() {
  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const { data, isLoading, isError, error } = useQuery(
    ["products", currentPage],
    () => ProductsServices.getProducts(currentPage),
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setTotalPages(Math.ceil(data.count / 10));
      },
    }
  );

  const openDialog = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Move the columns definition inside the component
  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
    id: "product_image",
    header: "Product Image",
    cell: ({ row }) => (
      <img
        src={row.getValue("product_image")}
        alt={row.getValue("product_name")}
        className="h-12 w-12 object-cover"
      />
    ),
  },
    {
      accessorKey: "product_code",
      header: "Product Code",
      cell: ({ row }) => <div>{row.getValue("product_code")}</div>,
    },
    {
      accessorKey: "product_name",
      header: "Product Name",
      cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
    },
    {
      accessorKey: "total_stock",
      header: "Total Stock",
      cell: ({ row }) => <div>{row.getValue("total_stock")}</div>,
    },
    {
      accessorKey: "hsn_code",
      header: "HSN Code",
      cell: ({ row }) => <div>{row.getValue("hsn_code")}</div>,
    },
    {
      id: "update_stock",
      header: "Update Stock",
      cell: ({ row }) => (
        <Button onClick={() => openDialog(row.original)}>Update</Button> // Now openDialog is in scope
      ),
    },
  ];

  const table = useReactTable({
    data: data?.results || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) return <div>Loading products...</div>;
  if (isError) {
    const err = error as Error;
    return <div>Error: {err?.message}</div>;
  }

  return (
    <div className="w-[90vw] m-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="text-black text-base" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "update_stock" ? (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : (
                        <div>{flexRender(cell.column.columnDef.cell, cell.getContext())}</div>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Dialog for Stock Update */}
      {selectedProduct && (
        <StockUpdateDialog
          product={selectedProduct}
          isOpen={isDialogOpen}
          onClose={closeDialog}
        />
      )}
    </div>
  );
}



