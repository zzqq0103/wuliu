<template>
  <div>
    <h2 style="text-align:center">详情物流信息</h2>
    <div class='logistics-title'>
      <span style='width:7%'>订单号：</span>
      <span class='logistics-title-con' style='padding-top:0.4%;width:12%'>{{logisticsDetail.orederID}}</span>
      <span style='width:8%'>下单日期：</span>
      <span class='logistics-title-con' style='padding-top:0.4%;width:18%'>{{logisticsDetail.orderTim}}</span>
      <span style='width:7%'>经办人：</span>
      <span class='logistics-title-con' style='width:4%'>{{logisticsDetail.serviceNam}}</span>
      <span style='width:8%;padding-left:4%'>始发站：</span>
      <span class='logistics-title-con' style='width:9%'>{{logisticsDetail.startStation}}</span>
      <span class='width:8%;padding-left:4%'>到站：</span>
      <span class='logistics-title-con' style='width:8%'>{{logisticsDetail.arrStation}}</span>
    </div>
    <div class='logistics-info'>
      <template v-for="(data,i) in logisticsContent">
        <span class='info-time' :key='data.time'>{{data.time}}</span>
        <span class='info-content' :key='data.time'>{{data.content}}</span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      logisticsContent: [],
      logisticsDetail: {
        orederID: '12345678',
        orderTim: '2014-07-12 10:12:12',
        serviceNam: '李四',
        startStation: '北京海淀',
        arrStation: '南京XX',
        logistics: '2013-07-12 10:12:12+货物已经入库#2014-07-12 10:12:12+已从南京南京站点开始派送#2015-07-12 10:12:12+已到达北京站点#2016-07-12 10:12:12+已经签收#'
      }
    }
  },
  methods: {
    /** 处理物流信息便于展示 */
    handlelogistics () {
      var listData = []
      listData = this.logisticsDetail.logistics.split('#')
      for (var m = 0; m < listData.length; m++) {
        this.logisticsContent.push({ 'time': listData[m].split('+')[0], 'content': listData[m].split('+')[1] })
      }
    }
  },
  mounted () {
    this.handlelogistics()
  }
}
</script>
<style scoped>
.logistics-title {
  width: 100%;
  margin-left: 0%;
  padding: 1% 0;
  display: inline-block;
  margin-top: 2%;
  box-sizing: border-box
}

.logistics-title span {
  float: left
}

.logistics-title-con {
  color: #00d1b2
}

.logistics-info {
  border: 2px solid black;
  width: 60%;
  height: 300px;
  margin-left: 18%;
  display: inline-block;
  margin-top: 1%;
  padding: 2% 5%;
  box-sizing: border-box;
}

.info-time {
  float: left;
  width: 30%;
  margin-top: 5%
}

.info-content {
  float: left;
  width: 50%;
  margin-left: 19%;
  margin-top: 5%
}
</style>