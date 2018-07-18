/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, FlatList, Text } from 'react-native'
import { EmptyView, Container, Row, ListSeparator } from '../../../components'
import ThemeEntry from '../entry'
import { ThemeLabel, ThemeRange } from './components'

import styles from './styles'

export default class ThemeEdit extends React.Component {

  props: {
    navigation: Object,
  }
  
  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.state = {
      title: params && params.title,
      data: {
      
      }
    }
  }

  rowAction = ({title}) => {

  }
  
  renderThemeLabel = () => {
    return (
      <ThemeLabel />
    )
  }
  
  renderContent = () => {
    let content
    switch (this.state.title) {
      case ThemeEntry.Type.UNIQUE:
        break
      case ThemeEntry.Type.RANGE:
        content = <ThemeRange/>
        break
      case ThemeEntry.Type.UNIFIED:
        content = <ThemeLabel />
        break
      default:
        content = <EmptyView />
        break
    }
    return content
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
        }}>
        
        {this.renderContent()}

      </Container>
    )
  }
}