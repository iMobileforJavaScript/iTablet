import { SCartography } from 'imobile_for_reactnative'

const lineColorSet = [
  {
    title: '选择颜色',
    data: [
      {
        backgroundColor: '#F8F8FF',
        action: () => {
          SCartography.setLineColor('#F8F8FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFC0CB',
        action: () => {
          SCartography.setLineColor('#FFC0CB', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FF0000',
        action: () => {
          SCartography.setLineColor('#FF0000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#696969',
        action: () => {
          SCartography.setLineColor('#696969', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#000000',
        action: () => {
          SCartography.setLineColor('#000000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#800080',
        action: () => {
          SCartography.setLineColor('#800080', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#4B0082',
        action: () => {
          SCartography.setLineColor('#4B0082', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFFF00',
        action: () => {
          SCartography.setLineColor('#FFFF00', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#0000FF',
        action: () => {
          SCartography.setLineColor('#0000FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#00FFFF',
        action: () => {
          SCartography.setLineColor('#00FFFF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#008000',
        action: () => {
          SCartography.setLineColor('#008000', GLOBAL.currentLayer.caption)
        },
      },
    ],
  },
]

const pointColorSet = [
  {
    title: '选择颜色',
    data: [
      {
        backgroundColor: '#F8F8FF',
        action: () => {
          SCartography.setMarkerColor('#F8F8FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFC0CB',
        action: () => {
          SCartography.setMarkerColor('#FFC0CB', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FF0000',
        action: () => {
          SCartography.setMarkerColor('#FF0000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#696969',
        action: () => {
          SCartography.setMarkerColor('#696969', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#000000',
        action: () => {
          SCartography.setMarkerColor('#000000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#800080',
        action: () => {
          SCartography.setMarkerColor('#800080', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#4B0082',
        action: () => {
          SCartography.setMarkerColor('#4B0082', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFFF00',
        action: () => {
          SCartography.setMarkerColor('#FFFF00', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#0000FF',
        action: () => {
          SCartography.setMarkerColor('#0000FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#00FFFF',
        action: () => {
          SCartography.setMarkerColor('#00FFFF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#008000',
        action: () => {
          SCartography.setMarkerColor('#008000', GLOBAL.currentLayer.caption)
        },
      },
    ],
  },
]

const regionBeforeColorSet = [
  {
    title: '选择颜色',
    data: [
      {
        backgroundColor: '#F8F8FF',
        action: () => {
          SCartography.setFillForeColor('#F8F8FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFC0CB',
        action: () => {
          SCartography.setFillForeColor('#FFC0CB', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FF0000',
        action: () => {
          SCartography.setFillForeColor('#FF0000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#696969',
        action: () => {
          SCartography.setFillForeColor('#696969', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#000000',
        action: () => {
          SCartography.setFillForeColor('#000000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#800080',
        action: () => {
          SCartography.setFillForeColor('#800080', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#4B0082',
        action: () => {
          SCartography.setFillForeColor('#4B0082', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFFF00',
        action: () => {
          SCartography.setFillForeColor('#FFFF00', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#0000FF',
        action: () => {
          SCartography.setFillForeColor('#0000FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#00FFFF',
        action: () => {
          SCartography.setFillForeColor('#00FFFF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#008000',
        action: () => {
          SCartography.setFillForeColor('#008000', GLOBAL.currentLayer.caption)
        },
      },
    ],
  },
]

const regionAfterColorSet = [
  {
    title: '选择颜色',
    data: [
      {
        backgroundColor: '#F8F8FF',
        action: () => {
          SCartography.setFillBackColor('#F8F8FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFC0CB',
        action: () => {
          SCartography.setFillBackColor('#FFC0CB', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FF0000',
        action: () => {
          SCartography.setFillBackColor('#FF0000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#696969',
        action: () => {
          SCartography.setFillBackColor('#696969', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#000000',
        action: () => {
          SCartography.setFillBackColor('#000000', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#800080',
        action: () => {
          SCartography.setFillBackColor('#800080', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#4B0082',
        action: () => {
          SCartography.setFillBackColor('#4B0082', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#FFFF00',
        action: () => {
          SCartography.setFillBackColor('#FFFF00', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#0000FF',
        action: () => {
          SCartography.setFillBackColor('#0000FF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#00FFFF',
        action: () => {
          SCartography.setFillBackColor('#00FFFF', GLOBAL.currentLayer.caption)
        },
      },
      {
        backgroundColor: '#008000',
        action: () => {
          SCartography.setFillBackColor('#008000', GLOBAL.currentLayer.caption)
        },
      },
    ],
  },
]
export {
  lineColorSet,
  pointColorSet,
  regionBeforeColorSet,
  regionAfterColorSet,
}
