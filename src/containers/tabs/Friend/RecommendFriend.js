import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native'
import { SOnlineService } from 'imobile_for_reactnative'
import { Container, Dialog } from '../../../components'
import { dialogStyles } from './Styles'
import { scaleSize } from '../../../utils/screen'
import { getLanguage } from '../../../language/index'
// eslint-disable-next-line
import Contacts from 'react-native-contacts'
import { Toast } from '../../../utils'
import FriendListFileHandle from './FriendListFileHandle'
import MsgConstant from './MsgConstant'
import NavigationService from '../../NavigationService'

class RecommendFriend extends Component {
  props: {
    navigation: Object,
    user: Object,
  }

  constructor(props) {
    super(props)
    this.screenWidth = Dimensions.get('window').width
    this.target
    this.friend = this.props.navigation.getParam('friend')
    this.user = this.props.navigation.getParam('user')
    this.state = {
      contacts: [],
    }
    this.language = this.props.navigation.getParam('language')
    this.search = this.search.bind(this)
    this._renderItem = this._renderItem.bind(this)
    this.addFriendRequest = this.addFriendRequest.bind(this)
    this.exit = false
  }

  componentDidMount() {
    setTimeout(this.requestPermission, 1000)
  }

  componentWillUnmount() {
    this.exit = true
  }

