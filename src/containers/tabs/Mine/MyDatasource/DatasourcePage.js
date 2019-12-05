import { MyDataPage } from '../component'
import { SMap, EngineType } from 'imobile_for_reactnative'
import { FileTools } from '../../../../native'
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'

class DatasourcePage extends MyDataPage {
  constructor(props) {
    super(props)
    this.type = this.types.dataset
    const { params } = this.props.navigation.state
    this.state = {
      ...this.state,
      title:
        params.data.name &&
        params.data.name.substr(0, params.data.name.lastIndexOf('.')),
      data: params.data,
    }
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

  getItemPopupData = () => [
    {
      title: getLanguage(global.language).Profile.DELETE_DATASET,
      action: this.showDeleteConfirmDialog,
    },
  ]
}

export default DatasourcePage
