import { ChevronsDown, ChevronsUp, ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";

// --- SVG Icons ---
const FilterArrowIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
    <path d="M6 9L12 15L18 9" stroke="#073C9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- Interfaces ---
interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  lateFee: number;
  total: number;
  status: string;
}

interface DropdownProps {
  onSelect: (item: string) => void;
}

interface StatusBadgeProps {
  status: string;
}

// --- Mock Data ---
const transactionsData: Transaction[] = [
  { id: 1, date: "15/04/2025", description: "Rent", amount: 20000, lateFee: 0, total: 20000, status: "Paid" },
  { id: 2, date: "15/04/2025", description: "Misc. fee", amount: 1000, lateFee: 0, total: 1000, status: "Paid" },
  { id: 3, date: "15/04/2025", description: "Rent", amount: 20000, lateFee: 1000, total: 21000, status: "Pending" },
  { id: 4, date: "15/04/2025", description: "Rent", amount: 20000, lateFee: 1000, total: 21000, status: "Pending" },
  { id: 5, date: "14/03/2025", description: "Mess fee", amount: 3000, lateFee: 0, total: 3000, status: "Paid" },
  { id: 6, date: "10/03/2025", description: "Electricity bill", amount: 500, lateFee: 0, total: 500, status: "Paid" },
  { id: 7, date: "15/02/2025", description: "Rent", amount: 20000, lateFee: 0, total: 20000, status: "Paid" },
  { id: 8, date: "15/01/2025", description: "Rent", amount: 20000, lateFee: 0, total: 20000, status: "Paid" },
  { id: 9, date: "10/12/2024", description: "Laundry", amount: 300, lateFee: 0, total: 300, status: "Paid" },
];

// --- Helper Function ---
function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
}

// --- Sub-components ---
const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-full py-1 px-3 whitespace-nowrap";
  const textClasses = "font-poppins text-xs font-medium";

  switch (status) {
    case "Paid":
      return <div className={`${baseClasses} bg-green-200 text-green-800`}><span className={textClasses}>Paid</span></div>;
    case "Pending":
      return <div className={`${baseClasses} bg-red-200 text-red-800`}><span className={textClasses}>Pending</span></div>;
    default:
      return <div className={`${baseClasses} bg-gray-200 text-gray-800`}><span className={textClasses}>{status}</span></div>;
  }
};

const PaymentFilterDropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const items = ["All Payments", "miscellaneous fee", "Laundry", "Mess fee", "Electricity bill", "Rent"];
  return (
    <div className="absolute top-full mt-1 w-full sm:w-auto min-w-[180px] rounded-xl bg-white shadow-lg overflow-hidden z-10 left-0 border border-gray-200">
      {items.map((item) => (
        <div key={item} onClick={() => onSelect(item)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
          {item}
        </div>
      ))}
    </div>
  );
};

const TimeFilterDropdown: React.FC<DropdownProps> = ({ onSelect }) => {
  const items = ["Last month", "Last 3 months", "Last 6 months"];
  return (
    <div className="absolute top-full mt-1 w-auto rounded-xl bg-white shadow-lg overflow-hidden z-10 right-0 border border-gray-200">
      {items.map((item) => (
        <div key={item} onClick={() => onSelect(item)} className="cursor-pointer px-4 py-2 hover:bg-gray-100">
          {item}
        </div>
      ))}
    </div>
  );
};

