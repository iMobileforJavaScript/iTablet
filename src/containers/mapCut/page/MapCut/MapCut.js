/*
 Copyright © SuperMap. All rights reserved.
 Author: Yang Shanglong
 E-mail: yangshanglong@supermap.com
 */
import * as React from 'react'
import {
  View,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  TouchableOpacity,
  Platform,
  InteractionManager,
} from 'react-native'
import {
  Container,
  TextBtn,
  ImageButton,
  Button,
  PopView,
} from '../../../../components'
import { scaleSize, Toast, dataUtil } from '../../../../utils'
import { CheckStatus } from '../../../../constants'
import { color } from '../../../../styles'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { MapCutSetting, CutListItem, MapCutAddLayer } from '../../compoents'
import NavigationService from '../../../NavigationService'
import { DatasetType, SMap, EngineType } from 'imobile_for_reactnative'
import styles from '../../styles'
import { getLanguage } from '../../../../language'
import ConstPath from '../../../../constants/ConstPath'
import FileTools from '../../../../native/FileTools'

let COMPLETE = ''
let EDIT = ''
let CANCEL = ''

export default class MapCut extends React.Component {
  props: {
    language: string,
    navigation: Object,
    nav: Object,
    map: Array,
    currentUser: string,
    layers: Array,
    getLayers: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    COMPLETE = getLanguage(this.props.language).Prompt.CONFIRM
    EDIT = getLanguage(this.props.language).Map_Main_Menu.EDIT
    CANCEL = getLanguage(this.props.language).Prompt.CANCEL
    this.state = {
      headerBtnTitle: EDIT,
      selected: (new Map(): Map<string, boolean>),
      extraData: (new Map(): Map<string, Object>),
      isSelectAll: false,
      isSaveAs: false,
      saveAsName: '',
      // layers: props.layers,
      layers: [],
      outLayers: [], // 未选中的图层
      datasources: [],
      points: (params && params.points) || [],
    }
    this.init = true
    this.changeDSData = null
    this.isCutting = false // 判断是否正在裁剪
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      (async function() {
        let layers = await this.props.getLayers()
        SMap.getDatasources().then(datasources => {
          let reg = /^Label_(.*)((#$)|(#_\d+$)|(##\d+$))/
          datasources = datasources.filter(
            item =>
              !item.alias.match(reg) && item.engineType === EngineType.UDB,
          )
          this.setState({
            datasources,
          })
        })
        let _layers = await this.getAllLayers(layers)
        _layers = _layers.filter(item => item.isVisible)
        this.selectAll(true, _layers)
      }.bind(this)())
    })
  }

  /**
   * 获取所有图层，包含图层组中的图层  过滤标注图层 保留当前标注图层
   */
  getAllLayers = async layers => {
    let _layers = []
    for (let i = 0; i < layers.length; i++) {
      let item = layers[i]
      if (item.type === 'layerGroup') {
        let groupLayers = await SMap.getLayersByGroupPath(item.path)
        if (groupLayers.length > 0) {
          let _layers_2 = await this.getAllLayers(groupLayers)
          _layers = _layers.concat(_layers_2)
        }
      } else {
        _layers.push(item)
      }
    }
    return _layers
  }

  headerBtnAction = () => {
    this.setState({
      headerBtnTitle: this.state.headerBtnTitle === EDIT ? COMPLETE : EDIT,
    })
  }

