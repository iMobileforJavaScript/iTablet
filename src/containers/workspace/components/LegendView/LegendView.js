import * as React from 'react'
import { View, StyleSheet } from 'react-native'
// import { SMRLegendView, SMLegendView } from 'imobile_for_reactnative'
// import { scaleSize } from '../../../../utils'

export default class LegendView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        {/*<View style={{flex: 1, backgroundColor: 'gray'}}/>*/}
        {/*<SMRLegendView*/}
        {/*LegendStyle={{*/}
        {/*width: scaleSize(200),*/}
        {/*height: scaleSize(300),*/}
        {/*TextSize: 30,*/}
        {/*RowHeight: 200,*/}
        {/*// TextColor: 0xFFFF0000,*/}
        {/*}}*/}
        {/*/>*/}
        {/*<View style={{flex: 1, backgroundColor: 'blue'}}/>*/}
        {/*<SMLegendView mapId={'aaa'} />*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'yellow',
  },
})