// --- Main Component ---
const GuestFinancialSnapshot: React.FC = () => {
  const [paymentFilterOpen, setPaymentFilterOpen] = useState<boolean>(false);
  const [timeFilterOpen, setTimeFilterOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<string>("All Payments");
  const [selectedTime, setSelectedTime] = useState<string>("Time Range");
  const [showAllRows, setShowAllRows] = useState<boolean>(false);
  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const [currentReceipt, setCurrentReceipt] = useState<Transaction | null>(null);

  // Filtering Logic
  const filteredTransactions = useMemo(() => {
    const currentDate = new Date(2025, 3, 17);
    return transactionsData.filter((tx) => {
      const paymentMatch =
        selectedPayment === "All Payments" ||
        (selectedPayment.toLowerCase() === "miscellaneous fee"
          ? tx.description.toLowerCase() === "misc. fee"
          : tx.description.toLowerCase() === selectedPayment.toLowerCase());

      let timeMatch = true;
      if (selectedTime !== "Time Range") {
        const txDate = parseDate(tx.date);
        const startDate = new Date(currentDate);
        if (selectedTime === "Last month") startDate.setMonth(currentDate.getMonth() - 1);
        else if (selectedTime === "Last 3 months") startDate.setMonth(currentDate.getMonth() - 3);
        else if (selectedTime === "Last 6 months") startDate.setMonth(currentDate.getMonth() - 6);
        timeMatch = txDate >= startDate && txDate <= currentDate;
      }
      return paymentMatch && timeMatch;
    });
  }, [selectedPayment, selectedTime]);

  const transactionsToDisplay = showAllRows ? filteredTransactions : filteredTransactions.slice(0, 3);
  const remaining = Math.max(filteredTransactions.length - 3, 0);

  const handleViewReceipt = (transaction: Transaction) => {
    setCurrentReceipt(transaction);
    setShowReceipt(true);
  };

  return (
    <div className="w-full rounded-3xl bg-white shadow-xl p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
        <h2 className="flex items-center text-lg font-bold text-gray-900 gap-2">
          <ClipboardList className="h-5 w-5 text-indigo-600" />
          Financial Snapshot
        </h2>

        <div className="flex gap-2 flex-wrap">
          <div className="relative w-1/2 sm:w-auto">
            <button onClick={() => { setPaymentFilterOpen(!paymentFilterOpen); setTimeFilterOpen(false); }} className="h-[40px] w-full">
              {selectedPayment} <FilterArrowIcon />
            </button>
            {paymentFilterOpen && <PaymentFilterDropdown onSelect={setSelectedPayment} />}
          </div>

          <div className="relative w-1/2 sm:w-auto">
            <button onClick={() => { setTimeFilterOpen(!timeFilterOpen); setPaymentFilterOpen(false); }} className="h-[40px] w-full">
              {selectedTime} <FilterArrowIcon />
            </button>
            {timeFilterOpen && <TimeFilterDropdown onSelect={setSelectedTime} />}
          </div>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {["Payment date", "Description", "Amount", "Late fee", "Total", "Status", "View"].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {transactionsToDisplay.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{tx.description}</td>
                <td>{tx.amount.toLocaleString()}</td>
                <td>{tx.lateFee.toLocaleString()}</td>
                <td>{tx.total.toLocaleString()}</td>
                <td><StatusBadge status={tx.status} /></td>
                <td>
                  <button onClick={() => handleViewReceipt(tx)}>View Receipt</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* View More */}
        {filteredTransactions.length > 3 && (
          <button onClick={() => setShowAllRows((v) => !v)}>
            {showAllRows ? <>View less <ChevronsUp /></> : <>View more ({remaining}) <ChevronsDown /></>}
          </button>
        )}
      </div>

      {/* Receipt Popup */}
      {showReceipt && currentReceipt && (
        <div onClick={() => setShowReceipt(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div onClick={(e) => e.stopPropagation()}>
            <h3>Receipt Details</h3>
            <p><strong>Date:</strong> {currentReceipt.date}</p>
            <p><strong>Description:</strong> {currentReceipt.description}</p>
            <p><strong>Amount:</strong> ₹{currentReceipt.amount}</p>
            <p><strong>Late Fee:</strong> ₹{currentReceipt.lateFee}</p>
            <p><strong>Total:</strong> ₹{currentReceipt.total}</p>
            <p><strong>Status:</strong> {currentReceipt.status}</p>
            <button onClick={() => setShowReceipt(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestFinancialSnapshot;