  cut = () => {
    (async function() {
      try {
        if (
          this.isCutting ||
          (this.state.isSaveAs && this.state.saveAsName === '')
        )
          return
        this.isCutting = true

        this.mapNameIput && this.mapNameIput.blur()
        this.container &&
          this.container.setLoading(
            true,
            getLanguage(this.props.language).Prompt.CLIPPING,
          )
        setTimeout(async () => {
          let layersInfo = []
          let newDatasourceName =
            this.props.currentUser.userName + '_Clip_Label#'
          let filePath = await FileTools.appendingHomeDirectory(
            ConstPath.AppPath +
              'User/' +
              this.props.currentUser.userName +
              '/' +
              ConstPath.RelativePath.Datasource,
          )
          let newDatasourcePath = filePath + newDatasourceName + '.udb'
          let newDatasourceUDDPath = filePath + newDatasourceName + '.udd'

          //另存地图
          let addition = {}
          if (this.props.map.currentMap.Template) {
            addition.Template = this.props.map.currentMap.Template
          }
          if (this.state.saveAsName !== '') {
            let datasourceParams = {}
            let index = 0
            let flag = true
            newDatasourcePath = filePath + newDatasourceName + index + '.udb'
            while (flag) {
              index++
              newDatasourceName =
                this.props.currentUser.userName + index + '_Clip_Label#'
              newDatasourcePath = filePath + newDatasourceName + '.udb'
              newDatasourceUDDPath = filePath + newDatasourceName + '.udd'
              flag = await FileTools.fileIsExist(newDatasourcePath)
            }
            //如果别名不可用 返回了新的别名 重新赋值
            let returnName = await SMap.isAvilableAlias(newDatasourceName)
            if (returnName !== newDatasourceName) {
              newDatasourcePath = filePath + returnName + '.udb'
              newDatasourceUDDPath = filePath + returnName + '.udd'
              newDatasourceName = returnName
            }
            datasourceParams.server = newDatasourcePath
            datasourceParams.engineType = EngineType.UDB
            datasourceParams.alias = newDatasourceName
            let rel = await SMap.createDatasource(datasourceParams)
            if (rel === true) {
              await SMap.openDatasource(datasourceParams)
            }
            let prefix = `@Label_${this.props.currentUser.userName}#`
            let regexp = new RegExp(prefix)
            let layers = this.state.layers
            addition.filterLayers = layers
              .filter(item => item.name.match(regexp))
              .map(val => val.name)
          }
          let DSName = this.state.datasources.map(item => item.alias)
          //不另存地图需要新建数据源 for of中await
          for (let item of this.state.selected) {
            let layerInfo = {}
            let info = this.state.extraData.get(item[0])
            if (
              DSName.indexOf(info.datasourceName) === -1 &&
              this.state.saveAsName === ''
            ) {
              let newDatasourcePath = filePath + info.datasourceName + '.udb'
              let datasourceParams = {}
              datasourceParams.server = newDatasourcePath
              datasourceParams.engineType = EngineType.UDB
              datasourceParams.alias = info.datasourceName
              let rel = await SMap.createDatasource(datasourceParams)
              if (rel === true) {
                await SMap.openDatasource(datasourceParams)
                DSName.push(info.datasourceName)
              }
            }
            layerInfo.LayerName = item[0]
            layerInfo.IsClipInRegion =
              info.inRangeStatus === CheckStatus.CHECKED ||
              info.inRangeStatus === CheckStatus.CHECKED_DISABLE
            layerInfo.IsErase =
              info.eraseStatus === CheckStatus.CHECKED ||
              info.eraseStatus === CheckStatus.CHECKED_DISABLE
            if (
              info.exactCutStatus === CheckStatus.CHECKED ||
              info.exactCutStatus === CheckStatus.UN_CHECK
            ) {
              layerInfo.IsExactClip =
                info.exactCutStatus === CheckStatus.CHECKED
            }
            layerInfo.DatasourceTarget =
              this.state.saveAsName !== ''
                ? newDatasourceName
                : info.datasourceName
            layersInfo.push(layerInfo)
          }

          SMap.clipMap(
            this.state.points,
            layersInfo,
            this.state.saveAsName,
            '',
            addition,
            true,
          ).then(
            () => {
              if (this.state.saveAsName !== '') {
                SMap.closeDatasource(newDatasourceName)
                SMap.deleteDatasource(newDatasourcePath)
                SMap.deleteDatasource(newDatasourceUDDPath)
              }
              this.container && this.container.setLoading(false)
              this.isCutting = false

              GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(false)
              GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false)
              NavigationService.goBack()
              Toast.show(
                getLanguage(this.props.language).Prompt.CLIPPED_SUCCESS,
              )
            },
            () => {
              this.container && this.container.setLoading(false)
              this.isCutting = false
              Toast.show(getLanguage(this.props.language).Prompt.CLIP_FAILED)
            },
          )
          // this.container && this.container.setLoading(false)
          // this.isCutting = false
          // if (result) {
          //   GLOBAL.MapSurfaceView && GLOBAL.MapSurfaceView.show(false)
          //   GLOBAL.toolBox && GLOBAL.toolBox.setVisible(false)
          //   NavigationService.goBack()
          //   Toast.show(getLanguage(this.props.language).Prompt.CLIPPED_SUCCESS)
          // } else {
          //   Toast.show(ConstInfo.CLIP_FAILED)
          // }
        }, 0)
      } catch (e) {
        this.isCutting = false
        this.container && this.container.setLoading(false)
        Toast.show(getLanguage(this.props.language).Prompt.CLIP_FAILED)
      }
    }.bind(this)())
  }

  _onChangeText = text => {
    let { result, error } = dataUtil.isLegalName(text, this.props.language)
    if (!result && error) {
      Toast.show(error)
      return
    }
    this.setState({
      saveAsName: text,
    })
  }

  saveAs = () => {
    this.setState({
      isSaveAs: !this.state.isSaveAs,
    })
  }

  isEdit = () => {
    return this.state.headerBtnTitle !== EDIT
  }

  /**
   * 全选/全取消
   * @param isSelectAll
   */
  selectAll = (isSelectAll, layers = this.state.layers) => {
    if (isSelectAll !== undefined && isSelectAll === this.state.isSelectAll)
      return
    this.setState(state => {
      const selected = new Map(state.selected)
      const isSelectAll = !state.isSelectAll
      if (this.state.isSelectAll) {
        selected.clear()
      } else {
        // this.state.layers.forEach(item => {
        layers.forEach(item => {
          selected.set(item.name, true)
        })
      }
      if (JSON.stringify(state.layers) !== JSON.stringify(layers)) {
        return { selected, isSelectAll, layers }
      } else {
        return { selected, isSelectAll }
      }
    })
  }

  /**
   * 区域内裁剪
   * @param item
   */
  onSelect = item => {
    this.setState(state => {
      const selected = new Map(state.selected)
      const isSelected = selected.get(item.name)
      if (isSelected) {
        selected.delete(item.name)
      } else {
        selected.set(item.name, true)
      }

      if (selected.size !== state.layers.length && state.isSelectAll) {
        // if (selected.size !== this.props.layers.length && state.isSelectAll) {
        return { selected, isSelectAll: false }
      } else if (selected.size === state.layers.length && !state.isSelectAll) {
        // } else if (selected.size === this.props.layers.length && !state.isSelectAll) {
        return { selected, isSelectAll: true }
      }
      return { selected }
    })
  }

  /**
   * 区域内裁剪
   * @param item
   */
  changeRangeCut = item => {
    let data = this.state.extraData.get(item.name)
    switch (data.inRangeStatus) {
      case CheckStatus.UN_CHECK:
        data.inRangeStatus = CheckStatus.CHECKED
        break
      case CheckStatus.CHECKED:
        data.inRangeStatus = CheckStatus.UN_CHECK
        break
      default:
        return
    }
    this.setState(state => {
      const extraData = new Map(state.extraData)
      extraData.set(item.name, data)
      return { extraData }
    })
  }

  /**
   * 擦除
   * @param item
   */
  changeErase = item => {
    let data = this.state.extraData.get(item.name)
    switch (data.eraseStatus) {
      case CheckStatus.UN_CHECK:
        data.eraseStatus = CheckStatus.CHECKED
        break
      case CheckStatus.CHECKED:
        data.eraseStatus = CheckStatus.UN_CHECK
        break
      default:
        return
    }
    this.setState(state => {
      const extraData = new Map(state.extraData)
      extraData.set(item.name, data)
      return { extraData }
    })
  }

  /**
   * 精确裁剪
   * @param item
   */
  changeExactCut = item => {
    let data = this.state.extraData.get(item.name)
    switch (data.exactCutStatus) {
      case CheckStatus.UN_CHECK:
        data.exactCutStatus = CheckStatus.CHECKED
        break
      case CheckStatus.CHECKED:
        data.exactCutStatus = CheckStatus.UN_CHECK
        break
      default:
        return
    }
    this.setState(state => {
      const extraData = new Map(state.extraData)
      extraData.set(item.name, data)
      return { extraData }
    })
  }

  /**
   * 修改数据源
   * @param item
   */
  showDatasource = item => {
    this.dsModal && this.dsModal.setVisible(true)
    this.changeDSData = item
  }

  /**
   * 修改图层名字
   * @param item
   * @param caption 新名字
   */
  changeCaption = (item, caption) => {
    let data = this.state.extraData.get(item.name)
    this.setState(state => {
      const extraData = new Map(state.extraData)
      data.caption = caption
      extraData.set(item.caption, data)
      return { extraData }
    })
  }

  dsItemAction = ({ item }) => {
    this.dsModal && this.dsModal.setVisible(false)
    if (this.changeDSData) {
      this.setState(state => {
        let data = this.state.extraData.get(this.changeDSData.name)
        const extraData = new Map(state.extraData)
        data.datasourceName = item.alias
        extraData.set(item.alias, data)
        return { extraData }
      })
    }
  }

  /** 删除选中图层图层 **/
  deleteLayers = () => {
    if (this.state.selected.size === 0) return
    this.setState(state => {
      const selected = new Map(state.selected)
      const extraData = new Map().clone(state.extraData)
      let layers = []
      let outLayers = JSON.parse(JSON.stringify(state.outLayers))

      state.layers.forEach(item => {
        if (selected.get(item.name)) {
          outLayers.push(item)
        } else {
          layers.push(item)
        }
      })
      selected.clear()
      if (state.isSelectAll) {
        // outLayers = state.layers
        // selected.clear()
        extraData.clear()
      } else {
        // state.layers.forEach(item => {
        //   if (selected.get(item.name)) {
        //     outLayers.push(item)
        //   } else {
        //     layers.push(item)
        //   }
        // })
        //
        // selected.clear()
      }

      return { selected, extraData, outLayers, layers }
    })
  }

  /** 添加图层 **/
  addLayers = () => {}

  /** 多选框 **/
  renderCheckButton = ({ status = 0, action = () => {}, data }) => {
    let icon = this.state.sectionSelected
      ? getPublicAssets().common.icon_check
      : getPublicAssets().common.icon_uncheck
    switch (status) {
      case CheckStatus.UN_CHECK:
        icon = getPublicAssets().common.icon_uncheck
        break
      case CheckStatus.CHECKED:
        icon = getPublicAssets().common.icon_check
        break
      case CheckStatus.UN_CHECK_DISABLE:
        icon = getPublicAssets().common.icon_uncheck_disable
        break
      case CheckStatus.CHECKED_DISABLE:
        icon = getPublicAssets().common.icon_check_disable
        break
    }
    return (
      <ImageButton
        iconBtnStyle={styles.selectImgView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          action && action(data)
        }}
      />
    )
  }

  renderBottomButton = ({ icon, action }) => {
    return (
      <ImageButton
        iconBtnStyle={styles.bottomBtnView}
        iconStyle={styles.selectImg}
        icon={icon}
        onPress={() => {
          action && action()
        }}
      />
    )
  }

  /** 顶部组件 **/
  renderTop = () => {
    if (this.isEdit()) {
      return (
        <View style={styles.topView}>
          <View style={styles.topLeftView}>
            {this.renderCheckButton({
              status: this.state.isSelectAll
                ? CheckStatus.CHECKED
                : CheckStatus.UN_CHECK,
              action: this.selectAll,
            })}
            <Text style={styles.topText}>
              {getLanguage(this.props.language).Map_Label.LAYER}
              {/* 图层 */}
            </Text>
          </View>
          <View style={[styles.topRightView, { width: scaleSize(360) }]}>
            <Text
              style={[
                styles.topText,
                { width: scaleSize(120), marginRight: scaleSize(30) },
              ]}
            >
              {
                getLanguage(this.props.language).Map_Main_Menu
                  .TOOLS_TARGET_DATASOURCE
              }
              {/* 目标数据源 */}
            </Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.topView}>
          <View style={styles.topLeftView}>
            <View style={styles.selectImgView} />
            <Text style={styles.topText}>
              {getLanguage(this.props.language).Map_Label.LAYER}
              {/* 图层 */}
            </Text>
          </View>
          <View style={styles.topRightView}>
            <Text style={[styles.topText, { width: scaleSize(120) }]}>
              {getLanguage(this.props.language).Map_Main_Menu.TOOLS_CLIP_INSIDE}
              {/* 区域内裁剪 */}
            </Text>
            <Text style={[styles.topText, { width: scaleSize(120) }]}>
              {getLanguage(this.props.language).Map_Main_Menu.TOOLS_ERASE}
              {/* 擦除 */}
            </Text>
            <Text style={[styles.topText, { width: scaleSize(120) }]}>
              {getLanguage(this.props.language).Map_Main_Menu.TOOLS_EXACT_CLIP}
              {/* 精确裁剪 */}
            </Text>
          </View>
        </View>
      )
    }
  }

  _renderItem = ({ item }) => {
    let data = this.state.extraData.get(item.name)
    if (!data || data.datasourceName === '') {
      data = {
        inRangeStatus: CheckStatus.CHECKED,
        eraseStatus:
          item.type !== DatasetType.Text && item.type !== DatasetType.GRID
            ? CheckStatus.UN_CHECK
            : CheckStatus.UN_CHECK_DISABLE,
        exactCutStatus:
          item.type === DatasetType.GRID
            ? CheckStatus.UN_CHECK
            : CheckStatus.CHECKED_DISABLE,
        datasourceName: item.datasourceAlias,
        caption: '',
      }
      // this.setState(state => {
      //   const extraData = new Map(state.extraData)
      //   extraData.set(item.name, data)
      //   return { extraData }
      // })

      // 为减少循环遍历并setState的临时方案，extraData为Map
      this.state.extraData.set(item.name, data)
    }
    return (
      <CutListItem
        data={item}
        isEdit={this.isEdit()}
        caption={data.caption}
        selected={!!this.state.selected.get(item.name)}
        inRangeStatus={data.inRangeStatus}
        eraseStatus={data.eraseStatus}
        exactCutStatus={data.exactCutStatus}
        datasourceName={data.datasourceName}
        onSelect={() => this.onSelect(item)}
        changeRangeCut={() => this.changeRangeCut(item)}
        changeErase={() => this.changeErase(item)}
        changeExactCut={() => this.changeExactCut(item)}
        showDatasource={() => {
          this.showDatasource(item)
        }}
        changeCaption={caption => this.changeCaption(item, caption)}
      />
    )
  }

  /** 中间组件 **/
  renderContent = () => {
    return (
      <FlatList
        style={{ flex: 1 }}
        initialNumToRender={20}
        ref={ref => (this.ref = ref)}
        renderItem={this._renderItem}
        data={this.state.layers}
        keyExtractor={item => item.name}
        // ItemSeparatorComponent={() => (
        //   <View
        //     style={{
        //       backgroundColor: color.separateColorGray,
        //       flex: 1,
        //       height: 1,
        //     }}
        //   />
        // )}
      />
    )
  }

  /** 底部组件 **/
  renderBottom = () => {
    if (this.isEdit()) {
      return (
        <View style={[styles.bottomView, { width: '100%' }]}>
          {this.renderBottomButton({
            icon: getThemeAssets().attribute.rightbar_tool_select_layerlist,
            action: () => {
              if (this.state.outLayers.length === 0) return
              this.addLayerModal && this.addLayerModal.showModal(true)
            },
          })}
          {this.renderBottomButton({
            icon: getThemeAssets().attribute.icon_delete,
            action: () => {
              if (this.state.selected.size === 0) return
              this.deleteLayers()
            },
          })}
          {this.renderBottomButton({
            icon: getThemeAssets().attribute.icon_setting,
            action: () => {
              if (this.state.selected.size === 0) return
              this.settingModal && this.settingModal.showModal(true)
            },
          })}
        </View>
      )
    } else {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' && 'padding'}
          enabled
        >
          <View style={[styles.bottomView, { width: '100%' }]}>
            <View style={styles.bottomLeftView}>
              {this.renderCheckButton({
                status: this.state.isSaveAs
                  ? CheckStatus.CHECKED
                  : CheckStatus.UN_CHECK,
                action: this.saveAs,
              })}
              {this.state.isSaveAs ? (
                <TextInput
                  ref={ref => (this.mapNameIput = ref)}
                  value={this.state.text}
                  style={styles.input}
                  placeholder={
                    getLanguage(this.props.language).Prompt.CLIP_ENTER_MAP_NAME
                  }
                  // {'请输入地图名字'}
                  underlineColorAndroid="transparent"
                  onChangeText={text => this._onChangeText(text)}
                  placeholderTextColor={color.borderColor}
                />
              ) : (
                <Text style={styles.topText}>
                  {
                    getLanguage(this.props.language).Map_Main_Menu
                      .START_SAVE_AS_MAP
                  }
                  {/* 另存地图 */}
                </Text>
              )}
            </View>
            <View style={styles.bottomRightView}>
              <Button
                style={
                  this.state.isSaveAs && this.state.saveAsName === ''
                    ? styles.cutButtonDisable
                    : styles.cutButton
                }
                titleStyle={
                  this.state.isSaveAs && this.state.saveAsName === ''
                    ? styles.cutTitleDisable
                    : styles.cutTitle
                }
                title={getLanguage(this.props.language).Map_Main_Menu.CLIP}
                //"裁剪"
                onPress={this.cut}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      )
    }
  }

  renderDSItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.dsItem}
        onPress={() => this.dsItemAction({ item, index })}
      >
        <Image
          resizeMode="contain"
          style={styles.dsItemIcon}
          source={require('../../../../assets/Mine/mine_my_online_data.png')}
        />
        <Text style={styles.dsItemText}>{item.alias}</Text>
      </TouchableOpacity>
    )
  }

  /** 选择数据源弹出框 **/
  renderDSList = () => {
    return (
      <View style={[styles.popView, { width: '100%' }]}>
        <FlatList
          data={this.state.datasources}
          style={styles.dsList}
          renderItem={this.renderDSItem}
          keyExtractor={item => item.alias}
          ItemSeparatorComponent={() => (
            <View
              style={{
                backgroundColor: color.separateColorGray,
                flex: 1,
                height: 1,
              }}
            />
          )}
        />
        <TouchableOpacity
          style={[styles.closeDSBtn, { width: '100%' }]}
          onPress={() => this.dsModal && this.dsModal.setVisible(false)}
        >
          <Text style={styles.closeText}>
            {getLanguage(this.props.language).Prompt.CANCEL}
            {/* 关闭 */}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 选择数据源弹框 **/
  renderDS = () => {
    return (
      <PopView ref={ref => (this.dsModal = ref)}>{this.renderDSList()}</PopView>
    )
  }

  /** 设置弹框 **/
  renderSetting = () => {
    return (
      <MapCutSetting
        language={this.props.language}
        ref={ref => (this.settingModal = ref)}
        currentUser={this.props.currentUser}
        datasources={this.state.datasources}
        configAction={settings => {
          this.setState(state => {
            const extraData = new Map(state.extraData)
            // 只改变非disable的选项
            extraData.forEach((value, key) => {
              let rowSelected = this.state.selected.get(key)
              if (!rowSelected) return value

              if (settings.get('ds').selected) {
                value.datasourceName = settings.get('ds').dsName
              }
              if (settings.get('range').selected) {
                value.inRangeStatus = settings.get('range').value
                  ? CheckStatus.CHECKED
                  : CheckStatus.UN_CHECK
              }
              if (
                settings.get('erase').selected &&
                value.eraseStatus !== CheckStatus.UN_CHECK_DISABLE &&
                value.eraseStatus !== CheckStatus.CHECKED_DISABLE
              ) {
                value.eraseStatus = settings.get('erase').value
                  ? CheckStatus.CHECKED
                  : CheckStatus.UN_CHECK
              }
              if (
                settings.get('exactCut').selected &&
                value.exactCutStatus !== CheckStatus.UN_CHECK_DISABLE &&
                value.exactCutStatus !== CheckStatus.CHECKED_DISABLE
              ) {
                value.exactCutStatus = settings.get('exactCut').value
                  ? CheckStatus.CHECKED
                  : CheckStatus.UN_CHECK
              }
              return value
            })
            return { extraData }
          })
        }}
      />
    )
  }

  /** 添加被裁剪图层弹框 **/
  renderAddLayers = () => {
    return (
      <MapCutAddLayer
        ref={ref => (this.addLayerModal = ref)}
        layers={this.state.outLayers}
        confirmTitle={
          getLanguage(this.props.language || GLOBAL.language).Analyst_Labels
            .CONFIRM
        }
        cancelTitle={
          getLanguage(this.props.language || GLOBAL.language).Analyst_Labels
            .CANCEL
        }
        configAction={addLayers => {
          let layers = JSON.parse(JSON.stringify(this.state.layers))
          const extraData = new Map(this.state.extraData)
          const selected = new Map(this.state.selected)
          let outLayers = JSON.parse(JSON.stringify(this.state.outLayers))
          addLayers.forEach(item => {
            for (let i = 0; i < outLayers.length; i++) {
              if (outLayers[i].name === item.name) {
                outLayers.splice(i, 1)
                break
              }
            }
            layers.push(item)

            let data = {
              inRangeStatus: CheckStatus.CHECKED,
              eraseStatus:
                item.type !== DatasetType.Text && item.type !== DatasetType.GRID
                  ? CheckStatus.UN_CHECK
                  : CheckStatus.UN_CHECK_DISABLE,
              exactCutStatus:
                item.type === DatasetType.GRID
                  ? CheckStatus.UN_CHECK
                  : CheckStatus.CHECKED_DISABLE,
              datasourceName: item.datasourceAlias,
              caption: '',
            }
            extraData.set(item.name, data)
            if (this.state.isSelectAll) {
              selected.set(item.name, true)
            }
          })

          this.setState({
            layers,
            extraData,
            selected,
            outLayers,
          })
        }}
      />
    )
  }

  render() {
    let headerL = {}
    this.state.headerBtnTitle === COMPLETE &&
      (headerL.headerLeft = (
        <TextBtn
          btnText={CANCEL}
          textStyle={styles.headerBtnTitle}
          btnClick={() => {
            if (this.state.headerBtnTitle === COMPLETE) {
              this.settingModal.reset(this.headerBtnAction)
            } else {
              this.props.navigation.goBack()
            }
          }}
        />
      ))
    return (
      <Container
        ref={ref => (this.container = ref)}
        style={styles.container}
        headerProps={{
          title: getLanguage(this.props.language).Map_Main_Menu.MAP_CLIP,
          //'地图裁剪',
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={this.state.headerBtnTitle}
              textStyle={styles.headerBtnTitle}
              btnClick={this.headerBtnAction}
            />
          ),
          ...headerL,
        }}
      >
        {this.renderTop()}
        {this.renderContent()}
        {this.renderBottom()}
        {this.renderDS()}
        {this.renderSetting()}
        {this.renderAddLayers()}
      </Container>
    )
  }
}
