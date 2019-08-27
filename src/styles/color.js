import { ThemeType } from '../constants'

const darkTheme = {
  theme: '#2D2D2F',
  reverseTheme: '#FFFFFF',
  borderLight: '#C1C0B9',
  border: '#505052',
  subTheme: '#48484b',
  themeText: '#FFFFFF',
  themeText2: '#303030',
  themePlaceHolder: '#959595',

  overlay: 'rgba(105, 105, 105, 0.8)',
  transOverlay: 'rgba(0, 0, 0, 0)',
  transView: 'rgba(48, 48, 48, 0.85)',
  blackBg: '#353537',
  bgW: '#FBFBFB',
  bgG: '#A0A0A0',
}

const lightTheme = {
  theme: '#2D2D2F',
  reverseTheme: '#FFFFFF',
  borderLight: '#C1C0B9',
  border: '#505052',
  subTheme: '#48484b',
  themeText: '#FFFFFF',
  themeText2: '#303030',
  themePlaceHolder: '#959595',

  overlay: 'rgba(105, 105, 105, 0.8)',
  transOverlay: 'rgba(0, 0, 0, 0)',
  transView: 'rgba(240, 240, 240, 0.85)',
  blackBg: '#353537',
  bgW: '#FBFBFB',
  bgG: '#A0A0A0',
  switch: '#4680DF',
  // selected: '#4680DF',
  selected: 'rgba(70, 128, 223, 0.5)',

  fontColorWhite: '#FBFBFB',
  fontColorBlack: '#303030',
  fontColorGray: '#A0A0A0',

  itemColorWhite: '#FBFBFB',
  itemColorBlack: '#303030',
  itemColorGray: '#505050',

  contentColorWhite: '#FBFBFB',
  contentWhite: '#FBFBFB',
  contentColorWhite2: 'rgba(240,240,240, 0.85)',
  contentColorBlack: '#303030',
  contentColorGray: '#505050',

  borderColorBlack: '#303030',

  // separateColorGray: '#A0A0A0',
  separateColorGray: '#EEEEEE',

  imageColorBlack: '#303030',
  imageColorWhite: '#FBFBFB',

  // modalBgColor: 'rgba(48, 48, 48, 0.85)',
  modalBgColor: 'rgba(0, 0, 0, 0.5)',
}

let styles
switch (GLOBAL.ThemeType) {
  case ThemeType.DARK_THEME:
    styles = darkTheme
    break
  case ThemeType.LIGHT_THEME:
  default:
    styles = lightTheme
    break
}

export default {
  ...styles,

  white: '#FFFFFF',
  red: '#FF0000',
  yellow: '#FFFF00',
  grassGreen: '#7BB736',
  cyan: '#41C7DB',
  black: '#000000',

  background: '#e2e2e2',
  background1: '#f3f3f3',
  background3: '#F1F1F1',
  headerBackground: '#959595',

  red1: '#d81e06',
  pink: '#FF9AA9',
  black1: '#222222',
  gray: '#959595',
  grayL: '#999999',
  gray1: '#94A0B2',
  gray2: '#A5AFBD',
  gray3: '#dbdfe5',
  gray4: '#DBDFE5',
  gray5: '#E9E9EF',
  grayLight: '#e2e2e2',
  grayLight2: '#BCC3CE',
  // border: '#e0e0e0',
  title2: '#454545',
  background2: '#f5f7fa',
  statusBarColor: 'white',
  blue1: '#4BA0FF',
  blue2: '#1296db',

  USUAL_SEPARATORCOLOR: 'rgba(59,55,56,0.3)',
  UNDERLAYCOLOR: 'rgba(34,26,38,0.1)',
  USUAL_GREEN: '#F5FCFF',
  USUAL_BLUE: '#2196f3',
  USUAL_PURPLE: '#871F78',

  green1: '#1afa29',

  /** 深色版*/
  content: '#555555',
  /** 浅色版*/
  item_separate_white: '#A0A0A0', //分割线
  content_white: '#FBFBFB', //列表项目背景
  font_color_white: '#303030', //列表项目文字颜色
  image_bg_white: '#727272',
  theme_white: '#303030',
  section_bg: '#505050', //列表一级标题背景
  section_text: '#FBFBFB', //列表一级标题文字
  bottomz: '#303030', //底部工具栏背景
  overlay_tint: 'rgba(48,48,48,0.85)', //遮罩颜色为#303030,85%不透明度
  item_selected_bg: '#4680DF', //列表选中背景
  item_text_selected: '#FBFBFB', //列表文字选中颜色

  // 提示消息颜色
  infoBg: '#EDF1FB',
  warningBg: '#FAF5EC',
  successBg: '#F2F9EB',
  errorBg: '#FAEFEF',
  info: '#8F9198',
  warning: '#D4A146',
  success: '#88C148',
  error: '#D96C6C',
}
