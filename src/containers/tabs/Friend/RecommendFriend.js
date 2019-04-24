import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
} from 'react-native'
import { SOnlineService } from 'imobile_for_reactnative'
import { Container } from '../../../components'
import { scaleSize } from '../../../utils/screen'
import { getLanguage } from '../../../language/index'
import Contacts from 'react-native-contacts'

class RecommendFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.target
    this.friend = {}
    this.user = this.props.navigation.getParam('user')
    this.state = {
      contacts: [],
    }
    this.language = this.props.navigation.getParam('language')
    this.search = this.search.bind(this)
    this._renderItem = this._renderItem.bind(this)
  }

  componentDidMount() {
    setTimeout(this.requestPermission, 1000)
  }

  requestPermission = () => {
    if (Platform === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: 'Contacts',
        message: 'This app would like to view your contacts.',
      }).then(() => {
        this.getContacts()
      })
    } else {
      Contacts.checkPermission((err, permission) => {
        if (err) throw err
        if (permission === 'undefined') {
          Contacts.requestPermission((err, permission) => {
            if (err) throw err
            if (permission === 'authorized') {
              this.getContacts()
            }
            if (permission === 'denied') {
              alert(
                '访问通讯录权限没打开',
                '请在iPhone的“设置-隐私”选项中,允许访问您的通讯录',
              )
            }
          })
        }
        if (permission === 'authorized') {
          this.getContacts()
        }
        if (permission === 'denied') {
          alert(
            '访问通讯录权限没打开',
            '请在iPhone的“设置-隐私”选项中,允许访问您的通讯录',
          )
        }
      })
    }
  }

  getContacts = async () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        // error
      } else {
        contacts.map(async item => {
          if (item.phoneNumbers.length > 0) {
            await this.search({
              familyName: item.familyName,
              givenName: item.givenName,
              phoneNumbers: item.phoneNumbers,
            })
          }
        })
      }
    })
  }

  async search(val) {
    let i = 0
    for (i; i < val.phoneNumbers.length; i++) {
      if (!val.phoneNumbers[i]) {
        break
      }
      if (val.phoneNumbers[i].label !== 'mobile') {
        break
      }
      let number = this.formatPhoneNumber(val.phoneNumbers[i].number)
      let result = await SOnlineService.getUserInfoBy(number, 0)
      // let result =['0','a']
      if (result !== false) {
        let array = this.state.contacts
        array.push({
          familyName: val.familyName,
          givenName: val.givenName,
          phoneNumbers: val.phoneNumbers[i],
          id: result[0],
          name: result[1],
        })
        this.setState({
          contacts: this.state.contacts.map(item => {
            return item
          }),
        })
      }
    }
  }

  formatPhoneNumber = number => {
    return number.replace(/\s+/g, '')
  }
  render() {
    return (
      <Container
        ref={ref => (this.container = ref)}
        headerProps={{
          title: getLanguage(global.language).Friends.RECOMMEND_FRIEND,
          withoutBack: false,
          navigation: this.props.navigation,
        }}
      >
        <FlatList
          style={{
            top: scaleSize(10),
          }}
          data={this.state.contacts}
          // ItemSeparatorComponent={() => {
          //   return <View style={styles.SectionSeparaLineStyle} />
          // }}
          // extraData={this.state}
          // renderItem={this._renderItem}
          renderItem={({ item }) => (
            <View>
              <Text>{item.familyName + item.givenName}</Text>
              <Text>{item.phoneNumbers.number}</Text>
              <Text>{item.name}</Text>
              <Text>{item.id}</Text>
            </View>
          )}
          // initialNumToRender={2}
          // keyExtractor={(item, index) => index.toString()}
          // ListEmptyComponent={<Loading/>}
          // ListHeaderComponent={this._renderSearch}
          // ListFooterComponent={this._renderFooter}
          // onEndReached={this._fetchMoreData}
          // onEndReachedThreshold={0.3}
          // returnKeyType={'search'}
          // keyboardDismissMode={'on-drag'}
        />
      </Container>
    )
  }

  _renderItem({ item }) {
    // <View>
    <Text>{item.name}</Text>
    // <View>
  }
}

// eslint-disable-next-line no-unused-vars
var styles = StyleSheet.create({
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginHorizontal: scaleSize(10),
    marginLeft: scaleSize(120),
  },
})
export default RecommendFriend
