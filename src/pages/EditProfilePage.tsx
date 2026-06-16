import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../api/auth'
import { getErrorMessage } from '../api/error'
import { AccountForm } from '../components/AccountForm'

export function EditProfilePage() {
  const navigate = useNavigate()
  const loginId = localStorage.getItem('loginId') ?? ''
  const [originPassword, setOriginPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordCheck, setNewPasswordCheck] = useState('')
  const [error, setError] = useState<string>()

  async function handleSubmit() {
    setError(undefined)
    if (!originPassword) {
      setError('현재 비밀번호를 입력해주세요.')
      return
    }
    if (!newPassword) {
      setError('새 비밀번호를 입력해주세요.')
      return
    }
    if (newPassword !== newPasswordCheck) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await updateProfile(loginId, originPassword, newPassword, newPasswordCheck)
      navigate('/my')
    } catch (e) {
      setError(getErrorMessage(e, '회원 정보 수정에 실패했습니다.'))
    }
  }

  return (
    <AccountForm
      title="회원 정보 수정"
      fields={[
        { name: 'loginId', label: '아이디', value: loginId, readOnly: true },
        { name: 'originPassword', label: '현재 비밀번호', type: 'password', value: originPassword, onChange: setOriginPassword },
        { name: 'newPassword', label: '새 비밀번호', type: 'password', value: newPassword, onChange: setNewPassword },
        { name: 'newPasswordCheck', label: '새 비밀번호 확인', type: 'password', value: newPasswordCheck, onChange: setNewPasswordCheck },
      ]}
      submitLabel="저장"
      cancelTo="/my"
      error={error}
      onSubmit={handleSubmit}
    />
  )
}
