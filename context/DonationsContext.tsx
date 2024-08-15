import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DonationsContext = createContext([]);

export const DonationsProvider = ({ children }) => {
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

  return (
    <DonationsContext.Provider
      value={{ donations, addDonation, deleteDonation }}
    >
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonations = () => useContext(DonationsContext);
