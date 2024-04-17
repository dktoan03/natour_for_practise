import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {
  try {
    const url = type === 'password' ? '/api/v1/users/updateMyPassword' : '/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
    })
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Update successful`)
    }
    console.log(res)
  } catch (err) {
    showAlert('error', err.response.data.message)
  }
}
