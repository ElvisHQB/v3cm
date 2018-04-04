<template>
  <div class="iWand-contact">
    <contact-list :data="iWindContactList"></contact-list>
  </div>
</template>
<script type="text/ecmascript-6">
  import ContactList from './contactList/contactList'
  import { getUserListGroupUrl, getUserAvatarUrl } from 'api/config'
  import api from 'api/fetchData'
  import { genIWindContactList } from 'common/js/utils'
  import { mapMutations, mapGetters } from 'vuex'

  export default {
    components: {
      ContactList
    },
    created() {
      this._getUserListGroup()
    },
    computed: {
      ...mapGetters([
        'iWindContactList'
      ])
    },
    methods: {
      ...mapMutations({
        setIWindContactList: 'SET_IWIND_CONTACT_LIST',
        mergeIWindContactList: 'MERGE_IWIND_CONTACT_LIST'
      }),
      _getUserListGroup() {
        const url = getUserListGroupUrl
        let params = {
          type: 1
        }
        api.getData(url, 'get', { params: params })
          .then((res) => {
            let users = genIWindContactList(res)
            this.setIWindContactList(users)
            this._getUserAvatar(users)
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
              arr.push(u.imId)
            }
          }
          return arr
        }
        let params = {
          imUserId: imUserId(userListGroup)
        }
        api.getData(url, 'post', params)
          .then((res) => {
            this.mergeIWindContactList(res)
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
