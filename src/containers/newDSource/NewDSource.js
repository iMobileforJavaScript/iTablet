/*
  Copyright © SuperMap. All rights reserved.
  Author: yangshanglong
  E-mail: yangshanglong@supermap.com
*/

import * as React from 'react'
import { View, TextInput, Text } from 'react-native'
import { BtnTwo, Container } from '../../components'
import { constUtil, Toast } from '../../utils'

import styles from './styles'

export default class NewDSource extends React.Component {
  
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
          title: '新建数据源',
          navigation: this.props.navigation,
          headerRight: [

          ],
        }}>
        <View style={styles.textContainer}><Text>数据源名称</Text></View>
        <TextInput style={styles.input}
          underlineColorAndroid='transparent'
          accessible={true}
          accessibilityLabel={'请输入数据源名称'}
          placeholder='请输入数据源名称'
          placeholderTextColor={constUtil.USUAL_SEPARATORCOLOR}
          onChangeText={text1 => { this.setState({ name: text1 }) }} />
        <View style={styles.textContainer}><Text>存储路径</Text></View>
        <TextInput
          style={styles.input}
          accessible={true}
          accessibilityLabel={'请输入存储路径'}
          underlineColorAndroid='transparent'
          placeholder='请输入存储路径（不填写则使用默认路径）'
          placeholderTextColor={constUtil.USUAL_SEPARATORCOLOR}
          onChangeText={text2 => { this.setState({ path: text2 }) }} />
        <BtnTwo text='确定' btnClick={this._OK} />

      </Container>
    )
  }
}