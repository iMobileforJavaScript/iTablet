import { SCartography, SMap } from 'imobile_for_reactnative'

const lineColorSet = [
  {
    key: '#FFFFFF',
    action: () => {
      SCartography.setLineColor('#FFFFFF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFFFF',
  },
  {
    key: '#000000',
    action: () => {
      SCartography.setLineColor('#000000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#000000',
  },
  {
    key: '#F0EDE1',
    action: () => {
      SCartography.setLineColor('#F0EDE1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0EDE1',
  },
  {
    key: '#1E477C',
    action: () => {
      SCartography.setLineColor('#1E477C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1E477C',
  },
  {
    key: '#4982BC',
    action: () => {
      SCartography.setLineColor('#4982BC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4982BC',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setLineColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#803000',
    action: () => {
      SCartography.setLineColor('#803000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#803000',
  },
  {
    key: '#BD5747',
    action: () => {
      SCartography.setLineColor('#BD5747', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BD5747',
  },
  {
    key: '#36E106',
    action: () => {
      SCartography.setLineColor('#36E106', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#36E106',
  },
  {
    key: '#9CBB58',
    action: () => {
      SCartography.setLineColor('#9CBB58', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9CBB58',
  },
  {
    key: '#8364A1',
    action: () => {
      SCartography.setLineColor('#8364A1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8364A1',
  },
  {
    key: '#4AADC7',
    action: () => {
      SCartography.setLineColor('#4AADC7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4AADC7',
  },
  {
    key: '#F89746',
    action: () => {
      SCartography.setLineColor('#F89746', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F89746',
  },
  {
    key: '#E7A700',
    action: () => {
      SCartography.setLineColor('#E7A700', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7A700',
  },
  {
    key: '#E7E300',
    action: () => {
      SCartography.setLineColor('#E7E300', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7E300',
  },
  {
    key: '#D33248',
    action: () => {
      SCartography.setLineColor('#D33248', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D33248',
  },
  {
    key: '#F1F1F1',
    action: () => {
      SCartography.setLineColor('#F1F1F1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F1F1F1',
  },
  {
    key: '#7D7D7D',
    action: () => {
      SCartography.setLineColor('#7D7D7D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7D7D7D',
  },
  {
    key: '#DDD9C3',
    action: () => {
      SCartography.setLineColor('#DDD9C3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDD9C3',
  },
  {
    key: '#C9DDF0',
    action: () => {
      SCartography.setLineColor('#C9DDF0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C9DDF0',
  },
  {
    key: '#DBE4F3',
    action: () => {
      SCartography.setLineColor('#DBE4F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE4F3',
  },
  {
    key: '#BCE8FD',
    action: () => {
      SCartography.setLineColor('#BCE8FD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BCE8FD',
  },
  {
    key: '#E5C495',
    action: () => {
      SCartography.setLineColor('#E5C495', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5C495',
  },
  {
    key: '#F4DED9',
    action: () => {
      SCartography.setLineColor('#F4DED9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F4DED9',
  },
  {
    key: '#DBE9CE',
    action: () => {
      SCartography.setLineColor('#DBE9CE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE9CE',
  },
  {
    key: '#EBF4DE',
    action: () => {
      SCartography.setLineColor('#EBF4DE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EBF4DE',
  },
  {
    key: '#E5E1ED',
    action: () => {
      SCartography.setLineColor('#E5E1ED', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5E1ED',
  },
  {
    key: '#DDF0F3',
    action: () => {
      SCartography.setLineColor('#DDF0F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDF0F3',
  },
  {
    key: '#FDECDC',
    action: () => {
      SCartography.setLineColor('#FDECDC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDECDC',
  },
  {
    key: '#FFE7C4',
    action: () => {
      SCartography.setLineColor('#FFE7C4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFE7C4',
  },
  {
    key: '#FDFACA',
    action: () => {
      SCartography.setLineColor('#FDFACA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDFACA',
  },
  {
    key: '#F09CA0',
    action: () => {
      SCartography.setLineColor('#F09CA0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F09CA0',
  },
  {
    key: '#D7D7D7',
    action: () => {
      SCartography.setLineColor('#D7D7D7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7D7D7',
  },
  {
    key: '#585858',
    action: () => {
      SCartography.setLineColor('#585858', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#585858',
  },
  {
    key: '#C6B797',
    action: () => {
      SCartography.setLineColor('#C6B797', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C6B797',
  },
  {
    key: '#8CB4EA',
    action: () => {
      SCartography.setLineColor('#8CB4EA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8CB4EA',
  },
  {
    key: '#C1CCE4',
    action: () => {
      SCartography.setLineColor('#C1CCE4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C1CCE4',
  },
  {
    key: '#7ED2F6',
    action: () => {
      SCartography.setLineColor('#7ED2F6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7ED2F6',
  },
  {
    key: '#B1894F',
    action: () => {
      SCartography.setLineColor('#B1894F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1894F',
  },
  {
    key: '#E7B8B8',
    action: () => {
      SCartography.setLineColor('#E7B8B8', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7B8B8',
  },
  {
    key: '#B0D59A',
    action: () => {
      SCartography.setLineColor('#B0D59A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B0D59A',
  },
  {
    key: '#D7E3BD',
    action: () => {
      SCartography.setLineColor('#D7E3BD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7E3BD',
  },
  {
    key: '#CDC1D9',
    action: () => {
      SCartography.setLineColor('#CDC1D9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#CDC1D9',
  },
  {
    key: '#B7DDE9',
    action: () => {
      SCartography.setLineColor('#B7DDE9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7DDE9',
  },
  {
    key: '#FAD6B1',
    action: () => {
      SCartography.setLineColor('#FAD6B1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FAD6B1',
  },
  {
    key: '#F5CE88',
    action: () => {
      SCartography.setLineColor('#F5CE88', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F5CE88',
  },
  {
    key: '#FFF55A',
    action: () => {
      SCartography.setLineColor('#FFF55A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF55A',
  },
  {
    key: '#EF6C78',
    action: () => {
      SCartography.setLineColor('#EF6C78', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EF6C78',
  },
  {
    key: '#BFBFBF',
    action: () => {
      SCartography.setLineColor('#BFBFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BFBFBF',
  },
  {
    key: '#3E3E3E',
    action: () => {
      SCartography.setLineColor('#3E3E3E', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3E3E',
  },
  {
    key: '#938953',
    action: () => {
      SCartography.setLineColor('#938953', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#938953',
  },
  {
    key: '#548ED4',
    action: () => {
      SCartography.setLineColor('#548ED4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#548ED4',
  },
  {
    key: '#98B7D5',
    action: () => {
      SCartography.setLineColor('#98B7D5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#98B7D5',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setLineColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#9A6C34',
    action: () => {
      SCartography.setLineColor('#9A6C34', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9A6C34',
  },
  {
    key: '#D79896',
    action: () => {
      SCartography.setLineColor('#D79896', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D79896',
  },
  {
    key: '#7EC368',
    action: () => {
      SCartography.setLineColor('#7EC368', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7EC368',
  },
  {
    key: '#C5DDA5',
    action: () => {
      SCartography.setLineColor('#C5DDA5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C5DDA5',
  },
  {
    key: '#B1A5C6',
    action: () => {
      SCartography.setLineColor('#B1A5C6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1A5C6',
  },
  {
    key: '#93CDDD',
    action: () => {
      SCartography.setLineColor('#93CDDD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93CDDD',
  },
  {
    key: '#F9BD8D',
    action: () => {
      SCartography.setLineColor('#F9BD8D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F9BD8D',
  },
  {
    key: '#F7B550',
    action: () => {
      SCartography.setLineColor('#F7B550', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F7B550',
  },
  {
    key: '#FFF100',
    action: () => {
      SCartography.setLineColor('#FFF100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF100',
  },
  {
    key: '#E80050',
    action: () => {
      SCartography.setLineColor('#E80050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E80050',
  },
  {
    key: '#A6A6A7',
    action: () => {
      SCartography.setLineColor('#A6A6A7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A6A6A7',
  },
  {
    key: '#2D2D2B',
    action: () => {
      SCartography.setLineColor('#2D2D2B', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#2D2D2B',
  },
  {
    key: '#494428',
    action: () => {
      SCartography.setLineColor('#494428', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#494428',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setLineColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#376192',
    action: () => {
      SCartography.setLineColor('#376192', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#376192',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setLineColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#825320',
    action: () => {
      SCartography.setLineColor('#825320', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#825320',
  },
  {
    key: '#903635',
    action: () => {
      SCartography.setLineColor('#903635', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#903635',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setLineColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#76933C',
    action: () => {
      SCartography.setLineColor('#76933C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#76933C',
  },
  {
    key: '#5E467C',
    action: () => {
      SCartography.setLineColor('#5E467C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#5E467C',
  },
  {
    key: '#31859D',
    action: () => {
      SCartography.setLineColor('#31859D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#31859D',
  },
  {
    key: '#E46C07',
    action: () => {
      SCartography.setLineColor('#E46C07', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E46C07',
  },
  {
    key: '#F39900',
    action: () => {
      SCartography.setLineColor('#F39900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F39900',
  },
  {
    key: '#B7AB00',
    action: () => {
      SCartography.setLineColor('#B7AB00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7AB00',
  },
  {
    key: '#A50036',
    action: () => {
      SCartography.setLineColor('#A50036', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A50036',
  },
  {
    key: '#979D99',
    action: () => {
      SCartography.setLineColor('#979D99', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#979D99',
  },
  {
    key: '#0C0C0C',
    action: () => {
      SCartography.setLineColor('#0C0C0C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C0C0C',
  },
  {
    key: '#1C1A10',
    action: () => {
      SCartography.setLineColor('#1C1A10', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1C1A10',
  },
  {
    key: '#0C263D',
    action: () => {
      SCartography.setLineColor('#0C263D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C263D',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setLineColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#005883',
    action: () => {
      SCartography.setLineColor('#005883', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005883',
  },
  {
    key: '#693904',
    action: () => {
      SCartography.setLineColor('#693904', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#693904',
  },
  {
    key: '#622727',
    action: () => {
      SCartography.setLineColor('#622727', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#622727',
  },
  {
    key: '#005E14',
    action: () => {
      SCartography.setLineColor('#005E14', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005E14',
  },
  {
    key: '#4F6028',
    action: () => {
      SCartography.setLineColor('#4F6028', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4F6028',
  },
  {
    key: '#3E3050',
    action: () => {
      SCartography.setLineColor('#3E3050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3050',
  },
  {
    key: '#245B66',
    action: () => {
      SCartography.setLineColor('#245B66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#245B66',
  },
  {
    key: '#974805',
    action: () => {
      SCartography.setLineColor('#974805', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#974805',
  },
  {
    key: '#AD6A00',
    action: () => {
      SCartography.setLineColor('#AD6A00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#AD6A00',
  },
  {
    key: '#8B8100',
    action: () => {
      SCartography.setLineColor('#8B8100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8B8100',
  },
  {
    key: '#7C0022',
    action: () => {
      SCartography.setLineColor('#7C0022', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7C0022',
  },
  {
    key: '#F0DCBE',
    action: () => {
      SCartography.setLineColor('#F0DCBE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0DCBE',
  },
  {
    key: '#F2B1CF',
    action: () => {
      SCartography.setLineColor('#F2B1CF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F2B1CF',
  },
  {
    key: '#D3FFBF',
    action: () => {
      SCartography.setLineColor('#D3FFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D3FFBF',
  },
  {
    key: '#00165F',
    action: () => {
      SCartography.setLineColor('#00165F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00165F',
  },
  {
    key: '#6673CB',
    action: () => {
      SCartography.setLineColor('#6673CB', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#6673CB',
  },
  {
    key: '#006EBF',
    action: () => {
      SCartography.setLineColor('#006EBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#006EBF',
  },
  {
    key: '#89CF66',
    action: () => {
      SCartography.setLineColor('#89CF66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#89CF66',
  },
  {
    key: '#70A900',
    action: () => {
      SCartography.setLineColor('#70A900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70A900',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setLineColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#93D150',
    action: () => {
      SCartography.setLineColor('#93D150', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93D150',
  },
  {
    key: '#70319F',
    action: () => {
      SCartography.setLineColor('#70319F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70319F',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setLineColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#D38968',
    action: () => {
      SCartography.setLineColor('#D38968', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D38968',
  },
  {
    key: '#FFBF00',
    action: () => {
      SCartography.setLineColor('#FFBF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFBF00',
  },
  {
    key: '#FFFF00',
    action: () => {
      SCartography.setLineColor('#FFFF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFF00',
  },
  {
    key: '#C10000',
    action: () => {
      SCartography.setLineColor('#C10000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C10000',
  },
  {
    key: '#F0F1A6',
    action: () => {
      SCartography.setLineColor('#F0F1A6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0F1A6',
  },
  {
    key: '#FF0000',
    action: () => {
      SCartography.setLineColor('#FF0000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FF0000',
  },
]

const pointColorSet = [
  {
    key: '#FFFFFF',
    action: () => {
      SCartography.setMarkerColor('#FFFFFF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFFFF',
  },
  {
    key: '#000000',
    action: () => {
      SCartography.setMarkerColor('#000000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#000000',
  },
  {
    key: '#F0EDE1',
    action: () => {
      SCartography.setMarkerColor('#F0EDE1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0EDE1',
  },
  {
    key: '#1E477C',
    action: () => {
      SCartography.setMarkerColor('#1E477C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1E477C',
  },
  {
    key: '#4982BC',
    action: () => {
      SCartography.setMarkerColor('#4982BC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4982BC',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setMarkerColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#803000',
    action: () => {
      SCartography.setMarkerColor('#803000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#803000',
  },
  {
    key: '#BD5747',
    action: () => {
      SCartography.setMarkerColor('#BD5747', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BD5747',
  },
  {
    key: '#36E106',
    action: () => {
      SCartography.setMarkerColor('#36E106', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#36E106',
  },
  {
    key: '#9CBB58',
    action: () => {
      SCartography.setMarkerColor('#9CBB58', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9CBB58',
  },
  {
    key: '#8364A1',
    action: () => {
      SCartography.setMarkerColor('#8364A1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8364A1',
  },
  {
    key: '#4AADC7',
    action: () => {
      SCartography.setMarkerColor('#4AADC7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4AADC7',
  },
  {
    key: '#F89746',
    action: () => {
      SCartography.setMarkerColor('#F89746', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F89746',
  },
  {
    key: '#E7A700',
    action: () => {
      SCartography.setMarkerColor('#E7A700', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7A700',
  },
  {
    key: '#E7E300',
    action: () => {
      SCartography.setMarkerColor('#E7E300', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7E300',
  },
  {
    key: '#D33248',
    action: () => {
      SCartography.setMarkerColor('#D33248', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D33248',
  },
  {
    key: '#F1F1F1',
    action: () => {
      SCartography.setMarkerColor('#F1F1F1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F1F1F1',
  },
  {
    key: '#7D7D7D',
    action: () => {
      SCartography.setMarkerColor('#7D7D7D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7D7D7D',
  },
  {
    key: '#DDD9C3',
    action: () => {
      SCartography.setMarkerColor('#DDD9C3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDD9C3',
  },
  {
    key: '#C9DDF0',
    action: () => {
      SCartography.setMarkerColor('#C9DDF0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C9DDF0',
  },
  {
    key: '#DBE4F3',
    action: () => {
      SCartography.setMarkerColor('#DBE4F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE4F3',
  },
  {
    key: '#BCE8FD',
    action: () => {
      SCartography.setMarkerColor('#BCE8FD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BCE8FD',
  },
  {
    key: '#E5C495',
    action: () => {
      SCartography.setMarkerColor('#E5C495', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5C495',
  },
  {
    key: '#F4DED9',
    action: () => {
      SCartography.setMarkerColor('#F4DED9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F4DED9',
  },
  {
    key: '#DBE9CE',
    action: () => {
      SCartography.setMarkerColor('#DBE9CE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE9CE',
  },
  {
    key: '#EBF4DE',
    action: () => {
      SCartography.setMarkerColor('#EBF4DE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EBF4DE',
  },
  {
    key: '#E5E1ED',
    action: () => {
      SCartography.setMarkerColor('#E5E1ED', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5E1ED',
  },
  {
    key: '#DDF0F3',
    action: () => {
      SCartography.setMarkerColor('#DDF0F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDF0F3',
  },
  {
    key: '#FDECDC',
    action: () => {
      SCartography.setMarkerColor('#FDECDC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDECDC',
  },
  {
    key: '#FFE7C4',
    action: () => {
      SCartography.setMarkerColor('#FFE7C4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFE7C4',
  },
  {
    key: '#FDFACA',
    action: () => {
      SCartography.setMarkerColor('#FDFACA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDFACA',
  },
  {
    key: '#F09CA0',
    action: () => {
      SCartography.setMarkerColor('#F09CA0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F09CA0',
  },
  {
    key: '#D7D7D7',
    action: () => {
      SCartography.setMarkerColor('#D7D7D7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7D7D7',
  },
  {
    key: '#585858',
    action: () => {
      SCartography.setMarkerColor('#585858', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#585858',
  },
  {
    key: '#C6B797',
    action: () => {
      SCartography.setMarkerColor('#C6B797', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C6B797',
  },
  {
    key: '#8CB4EA',
    action: () => {
      SCartography.setMarkerColor('#8CB4EA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8CB4EA',
  },
  {
    key: '#C1CCE4',
    action: () => {
      SCartography.setMarkerColor('#C1CCE4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C1CCE4',
  },
  {
    key: '#7ED2F6',
    action: () => {
      SCartography.setMarkerColor('#7ED2F6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7ED2F6',
  },
  {
    key: '#B1894F',
    action: () => {
      SCartography.setMarkerColor('#B1894F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1894F',
  },
  {
    key: '#E7B8B8',
    action: () => {
      SCartography.setMarkerColor('#E7B8B8', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7B8B8',
  },
  {
    key: '#B0D59A',
    action: () => {
      SCartography.setMarkerColor('#B0D59A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B0D59A',
  },
  {
    key: '#D7E3BD',
    action: () => {
      SCartography.setMarkerColor('#D7E3BD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7E3BD',
  },
  {
    key: '#CDC1D9',
    action: () => {
      SCartography.setMarkerColor('#CDC1D9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#CDC1D9',
  },
  {
    key: '#B7DDE9',
    action: () => {
      SCartography.setMarkerColor('#B7DDE9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7DDE9',
  },
  {
    key: '#FAD6B1',
    action: () => {
      SCartography.setMarkerColor('#FAD6B1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FAD6B1',
  },
  {
    key: '#F5CE88',
    action: () => {
      SCartography.setMarkerColor('#F5CE88', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F5CE88',
  },
  {
    key: '#FFF55A',
    action: () => {
      SCartography.setMarkerColor('#FFF55A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF55A',
  },
  {
    key: '#EF6C78',
    action: () => {
      SCartography.setMarkerColor('#EF6C78', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EF6C78',
  },
  {
    key: '#BFBFBF',
    action: () => {
      SCartography.setMarkerColor('#BFBFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BFBFBF',
  },
  {
    key: '#3E3E3E',
    action: () => {
      SCartography.setMarkerColor('#3E3E3E', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3E3E',
  },
  {
    key: '#938953',
    action: () => {
      SCartography.setMarkerColor('#938953', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#938953',
  },
  {
    key: '#548ED4',
    action: () => {
      SCartography.setMarkerColor('#548ED4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#548ED4',
  },
  {
    key: '#98B7D5',
    action: () => {
      SCartography.setMarkerColor('#98B7D5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#98B7D5',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setMarkerColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#9A6C34',
    action: () => {
      SCartography.setMarkerColor('#9A6C34', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9A6C34',
  },
  {
    key: '#D79896',
    action: () => {
      SCartography.setMarkerColor('#D79896', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D79896',
  },
  {
    key: '#7EC368',
    action: () => {
      SCartography.setMarkerColor('#7EC368', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7EC368',
  },
  {
    key: '#C5DDA5',
    action: () => {
      SCartography.setMarkerColor('#C5DDA5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C5DDA5',
  },
  {
    key: '#B1A5C6',
    action: () => {
      SCartography.setMarkerColor('#B1A5C6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1A5C6',
  },
  {
    key: '#93CDDD',
    action: () => {
      SCartography.setMarkerColor('#93CDDD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93CDDD',
  },
  {
    key: '#F9BD8D',
    action: () => {
      SCartography.setMarkerColor('#F9BD8D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F9BD8D',
  },
  {
    key: '#F7B550',
    action: () => {
      SCartography.setMarkerColor('#F7B550', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F7B550',
  },
  {
    key: '#FFF100',
    action: () => {
      SCartography.setMarkerColor('#FFF100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF100',
  },
  {
    key: '#E80050',
    action: () => {
      SCartography.setMarkerColor('#E80050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E80050',
  },
  {
    key: '#A6A6A7',
    action: () => {
      SCartography.setMarkerColor('#A6A6A7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A6A6A7',
  },
  {
    key: '#2D2D2B',
    action: () => {
      SCartography.setMarkerColor('#2D2D2B', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#2D2D2B',
  },
  {
    key: '#494428',
    action: () => {
      SCartography.setMarkerColor('#494428', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#494428',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setMarkerColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#376192',
    action: () => {
      SCartography.setMarkerColor('#376192', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#376192',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setMarkerColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#825320',
    action: () => {
      SCartography.setMarkerColor('#825320', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#825320',
  },
  {
    key: '#903635',
    action: () => {
      SCartography.setMarkerColor('#903635', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#903635',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setMarkerColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#76933C',
    action: () => {
      SCartography.setMarkerColor('#76933C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#76933C',
  },
  {
    key: '#5E467C',
    action: () => {
      SCartography.setMarkerColor('#5E467C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#5E467C',
  },
  {
    key: '#31859D',
    action: () => {
      SCartography.setMarkerColor('#31859D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#31859D',
  },
  {
    key: '#E46C07',
    action: () => {
      SCartography.setMarkerColor('#E46C07', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E46C07',
  },
  {
    key: '#F39900',
    action: () => {
      SCartography.setMarkerColor('#F39900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F39900',
  },
  {
    key: '#B7AB00',
    action: () => {
      SCartography.setMarkerColor('#B7AB00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7AB00',
  },
  {
    key: '#A50036',
    action: () => {
      SCartography.setMarkerColor('#A50036', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A50036',
  },
  {
    key: '#979D99',
    action: () => {
      SCartography.setMarkerColor('#979D99', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#979D99',
  },
  {
    key: '#0C0C0C',
    action: () => {
      SCartography.setMarkerColor('#0C0C0C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C0C0C',
  },
  {
    key: '#1C1A10',
    action: () => {
      SCartography.setMarkerColor('#1C1A10', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1C1A10',
  },
  {
    key: '#0C263D',
    action: () => {
      SCartography.setMarkerColor('#0C263D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C263D',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setMarkerColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#005883',
    action: () => {
      SCartography.setMarkerColor('#005883', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005883',
  },
  {
    key: '#693904',
    action: () => {
      SCartography.setMarkerColor('#693904', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#693904',
  },
  {
    key: '#622727',
    action: () => {
      SCartography.setMarkerColor('#622727', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#622727',
  },
  {
    key: '#005E14',
    action: () => {
      SCartography.setMarkerColor('#005E14', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005E14',
  },
  {
    key: '#4F6028',
    action: () => {
      SCartography.setMarkerColor('#4F6028', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4F6028',
  },
  {
    key: '#3E3050',
    action: () => {
      SCartography.setMarkerColor('#3E3050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3050',
  },
  {
    key: '#245B66',
    action: () => {
      SCartography.setMarkerColor('#245B66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#245B66',
  },
  {
    key: '#974805',
    action: () => {
      SCartography.setMarkerColor('#974805', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#974805',
  },
  {
    key: '#AD6A00',
    action: () => {
      SCartography.setMarkerColor('#AD6A00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#AD6A00',
  },
  {
    key: '#8B8100',
    action: () => {
      SCartography.setMarkerColor('#8B8100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8B8100',
  },
  {
    key: '#7C0022',
    action: () => {
      SCartography.setMarkerColor('#7C0022', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7C0022',
  },
  {
    key: '#F0DCBE',
    action: () => {
      SCartography.setMarkerColor('#F0DCBE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0DCBE',
  },
  {
    key: '#F2B1CF',
    action: () => {
      SCartography.setMarkerColor('#F2B1CF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F2B1CF',
  },
  {
    key: '#D3FFBF',
    action: () => {
      SCartography.setMarkerColor('#D3FFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D3FFBF',
  },
  {
    key: '#00165F',
    action: () => {
      SCartography.setMarkerColor('#00165F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00165F',
  },
  {
    key: '#6673CB',
    action: () => {
      SCartography.setMarkerColor('#6673CB', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#6673CB',
  },
  {
    key: '#006EBF',
    action: () => {
      SCartography.setMarkerColor('#006EBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#006EBF',
  },
  {
    key: '#89CF66',
    action: () => {
      SCartography.setMarkerColor('#89CF66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#89CF66',
  },
  {
    key: '#70A900',
    action: () => {
      SCartography.setMarkerColor('#70A900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70A900',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setMarkerColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#93D150',
    action: () => {
      SCartography.setMarkerColor('#93D150', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93D150',
  },
  {
    key: '#70319F',
    action: () => {
      SCartography.setMarkerColor('#70319F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70319F',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setMarkerColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#D38968',
    action: () => {
      SCartography.setMarkerColor('#D38968', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D38968',
  },
  {
    key: '#FFBF00',
    action: () => {
      SCartography.setMarkerColor('#FFBF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFBF00',
  },
  {
    key: '#FFFF00',
    action: () => {
      SCartography.setMarkerColor('#FFFF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFF00',
  },
  {
    key: '#C10000',
    action: () => {
      SCartography.setMarkerColor('#C10000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C10000',
  },
  {
    key: '#F0F1A6',
    action: () => {
      SCartography.setMarkerColor('#F0F1A6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0F1A6',
  },
  {
    key: '#FF0000',
    action: () => {
      SCartography.setMarkerColor('#FF0000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FF0000',
  },
]

const regionBeforeColorSet = [
  {
    key: '#FFFFFF',
    action: () => {
      SCartography.setFillForeColor('#FFFFFF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFFFF',
  },
  {
    key: '#000000',
    action: () => {
      SCartography.setFillForeColor('#000000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#000000',
  },
  {
    key: '#F0EDE1',
    action: () => {
      SCartography.setFillForeColor('#F0EDE1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0EDE1',
  },
  {
    key: '#1E477C',
    action: () => {
      SCartography.setFillForeColor('#1E477C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1E477C',
  },
  {
    key: '#4982BC',
    action: () => {
      SCartography.setFillForeColor('#4982BC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4982BC',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setFillForeColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#803000',
    action: () => {
      SCartography.setFillForeColor('#803000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#803000',
  },
  {
    key: '#BD5747',
    action: () => {
      SCartography.setFillForeColor('#BD5747', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BD5747',
  },
  {
    key: '#36E106',
    action: () => {
      SCartography.setFillForeColor('#36E106', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#36E106',
  },
  {
    key: '#9CBB58',
    action: () => {
      SCartography.setFillForeColor('#9CBB58', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9CBB58',
  },
  {
    key: '#8364A1',
    action: () => {
      SCartography.setFillForeColor('#8364A1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8364A1',
  },
  {
    key: '#4AADC7',
    action: () => {
      SCartography.setFillForeColor('#4AADC7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4AADC7',
  },
  {
    key: '#F89746',
    action: () => {
      SCartography.setFillForeColor('#F89746', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F89746',
  },
  {
    key: '#E7A700',
    action: () => {
      SCartography.setFillForeColor('#E7A700', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7A700',
  },
  {
    key: '#E7E300',
    action: () => {
      SCartography.setFillForeColor('#E7E300', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7E300',
  },
  {
    key: '#D33248',
    action: () => {
      SCartography.setFillForeColor('#D33248', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D33248',
  },
  {
    key: '#F1F1F1',
    action: () => {
      SCartography.setFillForeColor('#F1F1F1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F1F1F1',
  },
  {
    key: '#7D7D7D',
    action: () => {
      SCartography.setFillForeColor('#7D7D7D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7D7D7D',
  },
  {
    key: '#DDD9C3',
    action: () => {
      SCartography.setFillForeColor('#DDD9C3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDD9C3',
  },
  {
    key: '#C9DDF0',
    action: () => {
      SCartography.setFillForeColor('#C9DDF0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C9DDF0',
  },
  {
    key: '#DBE4F3',
    action: () => {
      SCartography.setFillForeColor('#DBE4F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE4F3',
  },
  {
    key: '#BCE8FD',
    action: () => {
      SCartography.setFillForeColor('#BCE8FD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BCE8FD',
  },
  {
    key: '#E5C495',
    action: () => {
      SCartography.setFillForeColor('#E5C495', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5C495',
  },
  {
    key: '#F4DED9',
    action: () => {
      SCartography.setFillForeColor('#F4DED9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F4DED9',
  },
  {
    key: '#DBE9CE',
    action: () => {
      SCartography.setFillForeColor('#DBE9CE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE9CE',
  },
  {
    key: '#EBF4DE',
    action: () => {
      SCartography.setFillForeColor('#EBF4DE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EBF4DE',
  },
  {
    key: '#E5E1ED',
    action: () => {
      SCartography.setFillForeColor('#E5E1ED', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5E1ED',
  },
  {
    key: '#DDF0F3',
    action: () => {
      SCartography.setFillForeColor('#DDF0F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDF0F3',
  },
  {
    key: '#FDECDC',
    action: () => {
      SCartography.setFillForeColor('#FDECDC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDECDC',
  },
  {
    key: '#FFE7C4',
    action: () => {
      SCartography.setFillForeColor('#FFE7C4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFE7C4',
  },
  {
    key: '#FDFACA',
    action: () => {
      SCartography.setFillForeColor('#FDFACA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDFACA',
  },
  {
    key: '#F09CA0',
    action: () => {
      SCartography.setFillForeColor('#F09CA0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F09CA0',
  },
  {
    key: '#D7D7D7',
    action: () => {
      SCartography.setFillForeColor('#D7D7D7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7D7D7',
  },
  {
    key: '#585858',
    action: () => {
      SCartography.setFillForeColor('#585858', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#585858',
  },
  {
    key: '#C6B797',
    action: () => {
      SCartography.setFillForeColor('#C6B797', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C6B797',
  },
  {
    key: '#8CB4EA',
    action: () => {
      SCartography.setFillForeColor('#8CB4EA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8CB4EA',
  },
  {
    key: '#C1CCE4',
    action: () => {
      SCartography.setFillForeColor('#C1CCE4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C1CCE4',
  },
  {
    key: '#7ED2F6',
    action: () => {
      SCartography.setFillForeColor('#7ED2F6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7ED2F6',
  },
  {
    key: '#B1894F',
    action: () => {
      SCartography.setFillForeColor('#B1894F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1894F',
  },
  {
    key: '#E7B8B8',
    action: () => {
      SCartography.setFillForeColor('#E7B8B8', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7B8B8',
  },
  {
    key: '#B0D59A',
    action: () => {
      SCartography.setFillForeColor('#B0D59A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B0D59A',
  },
  {
    key: '#D7E3BD',
    action: () => {
      SCartography.setFillForeColor('#D7E3BD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7E3BD',
  },
  {
    key: '#CDC1D9',
    action: () => {
      SCartography.setFillForeColor('#CDC1D9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#CDC1D9',
  },
  {
    key: '#B7DDE9',
    action: () => {
      SCartography.setFillForeColor('#B7DDE9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7DDE9',
  },
  {
    key: '#FAD6B1',
    action: () => {
      SCartography.setFillForeColor('#FAD6B1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FAD6B1',
  },
  {
    key: '#F5CE88',
    action: () => {
      SCartography.setFillForeColor('#F5CE88', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F5CE88',
  },
  {
    key: '#FFF55A',
    action: () => {
      SCartography.setFillForeColor('#FFF55A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF55A',
  },
  {
    key: '#EF6C78',
    action: () => {
      SCartography.setFillForeColor('#EF6C78', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EF6C78',
  },
  {
    key: '#BFBFBF',
    action: () => {
      SCartography.setFillForeColor('#BFBFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BFBFBF',
  },
  {
    key: '#3E3E3E',
    action: () => {
      SCartography.setFillForeColor('#3E3E3E', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3E3E',
  },
  {
    key: '#938953',
    action: () => {
      SCartography.setFillForeColor('#938953', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#938953',
  },
  {
    key: '#548ED4',
    action: () => {
      SCartography.setFillForeColor('#548ED4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#548ED4',
  },
  {
    key: '#98B7D5',
    action: () => {
      SCartography.setFillForeColor('#98B7D5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#98B7D5',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setFillForeColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#9A6C34',
    action: () => {
      SCartography.setFillForeColor('#9A6C34', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9A6C34',
  },
  {
    key: '#D79896',
    action: () => {
      SCartography.setFillForeColor('#D79896', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D79896',
  },
  {
    key: '#7EC368',
    action: () => {
      SCartography.setFillForeColor('#7EC368', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7EC368',
  },
  {
    key: '#C5DDA5',
    action: () => {
      SCartography.setFillForeColor('#C5DDA5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C5DDA5',
  },
  {
    key: '#B1A5C6',
    action: () => {
      SCartography.setFillForeColor('#B1A5C6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1A5C6',
  },
  {
    key: '#93CDDD',
    action: () => {
      SCartography.setFillForeColor('#93CDDD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93CDDD',
  },
  {
    key: '#F9BD8D',
    action: () => {
      SCartography.setFillForeColor('#F9BD8D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F9BD8D',
  },
  {
    key: '#F7B550',
    action: () => {
      SCartography.setFillForeColor('#F7B550', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F7B550',
  },
  {
    key: '#FFF100',
    action: () => {
      SCartography.setFillForeColor('#FFF100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF100',
  },
  {
    key: '#E80050',
    action: () => {
      SCartography.setFillForeColor('#E80050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E80050',
  },
  {
    key: '#A6A6A7',
    action: () => {
      SCartography.setFillForeColor('#A6A6A7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A6A6A7',
  },
  {
    key: '#2D2D2B',
    action: () => {
      SCartography.setFillForeColor('#2D2D2B', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#2D2D2B',
  },
  {
    key: '#494428',
    action: () => {
      SCartography.setFillForeColor('#494428', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#494428',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setFillForeColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#376192',
    action: () => {
      SCartography.setFillForeColor('#376192', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#376192',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setFillForeColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#825320',
    action: () => {
      SCartography.setFillForeColor('#825320', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#825320',
  },
  {
    key: '#903635',
    action: () => {
      SCartography.setFillForeColor('#903635', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#903635',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setFillForeColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#76933C',
    action: () => {
      SCartography.setFillForeColor('#76933C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#76933C',
  },
  {
    key: '#5E467C',
    action: () => {
      SCartography.setFillForeColor('#5E467C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#5E467C',
  },
  {
    key: '#31859D',
    action: () => {
      SCartography.setFillForeColor('#31859D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#31859D',
  },
  {
    key: '#E46C07',
    action: () => {
      SCartography.setFillForeColor('#E46C07', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E46C07',
  },
  {
    key: '#F39900',
    action: () => {
      SCartography.setFillForeColor('#F39900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F39900',
  },
  {
    key: '#B7AB00',
    action: () => {
      SCartography.setFillForeColor('#B7AB00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7AB00',
  },
  {
    key: '#A50036',
    action: () => {
      SCartography.setFillForeColor('#A50036', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A50036',
  },
  {
    key: '#979D99',
    action: () => {
      SCartography.setFillForeColor('#979D99', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#979D99',
  },
  {
    key: '#0C0C0C',
    action: () => {
      SCartography.setFillForeColor('#0C0C0C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C0C0C',
  },
  {
    key: '#1C1A10',
    action: () => {
      SCartography.setFillForeColor('#1C1A10', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1C1A10',
  },
  {
    key: '#0C263D',
    action: () => {
      SCartography.setFillForeColor('#0C263D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C263D',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setFillForeColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#005883',
    action: () => {
      SCartography.setFillForeColor('#005883', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005883',
  },
  {
    key: '#693904',
    action: () => {
      SCartography.setFillForeColor('#693904', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#693904',
  },
  {
    key: '#622727',
    action: () => {
      SCartography.setFillForeColor('#622727', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#622727',
  },
  {
    key: '#005E14',
    action: () => {
      SCartography.setFillForeColor('#005E14', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005E14',
  },
  {
    key: '#4F6028',
    action: () => {
      SCartography.setFillForeColor('#4F6028', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4F6028',
  },
  {
    key: '#3E3050',
    action: () => {
      SCartography.setFillForeColor('#3E3050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3050',
  },
  {
    key: '#245B66',
    action: () => {
      SCartography.setFillForeColor('#245B66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#245B66',
  },
  {
    key: '#974805',
    action: () => {
      SCartography.setFillForeColor('#974805', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#974805',
  },
  {
    key: '#AD6A00',
    action: () => {
      SCartography.setFillForeColor('#AD6A00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#AD6A00',
  },
  {
    key: '#8B8100',
    action: () => {
      SCartography.setFillForeColor('#8B8100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8B8100',
  },
  {
    key: '#7C0022',
    action: () => {
      SCartography.setFillForeColor('#7C0022', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7C0022',
  },
  {
    key: '#F0DCBE',
    action: () => {
      SCartography.setFillForeColor('#F0DCBE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0DCBE',
  },
  {
    key: '#F2B1CF',
    action: () => {
      SCartography.setFillForeColor('#F2B1CF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F2B1CF',
  },
  {
    key: '#D3FFBF',
    action: () => {
      SCartography.setFillForeColor('#D3FFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D3FFBF',
  },
  {
    key: '#00165F',
    action: () => {
      SCartography.setFillForeColor('#00165F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00165F',
  },
  {
    key: '#6673CB',
    action: () => {
      SCartography.setFillForeColor('#6673CB', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#6673CB',
  },
  {
    key: '#006EBF',
    action: () => {
      SCartography.setFillForeColor('#006EBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#006EBF',
  },
  {
    key: '#89CF66',
    action: () => {
      SCartography.setFillForeColor('#89CF66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#89CF66',
  },
  {
    key: '#70A900',
    action: () => {
      SCartography.setFillForeColor('#70A900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70A900',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setFillForeColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#93D150',
    action: () => {
      SCartography.setFillForeColor('#93D150', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93D150',
  },
  {
    key: '#70319F',
    action: () => {
      SCartography.setFillForeColor('#70319F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70319F',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setFillForeColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#D38968',
    action: () => {
      SCartography.setFillForeColor('#D38968', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D38968',
  },
  {
    key: '#FFBF00',
    action: () => {
      SCartography.setFillForeColor('#FFBF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFBF00',
  },
  {
    key: '#FFFF00',
    action: () => {
      SCartography.setFillForeColor('#FFFF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFF00',
  },
  {
    key: '#C10000',
    action: () => {
      SCartography.setFillForeColor('#C10000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C10000',
  },
  {
    key: '#F0F1A6',
    action: () => {
      SCartography.setFillForeColor('#F0F1A6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0F1A6',
  },
  {
    key: '#FF0000',
    action: () => {
      SCartography.setFillForeColor('#FF0000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FF0000',
  },
]

const regionAfterColorSet = [
  {
    key: '#FFFFFF',
    action: () => {
      SCartography.setFillBackColor('#FFFFFF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFFFF',
  },
  {
    key: '#000000',
    action: () => {
      SCartography.setFillBackColor('#000000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#000000',
  },
  {
    key: '#F0EDE1',
    action: () => {
      SCartography.setFillBackColor('#F0EDE1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0EDE1',
  },
  {
    key: '#1E477C',
    action: () => {
      SCartography.setFillBackColor('#1E477C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1E477C',
  },
  {
    key: '#4982BC',
    action: () => {
      SCartography.setFillBackColor('#4982BC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4982BC',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setFillBackColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#803000',
    action: () => {
      SCartography.setFillBackColor('#803000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#803000',
  },
  {
    key: '#BD5747',
    action: () => {
      SCartography.setFillBackColor('#BD5747', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BD5747',
  },
  {
    key: '#36E106',
    action: () => {
      SCartography.setFillBackColor('#36E106', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#36E106',
  },
  {
    key: '#9CBB58',
    action: () => {
      SCartography.setFillBackColor('#9CBB58', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9CBB58',
  },
  {
    key: '#8364A1',
    action: () => {
      SCartography.setFillBackColor('#8364A1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8364A1',
  },
  {
    key: '#4AADC7',
    action: () => {
      SCartography.setFillBackColor('#4AADC7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4AADC7',
  },
  {
    key: '#F89746',
    action: () => {
      SCartography.setFillBackColor('#F89746', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F89746',
  },
  {
    key: '#E7A700',
    action: () => {
      SCartography.setFillBackColor('#E7A700', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7A700',
  },
  {
    key: '#E7E300',
    action: () => {
      SCartography.setFillBackColor('#E7E300', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7E300',
  },
  {
    key: '#D33248',
    action: () => {
      SCartography.setFillBackColor('#D33248', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D33248',
  },
  {
    key: '#F1F1F1',
    action: () => {
      SCartography.setFillBackColor('#F1F1F1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F1F1F1',
  },
  {
    key: '#7D7D7D',
    action: () => {
      SCartography.setFillBackColor('#7D7D7D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7D7D7D',
  },
  {
    key: '#DDD9C3',
    action: () => {
      SCartography.setFillBackColor('#DDD9C3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDD9C3',
  },
  {
    key: '#C9DDF0',
    action: () => {
      SCartography.setFillBackColor('#C9DDF0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C9DDF0',
  },
  {
    key: '#DBE4F3',
    action: () => {
      SCartography.setFillBackColor('#DBE4F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE4F3',
  },
  {
    key: '#BCE8FD',
    action: () => {
      SCartography.setFillBackColor('#BCE8FD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BCE8FD',
  },
  {
    key: '#E5C495',
    action: () => {
      SCartography.setFillBackColor('#E5C495', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5C495',
  },
  {
    key: '#F4DED9',
    action: () => {
      SCartography.setFillBackColor('#F4DED9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F4DED9',
  },
  {
    key: '#DBE9CE',
    action: () => {
      SCartography.setFillBackColor('#DBE9CE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DBE9CE',
  },
  {
    key: '#EBF4DE',
    action: () => {
      SCartography.setFillBackColor('#EBF4DE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EBF4DE',
  },
  {
    key: '#E5E1ED',
    action: () => {
      SCartography.setFillBackColor('#E5E1ED', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E5E1ED',
  },
  {
    key: '#DDF0F3',
    action: () => {
      SCartography.setFillBackColor('#DDF0F3', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#DDF0F3',
  },
  {
    key: '#FDECDC',
    action: () => {
      SCartography.setFillBackColor('#FDECDC', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDECDC',
  },
  {
    key: '#FFE7C4',
    action: () => {
      SCartography.setFillBackColor('#FFE7C4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFE7C4',
  },
  {
    key: '#FDFACA',
    action: () => {
      SCartography.setFillBackColor('#FDFACA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FDFACA',
  },
  {
    key: '#F09CA0',
    action: () => {
      SCartography.setFillBackColor('#F09CA0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F09CA0',
  },
  {
    key: '#D7D7D7',
    action: () => {
      SCartography.setFillBackColor('#D7D7D7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7D7D7',
  },
  {
    key: '#585858',
    action: () => {
      SCartography.setFillBackColor('#585858', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#585858',
  },
  {
    key: '#C6B797',
    action: () => {
      SCartography.setFillBackColor('#C6B797', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C6B797',
  },
  {
    key: '#8CB4EA',
    action: () => {
      SCartography.setFillBackColor('#8CB4EA', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8CB4EA',
  },
  {
    key: '#C1CCE4',
    action: () => {
      SCartography.setFillBackColor('#C1CCE4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C1CCE4',
  },
  {
    key: '#7ED2F6',
    action: () => {
      SCartography.setFillBackColor('#7ED2F6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7ED2F6',
  },
  {
    key: '#B1894F',
    action: () => {
      SCartography.setFillBackColor('#B1894F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1894F',
  },
  {
    key: '#E7B8B8',
    action: () => {
      SCartography.setFillBackColor('#E7B8B8', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E7B8B8',
  },
  {
    key: '#B0D59A',
    action: () => {
      SCartography.setFillBackColor('#B0D59A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B0D59A',
  },
  {
    key: '#D7E3BD',
    action: () => {
      SCartography.setFillBackColor('#D7E3BD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D7E3BD',
  },
  {
    key: '#CDC1D9',
    action: () => {
      SCartography.setFillBackColor('#CDC1D9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#CDC1D9',
  },
  {
    key: '#B7DDE9',
    action: () => {
      SCartography.setFillBackColor('#B7DDE9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7DDE9',
  },
  {
    key: '#FAD6B1',
    action: () => {
      SCartography.setFillBackColor('#FAD6B1', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FAD6B1',
  },
  {
    key: '#F5CE88',
    action: () => {
      SCartography.setFillBackColor('#F5CE88', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F5CE88',
  },
  {
    key: '#FFF55A',
    action: () => {
      SCartography.setFillBackColor('#FFF55A', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF55A',
  },
  {
    key: '#EF6C78',
    action: () => {
      SCartography.setFillBackColor('#EF6C78', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#EF6C78',
  },
  {
    key: '#BFBFBF',
    action: () => {
      SCartography.setFillBackColor('#BFBFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#BFBFBF',
  },
  {
    key: '#3E3E3E',
    action: () => {
      SCartography.setFillBackColor('#3E3E3E', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3E3E',
  },
  {
    key: '#938953',
    action: () => {
      SCartography.setFillBackColor('#938953', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#938953',
  },
  {
    key: '#548ED4',
    action: () => {
      SCartography.setFillBackColor('#548ED4', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#548ED4',
  },
  {
    key: '#98B7D5',
    action: () => {
      SCartography.setFillBackColor('#98B7D5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#98B7D5',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setFillBackColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#9A6C34',
    action: () => {
      SCartography.setFillBackColor('#9A6C34', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#9A6C34',
  },
  {
    key: '#D79896',
    action: () => {
      SCartography.setFillBackColor('#D79896', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D79896',
  },
  {
    key: '#7EC368',
    action: () => {
      SCartography.setFillBackColor('#7EC368', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7EC368',
  },
  {
    key: '#C5DDA5',
    action: () => {
      SCartography.setFillBackColor('#C5DDA5', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C5DDA5',
  },
  {
    key: '#B1A5C6',
    action: () => {
      SCartography.setFillBackColor('#B1A5C6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B1A5C6',
  },
  {
    key: '#93CDDD',
    action: () => {
      SCartography.setFillBackColor('#93CDDD', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93CDDD',
  },
  {
    key: '#F9BD8D',
    action: () => {
      SCartography.setFillBackColor('#F9BD8D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F9BD8D',
  },
  {
    key: '#F7B550',
    action: () => {
      SCartography.setFillBackColor('#F7B550', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F7B550',
  },
  {
    key: '#FFF100',
    action: () => {
      SCartography.setFillBackColor('#FFF100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFF100',
  },
  {
    key: '#E80050',
    action: () => {
      SCartography.setFillBackColor('#E80050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E80050',
  },
  {
    key: '#A6A6A7',
    action: () => {
      SCartography.setFillBackColor('#A6A6A7', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A6A6A7',
  },
  {
    key: '#2D2D2B',
    action: () => {
      SCartography.setFillBackColor('#2D2D2B', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#2D2D2B',
  },
  {
    key: '#494428',
    action: () => {
      SCartography.setFillBackColor('#494428', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#494428',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setFillBackColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#376192',
    action: () => {
      SCartography.setFillBackColor('#376192', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#376192',
  },
  {
    key: '#00A1E9',
    action: () => {
      SCartography.setFillBackColor('#00A1E9', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#825320',
    action: () => {
      SCartography.setFillBackColor('#825320', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#825320',
  },
  {
    key: '#903635',
    action: () => {
      SCartography.setFillBackColor('#903635', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#903635',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setFillBackColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#76933C',
    action: () => {
      SCartography.setFillBackColor('#76933C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#76933C',
  },
  {
    key: '#5E467C',
    action: () => {
      SCartography.setFillBackColor('#5E467C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#5E467C',
  },
  {
    key: '#31859D',
    action: () => {
      SCartography.setFillBackColor('#31859D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#31859D',
  },
  {
    key: '#E46C07',
    action: () => {
      SCartography.setFillBackColor('#E46C07', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#E46C07',
  },
  {
    key: '#F39900',
    action: () => {
      SCartography.setFillBackColor('#F39900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F39900',
  },
  {
    key: '#B7AB00',
    action: () => {
      SCartography.setFillBackColor('#B7AB00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#B7AB00',
  },
  {
    key: '#A50036',
    action: () => {
      SCartography.setFillBackColor('#A50036', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#A50036',
  },
  {
    key: '#979D99',
    action: () => {
      SCartography.setFillBackColor('#979D99', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#979D99',
  },
  {
    key: '#0C0C0C',
    action: () => {
      SCartography.setFillBackColor('#0C0C0C', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C0C0C',
  },
  {
    key: '#1C1A10',
    action: () => {
      SCartography.setFillBackColor('#1C1A10', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1C1A10',
  },
  {
    key: '#0C263D',
    action: () => {
      SCartography.setFillBackColor('#0C263D', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#0C263D',
  },
  {
    key: '#1D3A5F',
    action: () => {
      SCartography.setFillBackColor('#1D3A5F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#005883',
    action: () => {
      SCartography.setFillBackColor('#005883', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005883',
  },
  {
    key: '#693904',
    action: () => {
      SCartography.setFillBackColor('#693904', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#693904',
  },
  {
    key: '#622727',
    action: () => {
      SCartography.setFillBackColor('#622727', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#622727',
  },
  {
    key: '#005E14',
    action: () => {
      SCartography.setFillBackColor('#005E14', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#005E14',
  },
  {
    key: '#4F6028',
    action: () => {
      SCartography.setFillBackColor('#4F6028', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#4F6028',
  },
  {
    key: '#3E3050',
    action: () => {
      SCartography.setFillBackColor('#3E3050', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#3E3050',
  },
  {
    key: '#245B66',
    action: () => {
      SCartography.setFillBackColor('#245B66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#245B66',
  },
  {
    key: '#974805',
    action: () => {
      SCartography.setFillBackColor('#974805', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#974805',
  },
  {
    key: '#AD6A00',
    action: () => {
      SCartography.setFillBackColor('#AD6A00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#AD6A00',
  },
  {
    key: '#8B8100',
    action: () => {
      SCartography.setFillBackColor('#8B8100', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#8B8100',
  },
  {
    key: '#7C0022',
    action: () => {
      SCartography.setFillBackColor('#7C0022', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#7C0022',
  },
  {
    key: '#F0DCBE',
    action: () => {
      SCartography.setFillBackColor('#F0DCBE', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0DCBE',
  },
  {
    key: '#F2B1CF',
    action: () => {
      SCartography.setFillBackColor('#F2B1CF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F2B1CF',
  },
  {
    key: '#D3FFBF',
    action: () => {
      SCartography.setFillBackColor('#D3FFBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D3FFBF',
  },
  {
    key: '#00165F',
    action: () => {
      SCartography.setFillBackColor('#00165F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00165F',
  },
  {
    key: '#6673CB',
    action: () => {
      SCartography.setFillBackColor('#6673CB', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#6673CB',
  },
  {
    key: '#006EBF',
    action: () => {
      SCartography.setFillBackColor('#006EBF', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#006EBF',
  },
  {
    key: '#89CF66',
    action: () => {
      SCartography.setFillBackColor('#89CF66', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#89CF66',
  },
  {
    key: '#70A900',
    action: () => {
      SCartography.setFillBackColor('#70A900', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70A900',
  },
  {
    key: '#13B044',
    action: () => {
      SCartography.setFillBackColor('#13B044', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#93D150',
    action: () => {
      SCartography.setFillBackColor('#93D150', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#93D150',
  },
  {
    key: '#70319F',
    action: () => {
      SCartography.setFillBackColor('#70319F', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#70319F',
  },
  {
    key: '#00B4F0',
    action: () => {
      SCartography.setFillBackColor('#00B4F0', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#D38968',
    action: () => {
      SCartography.setFillBackColor('#D38968', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#D38968',
  },
  {
    key: '#FFBF00',
    action: () => {
      SCartography.setFillBackColor('#FFBF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFBF00',
  },
  {
    key: '#FFFF00',
    action: () => {
      SCartography.setFillBackColor('#FFFF00', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FFFF00',
  },
  {
    key: '#C10000',
    action: () => {
      SCartography.setFillBackColor('#C10000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#C10000',
  },
  {
    key: '#F0F1A6',
    action: () => {
      SCartography.setFillBackColor('#F0F1A6', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#F0F1A6',
  },
  {
    key: '#FF0000',
    action: () => {
      SCartography.setFillBackColor('#FF0000', GLOBAL.currentLayer.name)
    },
    size: 'large',
    background: '#FF0000',
  },
]

const mapBackGroundColor = [
  {
    key: '#FFFFFF',
    action: () => {
      return SMap.setMapBackgroundColor('#FFFFFF')
    },
    size: 'large',
    background: '#FFFFFF',
  },
  {
    key: '#000000',
    action: () => {
      return SMap.setMapBackgroundColor('#000000')
    },
    size: 'large',
    background: '#000000',
  },
  {
    key: '#F0EDE1',
    action: () => {
      return SMap.setMapBackgroundColor('#F0EDE1')
    },
    size: 'large',
    background: '#F0EDE1',
  },
  {
    key: '#1E477C',
    action: () => {
      return SMap.setMapBackgroundColor('#1E477C')
    },
    size: 'large',
    background: '#1E477C',
  },
  {
    key: '#4982BC',
    action: () => {
      return SMap.setMapBackgroundColor('#4982BC')
    },
    size: 'large',
    background: '#4982BC',
  },
  {
    key: '#00A1E9',
    action: () => {
      return SMap.setMapBackgroundColor('#00A1E9')
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#803000',
    action: () => {
      return SMap.setMapBackgroundColor('#803000')
    },
    size: 'large',
    background: '#803000',
  },
  {
    key: '#BD5747',
    action: () => {
      return SMap.setMapBackgroundColor('#BD5747')
    },
    size: 'large',
    background: '#BD5747',
  },
  {
    key: '#36E106',
    action: () => {
      return SMap.setMapBackgroundColor('#36E106')
    },
    size: 'large',
    background: '#36E106',
  },
  {
    key: '#9CBB58',
    action: () => {
      return SMap.setMapBackgroundColor('#9CBB58')
    },
    size: 'large',
    background: '#9CBB58',
  },
  {
    key: '#8364A1',
    action: () => {
      return SMap.setMapBackgroundColor('#8364A1')
    },
    size: 'large',
    background: '#8364A1',
  },
  {
    key: '#4AADC7',
    action: () => {
      return SMap.setMapBackgroundColor('#4AADC7')
    },
    size: 'large',
    background: '#4AADC7',
  },
  {
    key: '#F89746',
    action: () => {
      return SMap.setMapBackgroundColor('#F89746')
    },
    size: 'large',
    background: '#F89746',
  },
  {
    key: '#E7A700',
    action: () => {
      return SMap.setMapBackgroundColor('#E7A700')
    },
    size: 'large',
    background: '#E7A700',
  },
  {
    key: '#E7E300',
    action: () => {
      return SMap.setMapBackgroundColor('#E7E300')
    },
    size: 'large',
    background: '#E7E300',
  },
  {
    key: '#D33248',
    action: () => {
      return SMap.setMapBackgroundColor('#D33248')
    },
    size: 'large',
    background: '#D33248',
  },
  {
    key: '#F1F1F1',
    action: () => {
      return SMap.setMapBackgroundColor('#F1F1F1')
    },
    size: 'large',
    background: '#F1F1F1',
  },
  {
    key: '#7D7D7D',
    action: () => {
      return SMap.setMapBackgroundColor('#7D7D7D')
    },
    size: 'large',
    background: '#7D7D7D',
  },
  {
    key: '#DDD9C3',
    action: () => {
      return SMap.setMapBackgroundColor('#DDD9C3')
    },
    size: 'large',
    background: '#DDD9C3',
  },
  {
    key: '#C9DDF0',
    action: () => {
      return SMap.setMapBackgroundColor('#C9DDF0')
    },
    size: 'large',
    background: '#C9DDF0',
  },
  {
    key: '#DBE4F3',
    action: () => {
      return SMap.setMapBackgroundColor('#DBE4F3')
    },
    size: 'large',
    background: '#DBE4F3',
  },
  {
    key: '#BCE8FD',
    action: () => {
      return SMap.setMapBackgroundColor('#BCE8FD')
    },
    size: 'large',
    background: '#BCE8FD',
  },
  {
    key: '#E5C495',
    action: () => {
      return SMap.setMapBackgroundColor('#E5C495')
    },
    size: 'large',
    background: '#E5C495',
  },
  {
    key: '#F4DED9',
    action: () => {
      return SMap.setMapBackgroundColor('#F4DED9')
    },
    size: 'large',
    background: '#F4DED9',
  },
  {
    key: '#DBE9CE',
    action: () => {
      return SMap.setMapBackgroundColor('#DBE9CE')
    },
    size: 'large',
    background: '#DBE9CE',
  },
  {
    key: '#EBF4DE',
    action: () => {
      return SMap.setMapBackgroundColor('#EBF4DE')
    },
    size: 'large',
    background: '#EBF4DE',
  },
  {
    key: '#E5E1ED',
    action: () => {
      return SMap.setMapBackgroundColor('#E5E1ED')
    },
    size: 'large',
    background: '#E5E1ED',
  },
  {
    key: '#DDF0F3',
    action: () => {
      return SMap.setMapBackgroundColor('#DDF0F3')
    },
    size: 'large',
    background: '#DDF0F3',
  },
  {
    key: '#FDECDC',
    action: () => {
      return SMap.setMapBackgroundColor('#FDECDC')
    },
    size: 'large',
    background: '#FDECDC',
  },
  {
    key: '#FFE7C4',
    action: () => {
      return SMap.setMapBackgroundColor('#FFE7C4')
    },
    size: 'large',
    background: '#FFE7C4',
  },
  {
    key: '#FDFACA',
    action: () => {
      return SMap.setMapBackgroundColor('#FDFACA')
    },
    size: 'large',
    background: '#FDFACA',
  },
  {
    key: '#F09CA0',
    action: () => {
      return SMap.setMapBackgroundColor('#F09CA0')
    },
    size: 'large',
    background: '#F09CA0',
  },
  {
    key: '#D7D7D7',
    action: () => {
      return SMap.setMapBackgroundColor('#D7D7D7')
    },
    size: 'large',
    background: '#D7D7D7',
  },
  {
    key: '#585858',
    action: () => {
      return SMap.setMapBackgroundColor('#585858')
    },
    size: 'large',
    background: '#585858',
  },
  {
    key: '#C6B797',
    action: () => {
      return SMap.setMapBackgroundColor('#C6B797')
    },
    size: 'large',
    background: '#C6B797',
  },
  {
    key: '#8CB4EA',
    action: () => {
      return SMap.setMapBackgroundColor('#8CB4EA')
    },
    size: 'large',
    background: '#8CB4EA',
  },
  {
    key: '#C1CCE4',
    action: () => {
      return SMap.setMapBackgroundColor('#C1CCE4')
    },
    size: 'large',
    background: '#C1CCE4',
  },
  {
    key: '#7ED2F6',
    action: () => {
      return SMap.setMapBackgroundColor('#7ED2F6')
    },
    size: 'large',
    background: '#7ED2F6',
  },
  {
    key: '#B1894F',
    action: () => {
      return SMap.setMapBackgroundColor('#B1894F')
    },
    size: 'large',
    background: '#B1894F',
  },
  {
    key: '#E7B8B8',
    action: () => {
      return SMap.setMapBackgroundColor('#E7B8B8')
    },
    size: 'large',
    background: '#E7B8B8',
  },
  {
    key: '#B0D59A',
    action: () => {
      return SMap.setMapBackgroundColor('#B0D59A')
    },
    size: 'large',
    background: '#B0D59A',
  },
  {
    key: '#D7E3BD',
    action: () => {
      return SMap.setMapBackgroundColor('#D7E3BD')
    },
    size: 'large',
    background: '#D7E3BD',
  },
  {
    key: '#CDC1D9',
    action: () => {
      return SMap.setMapBackgroundColor('#CDC1D9')
    },
    size: 'large',
    background: '#CDC1D9',
  },
  {
    key: '#B7DDE9',
    action: () => {
      return SMap.setMapBackgroundColor('#B7DDE9')
    },
    size: 'large',
    background: '#B7DDE9',
  },
  {
    key: '#FAD6B1',
    action: () => {
      return SMap.setMapBackgroundColor('#FAD6B1')
    },
    size: 'large',
    background: '#FAD6B1',
  },
  {
    key: '#F5CE88',
    action: () => {
      return SMap.setMapBackgroundColor('#F5CE88')
    },
    size: 'large',
    background: '#F5CE88',
  },
  {
    key: '#FFF55A',
    action: () => {
      return SMap.setMapBackgroundColor('#FFF55A')
    },
    size: 'large',
    background: '#FFF55A',
  },
  {
    key: '#EF6C78',
    action: () => {
      return SMap.setMapBackgroundColor('#EF6C78')
    },
    size: 'large',
    background: '#EF6C78',
  },
  {
    key: '#BFBFBF',
    action: () => {
      return SMap.setMapBackgroundColor('#BFBFBF')
    },
    size: 'large',
    background: '#BFBFBF',
  },
  {
    key: '#3E3E3E',
    action: () => {
      return SMap.setMapBackgroundColor('#3E3E3E')
    },
    size: 'large',
    background: '#3E3E3E',
  },
  {
    key: '#938953',
    action: () => {
      return SMap.setMapBackgroundColor('#938953')
    },
    size: 'large',
    background: '#938953',
  },
  {
    key: '#548ED4',
    action: () => {
      return SMap.setMapBackgroundColor('#548ED4')
    },
    size: 'large',
    background: '#548ED4',
  },
  {
    key: '#98B7D5',
    action: () => {
      return SMap.setMapBackgroundColor('#98B7D5')
    },
    size: 'large',
    background: '#98B7D5',
  },
  {
    key: '#00B4F0',
    action: () => {
      return SMap.setMapBackgroundColor('#00B4F0')
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#9A6C34',
    action: () => {
      return SMap.setMapBackgroundColor('#9A6C34')
    },
    size: 'large',
    background: '#9A6C34',
  },
  {
    key: '#D79896',
    action: () => {
      return SMap.setMapBackgroundColor('#D79896')
    },
    size: 'large',
    background: '#D79896',
  },
  {
    key: '#7EC368',
    action: () => {
      return SMap.setMapBackgroundColor('#7EC368')
    },
    size: 'large',
    background: '#7EC368',
  },
  {
    key: '#C5DDA5',
    action: () => {
      return SMap.setMapBackgroundColor('#C5DDA5')
    },
    size: 'large',
    background: '#C5DDA5',
  },
  {
    key: '#B1A5C6',
    action: () => {
      return SMap.setMapBackgroundColor('#B1A5C6')
    },
    size: 'large',
    background: '#B1A5C6',
  },
  {
    key: '#93CDDD',
    action: () => {
      return SMap.setMapBackgroundColor('#93CDDD')
    },
    size: 'large',
    background: '#93CDDD',
  },
  {
    key: '#F9BD8D',
    action: () => {
      return SMap.setMapBackgroundColor('#F9BD8D')
    },
    size: 'large',
    background: '#F9BD8D',
  },
  {
    key: '#F7B550',
    action: () => {
      return SMap.setMapBackgroundColor('#F7B550')
    },
    size: 'large',
    background: '#F7B550',
  },
  {
    key: '#FFF100',
    action: () => {
      return SMap.setMapBackgroundColor('#FFF100')
    },
    size: 'large',
    background: '#FFF100',
  },
  {
    key: '#E80050',
    action: () => {
      return SMap.setMapBackgroundColor('#E80050')
    },
    size: 'large',
    background: '#E80050',
  },
  {
    key: '#A6A6A7',
    action: () => {
      return SMap.setMapBackgroundColor('#A6A6A7')
    },
    size: 'large',
    background: '#A6A6A7',
  },
  {
    key: '#2D2D2B',
    action: () => {
      return SMap.setMapBackgroundColor('#2D2D2B')
    },
    size: 'large',
    background: '#2D2D2B',
  },
  {
    key: '#494428',
    action: () => {
      return SMap.setMapBackgroundColor('#494428')
    },
    size: 'large',
    background: '#494428',
  },
  {
    key: '#1D3A5F',
    action: () => {
      return SMap.setMapBackgroundColor('#1D3A5F')
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#376192',
    action: () => {
      return SMap.setMapBackgroundColor('#376192')
    },
    size: 'large',
    background: '#376192',
  },
  {
    key: '#00A1E9',
    action: () => {
      return SMap.setMapBackgroundColor('#00A1E9')
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#825320',
    action: () => {
      return SMap.setMapBackgroundColor('#825320')
    },
    size: 'large',
    background: '#825320',
  },
  {
    key: '#903635',
    action: () => {
      return SMap.setMapBackgroundColor('#903635')
    },
    size: 'large',
    background: '#903635',
  },
  {
    key: '#13B044',
    action: () => {
      return SMap.setMapBackgroundColor('#13B044')
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#76933C',
    action: () => {
      return SMap.setMapBackgroundColor('#76933C')
    },
    size: 'large',
    background: '#76933C',
  },
  {
    key: '#5E467C',
    action: () => {
      return SMap.setMapBackgroundColor('#5E467C')
    },
    size: 'large',
    background: '#5E467C',
  },
  {
    key: '#31859D',
    action: () => {
      return SMap.setMapBackgroundColor('#31859D')
    },
    size: 'large',
    background: '#31859D',
  },
  {
    key: '#E46C07',
    action: () => {
      return SMap.setMapBackgroundColor('#E46C07')
    },
    size: 'large',
    background: '#E46C07',
  },
  {
    key: '#F39900',
    action: () => {
      return SMap.setMapBackgroundColor('#F39900')
    },
    size: 'large',
    background: '#F39900',
  },
  {
    key: '#B7AB00',
    action: () => {
      return SMap.setMapBackgroundColor('#B7AB00')
    },
    size: 'large',
    background: '#B7AB00',
  },
  {
    key: '#A50036',
    action: () => {
      return SMap.setMapBackgroundColor('#A50036')
    },
    size: 'large',
    background: '#A50036',
  },
  {
    key: '#979D99',
    action: () => {
      return SMap.setMapBackgroundColor('#979D99')
    },
    size: 'large',
    background: '#979D99',
  },
  {
    key: '#0C0C0C',
    action: () => {
      return SMap.setMapBackgroundColor('#0C0C0C')
    },
    size: 'large',
    background: '#0C0C0C',
  },
  {
    key: '#1C1A10',
    action: () => {
      return SMap.setMapBackgroundColor('#1C1A10')
    },
    size: 'large',
    background: '#1C1A10',
  },
  {
    key: '#0C263D',
    action: () => {
      return SMap.setMapBackgroundColor('#0C263D')
    },
    size: 'large',
    background: '#0C263D',
  },
  {
    key: '#1D3A5F',
    action: () => {
      return SMap.setMapBackgroundColor('#1D3A5F')
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#005883',
    action: () => {
      return SMap.setMapBackgroundColor('#005883')
    },
    size: 'large',
    background: '#005883',
  },
  {
    key: '#693904',
    action: () => {
      return SMap.setMapBackgroundColor('#693904')
    },
    size: 'large',
    background: '#693904',
  },
  {
    key: '#622727',
    action: () => {
      return SMap.setMapBackgroundColor('#622727')
    },
    size: 'large',
    background: '#622727',
  },
  {
    key: '#005E14',
    action: () => {
      return SMap.setMapBackgroundColor('#005E14')
    },
    size: 'large',
    background: '#005E14',
  },
  {
    key: '#4F6028',
    action: () => {
      return SMap.setMapBackgroundColor('#4F6028')
    },
    size: 'large',
    background: '#4F6028',
  },
  {
    key: '#3E3050',
    action: () => {
      return SMap.setMapBackgroundColor('#3E3050')
    },
    size: 'large',
    background: '#3E3050',
  },
  {
    key: '#245B66',
    action: () => {
      return SMap.setMapBackgroundColor('#245B66')
    },
    size: 'large',
    background: '#245B66',
  },
  {
    key: '#974805',
    action: () => {
      return SMap.setMapBackgroundColor('#974805')
    },
    size: 'large',
    background: '#974805',
  },
  {
    key: '#AD6A00',
    action: () => {
      return SMap.setMapBackgroundColor('#AD6A00')
    },
    size: 'large',
    background: '#AD6A00',
  },
  {
    key: '#8B8100',
    action: () => {
      return SMap.setMapBackgroundColor('#8B8100')
    },
    size: 'large',
    background: '#8B8100',
  },
  {
    key: '#7C0022',
    action: () => {
      return SMap.setMapBackgroundColor('#8B8100')
    },
    size: 'large',
    background: '#7C0022',
  },
  {
    key: '#F0DCBE',
    action: () => {
      return SMap.setMapBackgroundColor('#F0DCBE')
    },
    size: 'large',
    background: '#F0DCBE',
  },
  {
    key: '#F2B1CF',
    action: () => {
      return SMap.setMapBackgroundColor('#F2B1CF')
    },
    size: 'large',
    background: '#F2B1CF',
  },
  {
    key: '#D3FFBF',
    action: () => {
      return SMap.setMapBackgroundColor('#D3FFBF')
    },
    size: 'large',
    background: '#D3FFBF',
  },
  {
    key: '#00165F',
    action: () => {
      return SMap.setMapBackgroundColor('#00165F')
    },
    size: 'large',
    background: '#00165F',
  },
  {
    key: '#6673CB',
    action: () => {
      return SMap.setMapBackgroundColor('#6673CB')
    },
    size: 'large',
    background: '#6673CB',
  },
  {
    key: '#006EBF',
    action: () => {
      return SMap.setMapBackgroundColor('#006EBF')
    },
    size: 'large',
    background: '#006EBF',
  },
  {
    key: '#89CF66',
    action: () => {
      return SMap.setMapBackgroundColor('#89CF66')
    },
    size: 'large',
    background: '#89CF66',
  },
  {
    key: '#70A900',
    action: () => {
      return SMap.setMapBackgroundColor('#70A900')
    },
    size: 'large',
    background: '#70A900',
  },
  {
    key: '#13B044',
    action: () => {
      return SMap.setMapBackgroundColor('#13B044')
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#93D150',
    action: () => {
      return SMap.setMapBackgroundColor('#93D150')
    },
    size: 'large',
    background: '#93D150',
  },
  {
    key: '#70319F',
    action: () => {
      return SMap.setMapBackgroundColor('#70319F')
    },
    size: 'large',
    background: '#70319F',
  },
  {
    key: '#00B4F0',
    action: () => {
      return SMap.setMapBackgroundColor('#00B4F0')
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#D38968',
    action: () => {
      return SMap.setMapBackgroundColor('#D38968')
    },
    size: 'large',
    background: '#D38968',
  },
  {
    key: '#FFBF00',
    action: () => {
      return SMap.setMapBackgroundColor('#FFBF00')
    },
    size: 'large',
    background: '#FFBF00',
  },
  {
    key: '#FFFF00',
    action: () => {
      return SMap.setMapBackgroundColor('#FFFF00')
    },
    size: 'large',
    background: '#FFFF00',
  },
  {
    key: '#C10000',
    action: () => {
      return SMap.setMapBackgroundColor('#C10000')
    },
    size: 'large',
    background: '#C10000',
  },
  {
    key: '#F0F1A6',
    action: () => {
      return SMap.setMapBackgroundColor('#F0F1A6')
    },
    size: 'large',
    background: '#F0F1A6',
  },
  {
    key: '#FF0000',
    action: () => {
      return SMap.setMapBackgroundColor('#FF0000')
    },
    size: 'large',
    background: '#FF0000',
  },
]
const legendColor = [
  {
    key: '#FFFFFF',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FFFFFF' })
    },
    size: 'large',
    background: '#FFFFFF',
  },
  {
    key: '#000000',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#000000' })
    },
    size: 'large',
    background: '#000000',
  },
  {
    key: '#F0EDE1',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F0EDE1' })
    },
    size: 'large',
    background: '#F0EDE1',
  },
  {
    key: '#1E477C',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#1E477C' })
    },
    size: 'large',
    background: '#1E477C',
  },
  {
    key: '#4982BC',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#4982BC' })
    },
    size: 'large',
    background: '#4982BC',
  },
  {
    key: '#00A1E9',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#00A1E9' })
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#803000',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#803000' })
    },
    size: 'large',
    background: '#803000',
  },
  {
    key: '#BD5747',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#BD5747' })
    },
    size: 'large',
    background: '#BD5747',
  },
  {
    key: '#36E106',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#36E106' })
    },
    size: 'large',
    background: '#36E106',
  },
  {
    key: '#9CBB58',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#9CBB58' })
    },
    size: 'large',
    background: '#9CBB58',
  },
  {
    key: '#8364A1',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#8364A1' })
    },
    size: 'large',
    background: '#8364A1',
  },
  {
    key: '#4AADC7',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#4AADC7' })
    },
    size: 'large',
    background: '#4AADC7',
  },
  {
    key: '#F89746',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F89746' })
    },
    size: 'large',
    background: '#F89746',
  },
  {
    key: '#E7A700',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E7A700' })
    },
    size: 'large',
    background: '#E7A700',
  },
  {
    key: '#E7E300',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E7E300' })
    },
    size: 'large',
    background: '#E7E300',
  },
  {
    key: '#D33248',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#D33248' })
    },
    size: 'large',
    background: '#D33248',
  },
  {
    key: '#F1F1F1',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F1F1F1' })
    },
    size: 'large',
    background: '#F1F1F1',
  },
  {
    key: '#7D7D7D',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#7D7D7D' })
    },
    size: 'large',
    background: '#7D7D7D',
  },
  {
    key: '#DDD9C3',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#DDD9C3' })
    },
    size: 'large',
    background: '#DDD9C3',
  },
  {
    key: '#C9DDF0',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#C9DDF0' })
    },
    size: 'large',
    background: '#C9DDF0',
  },
  {
    key: '#DBE4F3',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#DBE4F3' })
    },
    size: 'large',
    background: '#DBE4F3',
  },
  {
    key: '#BCE8FD',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#BCE8FD' })
    },
    size: 'large',
    background: '#BCE8FD',
  },
  {
    key: '#E5C495',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E5C495' })
    },
    size: 'large',
    background: '#E5C495',
  },
  {
    key: '#F4DED9',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F4DED9' })
    },
    size: 'large',
    background: '#F4DED9',
  },
  {
    key: '#DBE9CE',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#DBE9CE' })
    },
    size: 'large',
    background: '#DBE9CE',
  },
  {
    key: '#EBF4DE',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#EBF4DE' })
    },
    size: 'large',
    background: '#EBF4DE',
  },
  {
    key: '#E5E1ED',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E5E1ED' })
    },
    size: 'large',
    background: '#E5E1ED',
  },
  {
    key: '#DDF0F3',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#DDF0F3' })
    },
    size: 'large',
    background: '#DDF0F3',
  },
  {
    key: '#FDECDC',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FDECDC' })
    },
    size: 'large',
    background: '#FDECDC',
  },
  {
    key: '#FFE7C4',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FFE7C4' })
    },
    size: 'large',
    background: '#FFE7C4',
  },
  {
    key: '#FDFACA',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FDFACA' })
    },
    size: 'large',
    background: '#FDFACA',
  },
  {
    key: '#F09CA0',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F09CA0' })
    },
    size: 'large',
    background: '#F09CA0',
  },
  {
    key: '#D7D7D7',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#D7D7D7' })
    },
    size: 'large',
    background: '#D7D7D7',
  },
  {
    key: '#585858',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#585858' })
    },
    size: 'large',
    background: '#585858',
  },
  {
    key: '#C6B797',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#C6B797' })
    },
    size: 'large',
    background: '#C6B797',
  },
  {
    key: '#8CB4EA',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#8CB4EA' })
    },
    size: 'large',
    background: '#8CB4EA',
  },
  {
    key: '#C1CCE4',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#C1CCE4' })
    },
    size: 'large',
    background: '#C1CCE4',
  },
  {
    key: '#7ED2F6',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#7ED2F6' })
    },
    size: 'large',
    background: '#7ED2F6',
  },
  {
    key: '#B1894F',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#B1894F' })
    },
    size: 'large',
    background: '#B1894F',
  },
  {
    key: '#E7B8B8',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E7B8B8' })
    },
    size: 'large',
    background: '#E7B8B8',
  },
  {
    key: '#B0D59A',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#B0D59A' })
    },
    size: 'large',
    background: '#B0D59A',
  },
  {
    key: '#D7E3BD',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#D7E3BD' })
    },
    size: 'large',
    background: '#D7E3BD',
  },
  {
    key: '#CDC1D9',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#CDC1D9' })
    },
    size: 'large',
    background: '#CDC1D9',
  },
  {
    key: '#B7DDE9',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#B7DDE9' })
    },
    size: 'large',
    background: '#B7DDE9',
  },
  {
    key: '#FAD6B1',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FAD6B1' })
    },
    size: 'large',
    background: '#FAD6B1',
  },
  {
    key: '#F5CE88',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F5CE88' })
    },
    size: 'large',
    background: '#F5CE88',
  },
  {
    key: '#FFF55A',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FFF55A' })
    },
    size: 'large',
    background: '#FFF55A',
  },
  {
    key: '#EF6C78',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#EF6C78' })
    },
    size: 'large',
    background: '#EF6C78',
  },
  {
    key: '#BFBFBF',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#BFBFBF' })
    },
    size: 'large',
    background: '#BFBFBF',
  },
  {
    key: '#3E3E3E',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#3E3E3E' })
    },
    size: 'large',
    background: '#3E3E3E',
  },
  {
    key: '#938953',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#938953' })
    },
    size: 'large',
    background: '#938953',
  },
  {
    key: '#548ED4',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#548ED4' })
    },
    size: 'large',
    background: '#548ED4',
  },
  {
    key: '#98B7D5',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#98B7D5' })
    },
    size: 'large',
    background: '#98B7D5',
  },
  {
    key: '#00B4F0',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#00B4F0' })
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#9A6C34',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#9A6C34' })
    },
    size: 'large',
    background: '#9A6C34',
  },
  {
    key: '#D79896',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#D79896' })
    },
    size: 'large',
    background: '#D79896',
  },
  {
    key: '#7EC368',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#7EC368' })
    },
    size: 'large',
    background: '#7EC368',
  },
  {
    key: '#C5DDA5',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#C5DDA5' })
    },
    size: 'large',
    background: '#C5DDA5',
  },
  {
    key: '#B1A5C6',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#B1A5C6' })
    },
    size: 'large',
    background: '#B1A5C6',
  },
  {
    key: '#93CDDD',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#93CDDD' })
    },
    size: 'large',
    background: '#93CDDD',
  },
  {
    key: '#F9BD8D',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F9BD8D' })
    },
    size: 'large',
    background: '#F9BD8D',
  },
  {
    key: '#F7B550',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F7B550' })
    },
    size: 'large',
    background: '#F7B550',
  },
  {
    key: '#FFF100',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FFF100' })
    },
    size: 'large',
    background: '#FFF100',
  },
  {
    key: '#E80050',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E80050' })
    },
    size: 'large',
    background: '#E80050',
  },
  {
    key: '#A6A6A7',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#A6A6A7' })
    },
    size: 'large',
    background: '#A6A6A7',
  },
  {
    key: '#2D2D2B',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#2D2D2B' })
    },
    size: 'large',
    background: '#2D2D2B',
  },
  {
    key: '#494428',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#494428' })
    },
    size: 'large',
    background: '#494428',
  },
  {
    key: '#1D3A5F',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#1D3A5F' })
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#376192',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#376192' })
    },
    size: 'large',
    background: '#376192',
  },
  {
    key: '#00A1E9',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#00A1E9' })
    },
    size: 'large',
    background: '#00A1E9',
  },
  {
    key: '#825320',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#825320' })
    },
    size: 'large',
    background: '#825320',
  },
  {
    key: '#903635',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#903635' })
    },
    size: 'large',
    background: '#903635',
  },
  {
    key: '#13B044',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#13B044' })
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#76933C',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#76933C' })
    },
    size: 'large',
    background: '#76933C',
  },
  {
    key: '#5E467C',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#5E467C' })
    },
    size: 'large',
    background: '#5E467C',
  },
  {
    key: '#31859D',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#31859D' })
    },
    size: 'large',
    background: '#31859D',
  },
  {
    key: '#E46C07',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#E46C07' })
    },
    size: 'large',
    background: '#E46C07',
  },
  {
    key: '#F39900',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F39900' })
    },
    size: 'large',
    background: '#F39900',
  },
  {
    key: '#B7AB00',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#B7AB00' })
    },
    size: 'large',
    background: '#B7AB00',
  },
  {
    key: '#A50036',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#A50036' })
    },
    size: 'large',
    background: '#A50036',
  },
  {
    key: '#979D99',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#979D99' })
    },
    size: 'large',
    background: '#979D99',
  },
  {
    key: '#0C0C0C',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#0C0C0C' })
    },
    size: 'large',
    background: '#0C0C0C',
  },
  {
    key: '#1C1A10',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#1C1A10' })
    },
    size: 'large',
    background: '#1C1A10',
  },
  {
    key: '#0C263D',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#0C263D' })
    },
    size: 'large',
    background: '#0C263D',
  },
  {
    key: '#1D3A5F',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#1D3A5F' })
    },
    size: 'large',
    background: '#1D3A5F',
  },
  {
    key: '#005883',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#005883' })
    },
    size: 'large',
    background: '#005883',
  },
  {
    key: '#693904',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#693904' })
    },
    size: 'large',
    background: '#693904',
  },
  {
    key: '#622727',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#622727' })
    },
    size: 'large',
    background: '#622727',
  },
  {
    key: '#005E14',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#005E14' })
    },
    size: 'large',
    background: '#005E14',
  },
  {
    key: '#4F6028',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#4F6028' })
    },
    size: 'large',
    background: '#4F6028',
  },
  {
    key: '#3E3050',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#3E3050' })
    },
    size: 'large',
    background: '#3E3050',
  },
  {
    key: '#245B66',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#245B66' })
    },
    size: 'large',
    background: '#245B66',
  },
  {
    key: '#974805',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#974805' })
    },
    size: 'large',
    background: '#974805',
  },
  {
    key: '#AD6A00',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#AD6A00' })
    },
    size: 'large',
    background: '#AD6A00',
  },
  {
    key: '#8B8100',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#8B8100' })
    },
    size: 'large',
    background: '#8B8100',
  },
  {
    key: '#7C0022',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#8B8100' })
    },
    size: 'large',
    background: '#7C0022',
  },
  {
    key: '#F0DCBE',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F0DCBE' })
    },
    size: 'large',
    background: '#F0DCBE',
  },
  {
    key: '#F2B1CF',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F2B1CF' })
    },
    size: 'large',
    background: '#F2B1CF',
  },
  {
    key: '#D3FFBF',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#D3FFBF' })
    },
    size: 'large',
    background: '#D3FFBF',
  },
  {
    key: '#00165F',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#00165F' })
    },
    size: 'large',
    background: '#00165F',
  },
  {
    key: '#6673CB',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#6673CB' })
    },
    size: 'large',
    background: '#6673CB',
  },
  {
    key: '#006EBF',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#006EBF' })
    },
    size: 'large',
    background: '#006EBF',
  },
  {
    key: '#89CF66',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#89CF66' })
    },
    size: 'large',
    background: '#89CF66',
  },
  {
    key: '#70A900',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#70A900' })
    },
    size: 'large',
    background: '#70A900',
  },
  {
    key: '#13B044',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#13B044' })
    },
    size: 'large',
    background: '#13B044',
  },
  {
    key: '#93D150',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#93D150' })
    },
    size: 'large',
    background: '#93D150',
  },
  {
    key: '#70319F',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#70319F' })
    },
    size: 'large',
    background: '#70319F',
  },
  {
    key: '#00B4F0',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#00B4F0' })
    },
    size: 'large',
    background: '#00B4F0',
  },
  {
    key: '#D38968',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#D38968' })
    },
    size: 'large',
    background: '#D38968',
  },
  {
    key: '#FFBF00',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FFBF00' })
    },
    size: 'large',
    background: '#FFBF00',
  },
  {
    key: '#FFFF00',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FFFF00' })
    },
    size: 'large',
    background: '#FFFF00',
  },
  {
    key: '#C10000',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#C10000' })
    },
    size: 'large',
    background: '#C10000',
  },
  {
    key: '#F0F1A6',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#F0F1A6' })
    },
    size: 'large',
    background: '#F0F1A6',
  },
  {
    key: '#FF0000',
    action: () => {
      GLOBAL.legend.setMapLegend({ backgroundColor: '#FF0000' })
    },
    size: 'large',
    background: '#FF0000',
  },
]
export {
  lineColorSet,
  pointColorSet,
  regionBeforeColorSet,
  regionAfterColorSet,
  legendColor,
  mapBackGroundColor,
}
