'use client'

import { useEffect, useState } from "react"
import { Stamps } from "@prisma/client"
import { useRouter } from 'next/navigation'

export default function AdminStampPage() {
  type StampWithEmail = {
    userId: number
    email: string
    stamps: Stamps
  }
  const [data, setData] = useState<StampWithEmail[]>([])
  const [loading, setLoading] = useState(true)
  const [ errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/stamps')
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
        setLoading(false)
      })
  }, [router])

  if (loading) return <p className="p-4">読み込み中...</p>

  return errorMessage ? (
    <div className="p-4">
      <h1 className="text-red-500 text-xl">{errorMessage}</h1>
    </div>
  ) : (
        <div className="p-6">
        <button onClick={() => router.push('/admin/rand')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded border border-gray-300">
          抽選管理画面に移動
        </button>
        <span className="mx-2"></span>
        <button onClick={() => router.push('/admin/createUser')} className="mb-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded border border-gray-300">
          アカウント作成画面に移動
        </button>
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
    )}