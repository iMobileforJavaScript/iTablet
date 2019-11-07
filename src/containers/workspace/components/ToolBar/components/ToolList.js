import React from 'react'
import { color } from '../../../../../styles'
import { Toast, dataUtil, scaleSize } from '../../../../../utils'
import {
  ConstToolType,
  ConstPath,
  ConstOnline,
  UserType,
  ToolbarType,
} from '../../../../../constants'
import { getLanguage } from '../../../../../language'
import ToolBarSectionList from './ToolBarSectionList'

import { FileTools } from '../../../../../native'
import NavigationService from '../../../../NavigationService'
import { SMap, SMediaCollector, Action } from 'imobile_for_reactnative'
import ToolbarBtnType from '../ToolbarBtnType'
import ToolbarModule from '../modules/ToolbarModule'

export default class ToolList extends React.Component {
  props: {
    type: string,
    containerType: string,
    language: string,
    device: Object,
    user: Object,
    data: Array,
    setContainerLoading: () => {}, //多选刷新列表时调用
    saveMap: () => {},
    closeMap: () => {},
    openWorkspace: () => {},
    setCollectionInfo: () => {},
    setCurrentTemplateInfo: () => {},
    setCurrentPlotInfo: () => {},
    setTemplate: () => {},
    mapMoveToCurrent: () => {},
    getLayers: () => {},
    existFullMap: () => {},
    setCurrentLayer: () => {},
    setToolbarVisible: () => {},
    getMapSetting: () => {},
  }

  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || [],
      listExpressions: [],
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextProps) !== JSON.stringify(this.props) ||
      JSON.stringify(nextState) !== JSON.stringify(this.state)
    ) {
      return true
    }

    return false
  }

  componentDidUpdate() {
    if (JSON.stringify(this.props.data) !== JSON.stringify(this.state.data)) {
      this.setState({
        data: this.props.data,
      })
    }
  }

  /**点击item切换专题字段，刷新字段表达式列表 */
  refreshList = item => {
    let data = JSON.parse(JSON.stringify(this.state.data[0].data))
    for (let index = 0; index < data.length; index++) {
      const element = data[index]
      if (element.expression === item) {
        element.isSelected = true
      } else {
        element.isSelected = false
      }
    }
    let datalist = [
      {
        title: this.state.data.datasetName,
        datasetType: this.state.data.datasetType,
        expressionType: true,
        data: data,
      },
    ]
    this.setState({
      data: datalist,
    })
  }

  //滚动到顶部
  scrollListToLocation = () => {
    this.toolBarSectionList &&
      this.toolBarSectionList.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewOffset: scaleSize(80),
        viewPosition: 0,
      })
  }

  //滚动到指定位置
  scrollListTo = (sectionIndex, itemIndex) => {
    this.toolBarSectionList &&
      this.toolBarSectionList.scrollToLocation({
        sectionIndex: sectionIndex,
        itemIndex: itemIndex,
        viewOffset: scaleSize(80),
      })
  }

  headerAction = ({ section }) => {
    (async function() {
      if (
        ToolbarModule.getData().actions &&
        ToolbarModule.getData().actions.headerAction
      ) {
        // ToolbarModule.getData().actions.listAction({ item, index, section })
        ToolbarModule.getData().actions.headerAction(this.props.type, section)
        return
      }
      if (
        section.title ===
        getLanguage(this.props.language).Map_Main_Menu.CREATE_WITH_SYMBOLS
      ) {
        let userPath =
          this.props.user.currentUser.userName &&
          this.props.user.currentUser.userType !== UserType.PROBATION_USER
            ? ConstPath.UserPath + this.props.user.currentUser.userName + '/'
            : ConstPath.CustomerPath
        let mapPath = await FileTools.appendingHomeDirectory(
          userPath + ConstPath.RelativePath.Map,
        )
        let newName = await FileTools.getAvailableMapName(mapPath, 'DefaultMap')
        NavigationService.navigate('InputPage', {
          headerTitle: getLanguage(this.props.language).Map_Main_Menu
            .START_NEW_MAP,
          //'新建地图',
          value: newName,
          placeholder: getLanguage(this.props.language).Prompt.ENTER_MAP_NAME,
          type: 'name',
          cb: async value => {
            GLOBAL.Loading &&
              GLOBAL.Loading.setLoading(
                true,
                getLanguage(this.props.language).Prompt.CREATING,
                //ConstInfo.MAP_SYMBOL_COLLECTION_CREATING,
              )
            // 移除地图上所有callout
            SMediaCollector.removeMedias()
            await this.props.closeMap()
            this.props.setCollectionInfo() // 清空当前模板
            this.props.setCurrentTemplateInfo() // 清空当前模板
            this.props.setCurrentPlotInfo() //清空模板
            this.props.setTemplate() // 清空模板

            // 重新打开工作空间，防止Resource被删除或破坏
            const customerPath =
              ConstPath.CustomerPath + ConstPath.RelativeFilePath.Workspace
            let wsPath
            if (this.props.user.currentUser.userName) {
              const userWSPath =
                ConstPath.UserPath +
                this.props.user.currentUser.userName +
                '/' +
                ConstPath.RelativeFilePath.Workspace
              wsPath = await FileTools.appendingHomeDirectory(userWSPath)
            } else {
              wsPath = await FileTools.appendingHomeDirectory(customerPath)
            }
            await this.props.openWorkspace({ server: wsPath })
            await SMap.openDatasource(
              ConstOnline['Google'].DSParams,
              // ConstOnline['Google'].layerIndex,
              1,
            )

            let layers = await this.props.getLayers()
            await SMap.openTaggingDataset(this.props.user.currentUser.userName)
            // 检查是否有可显示的标注图层，并把多媒体标注显示到地图上
            await SMap.getTaggingLayers(
              this.props.user.currentUser.userName,
            ).then(dataList => {
              dataList.forEach(item => {
                if (item.isVisible) {
                  SMediaCollector.showMedia(item.name)
                }
              })
            })
            // 隐藏底图
            await SMap.setLayerVisible(layers[layers.length - 1].path, true)

            this.props.mapMoveToCurrent()

            this.props.saveMap &&
              (await this.props.saveMap({
                mapName: value,
                nModule: GLOBAL.Type,
                notSaveToXML: true,
              }))

            GLOBAL.Loading && GLOBAL.Loading.setLoading(false)
            NavigationService.goBack()
            setTimeout(async () => {
              this.props.setToolbarVisible(false)
              if (GLOBAL.legend) {
                await SMap.addLegendListener({
                  legendContentChange: GLOBAL.legend._contentChange,
                })
              }
              Toast.show(
                getLanguage(this.props.language).Prompt.CREATE_SUCCESSFULLY,
              )
            }, 1000)
          },
        })
      }
    }.bind(this)())
  }

  listAction = ({ item, index, section, ...params }) => {
    if (this.props.type === 'MAP3D_BASE') return
    if (
      ToolbarModule.getData().actions &&
      ToolbarModule.getData().actions.listAction
    ) {
      // ToolbarModule.getData().actions.listAction({ item, index, section })
      params.refreshList = this.refreshList
      ToolbarModule.getData().actions.listAction(this.props.type, {
        item,
        index,
        section,
        ...params,
      })
      return
    }
    if (item.action) {
      item.action && item.action()
    }
    // else if (this.props.type === ConstToolType.MAP_ADD_LAYER) {
    //   (async function() {
    //     this.props.setContainerLoading &&
    //       this.props.setContainerLoading(
    //         true,
    //         getLanguage(this.props.language).Prompt.READING_DATA,
    //       )
    //     this.path = await FileTools.appendingHomeDirectory(item.path)
    //     SMap.getUDBName(this.path).then(list => {
    //       let dataList = [
    //         {
    //           title: '数据集',
    //           data: list,
    //         },
    //       ]
    //       this.setState(
    //         {
    //           data: dataList,
    //           type: ConstToolType.MAP_ADD_DATASET,
    //         },
    //         () => {
    //           this.scrollListToLocation()
    //           this.props.setContainerLoading &&
    //             this.props.setContainerLoading(false)
    //         },
    //         () => {
    //           this.props.setContainerLoading &&
    //             this.props.setContainerLoading(false)
    //         },
    //       )
    //       // this.setLastState()
    //     })
    //   }.bind(this)())
    // } else if (this.props.type === ConstToolType.MAP_ADD_DATASET) {
    //   (async function() {
    //     let udbName = dataUtil.getNameByURL(this.path)
    //     let udbpath = {
    //       server: this.path,
    //       alias: udbName,
    //       engineType: 219,
    //     }
    //     let result = await SMap.openDatasource(udbpath, index)
    //     Toast.show(
    //       result === true
    //         ? getLanguage(this.props.language).Prompt.ADD_SUCCESS
    //         : ConstInfo.ADD_FAILED,
    //     )
    //   }.bind(this)())
    // } else if (this.props.type === ConstToolType.MAP_PLOTTING_ANIMATION_ITEM) {
    //   // 选择某一个推演动画xml加载
    //   // this.getAnimationList(item)
    // } else if (this.props.type === ConstToolType.MAP_THEME_ADD_DATASET) {
    // }
    else if (this.props.type === ConstToolType.NETDATA) {
      if (item.name === '室外数据') {
        (async function() {
          let data = []
          let maplist = await SMap.getNavigationData()
          if (maplist && maplist.length > 0) {
            let userList = []
            maplist.forEach(item => {
              let name = item.dataset
              item.title = name
              item.name = name.split('.')[0]
              item.image = require('../../../../../assets/Navigation/network.png')
              userList.push(item)
            })
          }
          data.push({
            title: getLanguage(global.language).Map_Main_Menu.NETWORK,
            //'路网',
            image: require('../../../../../assets/Navigation/network_white.png'),
            data: maplist || [],
          })

          this.props.setToolbarVisible(true, ConstToolType.NETWORK, {
            containerType: 'list',
            height: ConstToolType.THEME_HEIGHT[4],
            data,
          })
        }.bind(this)())
      } else if (item.name === '室内数据') {
        (async function() {
          let data = []
          let userUDBPath, userUDBs
          //过滤掉标注和标绘匹配正则
          let checkLabelAndPlot = /^(Label_|PlotEdit_(.*)@)(.*)#$/
          if (
            this.props.user &&
            this.props.user.currentUser.userName &&
            this.props.user.currentUser.userType !== UserType.PROBATION_USER
          ) {
            let userPath =
              (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
              this.props.user.currentUser.userName +
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
              item.image = require('../../../../../assets/mapToolbar/list_type_udb_black.png')
              item.info = {
                infoType: 'mtime',
                lastModifiedDate: item.mtime,
              }
            })
            data = [
              // {
              //   title: Const.PUBLIC_DATA_SOURCE,
              //   data: customerUDBs,
              // },
              {
                title: getLanguage(this.props.language).Map_Main_Menu
                  .OPEN_DATASOURCE,
                //Const.DATA_SOURCE,
                image: require('../../../../../assets/mapToolbar/list_type_udbs.png'),
                data: filterUDBs,
              },
            ]
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
              item.image = require('../../../../../assets/mapToolbar/list_type_udb_black.png')
              item.info = {
                infoType: 'mtime',
                lastModifiedDate: item.mtime,
              }
            })
            data = [
              {
                title: getLanguage(this.props.language).Map_Main_Menu
                  .OPEN_DATASOURCE,
                //Const.DATA_SOURCE,
                image: require('../../../../../assets/mapToolbar/list_type_udbs.png'),
                data: filterUDBs,
              },
            ]
          }
          this.props.setToolbarVisible(true, ConstToolType.INDOORDATA, {
            containerType: 'list',
            height: ConstToolType.THEME_HEIGHT[4],
            data,
          })
        }.bind(this)())
      }
    } else if (this.props.type === ConstToolType.NETWORK) {
      (async function() {
        // await FileTools.appendingHomeDirectory() + ConstPath.CachePath
        GLOBAL.navidataset = item.dataset
        let data = [],
          path =
            (await FileTools.appendingHomeDirectory(
              this.props.user && this.props.user.currentUser.userName
                ? ConstPath.UserPath +
                    this.props.user.currentUser.userName +
                    '/'
                : ConstPath.CustomerPath,
            )) + ConstPath.RelativePath.Datasource
        let userFileList

        userFileList = await FileTools.getNetModel(path)

        if (userFileList && userFileList.length > 0) {
          let userList = []
          userFileList.forEach(item => {
            let name = item.name
            item.title = name
            item.name = name.split('.')[0]
            item.image = require('../../../../../assets/Navigation/snm_model.png')
            userList.push(item)
          })
        }
        data.push({
          title: getLanguage(global.language).Map_Main_Menu.NETMODEL,
          //'网络模型',
          image: require('../../../../../assets/Navigation/network_white.png'),
          data: userFileList || [],
        })
        this.props.setToolbarVisible(true, ConstToolType.NETMODEL, {
          containerType: 'list',
          height: ConstToolType.THEME_HEIGHT[4],
          data,
        })
      }.bind(this)())
    } else if (this.props.type === ConstToolType.NETMODEL) {
      let path = GLOBAL.homePath + item.path
      SMap.startNavigation(GLOBAL.navidataset, path)
      this.props.setToolbarVisible(false)
      this.props.existFullMap()
      GLOBAL.HASCHOSE = true
      NavigationService.navigate('NavigationView')
    } else if (this.props.type === ConstToolType.INDOORDATA) {
      (async function() {
        GLOBAL.SELECTDATASOURCE = item.name
        let name = item.name
        let data = []
        let maplist = await SMap.getLineDataset(name)
        if (maplist && maplist.length > 0) {
          let userList = []
          maplist.forEach(item => {
            let name = item.dataset
            item.title = name
            item.name = name.split('.')[0]
            item.image = require('../../../../../assets/Navigation/network.png')
            userList.push(item)
          })
        }
        data.push({
          title: getLanguage(global.language).Map_Main_Menu.NETDATA,
          //'选择数据集',
          image: require('../../../../../assets/Navigation/network_white.png'),
          data: maplist || [],
        })
        this.props.setToolbarVisible(true, ConstToolType.LINEDATASET, {
          containerType: 'list',
          height: ConstToolType.THEME_HEIGHT[4],
          data,
          isFullScreen: false,
          buttons: [ToolbarBtnType.CANCEL_INCREMENT],
        })
      }.bind(this)())
    } else if (this.props.type === ConstToolType.LINEDATASET) {
      (async function() {
        if (GLOBAL.NAVIGATIONHEADLEFTCLICK) {
          this.props.setToolbarVisible(
            true,
            ConstToolType.MAP_TOOL_GPSINCREMENT,
            {
              containerType: 'table',
              column: 4,
              isFullScreen: false,
              height: ConstToolType.HEIGHT[0],
            },
          )
        } else {
          SMap.setLabelColor()
          SMap.setAction(Action.DRAWLINE)
          this.props.setToolbarVisible(true, ConstToolType.MAP_TOOL_INCREMENT, {
            containerType: 'table',
            column: 4,
            isFullScreen: false,
            height: ConstToolType.HEIGHT[0],
          })
        }
        await SMap.addNetWorkDataset(item.name)
        GLOBAL.LINEDATASET = item.name
      }.bind(this)())
    } else if (this.props.type === ConstToolType.NETWORKDATASET) {
      (async function() {
        await SMap.buildNetwork(GLOBAL.LINEDATASET, item.name)
        this.closeIncrement()
      }.bind(this)())
    }
  }

  render() {
    return (
      <ToolBarSectionList
        ref={ref => (this.toolBarSectionList = ref)}
        listSelectable={this.props.containerType === ToolbarType.selectableList}
        sections={this.state.data}
        itemAction={({ item, index, section, ...params }) => {
          this.listAction({ item, index, section, ...params })
        }}
        selectList={this.state.listExpressions}
        listSelectableAction={({ selectList }) => {
          if (
            ToolbarModule.getData().actions &&
            ToolbarModule.getData().actions.listSelectableAction
          ) {
            ToolbarModule.getData().actions.listSelectableAction({ selectList })
          }
          this.setState({
            listExpressions: selectList,
          })
        }}
        headerAction={this.headerAction}
        underlayColor={color.item_separate_white}
        keyExtractor={(item, index) => index}
        device={this.props.device}
      />
    )
  }
}
