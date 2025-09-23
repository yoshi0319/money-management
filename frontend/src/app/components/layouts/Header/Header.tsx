import { createContext, Dispatch, SetStateAction, useContext } from "react";
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
    setTabIndex: Dispatch<SetStateAction<number>>;
    user: User | undefined;
    setUser: Dispatch<SetStateAction<User | undefined>>;
    dataVersion: number;
    setDataVersion: Dispatch<SetStateAction<number>>;
}

const defaultContext: TabContextType = {
    tabIndex: 0,
    setTabIndex: () => {},
    user: undefined,
    setUser: () => {},
    dataVersion: 0,
    setDataVersion: () => {},
};

export const TabContext = createContext<TabContextType>(defaultContext);

export default function Header() {
    const { tabIndex, setTabIndex, user, setUser, dataVersion, setDataVersion } = useContext(TabContext);
    return (
        <TabContext.Provider value={{ tabIndex, setTabIndex, user, setUser, dataVersion, setDataVersion }}>
            <Contents />
        </TabContext.Provider>
    );
}
