import { StyleSheet } from 'react-native'
import { scaleSize, screen } from '../../../utils'
import { size, color } from '../../../styles'
export { screen, color }
export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  header: {
    // flex: 1,
    flexDirection: 'row',
    height: scaleSize(300),
  },
  avatarView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: scaleSize(160),
    width: scaleSize(160),
  },
  headerContent: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: scaleSize(300),
  },
  labelView: {
    flex: 1,
    height: scaleSize(80),
    marginHorizontal: scaleSize(30),
    justifyContent: 'center',
  },
  label: {
    fontSize: size.fontSize.fontSizeMd,
    backgroundColor: 'transparent',
  },

  //new
  mineContainer: {
    flex: 1,
    backgroundColor: '#EEEEEE',
    justifyContent: 'space-between',
  },
  //profile
  profileContainer: {
    backgroundColor: '#303030',
    width: '100%',
    height: '43%',
    alignItems: 'center',
    paddingTop: scaleSize(30),
  },
  //Myprofile
  MyProfileStyle: {
    marginVertical: scaleSize(20),
    alignItems: 'center',
  },
  profileImages: {
    flex: 1,
    backgroundColor: 'yellow',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileHeadStyle: {
    alignItems: 'center',
    marginBottom: -scaleSize(30),
  },
  profileAvatarStyle: {
    height: scaleSize(140),
    width: scaleSize(140),
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(70),
  },
  headImgStyle: {
    height: scaleSize(130),
    width: scaleSize(130),
    borderRadius: scaleSize(65),
  },
  moreViewStyle: {
    height: scaleSize(50),
    width: scaleSize(50),
    borderRadius: scaleSize(50),
    backgroundColor: '#4680DF',
    top: -scaleSize(30),
    borderColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreX: {
    backgroundColor: '#FFFFFF',
    width: scaleSize(30),
    height: scaleSize(3),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 1,
  },
  moreY: {
    backgroundColor: '#FFFFFF',
    width: scaleSize(3),
    height: scaleSize(30),
    borderRadius: 1,
  },
  profileTextStyle: {
    alignItems: 'center',
  },
  profileTextLandscapeStyle: {
    alignItems: 'flex-start',
    width: scaleSize(300),
    top: -scaleSize(130),
    right: -scaleSize(250),
  },
  userNameStyle: {
    fontSize: scaleSize(40),
    color: '#FFFFFF',
  },
  statusTextStyle: {
    fontSize: scaleSize(24),
    color: '#C2C2C2',
  },
  //search
  searchViewStyle: {
    width: scaleSize(460),
    height: scaleSize(48),
    backgroundColor: '#505050',
    borderRadius: scaleSize(24),
    paddingHorizontal: scaleSize(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchImgStyle: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  searchInputStyle: {
    width: scaleSize(380),
    paddingVertical: 0,
    fontSize: scaleSize(20),
    color: '#A7A7A7',
  },
  //side
  sideItemStyle: {
    position: 'absolute',
    right: 0,
    top: scaleSize(20),
    backgroundColor: '#ED372E',
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(20),
    borderTopLeftRadius: scaleSize(20),
    borderBottomLeftRadius: scaleSize(20),
  },
  SideTextStyle: {
    fontSize: scaleSize(20),
    color: '#FFFFFF',
  },

  //datas
  datasContainer: {
    backgroundColor: color.contentWhite,
    height: '53%',
  },
  scrollContentStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scaleSize(20),
  },
  itemView: {
    height: scaleSize(120),
    marginVertical: scaleSize(15),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  itemLandscapeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: scaleSize(80),
  },
  itemImg: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  itemText: {
    textAlign: 'center',
    fontSize: scaleSize(24),
  },

  logoView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoImagStyle: {
    width: scaleSize(100),
    height: scaleSize(100),
    marginBottom: scaleSize(30),
    marginHorizontal: scaleSize(10),
  },
})
