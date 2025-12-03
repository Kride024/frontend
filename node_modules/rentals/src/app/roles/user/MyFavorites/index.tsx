import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tailwindStyles from "@packages/styles/tailwindStyles";

import useTransactionsStore from "../../../../../../../packages/store/transactionsStore";
import useActionsListingsStore from "../../../store/actionsListingsStore";
import { useRoleStore } from "../../../../../../../packages/store/roleStore";

import FavouritesCard from "./FavoritesCard";
import PropertyListingSkeletonLoader from "../../../features/Properties/PropertyCardSkelton";
import { RENTALS_BASE } from "../../../../../../../packages/config/constants";

// -------------------------------------------------------------
// TYPES
// -------------------------------------------------------------
interface PropertyType {
  prop_id: number;
  [key: string]: any; // fallback for untyped fields
}

interface InvoiceType {
  property_id: number;
  [key: string]: any;
}

interface ReceiptType {
  property_id: number;
  [key: string]: any;
}

// -------------------------------------------------------------
// COMPONENT
// -------------------------------------------------------------
const FavoritesView: React.FC = () => {
  const navigate = useNavigate();

  // Role store
  const { userData } = useRoleStore();
  const id: number = userData?.id;

  // Transaction store
  const {
    invoices,
    receipts,
    fetchUserTransactions,
  } = useTransactionsStore();

  // User actions store
  const { userProperties, fetchActionsListings } = useActionsListingsStore();

  const [userConnectedProperties, setUserConnectedProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sync Zustand "userProperties" → local state
  useEffect(() => {
    const fetchConnected = () => {
      setLoading(true);
      try {
        setUserConnectedProperties(userProperties as PropertyType[]);
      } catch (err: any) {
        console.error("Error processing favorites:", err);
        setError(err.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchConnected();
  }, [userProperties]);

  // Initial fetch of user favorites + transactions
  useEffect(() => {
    const fetchInitial = async () => {
      await fetchActionsListings(id);
      await fetchUserTransactions(id);
    };

    fetchInitial();
  }, [id, fetchActionsListings, fetchUserTransactions]);

  // -------------------------------------------------------------
  // LOADING VIEW
  // -------------------------------------------------------------
  if (loading) {
    return (
      <div className={`${tailwindStyles.mainBackground} min-h-screen`}>
        <main className="container mx-auto p-4 mt-20 text-center">
          <PropertyListingSkeletonLoader />
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // ERROR VIEW
  // -------------------------------------------------------------
  if (error) {
    return (
      <div className={`${tailwindStyles.mainBackground} min-h-screen`}>
        <main className="p-10 pt-24">
          <p className="text-red-500">{error}</p>
        </main>
      </div>
    );
  }

  // -------------------------------------------------------------
  // MAIN VIEW
  // -------------------------------------------------------------
  return (
    <div className="bg-gray-200 flex md:min-h-[calc(100vh-60px)] justify-center p-5">
      <main>
        <div className="space-y-5">
          {userConnectedProperties.length > 0 ? (
            userConnectedProperties.map((property: PropertyType) => {
              const matchingInvoice: InvoiceType | undefined = invoices.find(
                (invoice: InvoiceType) =>
                  invoice.property_id === property.prop_id
              );

              const matchingReceipt: ReceiptType | undefined = receipts.find(
                (receipt: ReceiptType) =>
                  receipt.property_id === property.prop_id
              );

              return (
                <FavouritesCard
                  key={property.prop_id}
                  property={property}
                  initialInvoice={matchingInvoice ?? null}
                  receipt={matchingReceipt ?? null}
                />
              );
            })
          ) : (
            navigate(`${RENTALS_BASE}/myfavorites`)
          )}
        </div>
      </main>
    </div>
  );
};

export default FavoritesView;
