<template>
  <div class="phone-contact">
    <contact-list :contactType="contactType.phone"></contact-list>
  </div>
</template>
<script type="text/ecmascript-6">
  import ContactList from '../../base/contactList/contactList'
  import { CONTACT_TYPE } from '../../api/config'
  import { getPhoneContacts } from '../../common/js/utils'

  export default {
    components: {
      ContactList
    },
    created() {
      this.contactType = CONTACT_TYPE
      this._getPhoneContact()
    },
    data() {
      return {
        data: [
          {
            'key': 'B',
            'userList': [
              {
                'userName': '边书婷',
                'cellphone': '13002519253'
              },
              {
                'userName': '斌斌',
                'cellphone': '13002519253'
              }
            ]
          },
          {
            'key': 'S',
            'userList': [
              {
                'userName': 'SWT',
                'cellphone': '13002519253'
              },
              {
                'userName': '苏苏',
                'cellphone': '13002519253'
              },
              {
                'userName': 'sdlkfjsldkjf;lskdjf;lksdj;lfkjs;dlkjf;lksdj;flkjs;dalkjf;lkdsjf;lkj',
                'cellphone': '13002519253'
              }
            ]
          },
          {
            'key': 'K',
            'userList': [
              {
                'userName': 'kylin',
                'cellphone': '13002519253'
              },
              {
                'userName': 'KK',
                'cellphone': '13002519253'
              }
            ]
          },
          {
            'key': 'Z',
            'userList': [
              {
                'userName': 'ZQL',
                'cellphone': '13002519253'
              },
              {
                'userName': '张三',
                'cellphone': '13002519253'
              }
            ]
          },
          {
            'key': 'Y',
            'userList': [
              {
                'userName': 'YY',
                'cellphone': '13002519253'
              },
              {
                'userName': 'YHH',
                'cellphone': '13002519253'
              }
            ]
          }
        ]
      }
    },
    methods: {
      _getPhoneContact() {
        getPhoneContacts()
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>
