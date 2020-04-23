<template>
  <modal name="checkout" :resizable="true" :adaptive="true" height="auto" :maxWidth="430" :scrollable="true" :clickToClose="false">
    <div class="modal-wrapper">
      <div class="modal-container">
        <div class="modal-title">{{ modalTitle }}</div>
        <div class="dividing-line">\\\</div>
        <form class="booking-form" v-if="modalTitle === '預約時段'">
          <div class="form__group">
            <label for="name" class="form__label">姓名</label>
            <input v-model.trim="form.name" id="name" type="text" class="form__input" placeholder="請輸入姓名" />
          </div>
          <template v-if="$v.form.name.$dirty"><span v-if="!$v.form.name.required" class="warning">姓名為必填欄位</span></template>
          <div class="form__group">
            <label for="tel" class="form__label">電話</label>
            <input v-model.trim="form.tel" id="tel" type="tel" class="form__input" placeholder="請輸入電話" />
          </div>
          <template v-if="$v.form.tel.$dirty">
            <span class="warning" v-if="!$v.form.tel.required">電話為必填欄位</span>
            <span class="warning" v-if="!$v.form.tel.numeric">電話號碼必為數字</span>
          </template>
          <div class="form__group">
            <label for="tel" class="form__label">預約起訖</label>
            <div class="booking-picker">{{ range }}</div>
          </div>
        </form>
      </div>
      <div class="booking-days" v-if="modalTitle === '預約時段'">
        <div class="modal-container">
          <div class="booking-days__time">
            <p>平日時段</p>
            <p>{{ judgeWeekend.normal }} 夜</p>
          </div>
          <div class="booking-days__time">
            <p>假日時段</p>
            <p>{{ judgeWeekend.holiday }} 夜</p>
          </div>
        </div>
      </div>
      <div class="modal-container" v-if="modalTitle === '預約時段'">
        <div class="booking-price">= NT.{{ totalPrice }}</div>
      </div>
      <div class="booking-status modal-container" v-if="modalTitle !== '預約時段'">
        <img v-if="modalTitle === '預約成功'" src="../assets/info_icon/tick-inside-circle.svg" />
        <p v-if="modalTitle === '預約失敗'">預約時間已被人預訂</p>
      </div>
      <div class="modal-btngroup modal-container">
        <button class="modal-btn btn-light" @click.prevent="hide()" v-if="modalTitle === '預約時段'">取消</button>
        <button class="modal-btn btn-dark" @click.prevent="submitForm()" v-if="modalTitle === '預約時段'">確定預約 <i v-if="sending" class="fas fa-spinner fa-spin"></i></button>
        <router-link to="/" style="margin-left: auto;" v-if="modalTitle === '預約成功'"><button class="modal-btn btn-dark">回首頁</button></router-link>
        <button style="margin-left: auto;" class="modal-btn btn-dark" @click.prevent="modalTitle = '預約時段'" v-if="modalTitle === '預約失敗'">返回</button>
      </div>
    </div>
  </modal>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators';

export default {
  name: 'CheckoutModal',
  props: ['roomId', 'bookedDays', 'judgeWeekend', 'dayPrice', 'bookingDates', 'range'],
  data() {
    return {
      modalTitle: '預約時段',
      sending: false,
      form: { name: null, tel: null },
    };
  },
  computed: {
    totalPrice() {
      const vm = this;
      let totalPrice = 0;
      if (vm.judgeWeekend) {
        // 若超過一天最後一天不算錢
        if (vm.bookingDates && vm.bookingDates.length > 1) {
          const lastDay = new Date(vm.bookingDates[vm.bookingDates.length - 1]).getDay();
          if (lastDay === 0 || lastDay === 6) {
            vm.judgeWeekend.holiday -= 1;
          } else {
            vm.judgeWeekend.normal -= 1;
          }
        }
        totalPrice = vm.dayPrice.normal * vm.judgeWeekend.normal + vm.dayPrice.holiday * vm.judgeWeekend.holiday;
      }
      return totalPrice;
    },
  },
  validations: {
    form: {
      name: { required },
      tel: { required, numeric },
    },
  },
  methods: {
    formReset() {
      const vm = this;
      vm.form.name = null;
      vm.form.tel = null;
    },
    submitForm() {
      const vm = this;
      vm.$v.$touch();
      if (!vm.$v.$invalid) {
        vm.sending = true;
        const api = `https://challenge.thef2e.com/api/thef2e2019/stage6/room/${vm.roomId}`;
        const bookingOrder = { name: vm.form.name, tel: vm.form.tel, date: [...vm.bookingDates.map((day) => day.replace(/\//g, '-'))] };
        vm.axios
          .post(api, bookingOrder, {
            headers: {
              Authorization: process.env.VUE_APP_API_TOKEN,
              accept: 'application/json',
            },
          })
          .then((res) => {
            if (res.status === 200) {
              vm.modalTitle = '預約成功';
            }
            vm.sending = false;
          })
          .catch(() => {
            vm.modalTitle = '預約失敗';
            vm.sending = false;
          });
      }
    },
    hide() {
      const vm = this;
      vm.formReset();
      vm.$modal.hide('checkout');
    },
  },
};
</script>

<style lang="scss">
.modal-wrapper {
  padding: 30px 0;
}
.modal-container {
  padding: 0 40px;
}
.modal-title {
  font-size: 24px;
  font-family: 'Noto Sans TC', sans-serif;
  letter-spacing: 2.5px;
  margin-bottom: 12px;
}
.modal-btngroup {
  display: flex;
  justify-content: space-between;
}
.modal-btn {
  padding: 8px 23px;
  font-size: 14px;
  letter-spacing: 1.5px;
  margin-top: 30px;
}
.btn-dark {
  background-color: #484848;
  color: #ffffff;
}

.btn-light {
  background-color: #d8d8d8;
  color: #6d7278;
}

.booking-form {
  margin-top: 12px;
}

form {
  font-family: 'Noto Sans TC', sans-serif;
  letter-spacing: 1.5px;
  .form {
    &__label {
      font-size: 14px;
      width: 120px;
    }
    &__group {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }
    &__input {
      outline: none;
      border: 1px solid #c9c9c9;
      border-radius: 5px;
      height: 32px;
      width: 100%;
      padding: 12px;
      font-size: 14px;
      &::placeholder {
        color: #cccccc;
      }
    }
  }
  .warning {
    display: block;
    color: rgb(255, 123, 0);
    margin: 5px 0 0 95px;
  }
}

.booking-days {
  font-family: 'Noto Sans TC', sans-serif;
  margin: 30px 0 10px 0;
  background-color: #ededed;
  padding: 15px 0;
  color: #6d7278;
  font-size: 12px;
  letter-spacing: 1.3px;
  &__time {
    display: flex;
    justify-content: space-between;
  }
}
.booking-price {
  font-family: 'Noto Sans TC', sans-serif;
  text-align: right;
  color: hsl(27, 100%, 61%);
  font-size: 26px;
  letter-spacing: 2.7px;
}
.booking-status {
  display: flex;
  justify-content: center;
  img {
    display: block;
    width: 60px;
    height: 60px;
  }
  p {
    font-size: 14px;
    font-family: 'Noto Sans TC', sans-serif;
    letter-spacing: 1.5px;
    margin-right: auto;
    margin-top: 16px;
  }
}
</style>
