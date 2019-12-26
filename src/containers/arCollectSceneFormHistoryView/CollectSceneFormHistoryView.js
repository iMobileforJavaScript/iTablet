import * as React from 'react'
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from 'react-native'
import NavigationService from '../NavigationService'
import styles from './styles'
import { getLanguage } from '../../language'
import ToolbarModule from '../workspace/components/ToolBar/modules/ToolbarModule'
import { ConstPath, UserType } from '../../constants'
import { FileTools } from '../../native'
import { Toast, dataUtil, scaleSize } from '../../utils'
import { SCollectSceneFormView } from 'imobile_for_reactnative'
import { getThemeAssets } from '../../assets'
import { color } from '../../styles'
import { PopView, Button } from '../../components'
import { BatchHeadBar } from '../../containers/tabs/Mine/component'

const HEADER_PADDINGTOP = Platform.OS === 'ios' ? 20 : 0
const HEADER_HEIGHT = scaleSize(88) + (Platform.OS === 'ios' ? 20 : 0)

export default class CollectSceneFormHistoryView extends React.Component {
  props: {
    navigation: Object,
    language: String,
    user: Object,
    nav: Object,
  }

  constructor(props) {
    super(props)
    this.clickAble = true // 防止重复点击
    const { params } = this.props.navigation.state || {}
    this.state = {
      collectData: GLOBAL.newcollectData,
      chooseDataSource: false,
      historyData: params.history,
      moreType: 'BATCH_DELETE',
      index: 0,
      reName: '',
      BATCH_DELETE: false,
      selectedNum: 0,
    }
  }

  back = () => {
    if (this.clickAble) {
      this.clickAble = false
      setTimeout(() => {
        this.clickAble = true
      }, 1500)
      NavigationService.goBack()
    }
  }

  /**行与行之间的分隔线组件 */
  renderItemSeparator = () => {
    return (
      <View
        style={{
          flexDirection: 'column',
          width: '100%',
          height: 1,
          backgroundColor: color.contentColorGray,
        }}
      />
    )
  }

