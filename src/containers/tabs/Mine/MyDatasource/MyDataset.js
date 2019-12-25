import React from 'react'
import { MyDataPage } from '../component'
import { SMap, EngineType, DatasetType } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import { Toast, scaleSize } from '../../../../utils'
import { getLanguage } from '../../../../language'
import { connect } from 'react-redux'
import ExportList from '../component/ExportList'
import { Platform } from 'react-native'

class MyDataset extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.dataset
    const { params } = this.props.navigation.state
    this.state = {
      ...this.state,
      shareToLocal: true,
      title:
        params.data.name &&
        params.data.name.substr(0, params.data.name.lastIndexOf('.')),
      data: params.data,
    }
  }

  exportTypes = {
    TIF: 'tif',
    SHP: 'shp',
    MIF: 'mif',
    KML: 'kml',
    KMZ: 'kmz',
    DWG: 'dwg',
    DXF: 'dxf',
    GPX: 'gpx',
    IMG: 'img',
  }

  componentDidMount() {
    this._openDatasource().then(() => this._getSectionData(true))
  }

  componentWillUnmount() {
    SMap.closeDatasource(this.state.title)
    this.container && this.container.setLoading(false)
  }

  _openDatasource = async () => {
    try {
      let homePath = await FileTools.appendingHomeDirectory()
      let datasourceParams = {}
      datasourceParams.server = homePath + this.state.data.path
      datasourceParams.engineType = EngineType.UDB
      datasourceParams.alias = this.state.title
      await SMap.openDatasource2(datasourceParams)
    } catch (error) {
      Toast.show(getLanguage(global.language).Profile.OPEN_DATASROUCE_FAILED)
    }
  }

  getData = async () => {
    let dataset = await SMap.getDatasetsByDatasource({
      alias: this.state.title,
    })
    let data = dataset.list

    let sectionData = []
    sectionData.push({
      title: 'DATASET',
      data: data || [],
      isShowItem: true,
    })
    return sectionData
  }

  deleteData = async () => {
    try {
      if (!this.itemInfo) return false
      let datasetName = this.itemInfo.item.datasetName
      let result = await SMap.deleteDataset(this.state.title, datasetName)
      return result
    } catch (e) {
      return false
    }
  }

  exportData = async (name, exportToTemp = true) => {
    let datasetParams = Object.assign({}, this.itemInfo.item)
    let homePath = await FileTools.appendingHomeDirectory()
    let targetPath
    if (exportToTemp) {
      let tempPath = homePath + this.getRelativeTempPath()
      let availableName = await this._getAvailableFileName(
        tempPath,
        'MyExport',
        'zip',
      )
      targetPath = tempPath + availableName
      this.exportPath = targetPath
    } else {
      let exportPath = homePath + this.getRelativeExportPath()
      let availableName = await this._getAvailableFileName(
        exportPath,
        name,
        this.exportType,
      )
      targetPath = exportPath + availableName
      this.exportPath = this.getRelativeExportPath() + availableName
    }

    let result = false
    result = await SMap.exportDataset(
      this.exportType,
      targetPath,
      datasetParams,
    )

    return result
  }

  isExportable = itemInfo => {
    let datasetType = itemInfo.item.datasetType
    if (
      datasetType === DatasetType.POINT ||
      datasetType === DatasetType.LINE ||
      datasetType === DatasetType.REGION ||
      datasetType === DatasetType.TEXT ||
      datasetType === DatasetType.CAD ||
      datasetType === DatasetType.IMAGE ||
      datasetType === DatasetType.MBImage ||
      datasetType === DatasetType.GRID
    ) {
      return true
    }
    return false
  }

  showUnableExportDialog = () => {
    this.SimpleDialog.set({
      text: getLanguage(global.language).Profile.DATASET_EXPORT_NOT_SUPPORTED,
    })
    this.SimpleDialog.setVisible(true)
  }

  showSelectExportTypeDialog = () => {
    let data = []
    let datasetType = this.itemInfo.item.datasetType
    switch (datasetType) {
      case DatasetType.IMAGE:
      case DatasetType.MBImage:
      case DatasetType.GRID:
        data.push(this.exportTypes.TIF)
        data.push(this.exportTypes.IMG)
        break
      case DatasetType.CAD:
        if (Platform.OS === 'ios') {
          data.push(this.exportTypes.DWG)
          data.push(this.exportTypes.DXF)
        } else {
          data.push(this.exportTypes.MIF)
        }
        break
      case DatasetType.POINT:
      case DatasetType.LINE:
      case DatasetType.REGION:
      case DatasetType.TEXT:
        data.push(this.exportTypes.SHP)
        if (Platform.OS === 'android') {
          data.push(this.exportTypes.MIF)
        }
        data.push(this.exportTypes.KML)
        data.push(this.exportTypes.KMZ)
        // if (Platform.OS === 'ios') {
        //   data.push(this.exportTypes.DWG)
        //   data.push(this.exportTypes.DXF)
        // }
        if (datasetType === DatasetType.POINT && Platform.OS === 'android') {
          data.push(this.exportTypes.GPX)
        }
        break
      default:
        break
    }
    this.exportType = data[0]
    let dialogHeight =
      scaleSize(130) + Math.ceil(data.length / 2) * scaleSize(70)
    this.SimpleDialog.set({
      text: getLanguage(global.language).Profile.SELECT_DATASET_EXPORT_TYPE,
      confirmAction: async () => {
        if (
          this.exportType === this.exportTypes.KML ||
          this.exportType === this.exportTypes.KMZ ||
          this.exportType === this.exportTypes.GPX
        ) {
          let datasetParams = Object.assign({}, this.itemInfo.item)
          if (!(await SMap.isPrgCoordSysWGS1984(datasetParams))) {
            this.SimpleDialog.set({
              text: getLanguage(global.language).Prompt.REQUIRE_PRJ_1984,
            })
            this.SimpleDialog.setVisible(true)
            return
          }
        }
        this._onShareData(this.shareType)
      },
      renderExtra: () => this.renderExportList(data),
      dialogStyle: { height: dialogHeight },
      showTitleImage: false,
    })
    this.SimpleDialog.setVisible(true)
  }

  renderExportList = data => {
    return (
      <ExportList
        data={data}
        selectedItem={this.exportType}
        onPress={type => (this.exportType = type)}
      />
    )
  }
}

const mapStateToProps = state => ({
  user: state.user.toJS(),
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyDataset)
