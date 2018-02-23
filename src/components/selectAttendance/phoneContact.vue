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
    methods: {
      _getPhoneContact() {
        getPhoneContacts()
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>
