<template>
  <div class="phone-contact">
    <contact-list :data="phoneContactList"></contact-list>
  </div>
</template>
<script type="text/ecmascript-6">
  import ContactList from './contactList/contactList'
  import { getPhoneContacts } from 'common/js/utils'
  import { mapGetters, mapMutations } from 'vuex'

  export default {
    components: {
      ContactList
    },
    computed: {
      ...mapGetters([
        'phoneContactList'
      ])
    },
    created() {
      this._getPhoneContact()
    },
    methods: {
      async _getPhoneContact () {
        let phoneContacts = await getPhoneContacts()
        console.log('phoneContacts:', phoneContacts)
        this.setPhoneContactList(phoneContacts)
      },
      ...mapMutations({
        setPhoneContactList: 'SET_PHONE_CONTACT_LIST'
      })
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>
