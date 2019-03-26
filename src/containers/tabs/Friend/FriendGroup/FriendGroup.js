/**
 * Created by imobile-xzy on 2019/3/4.
 */
/**
 * Created by imobile-xzy on 2019/3/4.
 */

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'

class FriendGroup extends Component {
  props: {
    navigation: Object,
    user: Object,
    friend: Object,
  }

  constructor(props) {
    super(props)
    //this.screenWidth = Dimensions.get('window').width
    this.state = {
      data: [{}],
      isRefresh: false,
      // progressWidth: this.screenWidth * 0.4,
      isLoadingData: false,
    }
  }

  refresh = () => {
    this.getContacts()
  }

  getContacts = async () => {}
  render() {
    //console.log(params.user);
    return (
      <View style={styles.container}>
        <View style={styles.whatLeft}>
          <Text style={{ fontSize: 20, textAlign: 'center', margin: 10 }}>
            group
          </Text>
        </View>
      </View>
    )
  }
}
var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  whatLeft: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //borderTopWidth:1,
    borderColor: 'black',
  },
})

export default FriendGroup
