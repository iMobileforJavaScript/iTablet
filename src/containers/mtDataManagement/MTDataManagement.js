import * as React from 'react'
import { SectionList } from 'react-native'
import {
  Container,
  ListSeparator,
  DataSetListSection,
  DataSetListItem,
  InputDialog,
  Dialog,
} from '../../components'
import { Toast } from '../../utils'
import { DataManagerTab } from './components'
import NavigationService from '../NavigationService'
import { Action, DatasetType } from 'imobile_for_reactnative'

// import styles from './styles'

export default class MTDataManagement extends React.Component {
  props: {
    navigation: Object,
  }

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    this.workspace = params.workspace
    this.mapControl = params.mapControl
    this.map = params.map
    this.cb = params.cb
    this.state = {
      dataSourceList: [],
      openList: {},
      dialogTitle: '',
      dialogLabel: '',
      currentData: {
        name: '',
      },
    }
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    this.container.setLoading(true)
    try {
      let list = []
      let count = await this.workspace.getDatasourcesCount()
      for (let i = 0; i < count; i++) {
        let dataSetList = []
        let dataSource = await this.workspace.getDatasource(i)
        let name = await this.workspace.getDatasourceAlias(i)
        let datasetsCount = await dataSource.getDatasetCount()
        for (let j = 0; j < datasetsCount; j++) {
          let dataset = await dataSource.getDataset(j)
          let dsName = await dataset.getName()
          let dsType = await dataset.getType()

          dataSetList.push({
            name: dsName,
            type: dsType,
            dataset: dataset,
            datasource: dataSource,
            section: i,
            key: i + '-' + dsName,
          })

          if (dsType === DatasetType.Network) {
            let dv = await dataset.toDatasetVector()
            let subDataset = await dv.getChildDataset()
            let subDatasetName = await subDataset.getName()
            let subDatasetType = await subDataset.getType()
            if (subDataset) {
              dataSetList.push({
                name: subDatasetName,
                type: subDatasetType,
                datasource: dataSource,
                dataset: subDataset,
                section: i,
                key: 'sub-' + i + '-' + subDatasetName,
              })
            }
          }
        }

        list.push({
          key: name,
          isShow: true,
          data: dataSetList,
          index: i,
          datasource: dataSource,
        })
      }
      await this.mapControl.setAction(Action.PAN)
      this.setState(
        {
          dataSourceList: list,
        },
        () => {
          this.container.setLoading(false)
        },
      )
    } catch (e) {
      this.container.setLoading(false)
    }
  }

  showSection = (section, isShow?: boolean) => {
    let newData = this.state.dataSourceList
    if (isShow === undefined) {
      section.isShow = !section.isShow
    } else {
      section.isShow = isShow
    }
    newData[section.index] = section
    this.setState({
      dataSourceList: newData.concat(),
    })
  }

  select = data => {
    let newList = this.state.openList
    if (newList[data.section + '-' + data.name]) {
      delete newList[data.section + '-' + data.name]
    } else {
      newList[data.section + '-' + data.name] = data
    }
    this.setState({
      openList: newList,
    })
  }

  _dSource = () => {
    NavigationService.navigate('NewDSource', {
      workspace: this.workspace,
      map: this.map,
      cb: this.getData,
    })
  }

  _dSet = () => {
    NavigationService.navigate('ChooseDatasource', {
      workspace: this.workspace,
      map: this.map,
      data: this.state.dataSourceList,
      cb: this.getData,
    })
  }

  addToMap = item => {
    (async function() {
      try {
        let id = await this.map.addLayer(item.data.dataset, true)
        if (id) {
          Toast.show('添加图层成功')
        } else {
          Toast.show('添加图层失败')
        }
      } catch (e) {
        Toast.show('添加图层失败')
      }

      // this.props.navigation.goBack()
    }.bind(this)())
  }

  showRenameDialog = item => {
    let data = item.data
    this.setState(
      {
        dialogTitle: data.dataset ? '数据集重命名' : '数据源重命名',
        dialogLabel: data.dataset ? '数据集名称' : '数据源名称',
        currentData: data,
      },
      () => {
        this.renameDialog && this.renameDialog.setDialogVisible(true)
      },
    )
  }

  showDeleteDialog = item => {
    let data = item.data
    this.setState(
      {
        dialogTitle: '提示',
        dialogLabel: data.dataset
          ? '是否要删除数据集' + data.name + '?\n删除后不可恢复'
          : '是否要关闭数据源' + data.name + '?',
        currentData: data,
      },
      () => {
        this.deleteDialog && this.deleteDialog.setDialogVisible(true)
      },
    )
  }

  rename = text => {
    if (!text) {
      Toast.show('请输入名称')
      return
    }
    if (this.state.currentData.name === text) {
      Toast.show('请输修改名称')
      return
    }
    (async function() {
      try {
        if (this.state.currentData.dataset) {
          // 重命名数据集
          await this.renameDataset(text)
        } else {
          await this.renameDatasource(text)
        }
      } catch (e) {
        Toast.show('重命名失败')
      }
      // this.props.navigation.goBack()
    }.bind(this)())
  }

  /**
   * 修改数据名称
   * @param text
   */
  renameDataset = text => {
    (async function() {
      if (await this.state.currentData.dataset.isopen()) {
        await this.state.currentData.dataset.close()
      }
      await this.state.currentData.dataset.setName(text)
      Toast.show('重命名成功')
      this.renameDialog && this.renameDialog.setDialogVisible(false)
      await this.map.refresh()
      await this.getData()
    }.bind(this)())
  }

  /**
   * 修改数据源名称
   * @param text
   */
  renameDatasource = text => {
    (async function() {
      try {
        let alias = await this.state.currentData.datasource.getAlias()
        await this.workspace.renameDatasource(alias, text)
        Toast.show('重命名成功')
        this.renameDialog && this.renameDialog.setDialogVisible(false)
        await this.map.refresh()
        await this.getData()
      } catch (e) {
        Toast.show('重命名失败')
      }
    }.bind(this)())
  }

  delete = () => {
    (async function() {
      try {
        if (this.state.currentData.dataset) {
          // 删除数据集
          let layers = await this.map.getLayersByType(
            this.state.currentData.type,
          )
          // 先从map中移除含该数据集的图层
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].datasetName === this.state.currentData.name) {
              await this.map.removeLayer(layers[i].name)
            }
          }
          // 关闭该数据集
          await this.state.currentData.dataset.close()
          // 删除该数据集
          await this.state.currentData.datasource.deleteDataset(
            this.state.currentData.name,
          )
          await this.map.refresh()
        } else {
          // 关闭数据源
          let connInfo = await this.state.currentData.datasource.getConnectionInfo()
          let alias = await connInfo.getAlias()
          if (await this.state.currentData.datasource.isOpened()) {
            await this.map.close()
            await this.workspace.closeDatasource(alias)
          }
        }
        this.deleteDialog && this.deleteDialog.setDialogVisible(false)
        await this.getData()
      } catch (e) {
        Toast.show('删除失败')
      }
    }.bind(this)())
  }

  attribute = item => {
    (async function() {
      // let recordset = await (await item.data.dataset.toDatasetVector()).getRecordset(false, CursorType.DYNAMIC)
      NavigationService.navigate('LayerAttributeEdit', {
        dataset: item.data.dataset,
      })
    }.bind(this)())
  }

  attrTable = item => {
    (async function() {
      // let recordset = await (await item.data.dataset.toDatasetVector()).getRecordset(false, CursorType.DYNAMIC)
      NavigationService.navigate('LayerAttribute', {
        dataset: item.data.dataset,
      })
    }.bind(this)())
  }

  getSectionOption = item => {
    return [
      {
        key: '重命名',
        name: item.key,
        datasource: item.datasource,
        action: data => this.showRenameDialog(data),
      },
      {
        key: '关闭',
        name: item.key,
        datasource: item.datasource,
        action: data => this.showDeleteDialog(data),
      },
    ]
  }

  getOption = item => {
    let itemData = {
      name: item.name,
      dataset: item.dataset,
      datasource: item.datasource,
      type: item.type,
    }
    return [
      {
        key: '添加到当前地图',
        ...itemData,
        action: data => this.addToMap(data),
      },
      {
        key: '重命名',
        ...itemData,
        action: data => this.showRenameDialog(data),
      },
      { key: '删除', ...itemData, action: data => this.showDeleteDialog(data) },
      { key: '属性', ...itemData, action: data => this.attribute(data) },
      { key: '浏览属性表', ...itemData, action: data => this.attrTable(data) },
    ]
  }

  _renderSetion = ({ section }) => {
    return (
      <DataSetListSection
        data={section}
        onPress={this.showSection}
        options={this.getSectionOption(section)}
      />
    )
  }

  _renderItem = ({ item }) => {
    return (
      <DataSetListItem
        hidden={!this.state.dataSourceList[item.section].isShow}
        data={item}
        height={60}
        onPress={this.select}
        options={this.getOption(item)}
      />
    )
  }

  _renderItemSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _renderSectionSeparatorComponent = ({ section }) => {
    return section.isShow ? <ListSeparator /> : null
  }

  _keyExtractor = item => item.key + item.index

  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '数据管理',
          navigation: this.props.navigation,
        }}
      >
        <DataManagerTab dSource={this._dSource} dSet={this._dSet} />
        <SectionList
          renderSectionHeader={this._renderSetion}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          sections={this.state.dataSourceList}
          ItemSeparatorComponent={this._renderItemSeparatorComponent}
          SectionSeparatorComponent={this._renderSectionSeparatorComponent}
        />
        <InputDialog
          ref={ref => (this.renameDialog = ref)}
          title={this.state.dialogTitle}
          label={this.state.dialogLabel}
          value={this.state.currentData.name}
          confirmAction={this.rename}
        />
        <Dialog
          ref={ref => (this.deleteDialog = ref)}
          type={Dialog.Type.MODAL}
          title={this.state.dialogTitle}
          info={this.state.dialogLabel}
          confirmAction={this.delete}
        />
      </Container>
    )
  }
}
