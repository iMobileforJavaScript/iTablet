import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import Login from './Login'

import styles from './styles'

export default class Mine extends Component {
  static propTypes = {
    // prop: PropTypes
  }

  render() {
    return (
      <View style={styles.container}>
        <Login />
      </View>
    )
  }
}
