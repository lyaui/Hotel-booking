<template>
  <div class="container">
    <router-link class="room-card" v-for="room in data" :key="room.id" :to="{ name: 'RoomInfo', params: { roomId: room.id } }">
      <img :src="room.imageUrl" class="room-card__img" :alt="room.name" />
      <div class="room-card__body">
        <div class="room-card__name">{{ room.name }}</div>
        <div class="room-card__price">
          <div class="room-card__price-holiday">
            <span>NT.{{ room.normalDayPrice }}</span> 假日
          </div>
          <div class="room-card__price-normal">NT.{{ room.holidayPrice }} 平日</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'RoomCard',
  props: ['data'],
};
</script>
<style lang="scss">
.container {
  max-width: 984px;
  padding: 0 22px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
}

.room-card {
  position: relative;
  z-index: 100;
  flex: 0 0 calc((100% - 44px) / 3);
  height: 350px;
  width: 300px;
  font-family: 'Noto Sans TC', sans-serif;
  font-weight: 300;
  letter-spacing: 1.5px;
  margin-bottom: 58px;
  background-color: #fff;
  box-shadow: 2px 2px 9px 0 rgba(0, 0, 0, 0.18);

  &:not(:nth-child(3n)) {
    margin-right: 22px;
  }
  @media (max-width: 750px) {
    flex: 0 0 calc((100% - 22px) / 2);
    &:not(:nth-child(3n)) {
      margin-right: 0px;
    }
    &:not(:nth-child(2n)) {
      margin-right: 22px;
    }
  }

  @media (max-width: 500px) {
    flex: 0 0 100%;
    &:not(:nth-child(2n)) {
      margin-right: 0px;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    padding-bottom: 70px;
    transition: all 0.3s;
  }
  &:hover &__img {
    opacity: 1;
    padding-bottom: 100px;
  }

  &__body {
    height: 70px;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    bottom: 0;
    z-index: 100;
    padding: 20px 30px;
    background-color: #fff7f7f7;
    transition: all 0.3s;
  }
  &:hover &__body {
    height: 100px;
  }
  &__name {
    font-size: 14px;
  }
  &__price {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    opacity: 0;
    transition: all 0.3s;
    &-holiday {
      span {
        font-size: 21px;
        letter-spacing: 2.2px;
      }
    }
    &-normal {
      font-size: 12px;
    }
  }
  &:hover &__price {
    opacity: 1;
  }
}
</style>
