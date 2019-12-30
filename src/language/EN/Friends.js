//好友
const Friends = {
  LOCALE: 'en',

  LOGOUT: 'Login Online service and keep in touch with your friends',
  MESSAGES: 'Messages',
  FRIENDS: 'Friends',
  GROUPS: 'Groups',
  ADD_FRIENDS: 'Add Friends',
  NEW_GROUP_CHAT: 'New Group Chat',
  RECOMMEND_FRIEND: 'Recommend Friends',
  SELECT_MODULE: 'Select Module',
  //Friend
  MSG_SERVICE_FAILED: 'Failed to connect to message service',
  MSG_SERVICE_NOT_CONNECT: 'Unable to connect to message service',
  SEND_SUCCESS: 'Send successfully',
  SEND_FAIL: 'Failed to send file',
  SEND_FAIL_NETWORK: 'Failed to send file, please check your network',
  RECEIVE_SUCCESS: 'Receive successfully',
  RECEIVE_FAIL_EXPIRE: 'Receive failed, the file might have expired',
  RECEIVE_FAIL_NETWORK: 'Receive failed, please check your network',
  //FriendMessage
  MARK_READ: 'Mark read', //*
  MARK_UNREAD: 'Mark unread', //*
  DEL: 'Delete', //*
  NOTIFICATION: 'Notification', //*
  CLEAR_NOTIFICATION: 'Clear notification', //*
  CONFIRM: 'Yes', //*
  CANCEL: 'Cancel', //*
  ALERT_DEL_HISTORY: 'Clear this chat history?', //*
  //FriendList
  SET_MARK_NAME: 'Set mark name',
  DEL_FRIEND: 'Delete friend',
  ALERT_DEL_FRIEND: 'Delete friend as well as the chat history?',
  TEXT_CONTENT: 'Text content',
  INPUT_MARK_NAME: 'Please input mark name',
  INPUT_INVALID: 'Invalid input, please input again',
  //InformMessage
  TITLE_NOTIFICATION: 'Notification',
  FRIEND_RESPOND: 'Accept this friend request?',
  //CreateGroupChat
  CONFIRM2: 'OK',
  TITLE_CHOOSE_FRIEND: 'Choose friend',
  TOAST_CHOOSE_2: 'Add more than 2 friend to chat in group',
  NO_FRIEND: 'Oops,no friend yet',
  //AddFriend
  ADD_FRIEND_PLACEHOLDER: 'Email/Phone/Nickname',
  SEARCHING: 'Searching...',
  SEARCH: 'SEARCH',
  ADD_SELF: 'Cannot add yourself as friend',
  ADD_AS_FRIEND: 'Add him/her as friend?',
  //FriendGroup
  LOADING: 'Loading...',
  DEL_GROUP: 'Delete group',
  DEL_GROUP_CONFIRM:
    'Would you like to clear chat history and leave this group?',
  DEL_GROUP_CONFIRM2:
    'Would you like to clear chat history and disband this group?',
  //Chat
  INPUT_MESSAGE: 'Input message...',
  SEND: 'Send',
  LOAD_EARLIER: 'Load earlier messages',
  IMPORT_DATA: 'Importing data...',
  IMPORT_SUCCESS: 'Import success',
  IMPORT_FAIL: 'Import failed',
  IMPORT_CONFIRM: 'Do you want to import the data?',
  RECEIVE_CONFIRM: 'Do you want to download the data',
  OPENCOWORKFIRST: 'Please open cowork map first before import the data',
  LOCATION_COWORK_NOTIFY: "Can't open location in cowork mode",
  LOCATION_SHARE_NOTIFY: "Can't open location in sharing",
  WAIT_DOWNLOADING: 'Please wait until download completed',
  DATA_NOT_FOUND: 'Data not fond, would you like to download it again?',
  LOAD_ORIGIN_PIC: 'Load Origin',
  //CustomActions
  MAP: 'Map',
  TEMPLATE: 'Template',
  LOCATION: 'Lacation',
  PICTURE: 'Picture',
  LOCATION_FAILED: 'Failed to locate',
  //RecommendFriend
  FIND_NONE: 'Unable to find new frineds from your contacts',
  ALREADY_FRIEND: 'Your are already friends',
  PERMISSION_DENIED_CONTACT:
    'Please turn on the permission of iTablet to view contacts',
  //ManageFriend/Group
  SEND_MESSAGE: 'Send message',
  SET_MARKNAME: 'Set Alias',
  SET_GROUPNAME: 'Set group name',
  PUSH_FRIEND_CARD: 'Push friend card',
  FRIEND_MAP: 'Friend map',
  ADD_BLACKLIST: 'Add to blacklist',
  DELETE_FRIEND: 'Delete friend',
  LIST_MEMBERS: 'List members ',
  LEAVE_GROUP: 'Leave group',
  CLEAR_HISTORY: 'Clear chat history',
  DISBAND_GROUP: 'Disband group',
  DELETE_MEMBER: 'Remove group member',
  ADD_MEMBER: 'Add group member',
  COWORK: 'Map cowork',
  EXIT_COWORK: 'Exit cowork',
  GO_COWORK: 'Cowork',
  ALERT_EXIT_COWORK: 'Do you want to close current cowork map?',
  SHARE_DATASET: 'Share the dataset at the same time',
  //system text
  SYS_MSG_PIC: '[PICTURE]',
  SYS_MSG_MAP: '[MAP]',
  SYS_MSG_LAYER: '[LAYER]',
  SYS_MSG_DATASET: '[DATASET]',
  SYS_MSG_ADD_FRIEND: 'Send a friend request',
  SYS_MSG_REMOVED_FROM_GROUP: 'removed you out of group',
  SYS_MSG_LEAVE_GROUP: 'leaved this group',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: ' have removed ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'out of group',
  SYS_MSG_ADD_INTO_GROUP: ' have added ',
  SYS_MSG_ADD_INTO_GROUP2: 'into group',
  SYS_NO_SUCH_USER: 'User not found',
  SYS_FRIEND_ALREADY_IN_GROUP: 'Friends selected already in group',
  EXCEED_NAME_LIMIT: 'Name should be within 40 words (Chinese within 20 words)',
  SYS_MSG_MOD_GROUP_NAME: ' changed the group name to ',
  SYS_LOGIN_ON_OTHER_DEVICE: 'Your account is logged in on other device',
  SYS_MSG_REJ: "The opposite haven't added you as friend yet",
  SYS_FRIEND_REQ_ACCEPT: "You're friends now, enjoy taking!",
}
export { Friends }
