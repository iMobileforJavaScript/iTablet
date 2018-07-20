/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, FlatList, Text } from 'react-native'
import { EmptyView, Container, Row, ListSeparator } from '../../../components'
import ThemeEntry from '../entry'
import { ThemeLabelView, ThemeRangeView, ThemeUniqueView } from './components'

import styles from './styles'

export default class ThemeEdit extends React.Component {

  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    let { params } = props.navigation.state
    this.layer = params && params.layer
    this.map = params && params.map
    this.mapControl = params && params.mapControl
    this.state = {
      title: params && params.title,
    }
  }

  setLoading = isLoading => {
    this.container && this.container.setLoading(isLoading)
  }

  renderContent = () => {
    let content
    switch (this.state.title) {
      case ThemeEntry.Type.UNIQUE:
        content = <ThemeUniqueView nav={this.props.nav} setLoading={this.setLoading} map={this.map} mapControl={this.mapControl} layer={this.layer} />
        break
      case ThemeEntry.Type.RANGE:
        content = <ThemeRangeView nav={this.props.nav} setLoading={this.setLoading} map={this.map} mapControl={this.mapControl} layer={this.layer} />
        break
      case ThemeEntry.Type.UNIFIED:
        content = <ThemeLabelView nav={this.props.nav} setLoading={this.setLoading} map={this.map} mapControl={this.mapControl} layer={this.layer} />
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
        ref={ref => this.container = ref}
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