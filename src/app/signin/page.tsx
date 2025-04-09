'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.ok) {
      alert("ログイン成功")
    } else {
      alert("ログイン失敗")
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">ログイン</h2>
      <input type="text" value={email} onChange={e => setEmail(e.target.value)} placeholder="email" className="border p-2 mb-2 block" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" className="border p-2 mb-4 block" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">ログイン</button>
    </div>
  )
}
