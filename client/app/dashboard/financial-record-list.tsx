import { useMemo, useState, useCallback } from "react";
import {
  FinancialRecord,
  useFinancialRecords,
} from "@/app/contexts/financial-record-context";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

type CellValue = string | number | Date;

interface EditableCellProps {
  initialValue: CellValue;
  row: number;
  column: keyof FinancialRecord;
  updateRecord: (rowIndex: number, columnId: keyof FinancialRecord, value: CellValue) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState<CellValue>(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row, column, value);
  };

  const displayValue = initialValue instanceof Date 
    ? initialValue.toLocaleDateString()
    : typeof value === "string" 
    ? value 
    : value.toString();

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      className={`w-full ${editable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
    >
      {isEditing ? (
        <input
          value={typeof value === 'object' ? value.toISOString().split('T')[0] : value.toString()}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span className="block p-1">
          {column === 'amount' && typeof value === 'number' 
            ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
            : displayValue}
        </span>
      )}
    </div>
  );
};

const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();
  const columnHelper = createColumnHelper<FinancialRecord>();

  const updateCellRecord = useCallback((
    rowIndex: number, 
    columnId: keyof FinancialRecord, 
    value: CellValue
  ) => {
    const id = records[rowIndex]?._id;
    if (id) {
      updateRecord(id, { ...records[rowIndex], [columnId]: value });
    }
  }, [records, updateRecord]);

  const handleDelete = useCallback((id: string) => {
    deleteRecord(id);
  }, [deleteRecord]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => (
          <EditableCell
            initialValue={info.getValue()}
            row={info.row.index}
            column="description"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => (
          <EditableCell
            initialValue={info.getValue()}
            row={info.row.index}
            column="amount"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("category", {
        header: "Category",
        cell: (info) => (
          <EditableCell
            initialValue={info.getValue()}
            row={info.row.index}
            column="category"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Payment Method",
        cell: (info) => (
          <EditableCell
            initialValue={info.getValue()}
            row={info.row.index}
            column="paymentMethod"
            updateRecord={updateCellRecord}
            editable={true}
          />
        ),
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (
          <EditableCell
            initialValue={info.getValue()}
            row={info.row.index}
            column="date"
            updateRecord={updateCellRecord}
            editable={false}
          />
        ),
      }),
      columnHelper.display({

        id: "delete",
        header: "Delete",
        cell: (info) => (
          <button
            onClick={() => handleDelete(info.row.original._id ?? "")}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors duration-200"
          >
            <Trash2 size={18} />
          </button>
        ),
      }),
    ],
    [columnHelper, updateCellRecord, handleDelete]
  );

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="container mx-auto px-4 w-full">
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 tracking-wider space-x-8"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr 
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td 
                    key={cell.id}
                    className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FinancialRecordList;