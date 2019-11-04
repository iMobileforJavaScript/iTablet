/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View, TouchableOpacity, Text, Image, Keyboard } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, Row, Button } from '../../../../components'
import { Toast, scaleSize } from '../../../../utils'
import { PopModalList } from '../../../analystView/components'
import { getLanguage } from '../../../../language'

import styles from './styles'
import { color } from '../../../../styles'
let typeStr = [
  ['布尔型', 'BOOLEAN', 1],
  ['字节型', 'BYTE', 2],
  ['16位整型', 'INT16', 3],
  ['32位整型', 'INT32', 4],
  ['64位整型', 'INT64', 16],
  ['单精度', 'SINGLE', 6],
  ['双精度', 'DOUBLE', 7],
  ['日期型', 'DATETIME', 23],
  ['二进制型', 'LONGBINARY', 11],
  ['文本型', 'TEXT', 10],
  ['字符型', 'CHAR', 118],
  ['宽字符型', 'WTEXT', 127],
]

export default class LayerAttributeAdd extends React.Component {
  props: {
    navigation: Object,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.state = {
      isEdit: params.data && Object.keys(params.data).length > 0,
      callBack: params.callBack,
      data: params.data,
      dataset: params.dataset,
      name: (params.data && params.data.name) || '',
      caption: (params.data && params.data.caption) || '',
      type: (params.data && params.data.type) || '',
      maxLength: (params.data && params.data.maxLength) || '',
      defaultValue: (params.data && params.data.defaultValue) || '',
      isRequired:
        params.data && typeof params.data.isRequired === 'boolean'
          ? params.data.isRequired
          : '',
      // 弹出框数据
      popData: [],
      currentPopData: null,
      // currentPopData: {
      //   key: global.language === 'CN' ? typeStr[2][0] : typeStr[2][1],
      //   value: typeStr[2][2],
      // },
    }
  }

  componentDidMount() {}

  confirmValidate = () => {
    let isConfrim = false

    if (this.state.isEdit) {
      const { data } = this.props.navigation.state.params
      let keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (this.state[key] !== data[key] && key !== 'isSystemField') {
          isConfrim = true
          break
        }
      }
      !isConfrim && Toast.show('还未修改数据')
    } else {
      if (!this.state.name) {
        Toast.show(
          global.language === 'CN' ? '请输入名称' : 'Please input name',
        )
      } else if (!this.state.caption) {
        Toast.show(
          global.language === 'CN' ? '请输入别名' : 'Please input caption',
        )
      } else if (!this.state.type) {
        Toast.show(
          global.language === 'CN' ? '请选择类型' : 'Please choice type',
        )
      } else if (!this.state.maxLength) {
        Toast.show(
          global.language === 'CN' ? '请输入长度' : 'Please input max length',
        )
      } else if (
        this.state.defaultValue &&
        !this.checkDefaultValue(this.state.defaultValue)
      ) {
        Toast.show(
          global.language === 'CN'
            ? '缺省值输入错误'
            : 'Default value input error',
        )
      } else if (
        this.state.isRequired === '' ||
        this.state.isRequired === undefined
      ) {
        Toast.show(
          global.language === 'CN'
            ? '请选择是否必选'
            : 'Please select required',
        )
      } else {
        isConfrim = true
      }
    }

