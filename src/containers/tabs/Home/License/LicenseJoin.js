import React, { Component } from 'react'
import { View, StyleSheet, TextInput, Text, AsyncStorage } from 'react-native'
import { Container, Button } from '../../../../components'
import { color } from '../../../../styles'
import { getLanguage } from '../../../../language/index'
import { SMap } from 'imobile_for_reactnative'
import constants from '../../../../../src/containers/workspace/constants'
import { scaleSize, Toast } from '../../../../utils'
export default class LicenseJoin extends Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb
    this.backAction = params && params.backAction
    this.state = {
      texts: ['', '', '', '', ''],
      isCanSure: false,
    }
  }

  componentDidMount() {
    this.initTextInputs()
  }

  back = () => {
    this.backAction && this.backAction()
  }

  //初始化输入框
  initTextInputs() {
    this.inputs = []
    this.inputs.push(this.textInput1)
    this.inputs.push(this.textInput2)
    this.inputs.push(this.textInput3)
    this.inputs.push(this.textInput4)
    this.inputs.push(this.textInput5)
  }

  //激活许可序列号
  activateLicenseSerialNumber = async () => {
    GLOBAL.Loading.setLoading(
      true,
      global.language === 'CN' ? '许可申请中...' : 'Applying',
    )
    let str = ''
    for (let i = 0; i < this.state.texts.length - 1; i++) {
      str = str + this.state.texts[i] + '-'
    }
    str = str + this.state.texts[this.state.texts.length - 1]
    //4C95F-AB5F2-6944D-0976C-06891
    if (str.length === 29) {
      let result = -1
      setTimeout(function() {
        if (result === -1) {
          GLOBAL.Loading.setLoading(false)
          Toast.show(
            global.language === 'CN' ? '激活失败...' : 'Activate Faild',
          )
          return
        }
      }, 40000)
      result = await SMap.activateLicense(str)
      if (result) {
        AsyncStorage.setItem(constants.LICENSE_OFFICIAL_STORAGE_KEY, str)
        let modules = await SMap.licenseContainModule(str)
        let size = modules.length
        let number = 0
        for (let i = 0; i < size; i++) {
          let modultCode = Number(modules[i])
          if (modultCode == 0) {
            continue
          }
          number = number + (1 << modultCode % 100)
        }
        GLOBAL.modulesNumber = number
        GLOBAL.Loading.setLoading(
          false,
          global.language === 'CN' ? '许可申请中...' : 'Applying',
        )
        this.cb && this.cb()
      } else {
        Toast.show(
          // getLanguage(global.language).Profile.INPUT_LICENSE_SERIAL_NUMBER,
          global.language === 'CN' ? '激活失败...' : 'Activate Faild',
        )
        GLOBAL.Loading.setLoading(
          false,
          global.language === 'CN' ? '许可申请中...' : 'Applying',
        )
      }
    } else {
      Toast.show(
        getLanguage(global.language).Profile.PLEASE_INPUT_LICENSE_SERIAL_NUMBER,
      )
      GLOBAL.Loading.setLoading(
        false,
        global.language === 'CN' ? '许可申请中...' : 'Applying',
      )
    }
  }

  //编辑序列号
  editSerialNumber(index, text) {
    let tempTexts = this.state.texts
    if (index === 0 && text.length === 25) {
      tempTexts[0] = text.substring(0, 5)
      tempTexts[1] = text.substring(5, 10)
      tempTexts[2] = text.substring(10, 15)
      tempTexts[3] = text.substring(15, 20)
      tempTexts[4] = text.substring(20, 25)
    } else if (index === 0 && text.length === 29) {
      tempTexts[0] = text.substring(0, 5)
      tempTexts[1] = text.substring(6, 11)
      tempTexts[2] = text.substring(12, 17)
      tempTexts[3] = text.substring(18, 23)
      tempTexts[4] = text.substring(24, 29)
    } else if (text.length <= 5) {
      tempTexts[index] = text
    } else if (index < 4 && this.state.texts[index + 1] === '') {
      let subStr = text.substring(5)
      tempTexts[index + 1] = subStr
      this.inputs[index + 1].focus()
    }
    this.setState({
      texts: tempTexts.concat(),
    })
    let lengthTotal = 0
    for (let i = 0; i < tempTexts.length; i++) {
      lengthTotal += tempTexts[i].length
    }
    this.setState({
      isCanSure: lengthTotal === 25,
    })
  }

  renderContent() {
    return (
      <View style={{ flex: 1, backgroundColor: color.background }}>
        <Text
          style={{
            fontSize: scaleSize(24),
            marginLeft: '3%',
            marginTop: 30,
            marginBottom: 10,
            color: color.gray2,
          }}
        >
          {
            getLanguage(global.language).Profile
              .PLEASE_INPUT_LICENSE_SERIAL_NUMBER
          }
        </Text>

        <View
          style={{
            width: '100%',
            height: scaleSize(60),
            flexDirection: 'row',
            // justifyContent: 'space-between',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextInput
            style={styles.input}
            ref={ref => (this.textInput1 = ref)}
            value={this.state.texts[0]}
            onChangeText={text => {
              this.editSerialNumber(0, text)
            }}
          />
          <View style={styles.inputSeparate} />

          <TextInput
            style={styles.input}
            ref={ref => (this.textInput2 = ref)}
            value={this.state.texts[1]}
            onChangeText={text => {
              this.editSerialNumber(1, text)
            }}
          />
          <View style={styles.inputSeparate} />

          <TextInput
            style={styles.input}
            ref={ref => (this.textInput3 = ref)}
            value={this.state.texts[2]}
            onChangeText={text => {
              this.editSerialNumber(2, text)
            }}
          />
          <View style={styles.inputSeparate} />

          <TextInput
            style={styles.input}
            ref={ref => (this.textInput4 = ref)}
            value={this.state.texts[3]}
            onChangeText={text => {
              this.editSerialNumber(3, text)
            }}
          />
          <View style={styles.inputSeparate} />

          <TextInput
            style={styles.input}
            ref={ref => (this.textInput5 = ref)}
            value={this.state.texts[4]}
            onChangeText={text => {
              this.editSerialNumber(4, text)
            }}
          />
        </View>

        <View style={{ alignItems: 'center' }}>
          <Button
            title={global.language === 'CN' ? '确定' : 'Confirm'}
            ref={ref => (this.sureButton = ref)}
            type={this.state.isCanSure ? 'BLUE' : 'GRAY'}
            style={{
              width: '94%',
              height: scaleSize(60),
              marginTop: scaleSize(60),
            }}
            titleStyle={{ fontSize: scaleSize(24) }}
            onPress={
              this.state.isCanSure ? this.activateLicenseSerialNumber : null
            }
          />
        </View>
      </View>
    )
  }

  render() {
    return (
      <Container
        headerProps={{
          title: getLanguage(global.language).Profile
            .INPUT_LICENSE_SERIAL_NUMBER,
          //'输入许可序列编号',
          navigation: this.props.navigation,
          backAction: this.back,
        }}
      >
        {this.renderContent()}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //   flexDirection: 'column',
    backgroundColor: color.bgW,
  },

  item: {
    width: '100%',
    height: scaleSize(60),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: color.content_white,
  },
  title: {
    fontSize: scaleSize(18),
    marginLeft: 15,
  },
  subTitle: {
    fontSize: scaleSize(15),
    marginLeft: 15,
  },
  separateLine: {
    width: '100%',
    height: 1,
    backgroundColor: color.item_separate_white,
  },
  input: {
    width: '18%',
    height: scaleSize(60),
    fontSize: scaleSize(18),
    textAlignVertical: 'center',

    backgroundColor: color.white,
  },
  inputSeparate: {
    width: '1%',
    height: 2,
    backgroundColor: color.black1,
  },
})
