<template>
  <div class="select-attendance">
    <b-scroll class="attendance-list">
      <ul>
        <li v-for="(group, index) in attendanceList" class="list-group" :key="index">
          <h2 class="list-group-title">{{group.key}}</h2>
          <ul>
            <li v-for="(item, i) in group.userList" class="list-group-item" :key="i">
              <div class="item-left">
                <!--<img class="avatar" :src='item.avatar'>-->
              </div>
              <div class="item-right">
                <span class="userName">{{item.userName}}</span>
                <span class="company">{{item.company}}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </b-scroll>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  export default {
    name: 'selectAttendance',
    data () {
      return {
        attendanceList: [
          {
            key: 'B',
            userList: [
              {
                userName: '边书婷',
                userID: '11084607',
                company: 'Wind',
                department: '',
                email: 'stbian@wind.com.cn',
                iMID: '11084607',
                crmId: '1403545',
                memo: 'null',
                mobilePhone: '13002519253',
                position: 'null',
                telephone: 'null',
                userFrom: '1',
                userRank: 1,
                type: 0
              },
              {
                userName: '毕庆澜',
                userID: '111657879',
                company: '中国人保资产管理有限公司',
                department: '',
                email: '15502198701@163.com',
                iMID: '111657879',
                crmId: '1383279',
                memo: 'null',
                mobilePhone: '15502198701',
                position: 'null',
                telephone: 'null',
                userFrom: '1',
                userRank: 2,
                type: 0
              },
              {
                userName: '边书婷',
                userID: '11084607',
                company: 'Wind',
                department: '',
                email: 'stbian@wind.com.cn',
                iMID: '11084607',
                crmId: '1403545',
                memo: 'null',
                mobilePhone: '13002519253',
                position: 'null',
                telephone: 'null',
                userFrom: '1',
                userRank: 1,
                type: 0
              }
            ]
          },
          {
            key: 'C',
            userList: [
              {
                userName: '陈宏明',
                userID: '10000130',
                company: 'Wind',
                department: '',
                email: 'hmchen@wind.com.cn',
                iMID: '10000130',
                crmId: '1178711',
                memo: 'null',
                mobilePhone: '13585662711',
                position: 'null',
                telephone: 'null',
                userFrom: '1',
                userRank: 1,
                type: 0
              },
              {
                userName: '蔡如海',
                userID: '110377286',
                company: 'Wind',
                department: '',
                email: 'rhcai@wind.com.cn',
                iMID: '110377286',
                crmId: '1481010',
                memo: 'null',
                mobilePhone: '13918120240',
                position: 'null',
                telephone: 'null',
                userFrom: '1',
                userRank: 1,
                type: 0
              }
            ]
          }
        ]

      }
    },
    components: {
      BScroll
    }
  }
</script>

<style scoped lang="scss" type="text/scss">
  .select-attendance {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
    .attendance-list {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
</style>
