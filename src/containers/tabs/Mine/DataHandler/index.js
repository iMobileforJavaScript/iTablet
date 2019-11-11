import DataExternal from './DataExternal'
import DataLocal from './DataLocal'
import DataImport from './DataImport'
import DataExport from './DataExport'

const DataHandler = Object.assign(
  {},
  DataExternal,
  DataLocal,
  DataImport,
  DataExport,
)
export default DataHandler
