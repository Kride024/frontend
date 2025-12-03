import React, { useEffect, useState, ChangeEvent } from "react";
import {
  fetchTables,
  fetchTableData,
  saveRecords,
  deleteTableRecords,
} from "@/app/shared/services/api/adminApi";

// Types
interface TableRow {
  [key: string]: any;
}

type ApiError = string | null;

const DBTables: React.FC = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // Fetch tables on mount
  useEffect(() => {
    const getTables = async () => {
      setLoading(true);
      try {
        const data = await fetchTables();
        setTables(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Error fetching tables.");
      } finally {
        setLoading(false);
      }
    };
    getTables();
  }, []);

  // Fetch data when table is selected
  const handleTableChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    const selected = event.target.value;
    setSelectedTable(selected);
    setLoading(true);

    try {
      const { result, headers } = await fetchTableData(selected);
      setTableHeaders(headers);
      setTableData(result);
    } catch (err: any) {
      setError(err.message || "Error fetching table data.");
      setTableHeaders([]);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // Checkbox toggle
  const handleCheckboxChange = (rowIndex: number): void => {
    const updatedRows = new Set(selectedRows);
    updatedRows.has(rowIndex)
      ? updatedRows.delete(rowIndex)
      : updatedRows.add(rowIndex);
    setSelectedRows(updatedRows);
  };

  // Cell update
  const handleCellChange = (
    event: ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    header: string
  ): void => {
    const value = event.target.value;
    setTableData((prev) => {
      const updated = [...prev];
      updated[rowIndex] = { ...updated[rowIndex], [header]: value };
      return updated;
    });
  };

  // Save changes
  const handleSave = async (): Promise<void> => {
    if (selectedRows.size === 0) return alert("Select at least one row.");

    try {
      const result = await saveRecords(selectedTable, selectedRows, tableData);
      if (result.success) {
        alert("Saved successfully!");
        setSelectedRows(new Set());

        // Refresh
        const { result: newData, headers } = await fetchTableData(selectedTable);
        setTableHeaders(headers);
        setTableData(newData);
      } else {
        throw new Error(result.error || "Save failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    }
  };

  // Delete rows
  const handleDeleteRows = async (): Promise<void> => {
    if (selectedRows.size === 0) return alert("Select at least one row.");

    if (!window.confirm("Delete selected rows?")) return;

    try {
      const result = await deleteTableRecords(selectedTable, selectedRows, tableData);
      if (result.success) {
        alert("Deleted successfully.");
        setTableData((prev) =>
          prev.filter((_, index) => !selectedRows.has(index))
        );
        setSelectedRows(new Set());
      } else {
        alert(`Failed to delete ${result.failed.length} row(s).`);
      }
    } catch (err) {
      alert("Failed to delete rows.");
    }
  };

  // Add row
  const handleAddRow = (): void => {
    const newRow: TableRow = {};
    tableHeaders.forEach((header) => {
      newRow[header] = header.toLowerCase() === "id" ? null : "";
    });
    setTableData((prev) => [newRow, ...prev]);
  };

  // UI RETURN
  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="bg-white h-[calc(100vh-110px)] rounded-lg shadow m-5">
      <div className="px-6 pb-6">
        {/* Select Table */}
        <div className="flex justify-between items-center gap-4 py-6 overflow-auto">
          <div className="flex items-center space-x-3">
            <h1 className="text-base font-semibold text-gray-700">
              Select a Table
            </h1>
            <select
              id="tableDropdown"
              onChange={handleTableChange}
              value={selectedTable}
              className="w-60 text-sm p-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
            >
              <option value="">-- Choose a Table --</option>
              {tables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          {selectedTable && (
            <div className="flex gap-4">
              <button onClick={handleAddRow} className="bg-green-500 text-white px-4 py-2 rounded text-sm hover:bg-green-600">
                Add
              </button>
              <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded text-sm hover:bg-blue-600">
                Save
              </button>
              <button onClick={handleDeleteRows} className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Table View */}
        {selectedTable && (
          <div className="overflow-auto max-h-[calc(100vh-230px)] rounded-lg border">
            {tableHeaders.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-200 z-10">
                  <tr>
                    <th className="px-1 py-3 text-sm font-semibold whitespace-nowrap">
                      Select
                    </th>
                    {tableHeaders.map((header) => (
                      <th key={header} className="px-1 py-3 text-sm font-semibold whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      <td className="px-1 py-4 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(rowIndex)}
                          onChange={() => handleCheckboxChange(rowIndex)}
                        />
                      </td>

                      {tableHeaders.map((header) => (
                        <td key={header} className="px-1 py-4 text-center">
                          {selectedRows.has(rowIndex) ? (
                            header.toLowerCase() === "id" ? (
                              row[header]
                            ) : (
                              <input
                                type="text"
                                value={row[header] ?? ""}
                                onChange={(e) => handleCellChange(e, rowIndex, header)}
                                className="px-2 py-3 border border-gray-300 rounded w-full"
                              />
                            )
                          ) : (
                            row[header] ?? ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-600">No data available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DBTables;
