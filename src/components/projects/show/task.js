import React, { Component } from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'
import { Card } from 'antd'
import Link from 'next/link'

const Container = styled.div`
  margin-bottom: 16px;
  background-color: ${props => (props.isDragging ? '#f0f2f5' : '#fff')};
  box-shadow: ${props =>
    props.isDragging ? '0 2px 8px rgba(0, 0, 0, 0.09)' : 'none'};
`
const StyledCard = styled(Card)`
  background-color: transparent;
`

class Task extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            aria-roledescription="Press space bar to lift the task"
          >
            <Link
              href={`/tasks/show?id=${this.props.task.id}`}
              as={`/tasks/${this.props.task.id}`}
            >
              <a>
                <StyledCard hoverable>{this.props.task.content}</StyledCard>
              </a>
            </Link>
          </Container>
        )}
      </Draggable>
    )
  }
}

export default Task