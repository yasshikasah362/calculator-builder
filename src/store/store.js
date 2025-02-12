import { create } from "zustand";

const useCalculatorStore = create((set) => ({
  components: [
    { id: 1, label: "7", value: "7" },
    { id: 2, label: "8", value: "8" },
    { id: 3, label: "9", value: "9" },
    { id: 4, label: "/", value: "/" },
    { id: 5, label: "4", value: "4" },
    { id: 6, label: "5", value: "5" },
    { id: 7, label: "6", value: "6" },
    { id: 8, label: "*", value: "*" },
    { id: 9, label: "1", value: "1" },
    { id: 10, label: "2", value: "2" },
    { id: 11, label: "3", value: "3" },
    { id: 12, label: "-", value: "-" },
    { id: 13, label: "0", value: "0" },
    { id: 14, label: "C", value: "C" },
    { id: 15, label: "=", value: "=" },
    { id: 16, label: "+", value: "+" }
  ],
  setComponents: (newComponents) => set({ components: newComponents }),
}));

export default useCalculatorStore;
