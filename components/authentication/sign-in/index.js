import React, { Component, useState } from 'react'
import { Form, Button, Input, Card } from 'antd'
import Router from 'next/router'

const SignIn = props => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { getFieldDecorator } = props.form

  const handleSubmit = () => {
    props.form.validateFields(async (err, values) => {
      if (!err) {
        setIsLoading(true)

        try {
          const response = await fetch(`${process.env.AUTH_URL}/login`, {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: values.email,
              password: values.password,
              confirmPassword: values.password,
              username: values.username,
            }),
          })

          if ([200, 201].indexOf(response.status) > -1) {
            const data = await response.json()

            document.cookie = `userId=${data.id};path=/`
            document.cookie = `username=${data.username};path=/`
            document.cookie = `token=${data.token};path=/`

            setError('')

            Router.push('/projects')
          }

          setError(response.statusText)

          setIsLoading(false)
        } catch (error) {
          setError(error)
          setIsLoading(false)

          console.error(error)
        }
      }
    })
  }

  return (
    <div className="mt-4">
      <Form layout="vertical" onSubmit={handleSubmit}>
        <Form.Item
          label="Email"
          validateStatus={error ? 'error' : ''}
          help={error}
        >
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please enter email!',
              },
            ],
            initialValue: 'admin1@admin.com',
          })(
            <Input placeholder="Please enter email" size="large" type="email" />
          )}
        </Form.Item>
        <Form.Item
          label="Username"
          validateStatus={error ? 'error' : ''}
          help={error}
        >
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please enter username!' }],
            initialValue: 'admin1',
          })(
            <Input
              placeholder="Please enter username"
              size="large"
              type="username"
            />
          )}
        </Form.Item>
        <Form.Item
          label="Password"
          validateStatus={error ? 'error' : ''}
          help={error}
        >
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please enter password!' }],
            initialValue: 'password',
          })(
            <Input
              placeholder="Please enter password"
              size="large"
              type="password"
            />
          )}
        </Form.Item>
      </Form>
      <div className="flex justify-end mt-12">
        <Button
          type="primary"
          htmlType="submit"
          onClick={handleSubmit}
          size="large"
          icon="check-circle"
          block
          loading={isLoading}
        >
          Sign In
        </Button>
      </div>
    </div>
  )
}

export default Form.create()(SignIn)
