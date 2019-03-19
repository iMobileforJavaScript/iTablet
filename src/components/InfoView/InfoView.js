/*
  Copyright © SuperMap. All rights reserved.
  Author: Yang Shanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { Image, View, Text } from 'react-native'

import styles from './styles'

export default class InfoView extends React.Component {
  props: {
    image: any,
    title?: string,

    imgStyle?: Object,
    imgResizeMode?: string,

    titleStyle?: Object,
  }

  static defaultProps = {
    imgResizeMode: 'contain',
  }

  render() {
    if (!this.props.image) return null
    return (
      <View style={styles.container}>
        <Image
          resizeMode={this.props.imgResizeMode}
          style={this.props.imgStyle || styles.image}
          source={this.props.image}
        />
        {this.props.title && (
          <Text style={this.props.titleStyle || styles.title}>
            {this.props.title}
          </Text>
        )}
      </View>
    )
  }
}
