'use client'

import { useEffect, useState } from "react"
import { Stamps } from "@prisma/client"
import { useRouter } from 'next/navigation'

export default function AdminStampPage() {
type randData = {
    userId: number
    email: string
    stamps: Stamps
    gift: string
    innerTrueCount: boolean
  }
  const [data, setData] = useState<randData[]>([])
  const [loading, setLoading] = useState(true)
  const [ errorMessage, setErrorMessage] = useState<string>('')

  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/rand')
      .then(res => res.json())
      .then(res => {
        console.log(res.data)
        setData(res.data)
        setLoading(false)
        setErrorMessage(res.error)
      })
  }, [router])

  if (loading) return <p className="p-4">読み込み中...</p>

  return errorMessage ? (
    <div className="p-4">
      <h1 className="text-red-500 text-xl">{errorMessage}</h1>
    </div>
  ) : (
        <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">抽選管理画面</h1>
        <table className="table-auto border-collapse border border-gray-400">
            <thead>
            <tr>
                <th className="border px-4 py-2">ユーザーID</th>
                <th className="border px-4 py-2">メールアドレス</th>
                <th className="border px-4 py-2">ギフト</th>
                <th className="border px-4 py-2">Inner True Count</th>
            </tr>
            </thead>
            <tbody>
            {data.map((user) => (
                <tr key={user.userId}>
                <td className="border px-4 py-2">{user.userId}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.gift}</td>
                <td className="border px-4 py-2">{user.innerTrueCount}</td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    )}