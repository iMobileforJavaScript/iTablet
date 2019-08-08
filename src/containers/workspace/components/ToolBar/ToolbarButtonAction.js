/**
 * Toolbar底部按钮独立事件
 */
import { Toast } from '../../../../utils'
import { getLanguage } from '../../../../language'
import NavigationService from '../../../../containers/NavigationService'
import { SMap } from 'imobile_for_reactnative'

async function showAttribute(selection) {
  if (selection.length === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  let attributes = await SMap.getSelectionAttributeByLayer(
    selection[0].layerInfo.path,
    0,
    1,
  )
  if (attributes.total === 0) {
    Toast.show(getLanguage(GLOBAL.language).Prompt.NON_SELECTED_OBJ)
    return
  }

  let selectObjNums = 0
  selection.forEach(item => {
    selectObjNums += item.ids.length
  })
  selectObjNums === 0 &&
    Toast.show(getLanguage(this.props.language).Prompt.NON_SELECTED_OBJ)

  NavigationService.navigate(
    'LayerSelectionAttribute',
    GLOBAL.SelectedSelectionAttribute && {
      selectionAttribute: GLOBAL.SelectedSelectionAttribute,
    },
  )
}

export default {
  showAttribute,
}
