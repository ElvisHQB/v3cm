<template>
    <div>
      <contact-list :data="data"></contact-list>
    </div>
</template>
<script type="text/ecmascript-6">
  import ContactList from '../../base/contactList/contactList'

  export default {
    components: {
      ContactList
    },
    data() {
      return {
        data: [
          {
            'key': 'B',
            'userList': [
              {
                'userName': '边书婷',
                'company': 'Wind'
              },
              {
                'userName': '斌斌',
                'company': 'Wind'
              }
            ]
          },
          {
            'key': 'S',
            'userList': [
              {
                'userName': 'SWT',
                'company': 'Wind'
              },
              {
                'userName': '苏苏',
                'company': 'other'
              }
            ]
          },
          {
            'key': 'K',
            'userList': [
              {
                'userName': 'kylin',
                'company': 'other'
              },
              {
                'userName': 'KK',
                'company': 'other'
              }
            ]
          },
          {
            'key': 'Z',
            'userList': [
              {
                'userName': 'ZQL',
                'company': 'xixi'
              },
              {
                'userName': '张三',
                'company': 'other'
              }
            ]
          },
          {
            'key': 'Y',
            'userList': [
              {
                'userName': 'YY',
                'company': 'Wind'
              },
              {
                'userName': 'YHH',
                'company': 'other'
              }
            ]
          }
        ]
      }
    }
  }
</script>

<style scoped lang="scss" type="text/scss">

</style>
