<template>
  <div class="room-booking__selector">
    <VueHotelDatepicker ref="datePickInfo" :disabledDates="[...bookedDays]" :mobile="'mobile'" :weekList="week" :monthList="month" @update="passingDates()" :minDate="tomorrow"></VueHotelDatepicker>
    <button @click="show()" class="room-booking__btn">
      <div class="room-booking__btn-bg"></div>
      預約時段
    </button>
  </div>
</template>

<script>
import VueHotelDatepicker from '@northwalker/vue-hotel-datepicker';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);

export default {
  name: 'Date-picker',
  props: ['bookedDays'],
  components: {
    VueHotelDatepicker,
  },
  data() {
    return {
      week: ['日', '一', '二', '三', '四', '五', '六'],
      month: ['1 /', '2 /', '3 /', '4 /', '5 /', '6 /', '7 /', '8 /', '9 /', '10 /', '11 /', '12 /'],
    };
  },
  computed: {
    tomorrow() {
      return Moment().add(1, 'days').format('YYYY/MM/DD');
    },
    startEnd() {
      const vm = this;
      return vm.$refs.datePickInfo.value;
    },
    // 計算訂房日期
    bookingDates() {
      const vm = this;
      let data = [];
      if (vm.$refs.datePickInfo.value !== '') {
        const startAndEnd = vm.$refs.datePickInfo.value.split(' ~ ').map((date) => date.replace(/\//g, '-'));
        const range = moment.range(startAndEnd[0], startAndEnd[1]);
        const days = Array.from(range.by('day')).map((m) => m.format('YYYY-MM-DD'));
        const newBookedDays = vm.bookedDays.map((day) => day.replace(/\//g, '-'));
        data = days.filter((day) => !newBookedDays.includes(day));
      }
      return data;
    },
    // 判斷訂房平日/假日
    judgeWeekend() {
      const vm = this;
      const dates = { normal: 0, holiday: 0 };
      if (vm.bookingDates.length > 0) {
        vm.bookingDates.forEach((date) => {
          const week = new Date(date).getDay();
          if (week === 0 || week === 6) {
            dates.holiday += 1;
          } else {
            dates.normal += 1;
          }
        });
      }
      return dates;
    },
  },
  methods: {
    passingDates() {
      // change 無法即時抓到數據，使用setTimeout延遲抓取
      const vm = this;
      setTimeout(() => {
        vm.$emit('bookingDates', { bookingDates: vm.bookingDates, judgeWeekend: vm.judgeWeekend, range: vm.startEnd });
      }, 0);
    },
    styleChange() {
      document.querySelector('.vhd-calendar-header').remove();
      document.querySelector('.vhd-calendar-footer').remove();
      document.querySelector('.vhd-input').remove();
    },
    show() {
      const vm = this;
      if (vm.startEnd !== '') {
        vm.$modal.show('checkout');
      } else {
        this.$toasted.error('請選擇日期範圍', { duration: 2000 });
      }
    },
  },
  mounted() {
    const vm = this;
    vm.$refs.datePickInfo.active = true;
    setTimeout(() => {
      this.styleChange();
    }, 0);
  },
};
</script>
<style lang="scss">
.vhd-picker {
  min-height: auto !important;
  background-color: #f7f7f7 !important;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15) !important;
  position: relative !important;
  border-radius: 0 !important;
}

.day span {
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 300;
  font-size: 12px;
}

.disabled span {
  color: #c9ccd0;
}
.start-date,
.end-date,
.in-date-range {
  color: #393c41 !important;
  background-color: #dfdfdf !important;
}

.forbidden span {
  color: #393c41 !important;
}
.forbidden {
  background-color: transparent !important;
  background: repeating-linear-gradient(45deg, transparent, transparent 4px, #383838 5px, #383838 4px);
  background-size: 100% 100%;
}
.day {
  border: none !important;
  &::before,
  &::after {
    opacity: 0 !important;
  }
}

.room-booking {
  &__selector {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    @media (max-width: 500px) {
      align-items: center;
    }
  }
  &__btn {
    width: 120px;
    color: #fff;
    position: relative;
    font-size: 16px;
    font-family: 'Noto Sans TC', sans-serif;
    font-weight: 300;
    letter-spacing: 2px;
    background-color: #575757;
    padding: 14px 24px;
    margin-top: 26px;
    &-bg {
      z-index: -10;
      position: absolute;
      top: 8px;
      left: 5px;
      width: 120px;
      height: 50px;
      background: repeating-linear-gradient(45deg, transparent, transparent 3px, #383838 4px, #383838 3px);
      background-size: 100% 100%;
      transition: all 0.3s;
    }
    &:hover &-bg {
      opacity: 0;
    }
  }
}
</style>
