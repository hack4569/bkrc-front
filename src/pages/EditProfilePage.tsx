import { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../api/auth'
import { getErrorMessage } from '../api/error'
import { AccountForm } from '../components/AccountForm'

export function EditProfilePage() {
  const navigate = useNavigate()
  const loginId = localStorage.getItem('loginId') ?? ''
  const [state, dispatch] = useReducer(
    (current: { originPassword: string; newPassword: string; newPasswordCheck: string; error?: string }, action: { field: 'originPassword' | 'newPassword' | 'newPasswordCheck' | 'error'; value?: string }) => ({ ...current, [action.field]: action.value }),
    { originPassword: '', newPassword: '', newPasswordCheck: '' },
  )

  async function handleSubmit() {
    dispatch({ field: 'error' })
    if (!state.originPassword) {
      dispatch({ field: 'error', value: '현재 비밀번호를 입력해주세요.' })
      return
    }
    if (!state.newPassword) {
      dispatch({ field: 'error', value: '새 비밀번호를 입력해주세요.' })
      return
    }
    if (state.newPassword !== state.newPasswordCheck) {
      dispatch({ field: 'error', value: '비밀번호가 일치하지 않습니다.' })
      return
    }
    try {
      await updateProfile(loginId, state.originPassword, state.newPassword, state.newPasswordCheck)
      navigate('/my')
    } catch (e) {
      dispatch({ field: 'error', value: getErrorMessage(e, '회원 정보 수정에 실패했습니다.') })
    }
  }

  return (
    <AccountForm
      title="회원 정보 수정"
      fields={[
        { name: 'loginId', label: '아이디', value: loginId, readOnly: true },
        { name: 'originPassword', label: '현재 비밀번호', type: 'password', value: state.originPassword, onChange: (value) => dispatch({ field: 'originPassword', value }) },
        { name: 'newPassword', label: '새 비밀번호', type: 'password', value: state.newPassword, onChange: (value) => dispatch({ field: 'newPassword', value }) },
        { name: 'newPasswordCheck', label: '새 비밀번호 확인', type: 'password', value: state.newPasswordCheck, onChange: (value) => dispatch({ field: 'newPasswordCheck', value }) },
      ]}
      submitLabel="저장"
      cancelTo="/my"
      error={state.error}
      onSubmit={handleSubmit}
    />
  )
}
