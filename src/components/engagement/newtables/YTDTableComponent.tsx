import React from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';


interface YTDTableProps {
  columns: any;
  data: any[];
}

export const EngagementTableYTD: React.FC<YTDTableProps> = ({ columns, data }) => {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <table className="w-full table-auto">
        <thead className="sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-200">
              {headerGroup.headers.map((header, index) => {
                const widthStyle = index === 0 ? 'min-w-[200px]' : 'min-w-[170px] max-w-[170px]';
                const borderStyle = (index === 0 || index === 1 || index === 3) ? 'border-r-2 border-gray-300' : '';
                return (
                  <th
                    key={header.id}
                    className={`${widthStyle} ${borderStyle} ${index === 0 ? 'text-left' : 'text-center'} text-sm font-semibold text-charterdeepblue tracking-wider px-4 py-2`}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const isTotalRow = Number.isInteger(row.original.sorting_column);
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell, index) => {
                  const borderStyle = (index === 0 || index === 1 || index === 3) ? 'border-r border-gray-300' : '';
                  const textStyle = index === 0 ? 'text-left min-w-[150px]' : 'text-center';
                  const columnHeader = cell.column.columnDef.header as string;
                  let formattedValue: string | number = 'N/A';

                  if ((columnHeader === "Service Subs (000's)" ||
                    columnHeader === "Engaged Viewers (000's)" ||
                    columnHeader === "Highly Engaged Viewers (000s)") &&
                    cell.getValue() !== null &&
                    cell.getValue() !== undefined) {
                    formattedValue = (cell.getValue() as number).toLocaleString('en-US', { maximumFractionDigits: 0 });
                  }
                  else if (typeof cell.getValue() === 'number' && cell.getValue() !== null && cell.getValue() !== undefined) {
                    formattedValue = `${(cell.getValue() as number).toFixed(1)}%`;
                  }
                  else {
                    formattedValue = cell.getValue() as string;
                  }

                  return (
                    <td
                      key={cell.id}
                      className={`group hover:bg-blue-100 text-sm px-2 py-1 ${isTotalRow ? 'font-bold border-t-2 border-gray-300 ' : ''} ${borderStyle} ${textStyle}`}
                      title={`${row.original['Market / Region'] || 'N/A'}  - ${cell.column.id}, ${cell.getValue() || 'N/A'}`}
                    >
                      {formattedValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};