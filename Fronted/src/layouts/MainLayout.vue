<template>
  <q-layout view="hHh Lpr lFf">
    <q-drawer v-model="drawer" show-if-above side="left" elevated :style="{ backgroundColor: '#0c0c0c' }">
      <q-btn
          flat
          dense
          round
          icon="menu"
          @click="drawer = !drawer"
          class="q-mr-sm"
          color="white"
          size="30px"
        />
      <q-list class="flex flex-center">
        <SideBarButtonComponent
          v-for="(item, index) in menuItems"
          :key="index"
          :item="item"
          :isActive="activeButton === index"
          @click="selectMap(item, index)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page class="page-background">
        <DynamicMapComponent :mapSrc="currentMapSrc" :mapData="mapData"/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';
import DynamicMapComponent from '../components/DynamicMapComponent.vue';
import SideBarButtonComponent from 'src/components/SideBarButtonComponent.vue';

export default {
  name: 'MainLayout',
  components: {
    DynamicMapComponent,
    SideBarButtonComponent

  },
  setup() {
    const activeButton = ref(0)
    const drawer = ref(true);
    const menuItems = ref([]);
    const currentMapSrc = ref('');
    const mapData = ref(null);
    const loadMapData = async (mapName) => {
      try {
        const formattedMapName = mapName.toLowerCase(); // 🔹 Konvertujeme na lowercase
        const response = await api.get(`/map-data/${formattedMapName}`);
        mapData.value = response.data;
      } catch (error) {
        console.error('Chyba pri načítaní dát mapy:', error);
      }
    };

    const fetchMaps = async () => {
      try {
        const response = await api.get('/maps');
        const maps = response.data;

        menuItems.value = maps.map(map => ({
          label: map.name,
          src: `http://localhost:3333/map/${map.name}`,
        }));

        if (menuItems.value.length > 0) {
          selectMap(menuItems.value[0], 0);
        }

      } catch (error) {
        console.error('Chyba pri načítaní máp:', error);
      }
    };

    const selectMap = (item, index) => {
      activeButton.value = index
      currentMapSrc.value = item.src;
      loadMapData(item.label);

    };

    onMounted(fetchMaps);

    return {
      drawer,
      currentMapSrc,
      menuItems,
      selectMap,
      mapData,
      activeButton
    };
  },
};
</script>

<style scoped>
.page-background {
  background-color: #0c0c0c;
  color: white;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

}

</style>
