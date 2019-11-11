/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { View, Text } from 'react-native'
import { Container, Input, TextBtn } from '../../components'
import { color } from '../../styles'
import { getLanguage } from '../../language'
import { dataUtil } from '../../utils'
import styles from './styles'

/**
 * type: name | http | number | default
 */
export default class InputPage extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    language: string,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backcb = params && params.backcb
    let defaultValue = params && params.value !== undefined ? params.value : ''
    this.state = {
      value: defaultValue,
      placeholder:
        params && params.placeholder !== undefined ? params.placeholder : '',
      headerTitle:
        params && params.headerTitle !== undefined ? params.headerTitle : '',
      btnTitle:
        params && params.btnTitle
          ? params.btnTitle
          : getLanguage(global.language).Prompt.CONFIRM, //'确定',
      // keyboardType:
      //   params && params.keyboardType ? params.keyboardType : 'default',
      type: params && params.type ? params.type : 'default', // 输入值类型，关系到值的检测
      isLegalName: !!defaultValue,
      errorInfo: '',
    }
    this.clickAble = true // 防止重复点击
  }

  confirm = () => {
    if (this.clickAble && this.state.isLegalName) {
      this.clickAble = false
      this.input && this.input.blur()
      this.cb && this.cb(this.state.value)
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
    }
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      this.props.navigation.goBack()
    }
  }

  getKeyboardType = () => {
    let keyboardType
    switch (this.state.type) {
      case 'number':
        keyboardType = 'numeric'
        break
      case 'name':
      case 'http':
      default:
        keyboardType = 'default'
        break
    }
    return keyboardType
  }

  checkValue = text => {
    let res
    switch (this.state.type) {
      case 'number': {
        let isNumber = text !== '' && !isNaN(text) && text !== undefined
        res = {
          result: isNumber,
          error: isNumber
            ? null
            : getLanguage(this.props.language).Prompt.ERROR_INFO_NOT_A_NUMBER,
        }
        break
      }
      case 'name':
        res = dataUtil.isLegalName(text, this.props.language)
        break
      case 'http':
        if (text === '') {
          res = { result: true }
        } else {
          res = dataUtil.isLegalURL(text, this.props.language)
        }
        break
      default:
        res = { result: true }
        break
    }
    return res
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: this.state.headerTitle,
          backAction: this.back,
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={this.state.btnTitle}
              textStyle={
                this.state.isLegalName
                  ? styles.headerBtnTitle
                  : styles.headerBtnTitleDisable
              }
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <View style={styles.subContainer}>
          <Input
            ref={ref => (this.input = ref)}
            accessible={true}
            accessibilityLabel={'输入框'}
            inputStyle={styles.input}
            placeholder={this.state.placeholder}
            placeholderTextColor={color.themePlaceHolder}
            value={this.state.value + ''}
            onChangeText={text => {
              // if (this.state.keyboardType === 'numeric') {
              //   this.setState({
              //     value: text,
              //     isLegalName:
              //       text !== '' && !isNaN(text) && text !== undefined,
              //   })
              // } else {
              //   let { result, error } = dataUtil.isLegalName(
              //     text,
              //     this.props.language,
              //   )
              //   this.setState({
              //     isLegalName: result,
              //     errorInfo: error,
              //     value: text,
              //   })
              // }
              let { result, error } = this.checkValue(text)
              this.setState({
                isLegalName: result,
                errorInfo: error,
                value: text,
              })
            }}
            onClear={() => {
              // let { result, error } = dataUtil.isLegalName(
              //   '',
              //   this.props.language,
              // )
              // this.setState({
              //   isLegalName: result,
              //   errorInfo: error,
              //   value: '',
              // })
              let { result, error } = this.checkValue('')
              this.setState({
                isLegalName: result,
                errorInfo: error,
                value: '',
              })
            }}
            returnKeyType={'done'}
            // keyboardType={this.state.keyboardType}
            keyboardType={this.getKeyboardType()}
            showClear
          />
          {!this.state.isLegalName && !!this.state.errorInfo && (
            <View style={styles.errorView}>
              <Text style={styles.errorInfo}>{this.state.errorInfo}</Text>
            </View>
          )}
        </View>
      </Container>
    )
  }
}
