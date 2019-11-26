import * as React from 'react'
import { getLanguage } from '../../../../../language'

import { Picker as LinkPicker } from '../../../../../components'

function getData() {
  let option = [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_CONTRAST,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.STYLE_BRIGHTNESS,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.SATURATION,
    },
  ]
  let pickerData = [
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.FILL,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.FILL,
      children: option,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.BORDER,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.BORDER,
      children: option,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.LINE,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.LINE,
      children: option,
    },
    {
      key: getLanguage(GLOBAL.language).Map_Main_Menu.MARK,
      value: getLanguage(GLOBAL.language).Map_Main_Menu.MARK,
      children: option,
    },
  ]
  return pickerData
}

function initPicker(params = {}) {
  return (
    <LinkPicker
      ref={ref => (this.picker = ref)}
      language={GLOBAL.language}
      confirm={item => {
        if (params.confirm && typeof params.confirm === 'function') {
          params.confirm(
            item instanceof Array ? [item[0].key, item[1].key] : item,
          )
        }
      }}
      cancel={() => {
        if (params.cancel && typeof params.cancel === 'function') {
          params.cancel()
        }
      }}
      popData={getData()}
      viewableItems={3}
    />
  )
}

function toggle() {
  this.picker.setVisible()
}

export default {
  toggle,

  initPicker,
  getData,
}
