import { useState } from 'react'
import Form from '../components/form'
import { useAuth } from '../context/useAuth'
import { useLocation, useNavigate } from 'react-router-dom'
import { AUTH } from '../API'
import axios from 'axios'
import toast from 'react-hot-toast'

const Login = () => {
  const { setToken } = useAuth()
  const location = useLocation() // Get the current location
  const navigate = useNavigate() // For navigation after login
  const [fields, setFields] = useState([
    {
      type: 'email',
      placeholder: 'Enter your email address',
      name: 'email',
      value: '',
      isRequired: true
    },
    {
      type: 'password',
      placeholder: 'Enter your password',
      name: 'password',
      value: '',
      isRequired: true
    }
  ])

  const handleSubmit = async e => {
    e.preventDefault()

    // Prepare data from fields
    const data = fields.reduce((acc, field) => {
      acc[field.name] = field.value
      return acc
    }, {})

    // Login the user
    axios
      .post(`${AUTH}/user/consumer/login`, data)
      .then(res => {
        toast.success(res.data.message)
        setFields(
          fields.map(field => {
            field.value = ''
            return field
          })
        )
        localStorage.setItem('ticKitToken', res.data.token)
        setToken(res.data.token)
        const redirectPath = location.state?.from || '/'
        navigate(redirectPath, { replace: true })
      })
      .catch(err => {
        toast.error(err.response.data.message)
      })
  }

  return (
    <Form
      text1='Welcome Back!'
      text2='Login to your account'
      type='login'
      fields={fields}
      setFields={setFields}
      handleSubmit={handleSubmit}
    />
  )
}

export default Login
