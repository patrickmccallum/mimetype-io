import { createContext, useState, useEffect, useContext } from "react"
import data from "../../mimeData.json"
import { MimeData } from "../../types/mimeData"

const defaultValue = data

// Create a new context
export const DataContext = createContext<MimeData[]>(defaultValue)

export const DataProvider = ({ children }) => {
    const [dataset, setDataset] = useState<MimeData[]>(defaultValue)

    return (
        <DataContext.Provider value={{ dataset }}>
            {children}
        </DataContext.Provider>
    )
}
export const useData = () => {
    const context = useContext(DataContext)

    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider")
    }

    return context
}
