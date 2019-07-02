import { fromJS } from 'immutable'
import { handleActions } from 'redux-actions'
import { ConstPath } from '../constants'
import { FileTools } from '../native'
import { DatasetType, SMap, EngineType } from 'imobile_for_reactnative'
// Constants
// --------------------------------------------------
export const LOCAL_DATA_GET_DATASOURCES = 'LOCAL_DATA_GET_DATASOURCES'

// Actions
// --------------------------------------------------
export const getUdbAndDs = (params = {}, cb = () => {}) => async dispatch => {
  let udbPath =
    (await FileTools.appendingHomeDirectory(ConstPath.UserPath)) +
    params.userName +
    '/' +
    ConstPath.RelativePath.Datasource

  let udbs = await FileTools.getPathListByFilter(udbPath, {
    extension: 'udb',
    type: 'file',
  })
  let dataSourceAndSets = []
  for (let i = 0; i < udbs.length; i++) {
    let dataSource = udbs[i]
    let alias = dataSource.path.substr(
      dataSource.path.lastIndexOf('/') + 1,
      dataSource.path.lastIndexOf('.') - dataSource.path.lastIndexOf('/') - 1,
    )
    let udbPath = await FileTools.appendingHomeDirectory(dataSource.path)
    let datasets = await SMap.getDatasetsByExternalDatasource({
      server: udbPath,
      alias: alias,
      engineType: EngineType.UDB,
    })

    let dss = []
    for (let j = 0; j < datasets.length; j++) {
      if (datasets[j].datasetType === DatasetType.Network) {
        datasets[j].title = datasets[j].datasetName
        datasets[j].parentTitle = datasets[j].datasourceName
        dss.push(datasets[j])
      }
    }

    if (dss.length > 0) {
      dataSourceAndSets.push({
        title: alias,
        server: udbPath,
        engineType: EngineType.UDB,
        data: dss,
      })
    }
  }
  await dispatch({
    type: LOCAL_DATA_GET_DATASOURCES,
    payload: dataSourceAndSets,
  })
  cb && cb()
}

const initialState = fromJS({
  userUdbAndDs: [], // 指定用户目录下的数据源和其中的数据集
})

export default handleActions(
  {
    [`${LOCAL_DATA_GET_DATASOURCES}`]: (state, { payload }) => {
      return state.setIn(['userUdbAndDs'], fromJS(payload))
    },
  },
  initialState,
)
