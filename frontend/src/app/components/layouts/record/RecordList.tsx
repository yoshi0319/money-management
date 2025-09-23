import Image from "next/image";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { TabContext } from "../Header/Header";

export default function RecordList() {
    type Record = {
        record_id: number;
        date: string;
        method: string;
        recorded_money: number;
        amount?: number;
        updated_at?: string;
    }
    
    const router = useRouter();
    const {user} = useContext(TabContext);
    const [records, setRecords] = useState<Record[]>([]);
    const [addMenu_open, setAddMenu_open] = useState(false);
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const [deleteConfirm_open, setDeleteConfirm_open] = useState(false);
    const [deletingRecord, setDeletingRecord] = useState<Record | null>(null);
    const date = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/auth/login');
                    return;
                }
                if (!user) {
                    return;
                }
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}&sort=record_id&order=desc`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error("データの取得に失敗しました");
                }
                const data = await response.json();
                setRecords(data);
                console.log(data);
            } catch (e) {
                console.error("データの取得に失敗しました:", e);
            }
        };
        fetchData();
    }, [user, router]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && (addMenu_open || editingRecordId !== null || deleteConfirm_open)) {
                setAddMenu_open(false);
                setEditingRecordId(null);
                setDeleteConfirm_open(false);
                setDeletingRecord(null);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [addMenu_open, editingRecordId, deleteConfirm_open]);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData = new FormData(e.currentTarget);
        const method = formData.get('method') as string;
        const recorded_money = formData.get('recorded_money') as string;
        
        if (!method || method === '') {
            alert('methodを選択してください');
            return;
        }
        
        if (!recorded_money || recorded_money.trim() === '') {
            alert('in / outを入力してください');
            return;
        }
        
        const moneyValue = parseFloat(recorded_money);
        if (isNaN(moneyValue)) {
            alert('in / outは数値で入力してください');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            if (!user) {
                return;
            }

            const newRecord = {
                user_id: user.id,
                date: date,
                method: method,
                recorded_money: moneyValue,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newRecord),
            });            

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(`データの追加に失敗しました: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Success response:', data);

            const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}&sort=record_id&order=desc`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!updatedResponse.ok) {
                throw new Error("更新後のデータの取得に失敗しました");
            }

            const updatedData = await updatedResponse.json();
            setRecords(updatedData);
            
            setAddMenu_open(false);
        } catch (e) {
            console.error("エラーが発生しました。: ", e);
        }
    };

    const handleEdit = (recordId: number) => {
        setEditingRecordId(recordId);
    };

    const handleUpdate = async (recordId: number, newDate: string, newMethod: string, newRecordedMoney: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            if (!user) {
                return;
            }

            const updateData = {
                user_id: user.id,
                date: newDate,
                method: newMethod,
                recorded_money: newRecordedMoney,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/${recordId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });            

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(`データの更新に失敗しました: ${response.status} ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            console.log('Update response:', data);

            // 更新後のデータを再取得
            const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}&sort=record_id&order=desc`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!updatedResponse.ok) {
                throw new Error("更新後のデータの取得に失敗しました");
            }

            const updatedData = await updatedResponse.json();
            setRecords(updatedData);
            
            setEditingRecordId(null);
        } catch (e) {
            console.error("エラーが発生しました。: ", e);
        }
    };

    const handleCancelEdit = () => {
        setEditingRecordId(null);
    };

    const EditableRow = ({ record }: { record: Record }) => {
        const [editData, setEditData] = useState({
            date: record.date,
            method: record.method,
            recorded_money: record.recorded_money.toString()
        });

        const handleSave = () => {
            const moneyValue = parseFloat(editData.recorded_money);
            if (isNaN(moneyValue)) {
                alert('in / outは数値で入力してください');
                return;
            }
            if (!editData.method || editData.method === '') {
                alert('methodを選択してください');
                return;
            }
            handleUpdate(record.record_id, editData.date, editData.method, moneyValue);
        };

        return (
            <tr className="border-b border-gray-400 bg-blue-50">
                <td className="w-1/6 py-2">
                    <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({...editData, date: e.target.value})}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs h-6"
                    />
                </td>
                <td className="w-1/6 py-2">
                    <select
                        value={editData.method}
                        onChange={(e) => setEditData({...editData, method: e.target.value})}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs h-6"
                    >
                        <option value="">--選択--</option>
                        <option value="convenience_store">コンビニ</option>
                        <option value="food">飲食店</option>
                        <option value="supermarket">スーパー</option>
                        <option value="cafe">カフェ</option>
                        <option value="other">その他</option>
                    </select>
                </td>
                <td className="w-1/6 py-2">
                    <input
                        type="text"
                        value={editData.recorded_money}
                        onChange={(e) => setEditData({...editData, recorded_money: e.target.value})}
                        className="w-full px-1 py-0.5 border border-gray-300 rounded text-xs h-6"
                    />
                </td>
                <td className="w-1/6 py-2 text-sm">{record.amount}</td>
                <td className="w-1/12 py-2"></td>
                <td className="w-1/12 py-2 text-center">
                    <div className="flex justify-center gap-1">
                        <button
                            className="bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 h-6 w-6 flex items-center justify-center"
                            onClick={handleSave}
                            title="保存"
                        >
                            ✓
                        </button>
                        <button
                            className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 h-6 w-6 flex items-center justify-center"
                            onClick={handleCancelEdit}
                            title="キャンセル"
                        >
                            ✕
                        </button>
                        <button
                            className="bg-white border border-gray-400 text-gray-800 px-2 py-1 rounded hover:bg-gray-100 h-6 w-6 flex items-center justify-center"
                            onClick={() => handleDelete(record)}
                            title="削除"
                        >
                            🗑
                        </button>
                    </div>
                </td>
            </tr>
        );
    };

    const handleDelete = (record: Record) => {
        setDeletingRecord(record);
        setDeleteConfirm_open(true);
    };

    const confirmDelete = async () => {
        if (!deletingRecord) return;
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login');
                return;
            }
            if (!user) {
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/${deletingRecord.record_id}/`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });            

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(`データの削除に失敗しました: ${response.status} ${JSON.stringify(errorData)}`);
            }

            console.log('Delete successful');

            // 削除後のデータを再取得
            const updatedResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/record/?user_id=${user.id}&sort=record_id&order=desc`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!updatedResponse.ok) {
                throw new Error("削除後のデータの取得に失敗しました");
            }

            const updatedData = await updatedResponse.json();
            setRecords(updatedData);
            
            setDeleteConfirm_open(false);
            setDeletingRecord(null);
        } catch (e) {
            console.error("エラーが発生しました。: ", e);
        }
    };

    return (
        <div className="w-2/3 justify-center items-center border-2 border-gray-300 rounded-md p-4 bg-white">
            <table className="w-full">
                <thead className="border-b border-gray-400">
                    <tr className="text-left">
                        <th className="w-1/6 pb-2">date</th>
                        <th className="w-1/6 pb-2">method</th>
                        <th className="w-1/6 pb-2">in / out</th>
                        <th className="w-1/6 pb-2">amount</th>
                        <th className="w-1/12 pb-2"></th>
                        <th className="w-1/12 pb-2 text-center">
                            <button 
                                className="bg-blue-400 text-white rounded-md px-4 py-1 cursor-pointer hover:bg-blue-300"
                                onClick={() => setAddMenu_open(!addMenu_open)}
                            >
                                ADD
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {records.slice(0, 5).map((record, index) => (
                        editingRecordId === record.record_id ? (
                            <EditableRow key={index} record={record} />
                        ) : (
                        <tr key={index} className="border-b border-gray-400">
                                <td className="w-1/6 py-3">{record.date}</td>
                                <td className="w-1/6 py-3">{record.method}</td>
                                <td className="w-1/6 py-3">{record.recorded_money}</td>
                                <td className="w-1/6 py-3">{record.amount}</td>
                                <td className="w-1/12 py-3"></td>
                                <td className="w-1/12 py-3 text-center">
                                    <div className="flex justify-center gap-2">
                                <button
                                            className="cursor-pointer"
                                            onClick={() => handleEdit(record.record_id)}>
                                            <Image src="/icons/edit.svg" alt="edit" width={20} height={20} className="cursor-pointer"/>
                                </button>
                                    </div>
                            </td>
                        </tr>
                        )
                    ))}
                </tbody>
            </table>
            {addMenu_open && (
                <div className="fixed bg-black/20 w-full h-full top-0 left-0 z-10">
                    <div className="fixed bg-white border-1 rounded-md border-[#E2E8F0] shadow-md w-1/3 h-1/3 top-1/3 left-1/3">
                        <button className="relative bg-[#DEDEDE] text-black font-normal rounded-md border-1 border-[#C2C2C2] px-2 py-1 cursor-pointer hover:bg-[#A2A2A2] top-5 left-5" onClick={() => setAddMenu_open(false)}>
                            &lt; go back
                        </button>
                        <form className="w-full h-full flex flex-col justify-center items-center" onSubmit={handleAdd}>
                            <table className="w-full max-w-md">
                                <tbody>
                                    <tr>
                                        <th className="py-4 text-left">date</th>
                                        <th className="py-4 text-center">{date}</th>
                                    </tr>
                                    <tr>
                                        <th className="py-4 text-left">method</th>
                                        <th className="py-4 text-center"><select name="method" id="method" className="border-1 border-gray-400 rounded-md px-2 py-1 w-54">
                                            <option value="">--選択してください--</option>
                                            <option value="convenience_store">コンビニ</option>
                                            <option value="food">飲食店</option>
                                            <option value="supermarket">スーパー</option>
                                            <option value="cafe">カフェ</option>
                                            <option value="other">その他</option>
                                        </select></th>
                                    </tr>
                                    <tr>
                                        <th className="py-4 text-left">in / out</th>
                                        <th className="py-4 text-center"><input type="text" name="recorded_money" placeholder="0" className="border-1 border-gray-400 rounded-md px-2 py-1 w-54"/></th>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="flex justify-center">
                                <button type="submit" className="bg-[#3AA0FF] text-white font-normal rounded-md border-1 border-[#C2C2C2] px-10 py-1 cursor-pointer hover:bg-[#0084FF]">
                                    ADD
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {deleteConfirm_open && deletingRecord && (
                <div className="fixed bg-black/20 w-full h-full top-0 left-0 z-10">
                    <div className="fixed bg-white border-1 rounded-md border-[#E2E8F0] shadow-md w-1/4 h-1/4 top-1/3 left-1/3">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">削除の確認</h3>
                            <p className="mb-6">
                                このレコードを削除しますか？<br />
                                <span className="font-medium">
                                    {deletingRecord.date} - {deletingRecord.method} - ¥{deletingRecord.recorded_money}
                                </span>
                            </p>
                            <div className="flex justify-end gap-3">
                                <button 
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                    onClick={() => {setDeleteConfirm_open(false); setDeletingRecord(null);}}
                                >
                                    キャンセル
                                </button>
                                <button 
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                    onClick={confirmDelete}
                                >
                                    削除
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
