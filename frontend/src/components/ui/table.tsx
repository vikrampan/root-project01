import * as React from "react";

// Utility function for merging class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// Type definitions
type TableElement = React.ElementRef<"table">;
type TableProps = React.ComponentPropsWithoutRef<"table">;

type TableHeaderElement = React.ElementRef<"thead">;
type TableHeaderProps = React.ComponentPropsWithoutRef<"thead">;

type TableBodyElement = React.ElementRef<"tbody">;
type TableBodyProps = React.ComponentPropsWithoutRef<"tbody">;

type TableFooterElement = React.ElementRef<"tfoot">;
type TableFooterProps = React.ComponentPropsWithoutRef<"tfoot">;

type TableRowElement = React.ElementRef<"tr">;
type TableRowProps = React.ComponentPropsWithoutRef<"tr">;

type TableHeadElement = React.ElementRef<"th">;
type TableHeadProps = React.ComponentPropsWithoutRef<"th">;

type TableCellElement = React.ElementRef<"td">;
type TableCellProps = React.ComponentPropsWithoutRef<"td">;

type TableCaptionElement = React.ElementRef<"caption">;
type TableCaptionProps = React.ComponentPropsWithoutRef<"caption">;

const Table = React.forwardRef<TableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<TableHeaderElement, TableHeaderProps>(
  ({ className, ...props }, ref) => (
    <thead 
      ref={ref} 
      className={cn("[&_tr]:border-b border-[#282828]", className)} 
      {...props} 
    />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<TableBodyElement, TableBodyProps>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
);
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<TableFooterElement, TableFooterProps>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-[#282828] bg-[#1E1E1E]/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
);
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<TableRowElement, TableRowProps>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-[#282828] transition-colors hover:bg-[#282828]/50 data-[state=selected]:bg-[#282828]",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<TableHeadElement, TableHeadProps>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-[#9A9A9A] [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<TableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle text-[#E0E0E0] [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<TableCaptionElement, TableCaptionProps>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-[#9A9A9A]", className)}
      {...props}
    />
  )
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};