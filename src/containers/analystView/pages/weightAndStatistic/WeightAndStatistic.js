/*
 Copyright © SuperMap. All rights reserved.
 Author: Yangshanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import { FlatList, View } from 'react-native'
import { Container, TextBtn, ImageButton } from '../../../../components'
import { getLanguage } from '../../../../language'
import { getPublicAssets } from '../../../../assets'
import { scaleSize } from '../../../../utils'
import { color } from '../../../../styles'
import NavigationService from '../../../NavigationService'
import { PopSwitchList } from '../../components'
import onlineParamsData from '../onlineAnalystView/onlineParamsData'
import WeightItem from './WeightItem'
import styles from './styles'

export default class WeightAndStatistic extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    language: String,
    iServerData: String,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.cb = params && params.cb

    let popData = [
      onlineParamsData.getWeight(),
      onlineParamsData.getStatisticMode(this.props.language),
    ]
    let data = params && params.data ? [...params.data] : []
    if (data[data.length - 1] !== '+') {
      data.push('+')
    }
    this.state = {
      data: data,

      popData: popData,
      currentPopDatas: [],
    }
    this.editIndex = -1 // 记录当前编辑对象
  }

  componentDidMount() {
    // if (this.props.iServerData && this.props.iServerData.ip && this.props.iServerData.port) {
    //   InteractionManager.runAfterInteractions(() => {
    //
    //   })
    // }
  }

  addWeight = () => {
    this.setState(
      {
        currentPopDatas: [this.state.popData[0][0], this.state.popData[1][0]],
      },
      () => {
        this.popModal && this.popModal.setVisible(true)
      },
    )
  }

  back = () => {
    if (this.backcb) {
      this.backcb()
    } else {
      this.props.navigation.goBack()
    }
  }

  confirm = () => {
    if (this.cb && typeof this.cb === 'function') {
      let data = JSON.parse(JSON.stringify(this.state.data))
      data.splice(data.length - 1, 1)
      this.cb(data)

      NavigationService.goBack()
    }
  }

  renderPopList = () => {
    return (
      <PopSwitchList
        ref={ref => (this.popModal = ref)}
        language={this.props.language}
        // data={this.state.popData}
        data={this.state.popData}
        currentPopDatas={this.state.currentPopDatas}
        confirm={data => {
          let newData = [...this.state.data]
          if (this.editIndex > -1) {
            // 修改
            newData[this.editIndex] = data
            this.editIndex = -1
          } else {
            // 添加
            newData.splice(newData.length - 1, 0, data)
          }
          this.setState(
            {
              data: newData,
            },
            () => {
              this.popModal && this.popModal.setVisible(false)
            },
          )
        }}
      />
    )
  }

  _renderItem = ({ item, index }) => {
    if (item === '+') {
      return (
        <ImageButton
          title={
            getLanguage(this.props.language).Analyst_Labels.ADD_WEIGHT_STATISTIC
          }
          direction={'row'}
          containerStyle={[styles.plusBtnView, { width: '100%' }]}
          iconBtnStyle={styles.plusImgView}
          iconStyle={styles.plusImg}
          titleStyle={styles.btnTitleStyle}
          icon={getPublicAssets().common.icon_plus}
          onPress={this.addWeight}
        />
      )
    }
    if (!item || item.length < 2) return null
    return (
      <WeightItem
        data={item}
        edit={data => {
          this.setState(
            {
              currentPopDatas: data,
            },
            () => {
              this.editIndex = index
              this.popModal && this.popModal.setVisible(true)
            },
          )
        }}
        remove={data => {
          let newData = [...this.state.data]
          // for (let index in this.state.data) {
          //   if (item[index][0].key === data.title && item[index][1].key === data.subTitle) {
          //     newData.splice(index, 1)
          //     break
          //   }
          // }
          if (
            newData[index][0].key === data[0].key &&
            newData[index][1].key === data[1].key
          ) {
            newData.splice(index, 1)
            this.setState({
              data: newData,
            })
          }
        }}
      />
    )
  }

  getItemLayout = (data, index) => {
    return {
      length: scaleSize(80),
      offset: (scaleSize(80) + 1) * index,
      index,
    }
  }

  _renderSeparator = () => {
    return (
      <View
        style={{
          width: '100%',
          height: 1,
          backgroundColor: color.separateColorGray,
        }}
      />
    )
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
              btnText={getLanguage(this.props.language).Analyst_Labels.CONFIRM}
              textStyle={styles.headerBtnTitle}
              btnClick={this.confirm}
            />
          ),
        }}
      >
        <FlatList
          ref={ref => (this.listView = ref)}
          keyExtractor={this._keyExtractor}
          data={this.state.data}
          renderItem={this._renderItem}
          ItemSeparatorComponent={this._renderSeparator}
          getItemLayout={this.getItemLayout}
        />
        {this.renderPopList()}
      </Container>
    )
  }
}
