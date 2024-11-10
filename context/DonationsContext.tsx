import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonationsContext = createContext<DonationsContextType | null>(null);

export type DonationsContextType = {
  donations: Date[];
  addDonation: (date: Date) => Promise<void>;
  deleteDonation: (index: number) => Promise<void>;
  setAllDonations: (newDonations: Date[]) => Promise<void>;
};

interface DonationsProviderProps {
  children: ReactNode;
}

export const DonationsProvider = ({ children }: DonationsProviderProps) => {
  const [donations, setDonations] = useState<Date[]>([]);

  useEffect(() => {
    const loadDonations = async () => {
      const storedDonations = await AsyncStorage.getItem("donations");
      if (storedDonations) {
        setDonations(JSON.parse(storedDonations));
      }
    };
    loadDonations();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const storedDonations = await AsyncStorage.getItem("donations");
      if (storedDonations) {
        const parsedDonations = JSON.parse(storedDonations);
        if (JSON.stringify(parsedDonations) !== JSON.stringify(donations)) {
          setDonations(parsedDonations);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [donations]);

  const addDonation = async (date: Date) => {
    const newDonations = [...donations, date].sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );
    setDonations(newDonations);
    await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
  };

  const deleteDonation = async (index: number) => {
    const newDonations = donations.filter((_, i) => i !== index);
    setDonations(newDonations);
    await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
  };

  const setAllDonations = async (newDonations: Date[]) => {
    setDonations(newDonations);
    await AsyncStorage.setItem("donations", JSON.stringify(newDonations));
  };

  return (
    <DonationsContext.Provider
      value={{ donations, addDonation, deleteDonation, setAllDonations }}
    >
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonations = (): DonationsContextType => {
  const context = useContext(DonationsContext);
  if (context === null) {
    throw new Error("useDonations must be used within a DonationsProvider");
  }
  return context;
};
