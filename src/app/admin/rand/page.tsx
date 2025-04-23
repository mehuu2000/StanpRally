'use client'

import { useEffect, useState } from "react"
import { Stamps } from "@prisma/client"
import { useRouter } from 'next/navigation'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSession } from "next-auth/react"


export default function AdminStampPage() {
  type randData = {
    userId: number
    name: string
    email: string
    stamps: Stamps
    gift: string
    innerTrueCount: boolean
  }

  // type randDataRes = {
  //   status: string
  //   message: string
  //   results: results[]
  // }

  type results = {
    name: string
    email: string
    error: string
    gift: string
  }
    


  const [data, setData] = useState<randData[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSending, setIsSending] = useState(false)
  const [sendData, setSendData] = useState<results[]>([])

  const router = useRouter()
  const LOCAL_STORAGE_KEY = 'bunfes-raffle-results';
  const { data: session } = useSession()

  useEffect(() => {
    if (!session || !session.user?.publicId) {
      router.push('/auth')
      return
    }
    if (session.user.email !== "xppn772p8xdwt9iq@gmail.com") {
      router.push('/dashboard')
      return
    }

    // ローカルストレージから結果を取得
    const savedResults = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedResults) {
      try {
        const parsedResults = JSON.parse(savedResults);
        setData(parsedResults);
        setLoading(false);
        console.log('ローカルストレージから抽選結果を読み込みました');
      } catch (error) {
        console.error('ローカルストレージのデータ解析エラー:', error);
        fetchFromApi(); // ローカルストレージのデータに問題がある場合はAPIから取得
      }
    } else {
      fetchFromApi(); // ローカルストレージにデータがない場合はAPIから取得
    }
  }, [router, session]);

  const fetchFromApi = () => {
    setLoading(true)
    fetch('/api/admin/rand')
      .then(res => res.json())
      .then(res => {
        console.log(res.data)
        setData(res.data)
        // ローカルストレージに保存
        if (res.data && res.data.length > 0) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(res.data));
          console.log('抽選結果をローカルストレージに保存しました');
        }
        setLoading(false)
        setErrorMessage(res.error)
      })
  }
  

  const getNewResults = () => {
    if (confirm('新しい抽選結果を取得しますか？現在の結果は上書きされます。')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      fetchFromApi();
    }
  };

  const sendMail = async () => {
    if (!confirm('当選メールを送信しますか？この操作は取り消せません。')) {
      return;
    }
    
    setIsSending(true)
    const sendData = data.map((user) => ({
      email: user.email,
      gift: user.gift,
      name: user.name,
    }))
    const response = await fetch('/api/admin/giftMail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendData),
    })
    const res = await response.json()
    if (res.status !== 200) {
      alert(res.message)
    } else if (res.status === 200) {
      alert(res.message)
    } else {
      alert('メール送信に失敗しました')
    }
    console.log(res)
    setSendData(res.results)
    setIsSending(false)
  }

  if (loading) return <p className="p-4">読み込み中...</p>

  return errorMessage ? (
    <div className="p-4">
      <h1 className="text-red-500 text-xl">{errorMessage}</h1>
    </div>
  ) : (
        <div className="p-6">
          {/* admin/stampsに移動 */}
        <button onClick={() => router.push('/admin/stamps')} className="mb-4 bg-gray-200 text-black hover:bg-gray-300 px-4 py-2 rounded border border-gray-300">
          スタンプ管理画面に移動
        </button>
        <span className="mx-2"></span>
        <button onClick={() => router.push('/admin/createUser')} className="mb-4 bg-gray-200 text-black hover:bg-gray-300 px-4 py-2 rounded border border-gray-300">
          アカウント作成画面に移動
        </button>
        <h1 className="text-2xl font-bold mb-4">抽選管理画面</h1>
        <div className="mb-4 p-3 bg-yellow-100 rounded border border-yellow-400">
        <p className="font-semibold text-black">注意事項:</p>
        <ul className="list-disc list-inside text-black">
          <li>抽選結果はローカルストレージに保存されています。安全のため画面のスクリーンショット、CSVの保存をしてください。</li>
          <li>メール送信は一度だけ行ってください。重複送信を防ぐため、送信前に確認メッセージが表示されます。</li>
        </ul>
      </div>
        <table className="table-auto border-collapse border border-gray-400">
            <thead>
            <tr>
                <th className="border px-4 py-2">ユーザーID</th>
                <th className="border px-4 py-2">ユーザー名</th>
                <th className="border px-4 py-2">メールアドレス</th>
                <th className="border px-4 py-2">ギフト</th>
                <th className="border px-4 py-2">Inner True Count</th>
            </tr>
            </thead>
            <tbody>
            {data.map((user) => (
                <tr key={user.userId}>
                  <td className="border px-4 py-2">{user.userId}</td>
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2"
                  >{user.email}
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(user.email)
                      alert("メールアドレスをコピーしました: " + user.email)
                    }}
                  ><ContentCopyIcon 
                      sx={{
                        height: 20,
                        width: 20,
                      }}
                    />
                </button>
                  </td>
                  <td className="border px-4 py-2">{user.gift}</td>
                  <td className="border px-4 py-2">{user.innerTrueCount}</td>
                </tr>
            ))}
            </tbody>
        </table>

        <div className="flex gap-4 mb-4">
          <button
            onClick={sendMail}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isSending ? '全力送信中...' : '全員にメール送信'}
          </button>
          <button
            onClick={getNewResults}
            className="mt-4 bg-gray-200 text-black hover:bg-gray-300 px-4 py-2 rounded border border-gray-300"
          >
            新しい抽選結果を取得
          </button>
        
          <button
            onClick={() => {
              // テーブル内容をCSVに変換
              const headers = ["ユーザーID", "ユーザー名", "メールアドレス", "ギフト"];
              const csvContent = [
                headers.join(","),
                ...data.map(user => [
                  user.userId,
                  `"${user.name.replace(/"/g, '""')}"`, // 名前に"がある場合の対応
                  `"${user.email}"`,
                  `"${user.gift}"`
                ].join(","))
              ].join("\n");
              
              // CSVダウンロード
              const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
              const link = document.createElement("a");
              const url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", `抽選結果_${new Date().toISOString().split('T')[0]}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            CSVをダウンロード
          </button>
        </div>

        {sendData && sendData.length > 0 && (
          <div className="mt-4">
            <h2 className="text-lg font-bold">送信結果</h2>
            <ul>
              {sendData.map((user, index) => (
                <li key={index} className="border p-2 mb-2">
                  <p>ユーザー名: {user.name}</p>
                  <p>メールアドレス: {user.email}</p>
                  <p>ギフト: {user.gift}</p>
                  <p>結果: {user.error}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}