import React, { useState } from "react";
import ConfirmationCard from "./ConfirmationCard";
import { Eye } from "lucide-react";
import PropertyDetailsModal from "./property-detail-modal";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

interface RecordItem {
  transaction_id: number;
  community_id: number;
  community_name?: string;
  property_id?: number;
  curr_stat_code_id: number;
  tenant_name: string;
  tenant_mobile: string;
  owner_name: string;
  owner_mobile: string;
  schedule_date?: string;
  schedule_time?: string;
  start_time?: string;
  update_time?: string;
}

interface RMFMItem {
  user_id: number;
  user_name: string;
}

interface RMFMData {
  RMs?: RMFMItem[];
}

interface StatusItem {
  id: number;
  status_code: string;
}

interface CommunityMapping {
  community_id: number;
  rm_name: string;
  fm_name: string;
}

interface AdminPanelProps {
  cities: { id: number | string; name: string }[];
  builders: { id: number | string; name: string }[];
  communities: { id: number | string; name: string }[];
  status: StatusItem[];
  rmfm: RMFMData;
  comMapDetails: CommunityMapping[];
  records: RecordItem[];
  pagination: PaginationProps;
  requestsLoading: boolean;

  onCityChange: (cityId: string) => void;
  onBuilderChange: (builderId: string) => void;
  onUpdateRecord: (transactionId: number, updatedRecord: any) => void;
  onPageChange: (page: number) => void;
  setSelectedRm: (rmId: string) => void;
  setSelectedStatus: (statusId: string) => void;
  setSelectedCommunity: (communityId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  cities,
  builders,
  communities,
  onCityChange,
  onBuilderChange,
  records,
  status,
  rmfm,
  comMapDetails,
  requestsLoading,
  onUpdateRecord,
  pagination,
  onPageChange,
  setSelectedRm,
  setSelectedStatus,
  setSelectedCommunity,
}) => {
  const [updateRecords, setUpdateRecords] = useState<Record<number, any>>({});
  const [amountInputs, setAmountInputs] = useState<Record<number, string>>({});
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

  const [selectedRmFilter, setSelectedRmFilter] = useState<string>("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("");
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  const handleCommunityChange = (communityId: string) => {
    setSelectedCommunity(communityId);
    onPageChange(1);
  };

  const handleAmountChange = (transactionId: number, amount: string) => {
    setAmountInputs((prev) => ({
      ...prev,
      [transactionId]: amount,
    }));
  };

  const handleTopRmChange = (rmId: string) => {
    setSelectedRmFilter(rmId);
    setSelectedRm(rmId);
    onPageChange(1);
  };

  const handleTopStatusChange = (statusId: string) => {
    setSelectedStatusFilter(statusId);
    setSelectedStatus(statusId);
    onPageChange(1);
  };

  const handleStatusChange = (transactionId: number, statusId: string) => {
    setUpdateRecords((prev) => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        currentStatus: parseInt(statusId),
      },
    }));
  };

  const handleScheduleChange = (transactionId: number, key: string, value: string) => {
    setUpdateRecords((prev) => ({
      ...prev,
      [transactionId]: {
        ...prev[transactionId],
        [key]: value,
      },
    }));
  };

  const handleUpdateClick = (transactionId: number) => {
    setSelectedTransactionId(transactionId);
    setIsConfirmationOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (selectedTransactionId === null) return;
    const updatedRecord = updateRecords[selectedTransactionId];
    const amount = amountInputs[selectedTransactionId];

    if (updatedRecord?.currentStatus === 18 && amount) {
      updatedRecord.Inv_Amount = amount;
    }

    onUpdateRecord(selectedTransactionId, updatedRecord || {});
    setIsConfirmationOpen(false);
  };

  const toggleRowExpansion = (recordId: number) => {
    setExpandedRows((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }));
  };

  const getRmFmForCommunity = (communityId: number) => {
    const mapping = comMapDetails.find((item) => item.community_id === communityId);
    return {
      rm_name: mapping?.rm_name || "N/A",
      fm_name: mapping?.fm_name || "N/A",
    };
  };

  return (
    <div className="px-6 pb-6">
      {/* Filters Section */}
      <div className="shadow-sm w-full">
        <div className="flex items-center gap-4 py-6 justify-between overflow-auto">
          <h3 className="text-lg font-medium text-gray-900">Requests</h3>
          <div className="flex ml-auto items-center space-x-5">
            <select
              value={selectedStatusFilter}
              className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 border border-gray-300"
              onChange={(e) => handleTopStatusChange(e.target.value)}
            >
              <option value="">Select Status</option>
              {status?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.status_code}
                </option>
              ))}
            </select>
            <select
              value={selectedRmFilter}
              className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 border border-gray-300"
              onChange={(e) => handleTopRmChange(e.target.value)}
            >
              <option value="">Select RM</option>
              {rmfm?.RMs?.map((item) => (
                <option key={item.user_id} value={item.user_id}>
                  {item.user_name}
                </option>
              ))}
            </select>

            {/* City, Builder, Community Filters */}
            <select onChange={(e) => onCityChange(e.target.value)} className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 border border-gray-300">
              <option value="">Select City</option>
              {cities?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <select onChange={(e) => onBuilderChange(e.target.value)} className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 border border-gray-300">
              <option value="">Select Builder</option>
              {builders?.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>

            <select onChange={(e) => handleCommunityChange(e.target.value)} className="px-2 py-1 text-xs font-semibold rounded bg-gray-100 border border-gray-300">
              <option value="">Select Community</option>
              {communities?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Table or Records */}
        <div className="w-full overflow-auto max-h-[calc(100vh-210px)] rounded-lg border">
          {requestsLoading ? (
            <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-14 w-full bg-gray-300 animate-pulse rounded"></div>)}</div>
          ) : records.length === 0 ? (
            <div className="text-gray-500 text-center p-4">No records available</div>
          ) : (
            <table>
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr className="border-b">
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Request ID</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Community</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Tenant Details</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Owner Details</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">RM</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">FM</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Schedule</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Start</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Updated</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-6 py-3 text-sm text-center font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => {
                  const { rm_name, fm_name } = getRmFmForCommunity(record.community_id);
                  const isExpanded = expandedRows[record.transaction_id] || false;

                  return (
                    <React.Fragment key={record.transaction_id}>
                      <tr className="hover:bg-gray-100">
                        <td className="px-6 py-2 text-sm text-center">{record.transaction_id}</td>
                        <td className="px-6 py-2 text-sm">{record.community_name || "N/A"}</td>
                        <td className="px-6 py-4">
                          <div>{record.tenant_name}</div>
                          <div className="text-gray-500">{record.tenant_mobile}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{record.owner_name}</div>
                          <div className="text-gray-500">{record.owner_mobile}</div>
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={updateRecords[record.transaction_id]?.currentStatus ?? record.curr_stat_code_id}
                            onChange={(e) => handleStatusChange(record.transaction_id, e.target.value)}
                            className="px-2 py-1 text-xs rounded border border-gray-300"
                          >
                            {status.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.status_code}
                              </option>
                            ))}
                          </select>

                          {updateRecords[record.transaction_id]?.currentStatus === 18 && (
                            <input
                              type="number"
                              placeholder="Enter Amount"
                              value={amountInputs[record.transaction_id] || ""}
                              onChange={(e) => handleAmountChange(record.transaction_id, e.target.value)}
                              className="mt-2 border text-sm rounded px-2 py-1 w-full"
                            />
                          )}
                        </td>

                        <td className="px-6 py-4 text-center">{rm_name}</td>
                        <td className="px-6 py-4 text-center">{fm_name}</td>

                        <td className="px-6 py-5 flex gap-1">
                          <input
                            type="date"
                            defaultValue={record.schedule_date}
                            onChange={(e) =>
                              handleScheduleChange(record.transaction_id, "updatedScheduleDate", e.target.value)
                            }
                            className="border text-sm rounded px-2 py-1 w-full"
                          />
                          <input
                            type="time"
                            defaultValue={record.schedule_time}
                            onChange={(e) =>
                              handleScheduleChange(record.transaction_id, "updatedScheduleTime", e.target.value)
                            }
                            className="border text-sm rounded px-2 py-1 w-full"
                          />
                        </td>

                        <td className="px-6 py-2 text-sm">{record.start_time ? new Date(record.start_time).toLocaleDateString() : "N/A"}</td>
                        <td className="px-6 py-2 text-sm">{record.update_time ? new Date(record.update_time).toLocaleDateString() : "N/A"}</td>

                        <td className="px-6 py-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800" onClick={() => toggleRowExpansion(record.transaction_id)}>
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <button className="text-green-600 hover:underline" onClick={() => handleUpdateClick(record.transaction_id)}>
                            ✔
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <PropertyDetailsModal
                          propertyId={record.property_id}
                          isExpanded={isExpanded}
                          onClose={() => toggleRowExpansion(record.transaction_id)}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button disabled={pagination.currentPage === 1} onClick={() => onPageChange(pagination.currentPage - 1)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
              Previous
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={`px-3 py-2 rounded ${index + 1 === pagination.currentPage ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-700"}`}
              >
                {index + 1}
              </button>
            ))}

            <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => onPageChange(pagination.currentPage + 1)} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationCard
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmUpdate}
        message="Are you sure you want to update this record?"
      />
    </div>
  );
};

export default AdminPanel;
