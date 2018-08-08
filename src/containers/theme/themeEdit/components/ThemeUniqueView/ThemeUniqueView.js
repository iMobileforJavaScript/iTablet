/*
 Copyright © SuperMap. All rights reserved.
 Author: yangshanglong
 E-mail: yangshanglong@supermap.com
 */

import * as React from 'react'
import { ScrollView, View } from 'react-native'
import { RangeMode, ThemeUnique, ThemeUniqueItem, ColorGradientType, Action } from 'imobile_for_javascript'
import { Button, Row, BtnOne, InputDialog } from '../../../../../components'
import { Toast, dataUtil } from '../../../../../utils'
import NavigationService from '../../../../NavigationService'
import ThemeTable from '../ThemeTable'
import ChoosePage from '../../../choosePage'

import styles from './styles'

const CHOOSE = '请选择'

export default class ThemeUniqueView extends React.Component {

  props: {
    title: string,
    nav: Object,
    map: Object,
    mapControl: Object,
    layer: Object,
    isThemeLayer: boolean,
    setLoading: () => {},
  }

  static defaultProps = {
    isThemeLayer: false,
  }

  constructor(props) {
    super(props)
    this.state = {
      title: props.title,
      themeItemList: [
        // {visible: true, color: 'red', value: 1},
        // {visible: false, color: 'green', value: 2},
        // {visible: true, color: 'blue', value: 3},
      ],
      data: {
        expression: 'SmID',
        rangeMode: RangeMode.EQUALINTERVAL,
        colorMethod: {
          key: 'YELLOWRED',
          value: ColorGradientType.YELLOWRED,
        },
        color: '#0000FF',
      },
      currentItem: {},
    }
    this.themeUnique = {}
    this.defaultStyle = {}
  }

  componentDidMount() {
    // if (this.props.isThemeLayer) {
    //   this.getDataByTheme()
    // } else {
    this.getData(this.state.data.expression, this.state.data.colorMethod)
    // }
  }

  getDataByTheme = () => {
    // TODO 从专题图图层进入，获取专题图各个属性
    (async function () {
      try {
        // this.themeUnique = await this.props.layer.getTheme()
        // let expression = await this.themeUnique.getUniqueExpression()
        // let colorMethod = await this.themeUnique.getUniqueExpression()
      } catch (e) {
        Toast.show('加载错误')
      }
    }).bind(this)()
  }

  goToChoosePage = type => {
    let cb = () => {}
    switch (type) {
      case ChoosePage.Type.EXPRESSION:
        cb = this.getExpression
        break
      case ChoosePage.Type.COLOR:
        cb = this.getColorMethod
        break
    }

    NavigationService.navigate('ChoosePage', {
      type: type,
      cb: value => cb(value),
    })
  }

  selectRow = data => {
    this.setState({
      currentItem: data,
    })
  }

  changeStyle = data => {
    NavigationService.navigate('ThemeStyle', {
      layer: this.props.layer,
      map: this.props.map,
      mapControl: this.props.mapControl,
      item: data,
      cb: () => {
        this.getData(this.state.data.expression, this.state.data.colorMethod)
      },
    })
  }

  /**
   * 获取表达式
   */
  getExpression = ({key}) => {
    if (this.state.data.colorMethod.value === '') return
    this.getData(key, this.state.data.colorMethod)
  }

  /**
   * 获取颜色方案
   */
  getColorMethod = ({key, value}) => {
    let datalist = this.state.data
    if (this.state.data.expression === '') {
      Object.assign(datalist, { colorMethod: {key, value} })
      this.setState({
        data: datalist,
      })
      return
    }
    this.getData(this.state.data.expression, {key, value})
  }

  getData = (expression, colorMethod) => {
    this.props.setLoading && this.props.setLoading(true)
    ;(async function () {
      try {
        // 获取表达式对应的所有Item
        let datalist = this.state.data
        let dataset = await this.props.layer.getDataset()
        let datasetVector = await dataset.toDatasetVector()
        // await this.themeUnique.dispose()

        if (this.state.data.colorMethod.value !== colorMethod.value || !this.themeUnique._SMThemeUniqueId) {
          this.themeUnique = await (new ThemeUnique()).makeDefault(datasetVector, expression, colorMethod.value)
        } else if(this.themeUnique._SMThemeUniqueId && this.state.data.expression !== expression) {
          await this.themeUnique.setUniqueExpression(expression)
        }
        this.defaultStyle = await this.themeUnique.getDefaultStyle()

        // TODO 优化-更新时只更新变化的item | 分页查询
        let count = await this.themeUnique.getCount()
        let themeItemList = []
        for (let i = 0; i < count; i++) {
          let item = await this.themeUnique.getItem(i)
          let style = await item.getStyle()
          let visible = await item.isVisible()
          let color = await style.getLineColor()
          let uniqueValue = await item.getUnique()
          let data = { visible: visible, color: dataUtil.colorHex(color), value: uniqueValue, data: item }
          themeItemList.push(data)
        }
        await this.props.map.addThemeLayer(dataset, this.themeUnique, true)
        Object.assign(datalist, {
          expression: expression,
          colorMethod: colorMethod,
        })
        this.setState({
          themeItemList: themeItemList,
          data: datalist,
        }, () => this.props.setLoading && this.props.setLoading(false))
      } catch (e) {
        this.props.setLoading && this.props.setLoading(false)
      }
    }).bind(this)()
  }

  getValue = obj => {
    let data = this.state.data
    let key = Object.keys(obj)[0]
    if (data[key] === obj[key]) return
    Object.assign(data, obj)
    this.setState({
      data: data,
    })
  }