  getDatasource = async () => {
    if (!this.state.chooseDataSource) {
      let userUDBPath, userUDBs
      //过滤掉标注和标绘匹配正则
      let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)((#$)|(#_\d+$)|(##\d+$))/
      if (
        ToolbarModule.getParams().user &&
        ToolbarModule.getParams().user.currentUser.userName &&
        ToolbarModule.getParams().user.currentUser.userType !==
          UserType.PROBATION_USER
      ) {
        let userPath =
          (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
          ToolbarModule.getParams().user.currentUser.userName +
          '/'
        userUDBPath = userPath + ConstPath.RelativePath.Datasource
        userUDBs = await FileTools.getPathListByFilter(userUDBPath, {
          extension: 'udb',
          type: 'file',
        })
        //过滤掉标注和标绘
        let filterUDBs = userUDBs.filter(item => {
          item.name = dataUtil.getNameByURL(item.path)
          return !item.name.match(checkLabelAndPlot)
        })
        filterUDBs.map(item => {
          item.image = require('../../assets/mapToolbar/list_type_udb_black.png')
          item.info = {
            infoType: 'mtime',
            lastModifiedDate: item.mtime,
          }
        })
        this.setState({
          showHistory: true,
          historyData: filterUDBs,
          chooseDataSource: true,
        })
      } else {
        let customerUDBPath = await FileTools.appendingHomeDirectory(
          ConstPath.CustomerPath + ConstPath.RelativePath.Datasource,
        )
        let customerUDBs = await FileTools.getPathListByFilter(
          customerUDBPath,
          {
            extension: 'udb',
            type: 'file',
          },
        )
        //过滤掉标注和标绘
        let filterUDBs = customerUDBs.filter(item => {
          item.name = dataUtil.getNameByURL(item.path)
          return !item.name.match(checkLabelAndPlot)
        })
        filterUDBs.map(item => {
          item.image = require('../../assets/mapToolbar/list_type_udb_black.png')
          item.info = {
            infoType: 'mtime',
            lastModifiedDate: item.mtime,
          }
        })
        this.setState({
          showHistory: true,
          historyData: filterUDBs,
          chooseDataSource: true,
        })
      }
    } else {
      let data = await SCollectSceneFormView.getHistoryData()
      if (data && data.history.length > 0) {
        this.setState({
          historyData: data.history,
          chooseDataSource: false,
        })
      } else {
        this.setState({
          historyData: [],
          chooseDataSource: false,
        })
      }
    }
  }

  onHistoryItemPress = async item => {
    let isShowtrace = await SCollectSceneFormView.isShowTrace()
    if (!isShowtrace) {
      await SCollectSceneFormView.startRecording()
    }
    let isline = await SCollectSceneFormView.isLineDataset(item.index)
    await SCollectSceneFormView.loadData(item.index, isline)
    NavigationService.goBack()
  }

  changeSelect = async item => {
    let newData = this.state.historyData
    item.select = !item.select
    newData[item.index] = item

    let selectedNum = this.state.selectedNum
    if (item.select) {
      this.setState({
        selectedNum: ++selectedNum,
        historyData: newData.concat(),
      })
    } else {
      this.setState({
        selectedNum: --selectedNum,
        historyData: newData.concat(),
      })
    }
  }

  _keyExtractor = item => item.name + item.index

  renderItem = ({ item }) => {
    let datasetImg
    switch (item.type) {
      case 'LINE':
        datasetImg = getThemeAssets().ar.toolbar.line
        break
      case 'POINT':
        datasetImg = getThemeAssets().ar.toolbar.point
        break
      case 'REGION':
        datasetImg = getThemeAssets().ar.toolbar.region
        break
      case 'POINT3D':
        datasetImg = getThemeAssets().ar.toolbar.point_3d
        break
      case 'LINE3D':
        datasetImg = getThemeAssets().ar.toolbar.line_3d
        break
      default:
        datasetImg = getThemeAssets().ar.toolbar.icon_dataset
        break
    }
    const visibleImgBlack = item.select
      ? require('../../assets/mapTools/icon_multi_selected_disable_black.png')
      : require('../../assets/mapTools/icon_multi_unselected_disable_black.png')
    let visibleImg = visibleImgBlack
    if (this.state.chooseDataSource) {
      return (
        <View style={styles.itemView}>
          <TouchableOpacity
            style={{
              height: scaleSize(50),
              width: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: scaleSize(8),
            }}
          >
            <Image
              resizeMode={'contain'}
              style={{
                height: scaleSize(40),
                width: scaleSize(40),
              }}
              source={getThemeAssets().ar.toolbar.icon_datasource}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historyItem}
            onPress={() => {
              this.onChooseDataSource(item)
            }}
          >
            <Text style={styles.historyItemText}>{item.name}</Text>
          </TouchableOpacity>
          {/*<TouchableOpacity*/}
          {/*style={styles.historyDelete}*/}
          {/*onPress={() => {*/}
          {/*this.setState({moreType:'RENAME',reName:item.name})*/}
          {/*this.PopView.setVisible(true)*/}
          {/*}}*/}
          {/*>*/}
          {/*<Image*/}
          {/*resizeMode={'contain'}*/}
          {/*style={styles.smallIcon}*/}
          {/*source={getThemeAssets().ar.toolbar.icon_more}*/}
          {/*/>*/}
          {/*</TouchableOpacity>*/}
        </View>
      )
    } else {
      return (
        <View style={styles.itemView}>
          {this.state.BATCH_DELETE && (
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.historySelect}
              onPress={() => {
                this.changeSelect(item)
              }}
            >
              <Image
                resizeMode={'contain'}
                style={styles.smallIcon}
                source={visibleImg}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              height: scaleSize(50),
              width: scaleSize(60),
              justifyContent: 'center',
              alignItems: 'center',
              marginLeft: scaleSize(8),
            }}
          >
            <Image
              resizeMode={'contain'}
              style={styles.smallIcon}
              source={datasetImg}
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.historyItem}
            onPress={() => {
              this.onHistoryItemPress(item)
            }}
          >
            <Text style={styles.historyItemText}>{item.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              // this.deleteHistory(item)
              this.setState({ moreType: 'DELETE', index: item.index })
              this.PopView.setVisible(true)
            }}
            style={styles.historyDelete}
          >
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_more}
              style={styles.smallIcon}
            />
          </TouchableOpacity>
        </View>
      )
    }
  }

  onChooseDataSource = async item => {
    await SCollectSceneFormView.setDataSource(item.name, item.path)
    let data = await SCollectSceneFormView.getHistoryData()
    if (data && data.history.length > 0) {
      this.setState({
        historyData: data.history,
        collectData: item.name,
        chooseDataSource: false,
      })
    } else {
      this.setState({
        historyData: [],
        collectData: item.name,
        chooseDataSource: false,
      })
    }
  }

  deleteHistory = async item => {
    await SCollectSceneFormView.deleteData(item.index)
    let data
    data = await SCollectSceneFormView.getHistoryData()
    if (data) {
      this.setState({
        showHistory: true,
        historyData: data.history,
      })
    } else {
      this.setState({
        showHistory: true,
        historyData: [],
      })
      Toast.show(
        getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
      )
    }
  }

  rename = async () => {
    NavigationService.navigate('InputPage', {
      headerTitle: getLanguage(global.language).Map_Layer.LAYERS_RENAME,
      value: '',
      placeholder: getLanguage(global.language).Map_Layer.LAYERS_RENAME,
      type: 'name',
      cb: async value => {
        await SCollectSceneFormView.reNameDataSource(this.state.reName, value)
        NavigationService.goBack()
      },
    })
  }

  historyView = () => {
    return (
      <View style={styles.historyDataView}>
        <FlatList
          data={this.state.historyData}
          ItemSeparatorComponent={this.renderItemSeparator}
          style={styles.list}
          renderItem={this.renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state}
        />
      </View>
    )
  }

  _getTotalItemNumber = () => {
    let section = this.state.historyData
    let j = 0
    for (let i = 0; i < section.length; i++) {
      j++
    }
    return j
  }

  _selectAll = () => {
    let section = this.state.historyData.clone()
    let j = 0
    for (let i = 0; i < section.length; i++) {
      section[i].select = true
      j++
    }
    this.setState({ section, selectedNum: j })
  }

  _deselectAll = () => {
    let section = this.state.historyData.clone()
    for (let i = 0; i < section.length; i++) {
      section[i].select = false
    }
    this.setState({ section, selectedNum: 0 })
  }

  batchdelete = async () => {
    for (let i = this.state.historyData.length - 1; i >= 0; i--) {
      if (this.state.historyData[i].select) {
        await SCollectSceneFormView.deleteData(i)
      }
    }
    let data
    data = await SCollectSceneFormView.getHistoryData()
    if (data) {
      this.setState({
        showHistory: true,
        historyData: data.history,
        selectedNum: 0,
      })
    } else {
      this.setState({
        showHistory: true,
        historyData: [],
        selectedNum: 0,
      })
      Toast.show(
        getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
      )
    }
  }

  _renderBatchHead = () => {
    return (
      <BatchHeadBar
        select={this.state.selectedNum}
        total={this._getTotalItemNumber()}
        selectAll={this._selectAll}
        deselectAll={this._deselectAll}
      />
    )
  }

  renderBatchBottom = () => {
    return (
      <View style={styles.bottomStyle}>
        <TouchableOpacity
          style={styles.bottomItemStyle}
          onPress={() => {
            this.batchdelete()
          }}
        >
          <Image
            style={{
              height: scaleSize(50),
              width: scaleSize(50),
              marginRight: scaleSize(20),
            }}
            source={getThemeAssets().attribute.icon_delete}
          />
          <Text style={{ fontSize: scaleSize(20) }}>
            {getLanguage(global.language).Profile.BATCH_DELETE}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSeparatorLine = () => {
    return <View style={styles.separator} />
  }

  _renderCancelBtn = () => {
    return (
      <Button
        style={styles.item}
        titleStyle={styles.btnTitle}
        title={getLanguage(global.language).Prompt.CANCEL}
        // {'取消'}
        key={'取消'}
        onPress={() => {
          this.PopView.setVisible(false)
        }}
        activeOpacity={0.5}
      />
    )
  }

  _renderList = () => {
    if (this.state.moreType === 'BATCH_DELETE') {
      return (
        <Button
          style={styles.item}
          titleStyle={styles.btnTitle}
          title={getLanguage(global.language).Prompt.BATCH_DELETE}
          key={getLanguage(global.language).Prompt.BATCH_DELETE}
          onPress={() => {
            this.setState({ BATCH_DELETE: true })
            this.PopView.setVisible(false)
          }}
          activeOpacity={0.5}
        />
      )
    } else if (this.state.moreType === 'DELETE') {
      return (
        <Button
          style={styles.item}
          titleStyle={styles.btnTitle}
          title={getLanguage(global.language).Prompt.DELETE}
          key={getLanguage(global.language).Prompt.DELETE}
          onPress={() => {
            this.deleteHistory(this.state.historyData[this.state.index])
            this.PopView.setVisible(false)
          }}
          activeOpacity={0.5}
        />
      )
    } else {
      return (
        <Button
          style={styles.item}
          titleStyle={styles.btnTitle}
          title={getLanguage(global.language).Prompt.RENAME}
          key={getLanguage(global.language).Prompt.RENAME}
          onPress={() => {
            this.rename()
            this.PopView.setVisible(false)
          }}
          activeOpacity={0.5}
        />
      )
    }
  }

  _renderPagePopup = () => {
    return (
      <PopView ref={ref => (this.PopView = ref)}>
        <View
          style={{
            width: '100%',
            height: this.height,
            backgroundColor: color.contentColorWhite,
          }}
        >
          {this._renderList()}
          {this._renderSeparatorLine()}
          {this._renderCancelBtn()}
        </View>
      </PopView>
    )
  }

  complete = async () => {
    let data
    data = await SCollectSceneFormView.getHistoryData()
    if (data) {
      this.setState({
        showHistory: true,
        historyData: data.history,
        selectedNum: 0,
        BATCH_DELETE: false,
      })
    } else {
      this.setState({
        showHistory: true,
        historyData: [],
        selectedNum: 0,
        BATCH_DELETE: false,
      })
      Toast.show(
        getLanguage(global.language).Map_Main_Menu
          .MAP_AR_AI_ASSISTANT_SCENE_FORM_COLLECT_NO_HISTORY,
      )
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingTop: HEADER_PADDINGTOP,
            height: HEADER_HEIGHT,
            width: '100%',
            backgroundColor: '#303030',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.back()
            }}
            style={{
              position: 'absolute',
              width: 60,
              padding: 5,
              marginLeft: scaleSize(20),
              justifyContent: 'center',
            }}
          >
            <Image
              resizeMode={'contain'}
              source={require('../../assets/public/Frenchgrey/icon-back-white.png')}
              style={styles.backbtn}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              this.getDatasource()
            }}
            style={styles.historyCloseIcon}
          >
            <Text style={[styles.historyTitle]}>{this.state.collectData}</Text>
            <Image
              resizeMode={'contain'}
              source={getThemeAssets().ar.toolbar.icon_down}
              style={styles.smallIcons}
            />
          </TouchableOpacity>
          {!this.state.BATCH_DELETE && !this.state.chooseDataSource && (
            <TouchableOpacity
              onPress={() => {
                this.PopView.setVisible(true)
                this.setState({ moreType: 'BATCH_DELETE' })
              }}
              style={{
                position: 'absolute',
                width: 60,
                right: scaleSize(5),
                padding: 5,
                justifyContent: 'center',
              }}
            >
              <Image
                resizeMode={'contain'}
                style={{
                  width: scaleSize(60),
                  height: scaleSize(60),
                }}
                source={require('../../assets/home/Frenchgrey/icon_else_selected.png')}
              />
            </TouchableOpacity>
          )}
          {this.state.BATCH_DELETE && !this.state.chooseDataSource && (
            <TouchableOpacity
              onPress={() => {
                this.complete()
              }}
              style={{
                position: 'absolute',
                width: 60,
                right: scaleSize(5),
                padding: 5,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: '#FBFBFB',
                  fontSize: scaleSize(26),
                  textAlign: 'center',
                  textAlignVertical: 'center',
                }}
              >
                {getLanguage(global.language).Prompt.COMPLETE}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {this.state.BATCH_DELETE && this._renderBatchHead()}
        {this.historyView()}
        {this.state.BATCH_DELETE && this.renderBatchBottom()}
        {this._renderPagePopup()}
      </View>
    )
  }
}
