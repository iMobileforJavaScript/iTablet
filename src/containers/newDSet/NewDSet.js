/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, TextInput, Text } from 'react-native'
import { BtnTwo, Container, UsualInput } from '../../components'
import { constUtil, Toast } from '../../utils'

import styles from './styles'

export default class NewDSet extends React.Component {

  props: {
    navigation: Object,
  }

  _OK = () => {
    Toast.show('待完善')
  }

  render() {
    return (
      <Container
        style={styles.container}
        headerProps={{
          title: '新建数据集',
          navigation: this.props.navigation,
        }}>
        <TextInput
          accessible={true}
          accessibilityLabel={'请输入数据集名称'}
          style={styles.input}
          underlineColorAndroid='transparent'
          placeholder='请输入数据集名称'
          placeholderTextColor={constUtil.USUAL_SEPARATORCOLOR}
          onChangeText={text1 => { this.setState({ name: text1 }) }} />
        <BtnTwo text='确定' btnClick={this._OK} />

      </Container>
    )
  }
}