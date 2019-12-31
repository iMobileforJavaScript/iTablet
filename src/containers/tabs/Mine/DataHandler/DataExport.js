import { FileTools } from '../../../../native'

async function getAvailableFileName(path, name, ext) {
  let result = await FileTools.fileIsExist(path)
  if (!result) {
    await FileTools.createDirectory(path)
  }
  let availableName = name + '.' + ext
  if (await FileTools.fileIsExist(path + '/' + availableName)) {
    for (let i = 1; ; i++) {
      availableName = name + '_' + i + '.' + ext
      if (!(await FileTools.fileIsExist(path + '/' + availableName))) {
        return availableName
      }
    }
  } else {
    return availableName
  }
}

export default {
  getAvailableFileName,
}
