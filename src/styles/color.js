const blackTheme = {
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
  bgW: '#F0F0F0',
  bgG: '#A0A0A0',
}

let styles
switch (GLOBAL.themeStyle) {
  case 'blackTheme':
  default:
    styles = blackTheme
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
  item_separate_white: '#727272',
  content_white: '#F0F0F0',
  font_color_white: '#303030',
  image_bg_white: '#727272',
  theme_white: '#303030',
}
