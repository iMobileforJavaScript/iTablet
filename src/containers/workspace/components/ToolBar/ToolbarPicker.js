import Picker from 'react-native-picker'
import { getLanguage } from '../../../../language'
import { size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

function init(params = {}) {
  const options = [
    getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
    getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS,
    getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
  ]

  let pickerData = [
    {
      [getLanguage(GLOBAL.language).Map_Main_Menu.FILL]: options,
    },
    {
      [getLanguage(GLOBAL.language).Map_Main_Menu.BORDER]: options,
    },
    {
      [getLanguage(GLOBAL.language).Map_Main_Menu.LINE]: options,
    },
    {
      [getLanguage(GLOBAL.language).Map_Main_Menu.MARK]: options,
    },
  ]
  let selectedValue = ['a', 2]
  Picker.init({
    pickerTitleText: '',
    pickerConfirmBtnText: getLanguage(GLOBAL.language).Map_Settings.CONFIRM,
    pickerCancelBtnText: getLanguage(GLOBAL.language).Map_Settings.CANCEL,
    pickerCancelBtnColor: [48, 48, 48, 1],
    pickerConfirmBtnColor: [48, 48, 48, 1],
    pickerTitleColor: [48, 48, 48, 1],
    pickerToolBarBg: [251, 251, 251, 1],
    pickerBg: [251, 251, 251, 1],
    pickerFontSize: size.fontSize.fontSizeLg,
    pickerToolBarFontSize: size.fontSize.fontSizeLg,
    pickerRowHeight: scaleSize(40),
    pickerData: pickerData,
    selectedValue: selectedValue,
    onPickerConfirm: data => {
      params.onPickerConfirm && params.onPickerConfirm(data)
    },
    onPickerCancel: data => {
      params.onPickerCancel && params.onPickerCancel(data)
    },
    onPickerSelect: data => {
      params.onPickerSelect && params.onPickerSelect(data)
    },
  })
}

function show() {
  Picker.show()
}

function hide() {
  Picker.hide()
}

function toggle() {
  Picker.toggle()
}

/**
 * Example: ['selected']
 */
function select(item) {
  Picker.select(item)
}

function isPickerShow() {
  return Picker.isPickerShow()
}

export default {
  init,
  show,
  hide,
  toggle,
  select,
  isPickerShow,
}
