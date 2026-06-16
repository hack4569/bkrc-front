import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { getErrorMessage } from '../api/error'
import { AccountForm } from '../components/AccountForm'

export function SignupPage() {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [passwordCheck, setPasswordCheck] = useState('')
  const [error, setError] = useState<string>()

  async function handleSubmit() {
    setError(undefined)
    if (!loginId || !password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }
    if (password !== passwordCheck) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await signup(loginId, password, passwordCheck)
      navigate('/login')
    } catch (e) {
      setError(getErrorMessage(e, '회원가입에 실패했습니다.'))
    }
  }

  return (
    <AccountForm
      title="회원가입"
      fields={[
        { name: 'loginId', label: '아이디', value: loginId, onChange: setLoginId },
        { name: 'password', label: '비밀번호', type: 'password', value: password, onChange: setPassword },
        { name: 'passwordCheck', label: '비밀번호 확인', type: 'password', value: passwordCheck, onChange: setPasswordCheck },
      ]}
      submitLabel="가입하기"
      cancelTo="/login"
      error={error}
      onSubmit={handleSubmit}
    />
  )
}
