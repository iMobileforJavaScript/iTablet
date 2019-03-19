import * as React from 'react'
import { View, StyleSheet } from 'react-native'
// import { SMRLegendView } from 'imobile_for_reactnative'

export default class LegendView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {}

  render() {
    return (
      <View style={styles.container}>
        {/*<SMRLegendView*/}
        {/*LegendStyle={{*/}
        {/*TextSize: 30,*/}
        {/*RowHeight: 400,*/}
        {/*// TextColor: 0xFFFF0000,*/}
        {/*}}*/}
        {/*/>*/}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