  requestPermission = async () => {
    if (Platform.OS === 'android') {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      )
      if (granted == PermissionsAndroid.RESULTS.GRANTED) {
        this.getContacts()
      } else {
        this.permissionDeniedDialog.setDialogVisible(true)
      }
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
              this.permissionDeniedDialog.setDialogVisible(true)
            }
          })
        }
        if (permission === 'authorized') {
          this.getContacts()
        }
        if (permission === 'denied') {
          this.permissionDeniedDialog.setDialogVisible(true)
        }
      })
    }
  }

  getContacts = async () => {
    Contacts.getAll(async (err, contacts) => {
      if (err === 'denied') {
        this.permissionDeniedDialog.setDialogVisible(true)
      } else {
        GLOBAL.Loading.setLoading(
          true,
          getLanguage(this.language).Friends.SEARCHING,
        )
        for (let i = 0, len = contacts.length; i < len; i++) {
          let item = contacts[i]
          if (item.phoneNumbers.length > 0 || item.emailAddresses.length > 0) {
            await this.search({
              familyName: item.familyName,
              givenName: item.givenName,
              phoneNumbers: item.phoneNumbers,
              emails: item.emailAddresses,
            })
            if (this.exit) {
              GLOBAL.Loading.setLoading(false)
              return
            }
          }
        }
        GLOBAL.Loading.setLoading(false)
        if (this.state.contacts.length === 0) {
          Toast.show(getLanguage(this.language).Friends.FIND_NONE)
        }
      }
    })
  }

  async search(val) {
    for (let i = 0; i < val.phoneNumbers.length; i++) {
      if (!val.phoneNumbers[i]) {
        break
      }
      if (val.phoneNumbers[i].label !== 'mobile') {
        break
      }
      let number = this.formatPhoneNumber(val.phoneNumbers[i].number)
      let result = await SOnlineService.getUserInfoBy(number, 0)
      if (result !== false && result !== '获取用户id失败') {
        if (
          result[0] &&
          result[0] !== this.user.userId &&
          !FriendListFileHandle.isFriend(result[0])
        ) {
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
    for (let i = 0; i < val.emails.length; i++) {
      let result = await SOnlineService.getUserInfoBy(val.emails[i].email, 0)
      if (result !== false && result !== '获取用户id失败') {
        if (
          result[0] &&
          result[0] !== this.user.userId &&
          !FriendListFileHandle.isFriend(result[0])
        ) {
          let array = this.state.contacts
          array.push({
            familyName: val.familyName,
            givenName: val.givenName,
            email: val.emails[i].email,
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
  }

  formatPhoneNumber = number => {
    number = number.replace(/\s+/g, '')
    number = number.replace(/\D+/g, '')
    return number
  }

  async addFriendRequest() {
    this.dialog.setDialogVisible(false)

    let ctime = new Date()
    let time = Date.parse(ctime)
    let message = {
      message: this.user.nickname + ' 请求添加您为好友',
      type: MsgConstant.MSG_ADD_FRIEND,
      user: {
        name: this.user.nickname,
        id: this.user.userId,
        groupID: this.user.userId,
        groupName: '',
      },
      time: time,
    }

    this.friend._sendMessage(JSON.stringify(message), this.target.id, true)

    FriendListFileHandle.addToFriendList({
      markName: this.target.name,
      name: this.target.name,
      id: this.target.id,
      info: { isFriend: 1 },
    })
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
          renderItem={this._renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
        {this.renderDialog()}
        {this.renderPermissionDenidDialog()}
      </Container>
    )
  }

  _renderItem({ item }) {
    return (
      <View>
        <TouchableOpacity
          style={[styles.ItemViewStyle]}
          activeOpacity={0.75}
          onPress={() => {
            this.target = item //[id,name]
            if (this.target.id == this.user.userId) {
              Toast.show(getLanguage(this.language).Friends.ADD_SELF)
              return
            }
            if (FriendListFileHandle.isFriend(this.target.id)) {
              NavigationService.navigate('Chat', {
                targetId: this.target.id,
              })
            } else {
              this.dialog.setDialogVisible(true)
            }
          }}
        >
          <View style={[styles.ItemHeadViewStyle, { opacity: 1 }]}>
            <Text style={styles.ItemHeadTextStyle}>{item.name[0]}</Text>
          </View>
          <View style={{ flexDirection: 'column' }}>
            <View style={[styles.ItemTextViewStyle, { opacity: 1 }]}>
              <Text style={styles.ItemTextStyle}>{item.name}</Text>
            </View>
            <View style={styles.ItemSubTextViewStyle}>
              <Text style={styles.ItemSubTextStyle}>
                {item.familyName === null || item.familyName === ''
                  ? ''
                  : item.familyName + ' '}
                {item.givenName === null ? '' : item.givenName}
              </Text>
              <Text style={styles.ItemSubTextStyle}>
                {item.phoneNumbers ? item.phoneNumbers.number : item.email}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderDialog = () => {
    return (
      <Dialog
        ref={ref => (this.dialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={this.addFriendRequest}
        opacity={1}
        opacityStyle={dialogStyles.dialogBackgroundX}
        style={dialogStyles.dialogBackgroundX}
      >
        {this.renderDialogChildren()}
      </Dialog>
    )
  }

  renderDialogChildren = () => {
    return (
      <View style={dialogStyles.dialogHeaderViewX}>
        <Image
          source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
          style={dialogStyles.dialogHeaderImgX}
        />
        <Text style={dialogStyles.promptTtileX}>
          {getLanguage(this.language).Friends.ADD_AS_FRIEND}
        </Text>
      </View>
    )
  }

  renderPermissionDenidDialog = () => {
    return (
      <Dialog
        ref={ref => (this.permissionDeniedDialog = ref)}
        type={'modal'}
        confirmBtnTitle={getLanguage(this.language).Friends.CONFIRM}
        cancelBtnTitle={getLanguage(this.language).Friends.CANCEL}
        confirmAction={() => {
          this.permissionDeniedDialog.setDialogVisible(false)
        }}
        opacity={1}
        opacityStyle={dialogStyles.dialogBackgroundX}
        style={dialogStyles.dialogBackgroundX}
      >
        <View style={dialogStyles.dialogHeaderViewX}>
          <Image
            source={require('../../../assets/home/Frenchgrey/icon_prompt.png')}
            style={dialogStyles.dialogHeaderImgX}
          />
          <Text style={dialogStyles.promptTtileX}>
            {getLanguage(this.language).Friends.PERMISSION_DENIED_CONTACT}
          </Text>
        </View>
      </Dialog>
    )
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
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(30),
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginBottom: scaleSize(30),
  },
  ItemHeadViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(40),
    width: scaleSize(40),
    borderRadius: scaleSize(40),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ItemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  ItemTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
  },
  ItemHeadTextStyle: {
    fontSize: scaleSize(25),
    color: 'white',
  },
  ItemSubTextViewStyle: {
    marginLeft: scaleSize(20),
    flexDirection: 'row',
  },
  ItemSubTextStyle: {
    fontSize: scaleSize(25),
    marginRight: scaleSize(10),
    color: 'black',
  },
})
export default RecommendFriend
