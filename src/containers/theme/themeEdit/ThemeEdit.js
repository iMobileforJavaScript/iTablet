/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { EmptyView, Container } from '../../../components'
import { Const } from '../../../constants'
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
    this.isThemeLayer = (params && params.isThemeLayer) || false
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
      case Const.UNIQUE:
        content = (
          <ThemeUniqueView
            isThemeLayer={this.isThemeLayer}
            nav={this.props.nav}
            setLoading={this.setLoading}
            map={this.map}
            mapControl={this.mapControl}
            layer={this.layer}
          />
        )
        break
      case Const.RANGE:
        content = (
          <ThemeRangeView
            isThemeLayer={this.isThemeLayer}
            nav={this.props.nav}
            setLoading={this.setLoading}
            map={this.map}
            mapControl={this.mapControl}
            layer={this.layer}
          />
        )
        break
      case Const.LABEL:
        content = (
          <ThemeLabelView
            isThemeLayer={this.isThemeLayer}
            nav={this.props.nav}
            setLoading={this.setLoading}
            map={this.map}
            mapControl={this.mapControl}
            layer={this.layer}
          />
        )
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
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: this.state.title,
          navigation: this.props.navigation,
        }}
      >
        {this.renderContent()}
      </Container>
    )
  }
}
