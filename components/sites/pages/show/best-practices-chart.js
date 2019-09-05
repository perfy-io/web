import React, { useEffect } from 'react'
import gql from 'graphql-tag'
import { withApollo, useSubscription } from 'react-apollo'
import { Table, Popover, PageHeader, Tabs, Icon } from 'antd'
import Router from 'next/router'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import truncate from 'lodash/truncate'
import dynamic from 'next/dynamic'

import Loader from '../../../common/loader'
import chartConfig from '../../../../static/configs/chart.json'

dayjs.extend(LocalizedFormat)

const fetchBestPracticesSubscription = gql`
  subscription($id: uuid!) {
    page_by_pk(id: $id) {
      id
      audits(limit: 10, order_by: { fetch_time: desc }) {
        id
        categories_best_practices_score
        fetch_time
      }
    }
  }
`

const BestPracticesChart = props => {
  const { data, loading, error } = useSubscription(
    fetchBestPracticesSubscription,
    {
      variables: { id: props.id },
      fetchPolicy: 'network-only',
    }
  )

  if (loading) return <Loader />

  if (error) return <p>Error: {error.message}</p>

  const { page_by_pk } = data

  const ReactApexChart = dynamic(() => import('react-apexcharts'))

  const scores = page_by_pk.audits.map(audit =>
    Math.round(audit.categories_best_practices_score * 100)
  )

  const fetchTimes = page_by_pk.audits.map(audit => audit.fetch_time)

  return (
    <ReactApexChart
      options={{
        ...chartConfig,
        xaxis: {
          categories: fetchTimes,
          labels: {
            formatter: value => dayjs(value).format('MMM D'),
          },
        },
        yaxis: {
          min: 0,
          max: 100,
          labels: {
            formatter: value => value,
          },
        },
      }}
      series={[
        {
          name: 'Best Practices',
          data: scores,
        },
      ]}
      type="area"
      height="400"
    />
  )
}

export default withApollo(BestPracticesChart)
