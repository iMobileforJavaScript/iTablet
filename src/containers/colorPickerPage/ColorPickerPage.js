/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/
import * as React from 'react'
import { Container } from '../../components'
import { Toast } from '../../utils'
import NavigationService from '../NavigationService'
import styles from './styles'
// import { ColorPicker, TriangleColorPicker } from 'react-native-color-picker'

export default class ColorPickerPage extends React.Component {

  props: {
    navigation: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.state = {
      InputText: '',
    }
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '新建图层',
          navigation: this.props.navigation,
        }}>
        {/*<ColorPicker*/}
        {/*onColorSelected={color => alert(`Color selected: ${color}`)}*/}
        {/*style={{flex: 1}}*/}
        {/*/>*/}
      </Container>
    )
  }
}
