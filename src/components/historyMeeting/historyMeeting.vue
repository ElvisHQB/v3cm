<template>
  <div class="history-meeting-body">
    <div class="history-meeting-selector">
      <selector :title="hisTitle" :subTitle="hisSubTitle" :selectorVal="hisMeetingVal" @searchVal="_searchValChange"></selector>
    </div>
  </div>

</template>

<script type="text/ecmascript-6">
  import selector from '../../base/selector/selector'

  const hisCategory = ['类型', '领域']
  const hisDetail = [['全部', 'IR路演', '分析师路演', '产品项目路演', '论坛峰会', '金融培训', '策略会', '其他'], ['全部', '宏观经济', '策略研究', '固定收益', '非银金融', '房地产', '文化传播', '计算机', '医药生物', '通讯电子',
      '社会服务', '公用事业', '食品饮料', '批发零售', '汽车及零部件', '有色金属', '军工机械', '纺织服装', '农林牧渔', '交通运输', '建筑建材',
      '煤炭开采', '造纸印刷', '金融工程', '化工', '电力设备与新能源', '钢铁', '家电', '银行', '互联网', '其他']]
  const hisDetailValue = [['', 'IR_ROADSHOW', 'ANALYST_ROADSHOW', 'PRODUCT_ROADSHOW', 'FORUMSUMMIT', 'FINACIAL_TRNG', 'STRATEGY_MEETING', 'OTHERS'],
    ['', 'MACRO_ECONOMY', 'OPERATIONAL_RESEARCH', 'FIXEDINCOME', 'NONBANKFINANCE', 'REALESTATE', 'CULTURAL', 'COMPUTER', 'BIO_MEDICINE',
      'TELECOMMUNICATION_ELECTRONICS', 'SOCIALSERVICE', 'PUBLICUTILITIES', 'FOOD_BEVERAGE', 'TRADE_RETAIL', 'AUTO_PARTS', 'NONFERROUS_METAL',
      'MILITARYMACHINERY', 'TEXTILES_GARMENTS', 'AGRICULTURE_FORESTRY', 'TRANSPORTATION', 'CONSTRUCTION_MATERIALS', 'COALMINING', 'PAPER_PRINGING',
      'FINANCIAL_ENGINEERING', 'CHEMICAL_INDUSTRY', 'POWER_EQUIPMENT', 'STEEL', 'APPLIANCES', 'BANK', 'INTERNET', 'OTHERS']]

  export default {
    name: 'historyMeeting',
    components: {
      selector
    },
    mounted() {
    },
    computed: {
    },
    data() {
      return {
        hisTitle: hisCategory,
        hisSubTitle: hisDetail,
        hisMeetingVal: hisDetailValue,
        searchVal: {
          category: '',
          field: ''
        }
      }
    },
    methods: {
      _searchValChange(index1, index2) {
        let val = hisDetailValue[index1][index2]
        if (index1 === 0) {
          this.searchVal.category = val
        } else {
          this.searchVal.field = val
        }
      }
    },
    watch: {
      searchVal: {
        handler (val, oldVal) {
          console.log('searchVal Changed!')
        },
        deep: true
      }
    }
  }

</script>

<style scoped lang="scss">

  .history-meeting-body {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 40px;

    .history-meeting-selector {
      position: fixed;
      width: 100%;
      top: 45px;
    }

  }
</style>
