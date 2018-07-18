/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { View } from 'react-native'
import NavigationService from '../../../NavigationService'
import { Container, Row, Button } from '../../../../components'
import { Toast, scaleSize } from '../../../../utils'
import { FieldType } from 'imobile_for_javascript'

import styles from './styles'

export default class LayerAttributeAdd extends React.Component {

  props: {
    navigation: Object,
    currentAttribute: Object,
    setCurrentAttribute: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.isEdit = params.data && Object.keys(params.data).length > 0
    this.state = {
      callBack: params.callBack,
      data: params.data,
      selection: params.selection,
      name: params.data && params.data.name || '',
      type: params.data && params.data.type || '',
      maxLength: params.data && params.data.maxLength || '',
      defaultValue: params.data && params.data.defaultValue || '',
      isRequired: params.data && params.data.isRequired || '',
    }
  }

  componentDidMount() {
  }

  getDatasets = async () => {
    this.container.setLoading(false)
  }

  confirmValidate = () => {
    let isConfrim = false

    if (this.isEdit) {
      const { data } = this.props.navigation.state.params
      let keys = Object.keys(data)
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (this.state[key] !== data[key] && key !== 'caption' && key !== 'isSystemField') {
          isConfrim = true
          break
        }
      }
      !isConfrim && Toast.show('还未修改数据')
    } else {
      if (!this.state.name) {
        Toast.show('请输入名称')
      } else if (!this.state.type) {
        Toast.show('请选择类型')
      } else if (!this.state.maxLength) {
        Toast.show('请输入长度')
      } else if (this.state.isRequired === '' || this.state.isRequired === undefined) {
        Toast.show('请选择是否必选')
      } else {
        isConfrim = true
      }
    }

    return isConfrim
  }

  confirm = () => {
    if (!this.confirmValidate()) return
    this.container.setLoading(true, '数据编辑中')
    ;(async function () {
      try {
        let recordset = this.state.selection.recordset
        let datasets = await recordset.getDataset()
        let datasetVector = await datasets.toDatasetVector()
        let index
        if (this.isEdit) {
          const { params } = this.props.navigation.state
          const name = params.data.name
          index = await datasetVector.editFieldInfo(name, {
            caption: this.state.name,
            name: this.state.name,
            type: this.state.type,
            maxLength: this.state.maxLength,
            defaultValue: this.state.defaultValue,
            isRequired: this.state.isRequired,
          })
        } else {
          index = await datasetVector.addFieldInfo({
            caption: this.state.name,
            name: this.state.name,
            type: this.state.type,
            maxLength: this.state.maxLength,
            defaultValue: this.state.defaultValue,
            isRequired: this.state.isRequired,
          })
        }
        if (index >= 0 ) {
          Toast.show("添加成功")
          this.state.callBack && this.state.callBack()
          NavigationService.goBack()
        } else {
          Toast.show("添加失败")
        }

        this.container.setLoading(false)
      } catch (e) {
        Toast.show("添加失败")
        this.container.setLoading(false)
      }
    }).bind(this)()
  }

  reset = () => {
    Toast.show("待做")
  }

  getType = ({labelTitle, value}) => {
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
    }
  }

  getInputValue = ({title, text}) => {
    switch (title) {
      case '名称':
        this.setState({
          name: text,
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
        <Button title={'确定'} onPress={this.confirm}/>
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset}/>
      </View>
    )
  }

  renderRows = () => {
    return (
      <View style={styles.rows}>
        <Row
          style={{marginTop: scaleSize(30)}}
          key={'名称'}
          defaultValue={this.state.name}
          type={Row.Type.INPUT}
          title={'名称'}
          getValue={this.getInputValue}
        />
        <Row
          style={{marginTop: scaleSize(30)}}
          key={'类型'}
          type={Row.Type.RADIO_GROUP}
          title={'类型'}
          defaultValue={this.state.type}
          radioArr={[
            {title: '文本', value: FieldType.TEXT},
            {title: '数值', value: FieldType.DOUBLE},
            {title: '布尔', value: FieldType.BOOLEAN},
            {title: '日期', value: FieldType.DATETIME},
          ]}
          radioColumn={2}
          getValue={this.getType}
        />
        <Row
          style={{marginTop: scaleSize(30)}}
          key={'长度'}
          type={Row.Type.INPUT}
          title={'长度'}
          defaultValue={this.state.maxLength}
          getValue={this.getInputValue}
          inputType={Row.InputType.NUMERIC}
        />
        <Row
          style={{marginTop: scaleSize(30)}}
          key={'缺省值'}
          type={Row.Type.INPUT}
          title={'缺省值'}
          defaultValue={this.state.defaultValue}
          getValue={this.getInputValue}
        />
        <Row
          style={{marginTop: scaleSize(30)}}
          key={'必填'}
          type={Row.Type.RADIO_GROUP}
          title={'必填'}
          defaultValue={this.state.isRequired}
          radioArr={[
            {title: '是', value: true},
            {title: '否', value: false},
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
        ref={ref => this.container = ref}
        style={styles.container}
        // scrollable
        headerProps={{
          title: '属性信息',
          navigation: this.props.navigation,
        }}>
        {this.renderRows( )}
        {this.renderBtns()}
      </Container>
    )
  }
}