import { createContext, PropsWithChildren, useContext, useState } from "react";

interface HeaderContextType {
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
  showDateRangePicker: boolean;
  setShowDateRangePicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);


export const UseHeaderContext = () => {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error("UseHeaderContext must be used within a HeaderProvider");
    }
    return context;
}


export const HeaderProvider = ({children}: PropsWithChildren) => {

    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showDateRangePicker, setShowDateRangePicker] = useState<boolean>(false);


    return <HeaderContext.Provider value={{
        showSearch,
        setShowSearch,
        showDatePicker,
        setShowDatePicker,
        showDateRangePicker,
        setShowDateRangePicker
    }}>{children}</HeaderContext.Provider>

}