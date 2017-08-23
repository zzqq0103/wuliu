<template>
  <div>
    <h2 style="text-align:center">详情物流信息</h2>
    <div class='logistics-title'>
      <span style='width:7%'>订单号：</span>
      <span class='logistics-title-con' style='padding-top:0.4%;width:12%'>{{logisticsDetail.orederID}}</span>
      <span style='width:8%'>下单日期：</span>
      <span class='logistics-title-con' style='padding-top:0.4%;width:18%'>{{logisticsDetail.orderTim}}</span>
      <span style='width:7%'>经办人：</span>
      <span class='logistics-title-con' style='width:8%'>{{logisticsDetail.serviceNam}}</span>
      <span style='width:8%;padding-left:4%'>始发站：</span>
      <span class='logistics-title-con' style='width:8%'>{{logisticsDetail.startStation}}</span>
      <span class='width:8%;padding-left:4%'>到站：</span>
      <span class='logistics-title-con' style='width:8%'>{{logisticsDetail.arrStation}}</span>
    </div>
    <div class='logistics-info'>
      <template v-for="(data,i) in logisticsDetail.logisticsContent">
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
      logisticsDetail: {
        orederID: '12345678',
        orderTim: '2014-07-12 10:12:12',
        serviceNam: '李四',
        startStation: '北京海淀',
        arrStation: '南京XX',
        logisticsContent: [
          {
            'time': '2014-07-12 10:12:12',
            'content': '已从南京南京站点开始派送'
          },
          {
            'time': '2014-07-12 10:12:12',
            'content': '已到达北京站点'
          },
          {
            'time': '2014-07-12 10:12:12',
            'content': '已经签收'
          }
        ]
      }
    }
  },
  methods: {
  }
}
</script>
<style scoped>
.col-1 {
  width: 9.09%
}

.col-1_5 {
  width: 13.635%
}

.col-2 {
  width: 18.18%
}

.col-2_5 {
  width: 22.725%
}

.col-3 {
  width: 27.27%
}

.col-4 {
  width: 36.36%
}

.col-6 {
  width: 54.54%
}

.col-7 {
  width: 63.63%
}

.col-9 {
  width: 81.81%
}

.col-11 {
  width: 100%
}

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

.label-content {
  color: #00d1b2;
}

.form-div span {
  border: 1px solid #000000;
  box-sizing: border-box;
  float: left;
  font-size: 95%;
  padding: 0.8% 0;
  height: 38px;
  outline: 0;
  text-align: center;
  overflow: hidden;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
}
</style>