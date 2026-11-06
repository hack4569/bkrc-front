import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../api/auth'
import { getErrorMessage } from '../api/error'
import { AccountForm } from '../components/AccountForm'

export function SignupPage() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(
    (current: { loginId: string; password: string; passwordCheck: string; error?: string }, action: { field: 'loginId' | 'password' | 'passwordCheck' | 'error'; value?: string }) => ({ ...current, [action.field]: action.value }),
    { loginId: '', password: '', passwordCheck: '' },
  )

  async function handleSubmit() {
    dispatch({ field: 'error' })
    if (!state.loginId || !state.password) {
      dispatch({ field: 'error', value: '아이디와 비밀번호를 입력해주세요.' })
      return
    }
    if (state.password !== state.passwordCheck) {
      dispatch({ field: 'error', value: '비밀번호가 일치하지 않습니다.' })
      return
    }
    try {
      await signup(state.loginId, state.password, state.passwordCheck)
      navigate('/login')
    } catch (e) {
      dispatch({ field: 'error', value: getErrorMessage(e, '회원가입에 실패했습니다.') })
    }
  }

  return (
    <AccountForm
      title="회원가입"
      fields={[
        { name: 'loginId', label: '아이디', value: state.loginId, placeholder: '아이디를 입력해주세요.', onChange: (value) => dispatch({ field: 'loginId', value }) },
        { name: 'password', label: '비밀번호', type: 'password', value: state.password, placeholder: '비밀번호를 입력해주세요.', onChange: (value) => dispatch({ field: 'password', value }) },
        { name: 'passwordCheck', label: '비밀번호 확인', type: 'password', value: state.passwordCheck, placeholder: '비밀번호를 입력해주세요.', onChange: (value) => dispatch({ field: 'passwordCheck', value }) },
      ]}
      submitLabel="가입하기"
      cancelTo="/login"
      error={state.error}
      onSubmit={handleSubmit}
    />
  )
}
