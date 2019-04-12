import React, { Component, Fragment } from 'react'
import { graphql, withApollo, Query } from 'react-apollo'
import gql from 'graphql-tag'
import { Card, Col, Row, Icon, Button, Table } from 'antd'
import Link from 'next/link'

const fetchProjectsQuery = gql`
  query {
    projects {
      _id
      name
      users {
        _id
        username
      }
    }
  }
`

const deleteProjectMutation = gql`
  mutation($id: ID!) {
    deleteProject(input: { where: { id: $id } }) {
      project {
        _id
      }
    }
  }
`

class Projects extends Component {
  columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '90%',
      render: (text, record) => (
        <Link
          href={`/projects/show?id=${record._id}`}
          as={`/projects/${record._id}`}
        >
          <a>{record.name}</a>
        </Link>
      ),
    },
    {
      key: 'actions',
      width: '10%',
      render: (text, record) => (
        <Button
          type="danger"
          icon="delete"
          onClick={async () => {
            await this.props.client.mutate({
              mutation: deleteProjectMutation,
              variables: { id: record._id },
            })

            await this.props.client.query({
              query: fetchProjectsQuery,
              fetchPolicy: 'network-only',
            })
          }}
        >
          Delete
        </Button>
      ),
    },
  ]

  render() {
    return (
      <Query query={fetchProjectsQuery} fetchPolicy="network-only">
        {({ data, error, loading }) => {
          if (loading)
            return (
              <p className="flex justify-center items-center min-h-screen">
                Loading...
              </p>
            )

          if (error) return <p>Error: {error.message}</p>

          const { _id } = data.projects

          return (
            <Fragment>
              <div className="flex flex-row-reverse">
                <Link href={`/projects/new`} as={`/projects/new`}>
                  <Button type="primary" icon="plus-circle" size="large">
                    New Project
                  </Button>
                </Link>
              </div>
              <div className="mt-8">
                <Table
                  bordered
                  dataSource={data.projects}
                  columns={this.columns}
                  rowKey="_id"
                />
              </div>
            </Fragment>
          )
        }}
      </Query>
    )
  }
}

export default withApollo(Projects)
