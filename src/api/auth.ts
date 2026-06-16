import { api } from './client'

type LoginResponse = {
  token: string
  loginId: string
}

export async function login(
  loginId: string,
  password: string,
  autoLogin = false,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/login', { loginId, password, autoLogin })
  localStorage.setItem('token', data.token)
  localStorage.setItem('loginId', data.loginId)
  return data
}

export async function signup(
  loginId: string,
  password: string,
  passwordCheck: string,
): Promise<{ loginId: string }> {
  const { data } = await api.post<{ loginId: string }>('/v1/member', {
    loginId,
    password,
    passwordCheck,
  })
  return data
}

export function logout(): void {
  localStorage.removeItem('token')
  localStorage.removeItem('loginId')
}

export async function updateProfile(
  loginId: string,
  originPassword: string,
  newPassword: string,
  newPasswordCheck: string,
): Promise<{ loginId: string }> {
  const { data } = await api.put<{ loginId: string }>('/v1/member/me', {
    loginId,
    originPassword,
    newPassword,
    newPasswordCheck,
  })
  return data
}

// 회원 탈퇴 — 토큰 기반 사용자에게 현재 비밀번호를 확인한다.
export async function deleteMember(password: string): Promise<void> {
  await api.delete('/v1/member/me', { data: { password } })
}
