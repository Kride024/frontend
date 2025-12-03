import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import tailwindStyles from "@packages/styles/tailwindStyles";
import { getFmTasks, updateTask } from "@/app/shared/services/api/crud/rmCrud";
import Cookies from "js-cookie";

import { useRoleStore } from "../../../../../../packages/store/roleStore";
import SearchableDropdown from "../../shared/components/SearchableDropdown/SearchableDropdown";

// Types
interface FmStatus {
  id: number | string;
  status_code: string;
}

interface FmRequest {
  transaction_id: number;
  community_name: string;
  owner_name: string;
  owner_mobile?: string;
  tenant_name: string;
  tenant_mobile?: string;
  curr_stat_code: number | string;
  curr_stat_code_id?: number | string;
  schedule_date?: string;
  schedule_time?: string;
  requestedTime?: string;
  requestScheduled?: string;
  fm_id: number | string;
}

interface FmApiResponse {
  result?: FmRequest[];
  status?: FmStatus[];
}

const jwtSecretKey = `${import.meta.env.VITE_JWT_SECRET_KEY}`;

const FMView: React.FC = () => {
  const { userData, resetStore } = useRoleStore();
  const { id } = userData;

  const [requestFmDetails, setRequestFmDetails] = useState<FmRequest[]>([]);
  const [fmCommunities, setFmCommunities] = useState<string[]>([]);
  const [fmStatuses, setFmStatuses] = useState<FmStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFmDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const responseData: FmApiResponse = await getFmTasks({ fmId: id });

        const result = responseData?.result || [];

        setRequestFmDetails(result);

        setFmCommunities(result.map((item) => item.community_name).filter(Boolean));
        setFmStatuses(responseData.status || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchFmDashboardData();
  }, [id]);

  const handleInputChange = (
    transactionId: number,
    field: keyof FmRequest,
    value: any
  ) => {
    setRequestFmDetails((prevDetails) =>
      prevDetails.map((item) =>
        item.transaction_id === transactionId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSave = async (transactionId: number) => {
    const updatedRequest = requestFmDetails.find(
      (item) => item.transaction_id === transactionId
    );
    if (!updatedRequest) return;

    try {
      const payload = {
        id: transactionId,
        cur_stat_code: Number(updatedRequest.curr_stat_code),
        schedule_time: updatedRequest.requestedTime || null,
        schedule_date: updatedRequest.requestScheduled || null,
        fm_id: Number(updatedRequest.fm_id),
      };

      const response = await updateTask(payload);
      if (response) {
        alert("Request updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update request.");
      }
    } catch {
      alert("An error occurred while updating the request.");
    }
  };

 

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="bg-gray-200 min-h-screen flex flex-col">
      <header
        className={`${tailwindStyles.header} sticky top-0 w-full p-3 px-5 md:px-10 flex items-center justify-between shadow-md z-30`}
      >
        <Link to="/">
          <img src="/RUFRENT6.png" alt="logo" className={`${tailwindStyles.logo}`} />
        </Link>
        <h1 className="text-lg hidden md:flex md:text-xl font-bold text-center">
          FM Dashboard
        </h1>
      
      </header>

      <main className="flex-1 px-2 md:px-5 lg:px-10 py-5">
        <section className="hidden lg:block bg-gray-700 p-2 shadow rounded-t-lg text-gray-300">
          <div className="grid grid-cols-6 gap-2 py-2 text-center font-bold">
            <div>Property</div>
            <div>Owner</div>
            <div>Tenant</div>
            <div>Status</div>
            <div>Schedule</div>
            <div>Action</div>
          </div>
        </section>

        {requestFmDetails.length === 0 ? (
          <p className={`${tailwindStyles.heading_3} text-center py-5`}>
            No request available
          </p>
        ) : (
          <ul>
            {requestFmDetails.map((request) => (
              <li
                key={request.transaction_id}
                className="bg-white border-t-2 p-4 shadow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-center"
              >
                <p className={`${tailwindStyles.paragraph_b} text-center`}>
                  <strong className="lg:hidden">Property: </strong>
                  {request.community_name}
                </p>

                <p className={`${tailwindStyles.paragraph_b}`}>
                  <strong className="lg:hidden">Owner: </strong>
                  {request.owner_name} - {request.owner_mobile || "xxxxxx"}
                </p>

                <p className={`${tailwindStyles.paragraph_b}`}>
                  <strong className="lg:hidden">Tenant: </strong>
                  {request.tenant_name} - {request.tenant_mobile || "xxxxxx"}
                </p>

                <div className={`${tailwindStyles.paragraph_b} flex items-center space-x-2`}>
                  <strong className="lg:hidden">Status: </strong>

                  <SearchableDropdown
                    name="curr_stat_code"
                    options={fmStatuses || []}
                    value={request.curr_stat_code}
                    onChange={handleInputChange}
                    placeholder="Search Status"
                    displayKey="status_code"
                    valueKey="id"
                    transactionId={request.transaction_id}
                    currentStatusId={request.curr_stat_code_id}
                    className={`${tailwindStyles.paragraph_b} w-full`}
                  />
                </div>

                <p className={`${tailwindStyles.paragraph_b}`}>
                  <strong className="lg:hidden">Schedule: </strong>
                  {request.schedule_date || request.requestScheduled}
                  {request.schedule_time || request.requestedTime
                    ? ` at ${request.schedule_time || request.requestedTime}`
                    : ""}
                </p>

                <button
                  className={`${tailwindStyles.secondaryButton}`}
                  onClick={() => handleSave(request.transaction_id)}
                >
                  Save
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default FMView;
