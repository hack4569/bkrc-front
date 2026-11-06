import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { downloadCoupon, getCoupons } from '../api/coupons'
import type { Coupon } from '../api/coupons'

const format = (value: string) => new Intl.DateTimeFormat('ko-KR', {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Seoul',
}).format(new Date(`${value}+09:00`))

export function CouponPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const load = () => getCoupons().then(setCoupons).finally(() => setLoading(false))
  useEffect(() => { void load() }, [])

  const handleDownload = async (couponId: number) => {
    if (!localStorage.getItem('token')) {
      alert('로그인 후 이용가능합니다.')
      navigate('/login')
      return
    }
    try {
      await downloadCoupon(couponId)
      alert('쿠폰이 발급되었습니다.')
      await load()
    } catch (error) {
      const detail = (error as AxiosError<{ detail?: string }>).response?.data?.detail
      alert(detail ?? '쿠폰을 발급하지 못했습니다.')
    }
  }

  return <main className="coupon-page">
    <header className="coupon-page__header"><button onClick={() => navigate('/')}>← 홈</button><div><p>BKRC BENEFIT</p><h1>쿠폰</h1></div>{localStorage.getItem('token') ? <button onClick={() => navigate('/coupons/my')}>내 쿠폰</button> : <span />}</header>
    {loading ? <p className="coupon-empty">쿠폰을 불러오는 중입니다.</p> : coupons.length === 0 ? <p className="coupon-empty">현재 받을 수 있는 쿠폰이 없습니다.</p> :
      <section className="coupon-grid">{coupons.map(coupon => <article className="coupon-ticket" key={coupon.couponId}>
        <div><span className="coupon-ticket__badge">COUPON</span><h2>{coupon.name}</h2><p>{format(coupon.validFrom)} ~ {format(coupon.validUntil)}</p><small>남은 수량 {coupon.remainingStock}개</small></div>
        <button onClick={() => void handleDownload(coupon.couponId)}>다운로드</button>
      </article>)}</section>}
  </main>
}
