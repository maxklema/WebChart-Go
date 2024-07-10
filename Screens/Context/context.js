import React, { createContext, useState } from "react";
import App from "../../App";

export const SettingsContext = createContext();

export const SettingsProvider = ({children}) => {
    const [isToggled, setIsToggled] = useState(true);

    return (
        <SettingsContext.Provider value={{ isToggled, setIsToggled }}>
            <App />
        </SettingsContext.Provider>
    )
}