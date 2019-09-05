import { Platform } from 'react-native'
import Picker from 'react-native-picker'
import { getLanguage } from '../../../../language'
import { size } from '../../../../styles'
import { scaleSize } from '../../../../utils'

let isShow = false
let _params
function init(params = {}) {
  isShow = false
  _params = params
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
      isShow = false
    },
    onPickerCancel: data => {
      params.onPickerCancel && params.onPickerCancel(data)
      isShow = false
    },
    onPickerSelect: data => {
      params.onPickerSelect && params.onPickerSelect(data)
    },
  })
}

function show() {
  _params && init(_params)
  Picker.show()
  isShow = true
}

function hide() {
  Picker.hide()
  isShow = false
}

function toggle() {
  _params && init(_params)
  Picker.toggle()
  isShow = !isShow
}

/**
 * Example: ['selected']
 */
function select(item) {
  Picker.select(item)
}

function isPickerShow() {
  // return Picker.isPickerShow()
  return isShow
}

function updateView() {
  if (isShow) {
    Platform.OS === 'ios' && show()
  } else {
    hide()
  }
}

export default {
  init,
  show,
  hide,
  toggle,
  select,
  isPickerShow,
  updateView,
}
