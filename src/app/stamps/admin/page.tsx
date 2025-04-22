'use client'

import { useEffect, useState } from "react"
import { Stamps } from "@prisma/client"
import { useRouter } from 'next/navigation'

export default function AdminStampPage() {
  type StampWithEmail = {
    userId: number
    email: string
    stamp1: boolean | null
    stamp2: boolean | null
    stamp3: boolean | null
    stamp4: boolean | null
    stamp5: boolean | null
  }
  const [data, setData] = useState<StampWithEmail[]>([])
  const [originalData, setOriginalData] = useState<StampWithEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [ errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/stamp/admin')
      .then(res => res.json())
      .then(res => {
        console.log(res)
        setErrorMessage('')
        if(res.status !== 200) {
          setLoading(false)
          setErrorMessage(res.message)
          setTimeout(() => {
            router.push('/dashboard')
          }, 3000);
        }
        setData(res.data)
        setOriginalData(res.data)
        setLoading(false)
      })
  }, [])

  const handleReset = () => {
    setData(originalData)
  }

  const handleSort = () => {
    const sortedData = data.filter(user => {
      return [1, 2, 3, 4, 5].every(i => 
        user[`stamp${i}` as keyof StampWithEmail] === true
      )
    })
    setData(sortedData)
  }


  if (loading) return <p className="p-4">読み込み中...</p>

  return errorMessage ? (
    <div className="p-4">
      <h1 className="text-red-500 text-xl">{errorMessage}</h1>
    </div>
  ) : (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">スタンプ管理画面</h1>
        <div className="flex gap-5 pb-5">
          <button 
          onClick={handleReset}
          className="px-5 py-3 bg-white text-black rounded hover:bg-gray-400">リセット</button>
          <button
          onClick={handleSort}
          className="px-5 py-3 bg-blue-500 text-white rounded hover:bg-blue-600">ソート</button>
        </div>
        <table className="table-auto border w-full text-sm">
          <thead>
            <tr>
              <th className="border px-2 py-1">Email</th> {/* Emailの列を追加 */}
              <th className="border px-2 py-1">UserId</th>
              {[1, 2, 3, 4, 5].map(i => (
                <th key={i} className="border px-2 py-1">Stamp{i}</th>
              ))}
              {[1, 2, 3, 4, 5].map(i => (
                <th key={`i${i}`} className="border px-2 py-1">Inner{i}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(user => (
              <tr key={user.userId}>
                <td className="border text-center">
                  {user.email} {/* user.email にアクセス */}
                </td>
                <td className="border px-2 py-1">{user.userId}</td>
                {[1, 2, 3, 4, 5].map(i => (
                  <td key={`s${i}`} className="border text-center">
                    {user[`stamp${i}` as keyof StampWithEmail] ? '✅' : ''}
                  </td>
                ))}
                {[1, 2, 3, 4, 5].map(i => (
                  <td key={`in${i}`} className="border text-center">
                    {user[`inner${i}` as keyof StampWithEmail] ? '✅' : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}