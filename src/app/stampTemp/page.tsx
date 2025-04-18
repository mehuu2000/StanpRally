// app/stamp/page.tsx

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react';

export default function StampPage() {
  const [stampId, setStampId] = useState<number>(1)
  const [pass, setPass] = useState<number>(0)
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [message, setMessage] = useState<string>('')

  const getLocation = () => {
    
    if (!navigator.geolocation) {
      alert('位置情報はサポートされていません')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
      },
      () => {
        alert('位置情報の取得に失敗しました')
      }
    )
  }
    const { data: session } = useSession();
    // console.log(session);
    // const session = await getServerSession(authOptions)
        
        if (!session || !session.user?.publicId) {
            return <h1>権限がありません</h1>
        }
        const email = session.user.email
        if(email!="test2@example.com"){
            return <h1>権限がありません</h1>
        }

  const sendStamp = async () => {
    const payload: {
        stampId: number
        password?: number | null
        lat?: number | null
        lng?: number | null
    } = { stampId,password:pass }

    if (lat !== null && lng !== null) {
      payload.lat = lat
      payload.lng = lng
    }

    const res = await fetch('/api/stamp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    let data;
    if(res.status==200){
        data = await res.json()
        setMessage(data.message || `ステータス: ${res.status}`)
    }else{
        console.log(res.status)
        console.log(res.statusText)
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>スタンプ送信ページ</h1>

      <div>
        <label>スタンプID (1〜5): </label>
        <input
          type="number"
          value={stampId}
          onChange={(e) => setStampId(Number(e.target.value))}
          min={1}
          max={5}
        />
      </div>
      <div>
        <label>スタンプPassword: </label>
        <input
          type="text"
          value={pass}
          onChange={(e) => setPass(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={getLocation}>位置情報を取得</button>
        {lat && lng && (
          <div>
            緯度: {lat}, 経度: {lng}
          </div>
        )}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={sendStamp}>スタンプ送信</button>
      </div>

      {message && (
        <div style={{ marginTop: '1rem', color: 'green' }}>
          {message}
        </div>
      )}
    </div>
  )
}
