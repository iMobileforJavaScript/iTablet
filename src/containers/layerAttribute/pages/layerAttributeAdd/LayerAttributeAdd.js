/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
  TextInput,
} from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, Row, Button } from '../../../../components'
import { Toast, scaleSize } from '../../../../utils'
import { PopModalList } from '../../../analystView/components'
import { getLanguage } from '../../../../language'
import RadioGroup from '../../../../components/Row/RadioGroup'

import styles from './styles'
import { color } from '../../../../styles'
let typeStr = [
  ['布尔型', 'BOOLEAN', 1, 1],
  // ['字节型', 'BYTE', 2,1],
  ['16位整型', 'INT16', 3, 2],
  ['32位整型', 'INT32', 4, 4],
  ['64位整型', 'INT64', 16, 8],
  ['单精度', 'SINGLE', 6, 4],
  ['双精度', 'DOUBLE', 7, 8],
  // ['日期型', 'DATETIME', 23,8],
  // ['二进制型', 'LONGBINARY', 11,0],
  ['文本型', 'TEXT', 10, 255],
  // ['字符型', 'CHAR', 118,1],
  // ['宽字符型', 'WTEXT', 127,255],
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
    params.data = params.defaultParams && params.defaultParams.fieldInfo
    if (params.data && params.data.type === 1) {
      params.data.defaultValue = params.data.defaultValue === '1'
    }
    let isDetail = !!params.isDetail
    this.state = {
      isEdit: isDetail,
      callBack: params.callBack,
      defaultParams: params.defaultParams,
      data: params.data,
      dataset: params.dataset,
      name:
        (params.data &&
          (isDetail
            ? params.data.name
            : this.getTrimSmStr(params.data.name) + '_1')) ||
        '',
      caption:
        (params.data &&
          (isDetail
            ? params.data.caption
            : this.getTrimSmStr(params.data.caption) + '_1')) ||
        '',
      type: (params.data && params.data.type) || '',
      maxLength: this.getDefaultMaxLength(params.data.type),
      defaultValue:
        (params.data && params.data.defaultValue) ||
        typeof params.data.defaultValue === 'boolean'
          ? params.data.defaultValue
          : '',
      isRequired:
        params.data && typeof params.data.isRequired === 'boolean'
          ? params.data.isRequired
          : '',
      // 弹出框数据
      popData: [],
      currentPopData: this.getTypeDataByType(params.data.type),
      //缺省值是否能编辑
      isDefaultValueCanEdit: true,
    }
  }

  componentDidMount() {}

  confirmValidate = () => {
    let isConfrim = false
    if (!this.state.name || this.state.name === '') {
      Toast.show(global.language === 'CN' ? '请输入名称' : 'Please input name')
    } else if (!this.state.caption || this.state.caption === '') {
      Toast.show(
        global.language === 'CN' ? '请输入别名' : 'Please input caption',
      )
    } else if (!this.state.type) {
      Toast.show(global.language === 'CN' ? '请选择类型' : 'Please choice type')
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
        global.language === 'CN' ? '请选择是否必选' : 'Please select required',
      )
    } else if (
      this.state.isRequired &&
      (this.state.defaultValue === '' || this.state.defaultValue === undefined)
    ) {
      Toast.show(
        getLanguage(global.language).Prompt.ATTRIBUTE_DEFAULT_VALUE_IS_NULL,
      )
    } else {
      isConfrim = true
    }
    return isConfrim
  }

  //确认
  confirm = isContinue => {
    if (!this.confirmValidate()) {
      return
    }
    let result = {
      caption: this.getTrimSmStr(this.state.caption),
      name: this.getTrimSmStr(this.state.name),
      type: this.state.type,
      maxLength: this.state.maxLength,
      required: this.state.isRequired,
    }
    if (result.required) {
      result.defaultValue = this.state.defaultValue
    }
    this.state.callBack && this.state.callBack(result)
    if (isContinue) {
      let tempName = this.state.name + '_1'
      let tempCaption = this.state.caption + '_1'
      this.setState({
        name: tempName,
        caption: tempCaption,
      })
    } else {
      NavigationService.goBack()
    }
  }

  reset = () => {
    Toast.show('待做')
  }

  getTrimSmStr = text => {
    if (text.length < 2) {
      return text
    }
    let tempStr = text.toLowerCase()
    if (tempStr.substring(0, 2) == 'sm') {
      let endStr = text.substring(2, text.length)
      if (endStr.length < 2) {
        return endStr
      } else {
        return this.getTrimSmStr(endStr)
      }
    } else {
      return text
    }
  }

  getType = ({ labelTitle, value }) => {
    switch (labelTitle) {
      case global.language === 'CN' ? '类型' : 'Type':
        this.setState({
          type: value,
        })
        break
      case global.language === 'CN' ? '必填' : 'Required':
        this.setState({
          isRequired: value,
          isDefaultValueCanEdit: value,
        })
        break
      case global.language === 'CN' ? '缺省值' : 'Default Value':
        this.setState({
          defaultValue: value,
        })
    }
  }

  getInputValue = ({ title, text }) => {
    switch (title) {
      case global.language === 'CN' ? '名称' : 'Name':
        this.setState({
          name: text,
        })
        break
      case global.language === 'CN' ? '别名' : 'Caption':
        this.setState({
          caption: text,
        })
        break
      case global.language === 'CN' ? '必填' : 'Required':
        this.setState({
          maxLength: parseInt(text),
        })
        break
      case global.language === 'CN' ? '缺省值' : 'Default Value':
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
    if (this.state.isEdit) {
      return null
    }
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
    let r
    switch (this.state.type) {
      case 3:
      case 4:
      case 16:
        r = /^(0|\+?[1-9][0-9]*)$/ //正整数和0
        checkFlag = r.test(text)
        break
      case 6:
      case 7:
        r = /^\d+(\.\d+)?$/ //小数
        checkFlag = r.test(text)
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
  //长度是否能编辑
  maxLengthCanEdit() {
    let canEdit = false
    switch (this.state.type) {
      case 10:
      case 127:
        canEdit = true
    }
    return canEdit
  }
  //获取默认长度
  getDefaultMaxLength(type) {
    for (let i = 0; i < typeStr.length; i++) {
      if (type === typeStr[i][2]) {
        return typeStr[i][3]
      }
    }
    return 0
  }
  //根据类型获取popData数据
  getTypeDataByType(type) {
    for (let i = 0; i < typeStr.length; i++) {
      if (type === typeStr[i][2]) {
        return {
          key: global.language === 'CN' ? typeStr[i][0] : typeStr[i][1],
          value: typeStr[i][2],
        }
      }
    }
    return null
  }
  getSelected = ({ title, selected, index, value }) => {
    this.getType({
      labelTitle: title,
      title,
      value,
      selected,
      index,
    })
  }

  getDefaultValue = type => {
    let defaultValue
    if (type === 1) {
      defaultValue = true
    } else if (type === 10) {
      defaultValue = ''
    } else {
      defaultValue = 0 + ''
    }
    return defaultValue
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
          let tempLength = this.getDefaultMaxLength(data.value)
          let defaultValue = this.getDefaultValue(data.value)
          this.setState({
            currentPopData: data,
            type: data.value,
            defaultValue: defaultValue,
            maxLength: tempLength,
          })
          this.popModal.setVisible(false)
        }}
      />
    )
  }

  renderDefaultValue = () => {
    let defaultValueTile = global.language === 'CN' ? '缺省值' : 'Default Value'
    return !this.state.isRequired ? null : this.state.type === 1 ? (
      <View style={styles.defaultValueItem}>
        <Text style={styles.rowLabel}>{defaultValueTile}</Text>
        <RadioGroup
          data={[
            { title: global.language === 'CN' ? '是' : 'YES', value: true },
            { title: global.language === 'CN' ? '否' : 'NO', value: false },
          ]}
          column={2}
          getSelected={result => {
            this.setState({
              defaultValue: result.value,
            })
          }}
          disable={this.state.isEdit && this.state.isDefaultValueCanEdit}
          defaultValue={this.state.defaultValue}
        />
      </View>
    ) : (
      <View style={styles.defaultValueItem}>
        <Text style={styles.rowLabel}>{defaultValueTile}</Text>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            accessible={true}
            value={this.state.defaultValue + ''}
            underlineColorAndroid="transparent"
            onChangeText={text => {
              this.setState({
                defaultValue: text,
              })
            }}
          />
          {this.state.isEdit && this.state.isDefaultValueCanEdit && (
            <View style={styles.inputOverLayer} />
          )}
        </View>
      </View>
    )
  }

  renderRows = () => {
    let maxLengthCanEdit = this.maxLengthCanEdit()
    return (
      <View style={styles.rows}>
        <Row
          style={{ marginTop: scaleSize(30) }}
          customRightStyle={styles.customRightStyle}
          key={'名称'}
          disable={this.state.isEdit}
          defaultValue={this.state.name}
          type={Row.Type.INPUT_WRAP}
          title={global.language === 'CN' ? '名称' : 'Name'}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(15) }}
          customRightStyle={styles.customRightStyle}
          key={'别名'}
          disable={this.state.isEdit}
          defaultValue={this.state.caption}
          type={Row.Type.INPUT_WRAP}
          title={global.language === 'CN' ? '别名' : 'Caption'}
          getValue={this.getInputValue}
        />
        <Row
          style={{ marginTop: scaleSize(30) }}
          key={'类型'}
          type={Row.Type.RADIO_GROUP}
          title={global.language === 'CN' ? '类型' : 'Type'}
          defaultValue={this.state.type}
          disable={this.state.isEdit}
          customRgihtView={
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={
                this.state.isEdit
                  ? null
                  : () => {
                    Keyboard.dismiss()
                    this.popModal && this.popModal.setVisible(true)
                  }
              }
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
          style={{ marginTop: scaleSize(25) }}
          customRightStyle={{ height: scaleSize(50) }}
          key={'长度'}
          type={Row.Type.TEXT_BTN}
          title={global.language === 'CN' ? '长度' : 'Length'}
          customRgihtView={
            <View
              style={{
                flexDirection: 'row',
                flex: 2,
                justifyContent: 'space-between',
                alignItems: 'center',
                marginLeft: scaleSize(20),
              }}
            >
              <TextInput
                style={{
                  fontSize: scaleSize(20),
                  color: color.black,
                  width: scaleSize(150),
                }}
                value={this.state.maxLength ? this.state.maxLength + '' : null}
                editable={maxLengthCanEdit && !this.state.isEdit}
                onChangeText={text => {
                  let length = Number(text.replace(/[^0-9]*/g, ''))
                  this.setState({
                    maxLength: length,
                  })
                }}
                keyboardType="numeric"
              />
            </View>
          }
        />

        <Row
          style={{ marginTop: scaleSize(15) }}
          key={'必填'}
          type={Row.Type.RADIO_GROUP}
          title={global.language === 'CN' ? '必填' : 'Required'}
          disable={this.state.isEdit}
          defaultValue={this.state.isRequired}
          radioArr={[
            { title: global.language === 'CN' ? '是' : 'YES', value: true },
            { title: global.language === 'CN' ? '否' : 'NO', value: false },
          ]}
          radioColumn={2}
          getValue={this.getType}
        />
        {this.renderDefaultValue()}
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
          title: this.state.isEdit
            ? global.language === 'CN'
              ? '属性详情'
              : 'Attribute Detail'
            : global.language === 'CN'
              ? '添加属性'
              : 'Add Attribute',
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
