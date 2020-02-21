// import { AppRegistry, requireNativeComponent, View, Button, NativeModules } from 'react-native'
// // import App from './App'
// import React, { Component } from 'react'
// import { dataUtil } from './src/utils'
// const NativeMethod = NativeModules.NativeMethod
// let index = 0
// class SMTestView extends Component {
//   render() {
//     return (
//       <View>
//         <Button title="aaa" onPress={() => {
//           console.warn(index)
//           NativeMethod.addViewToTest(index++)
//         }}/>
//         <Button title="Refresh" onPress={() => {
//           NativeMethod.refreshView()
//         }}/>
//         <View style={{margin: 10}}>
//           <RCTTestView
//             style={{
//               height: 300,
//               width: 300,
//               backgroundColor: dataUtil.colorRgba('#ff0000'),
//             }}
//           />
//         </View>
//       </View>
//     )
//   }
// }
//
// var RCTTestView = requireNativeComponent('RCTTestView', SMTestView, {
//   nativeOnly: {
//     returnId: true,
//     onChange: true,
//   },
// })
//
//
// AppRegistry.registerComponent('iTablet', () => SMTestView)
import 'react-native-gesture-handler'
import { AppRegistry } from 'react-native'
import App from './App'

AppRegistry.registerComponent('iTablet', () => App)
