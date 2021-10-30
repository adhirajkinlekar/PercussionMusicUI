import React, { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return <h1>Ooops!!! Something went wrong.</h1>
    }
    return this.props.children
  }
}

export default ErrorBoundary;

//You can't catch compile-time errors, the Error Boundaries are for run-time errors within the UI. 