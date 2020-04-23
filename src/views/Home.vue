<template>
  <div class="home">
    <loading :active.sync="isLoading" :opacity="0.9" :background-color="'#fff'" :color="'#575757'"></loading>
    <header>
      <carousel v-if="headerBg && headerBg.length > 0" :dots="false" :items="1" :autoplay="true" :smartSpeed="3000" :nav="false" :loop="true">
        <div v-for="(img, i) in headerBg" :key="i" class="header__bg" :style="{ 'background-image': `linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.35) 100%), url(${img})` }"></div>
      </carousel>
      <div class="header__content">
        <img class="header__logo" src="../assets/index_icon/logo_white.svg" alt="White Space" />
        <div class="header__info">
          <div class="header__social">
            <a href="#"><img src="../assets/index_icon/instagram-brands.svg" /></a>
            <a href="#"><img src="../assets/index_icon/facebook-square-brands.svg" /></a>
          </div>
          <ul class="header__list">
            <li><img src="../assets/index_icon/phone-alt-solid.svg" />02-17264937</li>
            <li><img src="../assets/index_icon/envelope-solid.svg" />whitespace@whitespace.com.tw</li>
            <li><img src="../assets/index_icon/home-solid.svg" />台北市羅斯福路十段30號</li>
          </ul>
        </div>
      </div>
    </header>
    <main>
      <room-card :data="data"></room-card>
    </main>
  </div>
</template>

<script>
import carousel from 'vue-owl-carousel';
import RoomCard from '../components/RoomCard.vue';

export default {
  name: 'Home',
  components: { RoomCard, carousel },
  data() {
    return {
      data: null,
      headerBg: null,
    };
  },
  computed: {
    isLoading() {
      const vm = this;
      return !vm.data;
    },
    headerImg() {
      const vm = this;
      const test = vm.data;
      return test;
    },
  },
  created() {
    const vm = this;
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const api = 'https://challenge.thef2e.com/api/thef2e2019/stage6/rooms';
    vm.axios
      .get(`${proxy}${api}`, {
        headers: {
          Authorization: process.env.VUE_APP_API_TOKEN,
          accept: 'application/json',
        },
      })
      .then((response) => {
        vm.data = response.data.items;
        vm.headerBg = response.data.items.map((item) => item.imageUrl);
      });
  },
};
</script>
<style lang="scss" scoped>
.header__bg {
  height: 100vh;
  width: 100%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
.header {
  &__content {
    position: absolute;
    z-index: 1000;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
  }
  &__logo {
    margin-bottom: 40px;
  }
  &__info {
    display: flex;
    @media (max-width: 500px) {
      flex-direction: column;
    }
  }
  &__social {
    margin: auto;
    margin-right: 35px;
    & :not(:last-child) {
      margin-right: 10px;
    }
    @media (max-width: 500px) {
      margin: auto;
      margin-bottom: 20px;
    }
    img {
      width: 25px;
      height: 25px;
    }
  }

  &__list {
    border-left: 1px solid #fff;
    padding-left: 25px;
    @media (max-width: 500px) {
      border: none;
    }
    li {
      display: flex;
      color: #fff;
      font-size: 14px;
      &:not(:last-child) {
        margin-bottom: 12px;
      }
    }
    img {
      margin-right: 20px;
      width: 20px;
      height: 20px;
    }
  }
}

main {
  margin-top: -100px;
  margin-bottom: 107px;
}
</style>