    return isConfrim
  }

  //确认
  confirm = isContinue => {
    if (!this.confirmValidate()) {
      return
    }
    this.state.callBack &&
      this.state.callBack({
        caption: this.state.caption,
        name: this.state.name,
        type: this.state.type,
        maxLength: this.state.maxLength,
        defaultValue: this.state.defaultValue,
        required: this.state.isRequired,
      })
    if (!isContinue) {
      NavigationService.goBack()
    }
  }

  reset = () => {
    Toast.show('待做')
  }

  getType = ({ labelTitle, value }) => {
    switch (labelTitle) {
      case '类型':
        this.setState({
          type: value,
        })
        break
      case '必填':
        this.setState({
          isRequired: value,
        })
        break
      case '缺省值':
        this.setState({
          defaultValue: value,
        })
    }
  }

  getInputValue = ({ title, text }) => {
    switch (title) {
      case '名称':
        this.setState({
          name: text,
        })
        break
      case '别名':
        this.setState({
          caption: text,
        })
        break
      case '长度':
        this.setState({
          maxLength: parseInt(text),
        })
        break
      case '缺省值':
        this.setState({
          defaultValue: text,
        })
        break
    }
  }

  reset = () => {
    this.table && this.table.reset(this.props.currentAttribute)
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button
          title={global.language === 'CN' ? '确认' : 'Sure'}
          style={{
            width: '94%',
            height: scaleSize(60),
          }}
          titleStyle={{ fontSize: scaleSize(24) }}
          onPress={() => this.confirm(false)}
        />
        <TouchableOpacity onPress={() => this.confirm(true)}>
          <View style={styles.saveAndContinueView2}>
            <Image
              source={require('../../../../assets/publicTheme/plot/plot_add.png')}
              style={styles.saveAndContinueImage}
            />
            <Text style={styles.saveAndContinueText}>
              {
                getLanguage(global.language).Map_Plotting
                  .PLOTTING_ANIMATION_CONTINUE
              }
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  checkDefaultValue(text) {
    let checkFlag = true
    switch (this.state.type) {
      case 3:
      case 4:
      case 16:
        {
          let r = /^\+?[1-9][0-9]*$/ //正整数
          checkFlag = r.test(text)
        }

        break
      case 6:
      case 7:
        {
          let r2 = /^\\d+(\\.\\d+)?$/ //小数
          checkFlag = r2.test(text)
        }
        break
    }
    return checkFlag
  }

  getDataType() {
    let data = []
    let length = typeStr.length
    for (let i = 0; i < length; i++) {
      data.push({
        key: global.language === 'CN' ? typeStr[i][0] : typeStr[i][1],
        value: typeStr[i][2],
      })
    }
    return data
  }

  renderPopList = () => {
    return (
      <PopModalList
        ref={ref => (this.popModal = ref)}
        language={global.language}
        type={'finger'}
        popData={this.getDataType()}
        currentPopData={this.state.currentPopData}
        confirm={data => {
          this.setState({
            currentPopData: data,
            type: data.value,
            defaultValue: undefined,
          })
          this.popModal.setVisible(false)
        }}
      />
    )
  }

  renderRows = () => {
    return (
      <View style={styles.rows}>
        <Row
          style={{ marginTop: scaleSize(30) }}
          customRightStyle={{ height: scaleSize(35) }}
          key={'名称'}
          disable={this.state.isEdit}
          defaultValue={this.state.name}
          type={Row.Type.INPUT}
          title={'名称'}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(15) }}
          customRightStyle={{ height: scaleSize(35) }}
          key={'别名'}
          defaultValue={this.state.caption}
          type={Row.Type.INPUT}
          title={'别名'}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(30) }}
          key={'类型'}
          type={Row.Type.RADIO_GROUP}
          title={'类型'}
          defaultValue={this.state.type}
          disable={this.state.isEdit}
          customRgihtView={
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => {
                Keyboard.dismiss()
                this.popModal && this.popModal.setVisible(true)
              }}
            >
              <Text style={{ fontSize: scaleSize(24), color: color.gray }}>
                {this.state.currentPopData
                  ? this.state.currentPopData.key
                  : null}
              </Text>
              <Image
                source={require('../../../../assets/Mine/mine_my_arrow.png')}
                style={{ height: scaleSize(28), width: scaleSize(28) }}
              />
            </TouchableOpacity>
          }
        />
        <Row
          style={{ marginTop: scaleSize(15) }}
          customRightStyle={{ height: scaleSize(35) }}
          key={'长度'}
          type={Row.Type.INPUT}
          title={'长度'}
          disable={this.state.isEdit}
          defaultValue={this.state.maxLength}
          value={this.state.maxLength}
          getValue={this.getInputValue}
          inputType={Row.InputType.NUMERIC}
        />
        {this.state.type === 1 ? (
          <Row
            style={{ marginTop: scaleSize(15) }}
            customRightStyle={{ height: scaleSize(35) }}
            key={'缺省值'}
            type={Row.Type.RADIO_GROUP}
            title={'缺省值'}
            disable={this.state.isEdit}
            defaultValue={this.state.defaultValue}
            radioArr={[
              { title: global.language === 'CN' ? '是' : 'YES', value: true },
              { title: global.language === 'CN' ? '否' : 'NO', value: false },
            ]}
            radioColumn={2}
            getValue={this.getType}
          />
        ) : (
          <Row
            style={{ marginTop: scaleSize(15) }}
            customRightStyle={{ height: scaleSize(35) }}
            key={'缺省值'}
            type={Row.Type.INPUT}
            title={'缺省值'}
            disable={this.state.isEdit}
            defaultValue={this.state.defaultValue}
            value={this.state.defaultValue}
            getValue={this.getInputValue}
          />
        )}

        <Row
          style={{ marginTop: scaleSize(15) }}
          key={'必填'}
          type={Row.Type.RADIO_GROUP}
          title={'必填'}
          disable={this.state.isEdit}
          defaultValue={this.state.isRequired}
          radioArr={[
            { title: global.language === 'CN' ? '是' : 'YES', value: true },
            { title: global.language === 'CN' ? '否' : 'NO', value: false },
          ]}
          radioColumn={2}
          getValue={this.getType}
        />
      </View>
    )
  }

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        // scrollable
        headerProps={{
          title: global.language === 'CN' ? '添加属性' : 'Add Attribute',
          navigation: this.props.navigation,
        }}
      >
        {this.renderRows()}
        {this.renderBtns()}
        {this.renderPopList()}
      </Container>
    )
  }
}
