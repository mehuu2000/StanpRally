'use client'

import { useEffect, useState } from "react"
import { Stamps } from "@prisma/client"

export default function AdminStampPage() {
  type StampWithEmail = {
    userId: number
    email: string
    stamps: Stamps
  }
  const [data, setData] = useState<StampWithEmail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stamp/admin')
      .then(res => res.json())
      .then(res => {
        console.log(res.data)
        setData(res.data)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-4">読み込み中...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">スタンプ管理画面</h1>
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
  )
}