  confirm = () => {
    // NavigationService.goBack()
    if (!this.state.data.expression) {
      Toast.show('请选择表达式')
      return
    }
    (async function () {
      try {
        let listData = this.table.getModifiedData()
        let keys = Object.keys(listData)

        for (let i = 0; i < keys.length; i++) {
          let listItem = listData[keys[i]]
          let item = listItem[0].rowData.data

          if (listItem[0].value !== listItem[0].rowData.visible) {
            await item.setVisible(listItem[0].value)
          }

          if (listItem[1].value !== listItem[1].rowData.color) {
            let style = await item.getStyle()
            let rgb = dataUtil.colorRgba(listItem[1].value)
            style && await style.setLineColor(rgb.r, rgb.g, rgb.b)
          }

          if (listItem[2].value !== listItem[2].rowData.value) {
            await item.setUnique(listItem[2].value)
          }
        }

        let dataset = await this.props.layer.getDataset()
        await this.props.map.addThemeLayer(dataset, this.themeUnique, true)
        await this.props.map.refresh()
        await this.props.mapControl.setAction(Action.PAN)
        let routes = this.props.nav.routes
        let key = ''
        for (let i = 0; i < routes.length - 1; i++) {
          if (routes[i].routeName === 'MapView') {
            key = routes[i + 1].key
          }
        }
        NavigationService.goBack(key)
        Toast.show('设置成功')
      } catch (e) {
        console.error(e)
      }
    }).bind(this)()
  }

  reset = () => {
    // TODO reset
    Toast.show('待做')
  }

  add = unique => {
    (async function () {
      try {
        let item = await new ThemeUniqueItem().createObj()
        // await item.setStyle(this.defaultStyle)
        await item.setUnique(unique)
        let index = await this.themeUnique.add(item)

        if (index >= 0) {
          await this.getExpression({key: this.state.data.expression})
          await this.props.map.refresh()
          await this.props.mapControl.setAction(Action.PAN)
          Toast.show('添加成功')
          this.dialog && this.dialog.setDialogVisible(false)
        } else {
          Toast.show('添加失败，单值已存在')
        }
      } catch (e) {
        console.error(e)
      }
    }).bind(this)()
  }

  delete = () => {
    if (Object.keys(this.state.currentItem) <= 0) {
      Toast.show('请选择目标')
      return
    }
    (async function () {
      try {
        let result = await this.themeUnique.remove(this.state.currentItem[0].rowIndex)

        if (result) {
          await this.getExpression({key: this.state.data.expression})
          await this.props.map.refresh()
          await this.props.mapControl.setAction(Action.PAN)
          Toast.show('删除成功')
        } else {
          Toast.show('删除失败')
        }
      } catch (e) {
        console.error(e)
      }
    }).bind(this)()
  }

  setItemVisible = (item, visible) => {
    (async function () {
      await item.setVisible(visible)
    }).bind(this)()
  }

  updageValue = (obj, index) => {
    let newData = this.state.themeItemList
    Object.keys(obj).map(key => {
      newData[index][key] = obj[key]
    })
    // 如果数据相同就不重新渲染
    // if (JSON.stringify(newData) === JSON.stringify(this.state.themeItemList)) return
    this.setState({
      themeItemList: newData.concat(),
    })
  }

  renderOperationBtns = () => {
    return (
      <View style={styles.operationBtns}>
        <BtnOne
          style={styles.operationBtn}
          size={BtnOne.SIZE.SMALL}
          BtnText='添加'
          BtnImageSrc={require('../../../../../assets/public/icon-add.png')}
          BtnClick={() => this.dialog && this.dialog.setDialogVisible(true)}
        />
        <BtnOne
          style={styles.operationBtn}
          size={BtnOne.SIZE.SMALL}
          BtnText='删除'
          BtnImageSrc={require('../../../../../assets/public/icon-delete.png')}
          BtnClick={this.delete}
        />
      </View>
    )
  }

  renderContent = () => {
    return (
      <ScrollView style={styles.content}>
        <Row
          style={styles.row}
          key={'表达式'}
          value={this.state.data.expression || CHOOSE}
          type={Row.Type.TEXT_BTN}
          title={'表达式'}
          getValue={() => this.goToChoosePage(ChoosePage.Type.EXPRESSION)}
        />

        <Row
          style={styles.row}
          key={'颜色方案'}
          value={this.state.data.colorMethod.key || CHOOSE}
          type={Row.Type.TEXT_BTN}
          title={'颜色方案'}
          getValue={() => this.goToChoosePage(ChoosePage.Type.COLOR)}
        />

        {/*<Row*/}
        {/*style={styles.row}*/}
        {/*key={'颜色方案'}*/}
        {/*value={this.state.data.colorMethod}*/}
        {/*type={Row.Type.CHOOSE_COLOR}*/}
        {/*title={'颜色方案'}*/}
        {/*getValue={() => this.goToChoosePage(ChoosePage.Type.COLOR)}*/}
        {/*/>*/}

        {this.renderOperationBtns()}

        <ThemeTable
          ref={ref => this.table = ref}
          data={this.state.themeItemList}
          tableHead={['可见', '风格', '单值']}
          flexArr={[1, 2, 2]}
          updageValue={this.updageValue}
          setItemVisible={this.setItemVisible}
          selectRow={this.selectRow}
          changeStyle={this.changeStyle}
        />

        <InputDialog
          ref={ref => this.dialog = ref}
          // title={'请输入单值'}
          label={'单值'}
          confirmAction={this.add}
        />
      </ScrollView>
    )
  }

  renderBtns = () => {
    return (
      <View style={styles.btns}>
        <Button title={'确定'} onPress={this.confirm}/>
        <Button type={Button.Type.GRAY} title={'重置'} onPress={this.reset}/>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderContent()}
        {this.renderBtns()}
      </View>
    )
  }
}