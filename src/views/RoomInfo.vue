<template>
  <div v-if="data">
    <loading :active.sync="isLoading" :opacity="0.9" :background-color="'#fff'" :color="'#575757'"></loading>
    <header>
      <router-link to="/">
        <img class="room-header__logo" src="../assets/index_icon/logo_block.svg" />
      </router-link>
      <div class="room-header__img--main"><img @click="showImg(0)" :src="data.imageUrl[0]" /></div>
      <div class="room-header__img--side"><img @click="showImg(1)" :src="data.imageUrl[1]" /><img @click="showImg(2)" :src="data.imageUrl[2]" /></div>
    </header>
    <main>
      <div class="container">
        <div class="room-details">
          <div class="room-info">
            <h2 class="room-info__name">{{ data.name }}</h2>
            <ul class="room-info__desc-short">
              <li>房客人數限制： {{ descShort.GuestMin }}~{{ descShort.GuestMax }} 人</li>
              <li>床型：{{ descShort.Bed[0] }}</li>
              <li>衛浴數量： {{ descShort['Private-Bath'] }} 間</li>
              <li>房間大小： {{ descShort.Footage }} 平方公尺</li>
            </ul>
            <p class="room-info__desc-long">{{ data.description }}</p>
            <div class="dividing-line">\\\</div>
            <div class="room-info__check">
              <div class="room-info__check--in">
                <p class="span">Check In</p>
                <p class="room-info__check-time">{{ checkInAndOut.checkInEarly }} - {{ checkInAndOut.checkInLate }}</p>
              </div>
              <div class="room-info__check--out">
                <p class="span">Check Out</p>
                <p class="room-info__check-time">{{ checkInAndOut.checkOut }}</p>
              </div>
            </div>
          </div>
          <ul class="room-features">
            <li :style="{ opacity: isFeature(features['Wi-Fi']) }"><img class="room-features__icon" src="../assets/info_icon/Wi-Fi.svg" />Wi-Fi</li>
            <li :style="{ opacity: isFeature(features['Television']) }"><img class="room-features__icon" src="../assets/info_icon/Television.svg" />電視</li>
            <li :style="{ opacity: isFeature(features['Great-View']) }"><img class="room-features__icon" src="../assets/info_icon/Great-View.svg" />漂亮的視野</li>
            <li :style="{ opacity: isFeature(features['Breakfast']) }"><img class="room-features__icon" src="../assets/info_icon/Breakfast.svg" />早餐</li>
            <li :style="{ opacity: isFeature(features['Air-Conditioner']) }"><img class="room-features__icon" src="../assets/info_icon/Air-Conditioner.svg" />空調</li>
            <li :style="{ opacity: isFeature(features['Smoke-Free']) }"><img class="room-features__icon" src="../assets/info_icon/Smoke-Free.svg" />禁止吸煙</li>
            <li :style="{ opacity: isFeature(features['Mini-Bar']) }"><img class="room-features__icon" src="../assets/info_icon/Mini-Bar.svg" />Mini Bar</li>
            <li :style="{ opacity: isFeature(features['Refrigerator']) }"><img class="room-features__icon" src="../assets/info_icon/Refrigerator.svg" />冰箱</li>
            <li :style="{ opacity: isFeature(features['Child-Friendly']) }"><img class="room-features__icon" src="../assets/info_icon/Child-Friendly.svg" />適合兒童</li>
            <li :style="{ opacity: isFeature(features['Room-Service']) }"><img class="room-features__icon" src="../assets/info_icon/Room-Service.svg" />Room Service</li>
            <li :style="{ opacity: isFeature(features['Sofa.']) }"><img class="room-features__icon" src="../assets/info_icon/Sofa.svg" />沙發</li>
            <li :style="{ opacity: isFeature(features['Pet-Friendly']) }"><img class="room-features__icon" src="../assets/info_icon/Pet-Friendly.svg" />寵物攜帶</li>
          </ul>
        </div>
        <div class="room-booking">
          <div class="room-booking__price">
            <p class="room-booking__price-normal">NT.{{ data.normalDayPrice }}</p>
            <p>平日（一 ～ 四）</p>
            <p class="room-booking__price-holiday">NT.{{ data.holidayPrice }}</p>
            <p>假日（五 ～ 日）</p>
          </div>
          <date-picker @bookingDates="emitBookingDates" :bookedDays="bookedDays"></date-picker>
        </div>
      </div>
    </main>
    <checkout-modal :range="range" :dayPrice="dayPrice" :bookingDates="bookingDates" :judgeWeekend="judgeWeekend" :roomId="roomId" :bookedDays="bookedDays"></checkout-modal>
    <vue-easy-lightbox :visible="visible" :imgs="roomImg" :index="index" @hide="handleHide"></vue-easy-lightbox>
  </div>
</template>
<script>
import DatePicker from '@/components/DatePicker.vue';
import CheckoutModal from '@/components/CheckoutModal.vue';

