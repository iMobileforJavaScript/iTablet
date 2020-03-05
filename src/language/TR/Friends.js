//好友
const Friends = {
  LOCALE: 'tr',

  LOGOUT: 'Çevrimiçi hizmete giriş yapın ve arkadaşlarınızla iletişimde kalın',
  MESSAGES: 'Mesajlar',
  FRIENDS: 'Arkadaşlar',
  GROUPS: 'Gruplar',
  ADD_FRIENDS: 'Arkadaş Ekle',
  NEW_GROUP_CHAT: 'Yeni Grup Sohbeti',
  RECOMMEND_FRIEND: 'Arkadaş Ekle',
  SELECT_MODULE: 'Modül Seç',
  //Friend
  MSG_SERVICE_FAILED: 'Mesaj servisine bağlanılamadı',
  MSG_SERVICE_NOT_CONNECT: 'Mesaj servisine bağlanılamıyor',
  SEND_SUCCESS: 'Başarıyla gönderildi',
  SEND_FAIL: 'Dosya Gönderilemedi',
  SEND_FAIL_NETWORK: 'Dosya gönderilemedi, lütfen ağınızı kontrol edin',
  RECEIVE_SUCCESS: 'Başarılıyla alındı',
  RECEIVE_FAIL_EXPIRE: 'Alma başarısız, dosyanın süresi dolmuş olabilir',
  RECEIVE_FAIL_NETWORK: 'Alma başarısız, lütfen ağınızı kontrol edin',
  //FriendMessage
  MARK_READ: 'Okundu olarak işaretle', //*
  MARK_UNREAD: 'Okunmadı olarak işaretle', //*
  DEL: 'Delete', //*
  NOTIFICATION: 'Bildirim', //*
  CLEAR_NOTIFICATION: 'Bildirimleri Temizle', //*
  CONFIRM: 'Evet', //*
  CANCEL: 'İptal', //*
  ALERT_DEL_HISTORY: 'Bu konuşma geçmişini sil?', //*
  //FriendList
  SET_MARK_NAME: 'İşaret Adı Ayarla',
  DEL_FRIEND: 'Arkadaş Sil',
  ALERT_DEL_FRIEND:
    'Arkadaşınızı ve sohbet geçmişinizi silmek istiyor musunuz?',
  TEXT_CONTENT: 'Metin İçeriği',
  INPUT_MARK_NAME: 'Lütfen işaret adını girin',
  INPUT_INVALID: 'Geçersiz giriş, lütfen tekrar giriş yapın',
  //InformMessage
  TITLE_NOTIFICATION: 'Bildirim',
  FRIEND_RESPOND: 'Bu arkadaşlık isteğini kabul et?',
  //CreateGroupChat
  CONFIRM2: 'Tamam',
  TITLE_CHOOSE_FRIEND: 'Arkadaş Seç',
  TOAST_CHOOSE_2: 'Grupta sohbet etmek için ikiden fazla arkadaş ekle',
  NO_FRIEND: 'Hay aksi! Henüz arkadaş yok',
  //AddFriend
  ADD_FRIEND_PLACEHOLDER: 'E-posta / Telefon / Takma İsim',
  SEARCHING: 'Aranıyor...',
  SEARCH: 'Arama',
  ADD_SELF: 'Kendinizi arkadaş olarak ekleyemezsiniz',
  ADD_AS_FRIEND: 'Arkadaş olarak ekle?',
  //FriendGroup
  LOADING: 'Yükleniyor...',
  DEL_GROUP: 'Grubu Sil',
  DEL_GROUP_CONFIRM:
    'Sohbet geçmişini silmek ve bu gruptan ayrılmak ister misiniz?',
  DEL_GROUP_CONFIRM2:
    'Sohbet geçmişini temizlemek ve bu grubu dağıtmak ister misiniz?',
  //Chat
  INPUT_MESSAGE: 'Giriş mesajı ...',
  SEND: 'Gönder',
  LOAD_EARLIER: 'Önceki mesajları yükle',
  IMPORT_DATA: 'Veriler içe aktarılıyor…',
  IMPORT_SUCCESS: 'İçe aktarma başarılı oldu',
  IMPORT_FAIL: 'İçe aktarma başarısız oldu',
  IMPORT_CONFIRM: 'Verileri içe aktarmak istiyor musunuz?',
  RECEIVE_CONFIRM: 'Verileri indirmek istiyor musunuz?',
  OPENCOWORKFIRST:
    'Verileri içe aktarmadan önce lütfen ortak çalışma haritasını açın',
  LOCATION_COWORK_NOTIFY: 'Konum ortak çalışma modunda açılamıyor',
  LOCATION_SHARE_NOTIFY: 'Konum paylaşımda açılamıyor',
  WAIT_DOWNLOADING: 'Lütfen indirme tamamlanana kadar bekleyin',
  DATA_NOT_FOUND: 'Veri bulunamadı, tekrar indirmek ister misiniz?',
  LOAD_ORIGIN_PIC: 'Başlangıcı Yükle',
  //CustomActions
  MAP: 'Map',
  TEMPLATE: 'Taslak',
  LOCATION: 'Konum',
  PICTURE: 'Resim',
  LOCATION_FAILED: 'Konumlandırma Başarısız',
  //RecommendFriend
  FIND_NONE: 'Kişilerinizden yeni arkadaşlar bulunamıyor',
  ALREADY_FRIEND: 'Zaten arkadaşsınız',
  PERMISSION_DENIED_CONTACT:
    'Kişileri görüntülemek için lütfen iTablete izin verin',
  //ManageFriend/Group
  SEND_MESSAGE: 'Mesaj gönder',
  SET_MARKNAME: 'Takma İsim Ayarla',
  SET_GROUPNAME: 'Grup adı ayarla',
  PUSH_FRIEND_CARD: 'Arkadaş kartını dene',
  FRIEND_MAP: 'Arkadaş Haritası',
  ADD_BLACKLIST: 'Kara listeye ekle',
  DELETE_FRIEND: 'Arkadaşı sil',
  LIST_MEMBERS: 'Üyeleri listele ',
  LEAVE_GROUP: 'Gruptan çık',
  CLEAR_HISTORY: 'Sohbet geçmişini temizle',
  DISBAND_GROUP: 'Grubu dağıt',
  DELETE_MEMBER: 'Grup üyesini çıkar',
  ADD_MEMBER: 'Grup üyesi ekle',
  COWORK: 'Harita ortak çalışması',
  EXIT_COWORK: 'Ortak çalışmadan ayrıl',
  GO_COWORK: 'Ortak çalışma',
  ALERT_EXIT_COWORK:
    'Mevcut ortak çalışma haritasını kapatmak istiyor musunuz?',
  SHARE_DATASET: 'Veri kümesini aynı anda paylaşın',
  //system text
  SYS_MSG_PIC: '[RESİM]',
  SYS_MSG_MAP: '[HARİTA]',
  SYS_MSG_LAYER: '[KATMAN]',
  SYS_MSG_DATASET: '[VERİ KÜMESİ]',
  SYS_MSG_ADD_FRIEND: 'Arkadaşlık isteği gönder',
  SYS_MSG_REMOVED_FROM_GROUP: 'Seni gruptan çıkarttı',
  SYS_MSG_LEAVE_GROUP: 'Bu gruptan ayrıldı',
  SYS_MSG_ETC: '... ',
  SYS_MSG_REMOVE_OUT_GROUP: ' kaldırıldı ',
  SYS_MSG_REMOVE_OUT_GROUP2: 'Grup dışı',
  SYS_MSG_ADD_INTO_GROUP: ' eklendi ',
  SYS_MSG_ADD_INTO_GROUP2: 'gruba',
  SYS_NO_SUCH_USER: 'Kullanıcı bulunamadı',
  SYS_FRIEND_ALREADY_IN_GROUP: 'Seçilen arkadaşlar zaten grupta',
  EXCEED_NAME_LIMIT: 'Ad 40 karakteri aşamaz (Çince için 20)',
  SYS_MSG_MOD_GROUP_NAME: ' grup adını değiştirdi ',
  SYS_LOGIN_ON_OTHER_DEVICE: 'Hesabınız başka bir cihazda oturum açtı',
  SYS_MSG_REJ: 'Karşı taraf seni henüz arkadaş olarak eklemedi',
  SYS_FRIEND_REQ_ACCEPT: 'Artık arkadaşsınız, keyfini çıkar!',
}
export { Friends }
