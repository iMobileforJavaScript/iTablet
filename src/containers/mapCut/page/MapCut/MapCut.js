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
} from 'react-native'
import {
  Container,
  TextBtn,
  ImageButton,
  Button,
  PopModal,
} from '../../../../components'
import { scaleSize, Toast } from '../../../../utils'
import { CheckStatus, ConstInfo } from '../../../../constants'
import { color } from '../../../../styles'
import { getPublicAssets, getThemeAssets } from '../../../../assets'
import { MapCutSetting, CutListItem, MapCutAddLayer } from '../../compoents'
import { DatasetType, SMap } from 'imobile_for_reactnative'
import styles from '../../styles'

const COMPLETE = '完成'
const EDIT = '编辑'

export default class MapCut extends React.Component {
  props: {
    navigation: Object,
    nav: Object,
    map: Array,
    layers: Array,
    getLayers: () => {},
  }

  constructor(props) {
    super(props)
    const { params } = props.navigation.state
    this.state = {
      headerBtnTitle: EDIT,
      selected: (new Map(): Map<string, boolean>),
      extraData: (new Map(): Map<string, Object>),
      isSelectAll: false,
      isSaveAs: false,
      saveAsName: '',
      layers: props.layers,
      outLayers: [], // 未选中的图层
      datasources: [],
      points: (params && params.points) || [],
    }
    this.init = true
    this.changeDSData = null
  }

  componentDidMount() {
    (async function() {
      let layers = await this.props.getLayers()
      SMap.getDatasources().then(datasources => {
        this.setState({
          datasources,
        })
      })
      this.selectAll(true, layers)
    }.bind(this)())
  }

  headerBtnAction = () => {
    this.setState({
      headerBtnTitle: this.state.headerBtnTitle === EDIT ? COMPLETE : EDIT,
    })
  }
  saveMapName
  cut = () => {
    (async function() {
      try {
        this.mapNameIput && this.mapNameIput.blur()
        this.container && this.container.setLoading(true, ConstInfo.CLIPPING)
        let layersInfo = []
        this.state.selected.forEach((value, key) => {
          let layerInfo = {}
          if (!value) return
          let info = this.state.extraData.get(key)
          if (!info) return

          layerInfo.LayerName = key
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
            layerInfo.IsExactClip = info.exactCutStatus === CheckStatus.CHECKED
          }
          layerInfo.DatasourceTarget = info.datasourceName

          layersInfo.push(layerInfo)
        })

        let addition = {}
        if (this.props.map.currentMap.Template) {
          addition.Template = this.props.map.currentMap.Template
        }

        await SMap.clipMap(
          this.state.points,
          layersInfo,
          this.state.saveAsName,
          '',
          addition,
          true,
        )
        this.container && this.container.setLoading(false)
        Toast.show(ConstInfo.CLIP_SUCCESS)
      } catch (e) {
        this.container && this.container.setLoading(false)
        Toast.show(ConstInfo.CLIP_FAILED)
      }
    }.bind(this)())
  }

  _onChangeText = text => {
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
  selectAll = (isSelectAll, data = this.state.layers) => {
    if (isSelectAll !== undefined && isSelectAll === this.state.isSelectAll)
      return
    this.setState(state => {
      const selected = new Map(state.selected)
      const isSelectAll = !state.isSelectAll
      if (this.state.isSelectAll) {
        selected.clear()
      } else {
        // this.state.layers.forEach(item => {
        data.forEach(item => {
          selected.set(item.name, true)
        })
      }
      // if (JSON.stringify(state.layers) !== JSON.stringify(data)) {
      //   return { selected, isSelectAll, data }
      // }
      return { selected, isSelectAll }
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

      if (state.isSelectAll) {
        outLayers = state.layers
        selected.clear()
        extraData.clear()
      } else {
        state.layers.forEach(item => {
          if (selected.get(item.name)) {
            outLayers.push(item)
          } else {
            layers.push(item)
          }
        })

        selected.clear()
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
            <Text style={styles.topText}>图层</Text>
          </View>
          <View style={[styles.topRightView, { width: scaleSize(360) }]}>
            <Text
              style={[
                styles.topText,
                { width: scaleSize(120), marginRight: scaleSize(30) },
              ]}
            >
              目标数据源
            </Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.topView}>
          <View style={styles.topLeftView}>
            <View style={styles.selectImgView} />
            <Text style={styles.topText}>图层</Text>
          </View>
          <View style={styles.topRightView}>
            <Text style={[styles.topText, { width: scaleSize(120) }]}>
              区域内裁剪
            </Text>
            <Text style={[styles.topText, { width: scaleSize(120) }]}>
              擦除
            </Text>
            <Text style={[styles.topText, { width: scaleSize(120) }]}>
              精确裁剪
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
        showDatasource={() => this.showDatasource(item)}
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
            icon: require('../../../../assets/mapTools/icon_delete.png'),
            action: () => {
              if (this.state.selected.size === 0) return
              this.deleteLayers()
            },
          })}
          {this.renderBottomButton({
            icon: require('../../../../assets/mapTools/icon_setting.png'),
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
                  placeholder={'请输入地图名字'}
                  underlineColorAndroid="transparent"
                  onChangeText={text => this._onChangeText(text)}
                  placeholderTextColor={color.borderColor}
                />
              ) : (
                <Text style={styles.topText}>另存地图</Text>
              )}
            </View>
            <View style={styles.bottomRightView}>
              <Button
                style={styles.cutButton}
                titleStyle={styles.cutTitle}
                title="裁剪"
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
          <Text style={styles.closeText}>关闭</Text>
        </TouchableOpacity>
      </View>
    )
  }

  /** 选择数据源弹框 **/
  renderDS = () => {
    return (
      <PopModal ref={ref => (this.dsModal = ref)}>
        {this.renderDSList()}
      </PopModal>
    )
  }

  /** 设置弹框 **/
  renderSetting = () => {
    return (
      <MapCutSetting
        ref={ref => (this.settingModal = ref)}
        datasources={this.state.datasources}
        configAction={settings => {
          const extraData = new Map(this.state.extraData)
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

          this.setState({
            extraData,
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
        configAction={addLayers => {
          let layers = JSON.parse(JSON.stringify(this.state.layers))
          const extraData = new Map(this.state.extraData)
          const selected = new Map(this.state.selected)
          addLayers.forEach(item => {
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
          })
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
          title: '地图裁剪',
          navigation: this.props.navigation,
          headerRight: (
            <TextBtn
              btnText={this.state.headerBtnTitle}
              textStyle={styles.headerBtnTitle}
              btnClick={this.headerBtnAction}
            />
          ),
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
