// import { fromJS } from 'immutable'
// import { REHYDRATE } from 'redux-persist'
// import { handleActions } from 'redux-actions'
//
// // Constants
// // --------------------------------------------------
// export const SET_MAP_NAME = 'SET_MAP_NAME'
// export const OVERLAY_SETTING_SET = 'OVERLAY_SETTING_SET'
// export const ROUTE_SETTING_SET = 'ROUTE_SETTING_SET'
// export const TRACKING_SETTING_SET = 'TRACKING_SETTING_SET'
// export const SETTING_DATA = 'SETTING_DATA'
// export const MAP_SETTING = 'MAP_SETTING'
//
// // Actions
// // --------------------------------------------------
// export const setMapName = (params, cb = () => {}) => async dispatch => {
//   await dispatch({
//     type: SET_MAP_NAME,
//     payload: params || {},
//   })
//   cb && cb()
// }
//
// const initialState = fromJS({
//   map3D: [],
//   map: [
//     {
//       title: '基本设置',
//       visible: true,
//       index: 0,
//       data: [
//         {
//           name: '图层名称',
//           value: '',
//           isShow: true,
//           sectionIndex: 0,
//         },
//         {
//           name: '显示专题图图例',
//           value: true,
//           isShow: true,
//           sectionIndex: 0,
//         },
//         {
//           name: '显示状态栏',
//           value: true,
//           isShow: true,
//           sectionIndex: 0,
//         },
//         {
//           name: '显示导航栏',
//           value: true,
//           isShow: true,
//           sectionIndex: 0,
//         },
//       ],
//     },
//     {
//       title: '效果设置',
//       visible: true,
//       index: 1,
//       data: [
//         {
//           name: '旋转角度',
//           value: '',
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '颜色模式',
//           value: '',
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '背景颜色',
//           value: '',
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '文本反走样',
//           value: false,
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '线型反走样',
//           value: false,
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '固定符号角度',
//           value: false,
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '固定文本角度',
//           value: false,
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '固定文本方向',
//           value: false,
//           isShow: true,
//           sectionIndex: 1,
//         },
//         {
//           name: '显示压盖对象',
//           value: false,
//           isShow: true,
//           sectionIndex: 1,
//         },
//       ],
//     },
//     {
//       title: '范围设置',
//       visible: true,
//       index: 2,
//       data: [
//         {
//           name: '中心点',
//           value: '',
//           isShow: true,
//           sectionIndex: 2,
//         },
//         {
//           name: '比例尺',
//           value: '',
//           isShow: true,
//           sectionIndex: 2,
//         },
//         {
//           name: '固定比例尺级别',
//           value: '',
//           isShow: true,
//           sectionIndex: 2,
//         },
//         {
//           name: '当前窗口四至范围',
//           value: '',
//           isShow: true,
//           sectionIndex: 2,
//         },
//       ],
//     },
//     {
//       title: '坐标系设置',
//       visible: true,
//       index: 3,
//       data: [
//         {
//           name: '投影设置',
//           value: '',
//           isShow: true,
//           sectionIndex: 3,
//         },
//         {
//           name: '投影转换',
//           value: '',
//           isShow: true,
//           sectionIndex: 3,
//         },
//       ],
//     },
//   ],
// })
//
// export default handleActions(
//   {
//     [`${SET_MAP_NAME}`]: (state, { payload }) => {
//       let map = state.toJS().map
//       return state.setIn(['buffer'], fromJS(payload))
//     },
//     [`${OVERLAY_SETTING_SET}`]: (state, { payload }) => {
//       let data = state.toJS().overlay
//       if (payload) {
//         Object.assign(data, payload)
//       } else {
//         data = initialState.toJS().overlay
//       }
//       return state.setIn(['overlay'], fromJS(data))
//     },
//     [`${ROUTE_SETTING_SET}`]: (state, { payload }) => {
//       let data = state.toJS().overlay
//       if (payload) {
//         Object.assign(data, payload)
//       } else {
//         data = initialState.toJS().overlay
//       }
//       return state.setIn(['overlay'], fromJS(data))
//     },
//     [`${TRACKING_SETTING_SET}`]: (state, { payload }) => {
//       let data = state.toJS().overlay
//       if (payload) {
//         Object.assign(data, payload)
//       } else {
//         data = initialState.toJS().overlay
//       }
//       return state.setIn(['overlay'], fromJS(data))
//     },
//     [`${SETTING_DATA}`]: (state, { payload }) => {
//       let data = state.toJS().settingData
//       if (payload) {
//         data = payload
//       } else {
//         data = []
//       }
//       return state.setIn(['settingData'], fromJS(data))
//     },
//     [`${MAP_SETTING}`]: (state, { payload }) => {
//       let data = state.toJS().mapSetting
//       if (payload) {
//         data = payload
//       } else {
//         data = []
//       }
//       return state.setIn(['mapSetting'], fromJS(data))
//     },
//     [REHYDRATE]: (state, { payload }) => {
//       return payload && payload.setting ? fromJS(payload.setting) : state
//     },
//   },
//   initialState,
// )
