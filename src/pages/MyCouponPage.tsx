import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { getMyCoupons, useCoupon } from '../api/coupons'
import type { MyCoupon } from '../api/coupons'

const format = (value: string) => new Intl.DateTimeFormat('ko-KR', { dateStyle:'medium', timeStyle:'short', timeZone:'Asia/Seoul' }).format(new Date(`${value}+09:00`))

export function MyCouponPage() {
  const [coupons, setCoupons] = useState<MyCoupon[]>([])
  const navigate = useNavigate()
  const load = () => getMyCoupons().then(setCoupons)
  useEffect(() => { void load() }, [])
  const handleUse = async (id: number) => {
    if (!confirm('쿠폰을 사용 처리할까요? 이 작업은 취소할 수 없습니다.')) return
    try { await useCoupon(id); await load() }
    catch (error) { alert((error as AxiosError<{detail?:string}>).response?.data?.detail ?? '쿠폰을 사용할 수 없습니다.') }
  }
  const now = Date.now()
  return <main className="coupon-page"><header className="coupon-page__header"><button onClick={() => navigate('/coupons')}>← 쿠폰</button><h1>내 쿠폰</h1><span /></header>
    {coupons.length === 0 ? <p className="coupon-empty">보유한 쿠폰이 없습니다.</p> : <section className="coupon-grid">{coupons.map(coupon => {
      const expired = now > new Date(`${coupon.validUntil}+09:00`).getTime()
      return <article className={`coupon-ticket ${(coupon.usedAt || expired) ? 'coupon-ticket--disabled' : ''}`} key={coupon.memberCouponId}><div><h2>{coupon.name}</h2><p>{format(coupon.validFrom)} ~ {format(coupon.validUntil)}</p><small>{coupon.usedAt ? `사용 완료 · ${format(coupon.usedAt)}` : expired ? '기간 만료' : '사용 가능'}</small></div>
        {!coupon.usedAt && !expired && <button onClick={() => void handleUse(coupon.memberCouponId)}>사용하기</button>}</article>
    })}</section>}
  </main>
}
