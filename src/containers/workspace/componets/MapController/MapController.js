/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View } from 'react-native'
import { MTBtn } from '../../../../components'
import { SMap } from 'imobile_for_reactnative'

import styles from './styles'

export default class MapController extends React.Component {
  props: {
    style?: any,
  }

  constructor(props) {
    super(props)
  }

  plus = () => {
    SMap.zoom(2)
  }

  minus = () => {
    SMap.zoom(0.5)
  }

  location = () => {
    SMap.moveToCurrent()
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={[styles.topView, styles.shadow]}>
          <MTBtn
            style={styles.btn}
            key={'controller_plus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            image={require('../../../../assets/mapTool/icon_plus.png')}
            onPress={this.plus}
          />
          <MTBtn
            style={styles.btn}
            key={'controller_minus'}
            textColor={'black'}
            size={MTBtn.Size.NORMAL}
            image={require('../../../../assets/mapTool/icon_minus.png')}
            onPress={this.minus}
          />
        </View>
        <MTBtn
          style={[styles.btn, styles.separator, styles.shadow]}
          key={'controller_location'}
          textColor={'black'}
          size={MTBtn.Size.NORMAL}
          image={require('../../../../assets/mapTool/icon_location.png')}
          onPress={this.location}
        />
      </View>
    )
  }
}
