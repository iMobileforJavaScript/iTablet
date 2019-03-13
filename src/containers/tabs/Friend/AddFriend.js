/**
 * Created by imobile-xzy on 2019/3/11.
 */
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native'
//import NavigationService from '../../NavigationService'
import { scaleSize } from '../../../utils/screen'
import Container from '../../../components/Container'

class AddFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.state = {
      list: [],
      isLoading: false,
      text: '',
    }
  }

  renderSearchBar = () => {
    return (
      <View
        style={{
          flex: 1,
          height: scaleSize(50),
          marginLeft: scaleSize(10),
          marginRight: scaleSize(10),
          marginBottom: scaleSize(5),
        }}
      >
        {
          <TextInput
            autoCapitalize="none"
            placeholder="邮箱/手机/昵称"
            clearButtonMode="while-editing"
            onChangeText={newWord => this.setState({ text: newWord })}
            underlineColorAndroid="white"
            style={styles.searchBarTextInput}
          />
        }
      </View>
    )
  }

  search = () => {
    let val = this.state.text
    if (!val) {
      return
    }
    this.page = 1
    this.total = 1
    this.setState(
      {
        list: [val],
      },
      // , _ => {
      //   this.searching = true
      //   this._fetchMoreData()
      // }
    )
  }

  renderSearchButton = () => {
    let text = this.state.text.trim()
    return (
      <TouchableOpacity
        activeOpacity={text.length > 0 ? 0.5 : 1}
        onPress={this.search}
      >
        <Text
          style={[
            styles.sendText,
            { color: text.length > 0 ? '#0084ff' : '#BBB' },
          ]}
        >
          搜索
        </Text>
      </TouchableOpacity>
    )
  }

  _renderItem(item) {
    return (
      <TouchableOpacity
        style={styles.ItemViewStyle}
        activeOpacity={0.75}
        onPress={() => {}}
      >
        <View style={styles.ITemHeadTextViewStyle}>
          <Text style={styles.ITemHeadTextStyle}>{item[0].toUpperCase()}</Text>
        </View>
        <View style={styles.ITemTextViewStyle}>
          <Text style={styles.ITemTextStyle}>{item}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    //console.log(params.user);
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: '添加好友',
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 2,
            borderBottomColor: '#ccc',
            top: scaleSize(10),
            marginLeft: scaleSize(10),
            marginRight: scaleSize(10),
          }}
        >
          {this.renderSearchBar()}
          {this.renderSearchButton()}
        </View>
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.list}
          ItemSeparatorComponent={() => {
            return <View style={styles.SectionSeparaLineStyle} />
          }}
          // extraData={this.state}
          renderItem={({ item, index }) => this._renderItem(item, index)}
          initialNumToRender={2}
          keyExtractor={(item, index) => index.toString()}
          // ListEmptyComponent={<Loading/>}
          // ListHeaderComponent={this._renderSearch}
          // ListFooterComponent={this._renderFooter}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={0.3}
          returnKeyType={'search'}
          keyboardDismissMode={'on-drag'}
        />
      </Container>
    )
  }
}
var styles = StyleSheet.create({
  searchBarTextInput: {
    flex: 1,
    backgroundColor: 'white',
    // borderColor:'green',
    // height:textSize*1.4,
    // width:textSize*10,
    paddingTop: 0,
    paddingBottom: 0,
    fontSize: scaleSize(20),
    borderRadius: scaleSize(10),
    textAlign: 'center',
  },
  sendText: {
    fontWeight: '600',
    fontSize: 17,
    backgroundColor: 'transparent',
    marginLeft: 5,
    marginRight: 10,
  },

  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  ITemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(25),
    color: 'white',
  },
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    height: scaleSize(70),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: scaleSize(40),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
})

export default AddFriend
