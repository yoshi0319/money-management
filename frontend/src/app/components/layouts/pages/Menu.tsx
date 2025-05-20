import { useContext, useState } from "react"
import { TabContext } from "@/app/components/layouts/Header/Header"
import Image from "next/image"
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();
  
  const { tabIndex, setTabIndex, user } = useContext(TabContext)
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rememberMe");
    router.push("/auth/login");
  }

  return (
    <div className="w-full h-16 bg-white border-b border-[#E2E8F0]">
        <div className="flex flex-row justify-between items-center w-full h-full px-4">

            <div className="w-1/4"></div>
            
            <div className="flex flex-row justify-center items-center w-1/2">
                <div 
                    onClick={() =>setTabIndex(0)} 
                    className={`cursor-pointer px-24 py-2 relative ${
                        tabIndex === 0 
                        ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500" 
                        : ""
                    }`}
                >
                    全て
                </div>
                <div 
                    onClick={() =>setTabIndex(1)} 
                    className={`cursor-pointer px-24 py-2 relative ${
                        tabIndex === 1 
                        ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500" 
                        : ""
                    }`}
                >
                    期間選択
                </div>
            </div>

            <div className="w-1/4 flex justify-end items-center gap-2 pr-8">
                <button onClick={() => setSettingsOpen(!settingsOpen)} className={`flex justify-end items-center gap-2 border-2 hover:bg-gray-100 rounded-md p-2 ${settingsOpen ? "border-2 bg-gray-100 border-gray-200": "border-transparent"}`}>
                    <label className="flex flex-col cursor-pointer">
                        <span className="text-sm font-medium">{user?.user_name || "ゲスト"}</span>
                        <span className="text-xs text-gray-500">{user?.email_address || ""}</span>
                    </label>
                    <div className="cursor-pointer">
                        <Image
                            src="/settings.svg"
                            alt="設定"
                            width={20}
                            height={20}
                            />
                    </div>
                </button>
                {settingsOpen && (
                    <div className="absolute top-15 right-12 w-30 bg-white border-1 border-gray-200 shadow-md px-2 py-1">
                        <button onClick={handleLogout} className="text-sm text-red-500 hover:bg-gray-100">ログアウト</button>
                    </div>
                )}
            </div>
        </div>
    </div>
    )
}
