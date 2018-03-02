<template>
  <div class="iWand-contact">
    <contact-list :contactType="contactType.iWand"></contact-list>
  </div>
</template>
<script type="text/ecmascript-6">
  import ContactList from './contactList/contactList'
  import { CONTACT_TYPE, getUserListGroupUrl, getUserAvatarUrl } from 'api/config'
  import api from 'api/fetchData'
  import { SET_IWAND_CONTACT_LIST } from '../../store/mutation-types'
  import { genIWandContactList } from 'common/js/utils'

  export default {
    components: {
      ContactList
    },
    created() {
      this.contactType = CONTACT_TYPE
      this._getUserListGroup()
    },
    data() {
      return {
      }
    },
    methods: {
      _getUserListGroup() {
        const url = getUserListGroupUrl
        let params = {
          type: 1
        }
        api.getData(url, 'get', { params: params })
          .then((res) => {
            this._getUserAvatar(res)
          })
          .catch((e) => {
            console.log(e)
          })
      },
      _getUserAvatar(userListGroup) {
        const url = getUserAvatarUrl
        let imUserId = (userListGroup) => {
          let arr = []
          for (let users of userListGroup) {
            for (let u of users.userList) {
              arr.push(u.iMID)
            }
          }
          return arr
        }
        let params = {
          imUserId: imUserId(userListGroup)
        }
        api.getData(url, 'post', params)
          .then((res) => {
            let users = genIWandContactList(userListGroup, res)
            this.$store.commit(SET_IWAND_CONTACT_LIST, users)
          })
          .catch((e) => {
            console.log(e)
          })
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>
