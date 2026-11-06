import { api } from './client'

export type Coupon = {
  couponId: number
  name: string
  validFrom: string
  validUntil: string
  publishFrom: string
  publishUntil: string
  remainingStock: number
}

export type MyCoupon = {
  memberCouponId: number
  couponId: number
  name: string
  validFrom: string
  validUntil: string
  issuedAt: string
  usedAt: string | null
}

export async function getCoupons() {
  const { data } = await api.get<Coupon[]>('/v1/coupons', { skipAuth: true })
  return data
}

export async function downloadCoupon(couponId: number) {
  const { data } = await api.post<MyCoupon>(`/v1/coupons/${couponId}/download`)
  return data
}

export async function getMyCoupons() {
  const { data } = await api.get<MyCoupon[]>('/v1/coupons/my')
  return data
}

export async function useCoupon(memberCouponId: number) {
  const { data } = await api.post<MyCoupon>(`/v1/coupons/my/${memberCouponId}/use`)
  return data
}
