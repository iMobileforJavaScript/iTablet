/**
 * Created by imobile-xzy on 2019/3/16.
 */

import { StyleSheet } from 'react-native'
import { scaleSize } from '../../../../utils/screen'
const styles = StyleSheet.create({
  ItemViewStyle: {
    paddingLeft: scaleSize(20),
    paddingRight: scaleSize(20),
    height: scaleSize(140),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  ITemHeadTextViewStyle: {
    marginLeft: scaleSize(20),
    height: scaleSize(60),
    width: scaleSize(60),
    borderRadius: scaleSize(60),
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ITemHeadTextStyle: {
    fontSize: scaleSize(30),
    color: 'white',
  },

  ITemTextViewStyle: {
    marginRight: scaleSize(10),
    marginLeft: scaleSize(25),
    flexDirection: 'column',
    justifyContent: 'space-between',
    flex: 1,
  },
  ITemTextStyle: {
    fontSize: scaleSize(30),
    color: 'black',
  },
  SectionSeparaLineStyle: {
    height: scaleSize(1),
    backgroundColor: 'rgba(160,160,160,1.0)',
    marginLeft: scaleSize(120),
  },
})

export { styles }
