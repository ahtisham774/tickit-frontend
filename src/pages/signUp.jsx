import { useState } from 'react'

import Form from '../components/form'
import toast from 'react-hot-toast'
import { AUTH } from '../API'
import axios from 'axios'

const SignUp = () => {
  const [fields, setFields] = useState([
    {
      type: 'text',
      placeholder: 'Enter username',
      name: 'username',
      value: ''
    },

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

    try {
      axios
        .post(`${AUTH}/user/consumer/register`, data)
        .then(res => {
          toast.success(res.data.message)
          setFields(
            fields.map(field => {
              field.value = ''
              return field
            })
          )
        })
        .catch(err => {
          toast.error(err.response.data.message)
        })
    } catch (error) {
      toast.error('An error occurred during registration')
    }
  }

  return (
    <Form
      text1='Register Now'
      text2='Create your account'
      type='signup'
      fields={fields}
      setFields={setFields}
      handleSubmit={handleSubmit}
    />
  )
}

export default SignUp