export default {
  name: 'RoomInfo',
  components: { DatePicker, CheckoutModal },
  data() {
    return {
      roomId: null,
      data: null,
      bookedDays: null,
      visible: false,
      index: 0,
      bookingDates: null,
      judgeWeekend: { normal: 0, holiday: 0 },
      range: '',
    };
  },
  computed: {
    isLoading() {
      const vm = this;
      return !vm.data;
    },
    dayPrice() {
      const vm = this;
      return { normal: vm.data.normalDayPrice, holiday: vm.data.holidayPrice };
    },
    descShort() {
      const vm = this;
      return vm.data.descriptionShort;
    },
    checkInAndOut() {
      const vm = this;
      return vm.data.checkInAndOut;
    },
    features() {
      const vm = this;
      return vm.data.amenities;
    },
    roomImg() {
      const vm = this;
      return vm.data.imageUrl;
    },
  },
  methods: {
    emitBookingDates(data) {
      const vm = this;
      vm.bookingDates = data.bookingDates;
      vm.judgeWeekend = data.judgeWeekend;
      vm.range = data.range;
    },
    isFeature(feature) {
      return feature ? 1 : 0.3;
    },
    showImg(index) {
      this.index = index;
      this.visible = true;
    },
    handleHide() {
      const vm = this;
      vm.visible = false;
    },
  },
  created() {
    const vm = this;
    vm.roomId = vm.$route.params.roomId;
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const api = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${vm.roomId}`;
    vm.axios
      .get(`${proxy}${api}`, {
        headers: {
          Authorization: process.env.VUE_APP_API_TOKEN,
          accept: 'application/json',
        },
      })
      .then((res) => {
        const [roomData] = res.data.room;
        vm.data = roomData;
        vm.bookedDays = res.data.booking.map((day) => day.date.replace(/-/g, '/'));
      });
  },
};
</script>
<style lang="scss" scoped>
header {
  height: 600px;
  display: flex;
  box-shadow: 2px 2px 9px 0 rgba(0, 0, 0, 0.18);
  @media (max-width: 600px) {
    height: 100%;
    flex-direction: column;
  }
}
.room-header__logo {
  position: absolute;
  margin: 3.2rem 0 0 5rem;
  z-index: 10;
}

.room-header__img {
  &--main {
    flex: 0 0 70%;
    height: 100%;
    @media (max-width: 900px) {
      flex: 0 0 60%;
    }
    @media (max-width: 600px) {
      flex: 0 0 100%;
      height: 400px;
    }
    img {
      cursor: pointer;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.7;
      transition: all 0.3s;
      &:hncover {
        opacity: 1;
      }
    }
  }
  &--side {
    flex: 0 0 30%;
    height: 100%;
    @media (max-width: 900px) {
      flex: 0 0 40%;
    }
    @media (max-width: 600px) {
      flex: 0 0 100%;
      height: 300px;
    }
    img {
      cursor: pointer;
      display: block;
      width: 100%;
      height: 50%;
      object-fit: cover;
      opacity: 0.7;
      transition: all 0.3s;
      &:hover {
        opacity: 1;
      }
    }
  }
}
.container {
  max-width: 1070px;
  padding: 50px 60px 70px 60px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  @media (max-width: 900px) {
    flex-direction: column;
  }
  @media (max-width: 900px) {
    padding: 50px 40px 70px 40px;
  }
  @media (max-width: 600px) {
    padding: 50px 20px 70px 20px;
  }
}
.room-details {
  flex: 0 0 50%;
}
.room-info {
  &__name {
    font-family: 'Noto Sans TC', sans-serif;
    font-size: 3.6rem;
    margin-bottom: 30px;
  }
  &__desc-short {
    font-size: 14px;
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 300;
    li {
      margin-bottom: 10px;
    }
  }
  &__desc-long {
    font-size: 12px;
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 300;
    line-height: 20px;
    letter-spacing: 1.3px;
    margin-bottom: 32px;
  }
  &__check {
    margin-top: 32px;
    font-size: 14px;
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 300;
    display: flex;
    &--in {
      margin-right: 96px;
    }
    &-time {
      font-size: 21px;
    }
  }
}
.room-features {
  background-color: #f0f0f0;
  padding: 28px 24px 0 24px;
  margin: 40px 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  li {
    flex: 0 0 33.333%;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 300;
    padding-bottom: 28px;
    padding-left: 10px;
    @media (max-width: 500px) {
      flex: 0 0 50%;
    }
  }

  &__icon {
    width: 25px;
    height: 25px;
    margin-right: 12px;
  }
}
.room-booking {
  flex: 0 0 50%;
  display: flex;
  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: flex-end;
  }
  @media (max-width: 900px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
  &__price {
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 300;
    padding: 0 30px;
    @media (max-width: 1100px) {
      padding-right: 0;
      margin-bottom: 20px;
    }
    p {
      text-align: right !important;
      text-align: left;
      margin-bottom: 12px;
    }
    &-normal {
      font-size: 30px;
    }
    &-holiday {
      font-size: 16px;
    }
  }
}
</style>
