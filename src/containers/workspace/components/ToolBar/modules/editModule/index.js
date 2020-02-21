import EditData from './EditData'
import EditAction from './EditAction'
import ToolbarModule from '../ToolbarModule'
import { ConstToolType } from '../../../../../../constants'
import { getLanguage } from '../../../../../../language'
import { Toast } from '../../../../../../utils'
import { SMap, Action } from 'imobile_for_reactnative'

export async function action(type) {
  const _data = await EditData.getData(type)
  const params = ToolbarModule.getParams()
  params.showFullMap && params.showFullMap(true)
  params.setToolbarVisible(true, ConstToolType.MAP_EDIT_DEFAULT, {
    isFullScreen: false,
    // height: ConstToolType.HEIGHT[3],
    height: 0,
    column: params.device.orientation === 'LANDSCAPE' ? 5 : 4,
    cb: () => SMap.setAction(Action.SELECT),
  })
  Toast.show(getLanguage(params.language).Prompt.PLEASE_SELECT_OBJECT)
  let data = {
    type: ConstToolType.MAP_EDIT_DEFAULT,
    getData: EditData.getData,
    data: _data,
    actions: EditAction,
  }
  ToolbarModule.setData(data)
}

export default function(type, title, customAction) {
  return {
    key: title,
    title: title,
    action: () => {
      if (customAction === false) {
        return
      } else if (typeof customAction === 'function') {
        customAction(type)
      } else {
        action(type)
      }
    },
    size: 'large',
    image: require('../../../../../../assets/function/icon_edit.png'),
    getData: EditData.getData,
    actions: EditAction,
  }
}
