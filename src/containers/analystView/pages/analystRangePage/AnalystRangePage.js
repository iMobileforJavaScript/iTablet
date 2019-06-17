/**
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com

 在线分析-边界输入界面
 */
import * as React from 'react'
import { Platform, ScrollView, KeyboardAvoidingView, View } from 'react-native'
import { Container, TextBtn } from '../../../../components'
import { AnalystItem } from '../../components'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
import styles from './styles'

export default class AnalystRangePage extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    language: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    const bounds = (params && params.bounds) || [0, 0, 0, 0] // 顺序：左-下-右-上
    this.state = {
      left: bounds[0],
      down: bounds[1],
      right: bounds[2],
      up: bounds[3],
    }
  }

  back = () => {
    if (this.backcb && typeof this.backcb === 'function') {
      this.backcb()
    } else {
      this.props.navigation.goBack()
    }
  }

  confirm = () => {
    if (this.state.left === undefined) {
      Toast.show(
        getLanguage(this.props.language).Prompt.PLEASE_ENTER +
          getLanguage(this.props.language).Analyst_Labels.LEFT,
      )
      return
    }
    if (this.state.down === undefined) {
      Toast.show(
        getLanguage(this.props.language).Prompt.PLEASE_ENTER +
          getLanguage(this.props.language).Analyst_Labels.DOWN,
      )
      return
    }
    if (this.state.right === undefined) {
      Toast.show(
        getLanguage(this.props.language).Prompt.PLEASE_ENTER +
          getLanguage(this.props.language).Analyst_Labels.RIGHT,
      )
      return
    }
    if (this.state.up === undefined) {
      Toast.show(
        getLanguage(this.props.language).Prompt.PLEASE_ENTER +
          getLanguage(this.props.language).Analyst_Labels.UP,
      )
      return
    }
    if (this.cb && typeof this.cb === 'function') {
      this.cb([
        parseFloat(this.state.left),
        parseFloat(this.state.down),
        parseFloat(this.state.right),
        parseFloat(this.state.up),
      ])
    }
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: getLanguage(this.props.language).Analyst_Labels
            .ANALYSIS_BOUNDS,
          backAction: this.back,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={getLanguage(this.props.language).Prompt.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <KeyboardAvoidingView
          enabled={true}
          keyboardVerticalOffset={0}
          style={{ flex: 1 }}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
          }}
          behavior={Platform.OS === 'ios' && 'padding'}
        >
          <ScrollView
            style={{ flex: 1, width: '100%' }}
            // contentContainerStyle={{ height: 500, alignItems: 'center' }}
            keyboardDismissMode={'on-drag'}
            keyboardShouldPersistTaps={'handled'}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View key={'content'} style={[styles.content]}>
              <AnalystItem
                title={getLanguage(this.props.language).Analyst_Labels.LEFT}
                value={this.state.left}
                keyboardType={'numeric'}
                rightType={'input'}
                rightStyle={{ flex: 1 }}
                inputStyle={{ flex: 1 }}
                autoCheckNumber
                onChangeText={text => {
                  this.setState({
                    left: text,
                  })
                }}
              />
              <AnalystItem
                title={getLanguage(this.props.language).Analyst_Labels.DOWN}
                value={this.state.down}
                keyboardType={'numeric'}
                rightType={'input'}
                rightStyle={{ flex: 1 }}
                inputStyle={{ flex: 1 }}
                autoCheckNumber
                onChangeText={text => {
                  this.setState({
                    down: text,
                  })
                }}
              />
              <AnalystItem
                title={getLanguage(this.props.language).Analyst_Labels.RIGHT}
                value={this.state.right}
                keyboardType={'numeric'}
                rightType={'input'}
                rightStyle={{ flex: 1 }}
                inputStyle={{ flex: 1 }}
                autoCheckNumber
                onChangeText={text => {
                  this.setState({
                    right: text,
                  })
                }}
              />
              <AnalystItem
                title={getLanguage(this.props.language).Analyst_Labels.UP}
                value={this.state.up}
                keyboardType={'numeric'}
                rightType={'input'}
                inputStyle={{ flex: 1 }}
                rightStyle={{ flex: 1 }}
                autoCheckNumber
                onChangeText={text => {
                  this.setState({
                    up: text,
                  })
                }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
