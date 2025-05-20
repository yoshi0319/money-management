import { createContext, useState, useContext } from "react";
import Contents from "../pages/Contents";

type User = {
    id: number,
    first_name: string,
    family_name: string,
    user_name: string,
    email_address: string,
    created_at: string
}

type TabContextType = {
    tabIndex: number;
    setTabIndex: React.Dispatch<React.SetStateAction<number>>;
    user: User | undefined;
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
}

const defaultContext: TabContextType = {
    tabIndex: 0,
    setTabIndex: () => {},
    user: undefined,
    setUser: () => {}
};

export const TabContext = createContext<TabContextType>(defaultContext);

export default function Header() {
    const { tabIndex, setTabIndex, user, setUser } = useContext(TabContext);
    return (
        <TabContext.Provider value={{ tabIndex, setTabIndex, user, setUser }}>
            <Contents />
        </TabContext.Provider>
    );
}