import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getErrorMessage } from '../api/error'
import { AccountForm } from '../components/AccountForm'

export function LoginPage() {
  const navigate = useNavigate()
  const [loginId, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [autoLogin, setAutoLogin] = useState(false)
  const [error, setError] = useState<string>()

  async function handleSubmit() {
    setError(undefined)
    try {
      await login(loginId, password, autoLogin)
      navigate('/')
    } catch (e) {
      setError(getErrorMessage(e, '아이디 또는 비밀번호를 확인해주세요.'))
    }
  }

  return (
    <AccountForm
      title="로그인"
      fields={[
        { name: 'loginId', label: '아이디', value: loginId, onChange: setLoginId },
        { name: 'password', label: '비밀번호', type: 'password', value: password, onChange: setPassword },
        {
          name: 'autoLogin',
          label: '자동 로그인',
          type: 'checkbox',
          value: autoLogin ? 'true' : 'false',
          onChange: (v) => setAutoLogin(v === 'true'),
        },
      ]}
      submitLabel="로그인"
      showCancel={false}
      showMenu
      error={error}
      onSubmit={handleSubmit}
      footer={
        <p className="sign-in-form__footer">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      }
    />
  )
}
