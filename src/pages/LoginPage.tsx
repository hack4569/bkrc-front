import { useReducer } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { getErrorMessage } from '../api/error'
import { AccountForm } from '../components/AccountForm'

export function LoginPage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(
    (current: { loginId: string; password: string; autoLogin: boolean; error?: string }, action: { field: 'loginId' | 'password' | 'autoLogin' | 'error'; value: string | boolean | undefined }) => ({ ...current, [action.field]: action.value }),
    { loginId: '', password: '', autoLogin: false },
  )

  async function handleSubmit() {
    dispatch({ field: 'error', value: undefined })
    try {
      await login(state.loginId, state.password, state.autoLogin)
      navigate('/')
    } catch (e) {
      dispatch({ field: 'error', value: getErrorMessage(e, '아이디 또는 비밀번호를 확인해주세요.') })
    }
  }

  return (
    <AccountForm
      title="로그인"
      fields={[
        { name: 'loginId', label: '아이디', value: state.loginId, placeholder: '아이디를 입력해주세요.', onChange: (value) => dispatch({ field: 'loginId', value }) },
        { name: 'password', label: '비밀번호', type: 'password', value: state.password, placeholder: '비밀번호를 입력해주세요.', onChange: (value) => dispatch({ field: 'password', value }) },
        {
          name: 'autoLogin',
          label: '자동 로그인',
          type: 'checkbox',
          value: state.autoLogin ? 'true' : 'false',
          onChange: (value) => dispatch({ field: 'autoLogin', value: value === 'true' }),
        },
      ]}
      submitLabel="로그인"
      mode="login"
      showCancel={false}
      showMenu
      error={state.error}
      onSubmit={handleSubmit}
      footer={
        <p className="sign-in-form__footer">
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      }
    />
  )
}
