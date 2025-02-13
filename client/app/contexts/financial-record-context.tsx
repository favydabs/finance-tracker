import { useUser } from "@clerk/clerk-react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
      );

      if (response.ok) {
        const records = await response.json();
        console.log(records);
        setRecords(records);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch("http://localhost:3001/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(newRecord),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => (record._id === id ? updatedRecord : record))
        );
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
