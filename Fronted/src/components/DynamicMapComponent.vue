<template>
  <div class="toolBar">
    <q-btn
      :class="{
        'tool-bar-btn leftCornerBtn': true,
        'clicked-tool-bar-btn right-CornerBtn': areSmokesShowed,
      }"
      class="left-corner-btn"
      @click="showProcedureGrenades('smokes')"
    >
      Smokes
    </q-btn>
    <q-btn
      :class="{
        'tool-bar-btn': true,
        'clicked-tool-bar-btn': areFlashbangsShowed,
      }"
      @click="showProcedureGrenades('flashbangs')"
    >
      Flashbangs
    </q-btn>
    <q-btn
      :class="{
        'tool-bar-btn': true,
        'clicked-tool-bar-btn': areGrenadesShowed,
      }"
      @click="showProcedureGrenades('grenades')"
    >
      Grenades
    </q-btn>
    <q-btn
      :class="{
        'tool-bar-btn': true,
        'clicked-tool-bar-btn': areMolotovsShowed,
      }"
      @click="showProcedureGrenades('molotovs')"
    >
      Molotovs
    </q-btn>
    <q-btn
      :class="{
        'tool-bar-btn right-corner-btn': true,
        'clicked-tool-bar-btn right-corner-btn': isMoreShowed,
      }"
      @click="showProcedureGrenades('more')"
    >
      More
    </q-btn>
  </div>

  <div
    :class="{
      'container': !this.wantAddUtil,
      'add-util-container': this.wantAddUtil
    }"
    @wheel="zoomMap"
    @mousedown="startDrag"
    @mousemove="dragMap"
    @mouseup="endDrag"
  >
    <div class="map-wrapper" :style="mapTransformStyle">
      <q-img
        ref="mapImage"
        :src="mapSrc"
        alt="Map Image"
        class="mirage-image"
        @load="getImageSize"
      />

      <q-btn
        v-for="spot in smokes"
        :key="spot.id"
        v-show="
          spot.grenadeTypeId === 1
            ? areSmokesShowed
            : spot.grenadeTypeId === 2
            ? areFlashbangsShowed
            : spot.grenadeTypeId === 3
            ? areGrenadesShowed
            : spot.grenadeTypeId === 4
            ? areMolotovsShowed
            : spot.grenadeTypeId === 5
            ? isMoreShowed
            : false
        "
        class="marker no-hover"
        flat
        dense
        :style="{
          top: spot.positionY * imageHeight + 'px',
          left: spot.positionX * imageWidth + 'px',
        }"
        @click="showPositions(spot)"
      >
        <q-img
          :src="getGrenadeIconImageSource(spot.grenadeTypeId)"
          width="25px"
          height="25px"
        />
      </q-btn>

      <!-- Tlačidlá na konkrétnych pozíciách vo vybranom spote -->
      <q-btn
        v-for="(position, index) in selectedPositions"
        :key="index"
        class="marker no-hover"
        flat
        dense
        :style="{
          top: imageHeight * position.positionY + 'px',
          left: imageWidth * position.positionX + 'px',
          height: 0 + 'px',
          width: 0 + 'px',
        }"
        @click="showProcedure(position)"
      >
        <q-icon
          name="radio_button_checked"
          color="white"
          :size="`${13 / (scale / 2)}px`"
          class="radioBtn"
        />
      </q-btn>

      <q-dialog v-model="isProcedureVisible" @hide="onDialogClose">
        <div
          class="relative-position"
          style="
            width: 100vw;
            max-width: 1000px;
            background-color: white;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
          "
        >
          <div
            class="top text-h6 video-tile"
            style="color: black; padding: 8px 16px"
          >
            {{ postionName }}
          </div>
          <div class="rating-section">
            <q-icon name="star" style="color: #ffd700" size="50px" />
            <q-icon name="star" style="color: #ffd700" size="50px" />
            <q-icon name="star" style="color: #ffd700" size="50px" />
            <q-icon name="star" style="color: #ffd700" size="50px" />
            <q-icon name="star" style="color: #ffd700" size="50px" />
          </div>

          <div class="video-description">
            <div>Procedure:</div>
            <div>Difficulty:</div>
            <div></div>
          </div>

          <div class="video-container">
            <video
              ref="videoPlayer"
              class="video-player"
              autoplay
              muted
              loop
              :style="{
                transform: `scale(${videoScale})`,
                transition: 'transform 0.3s ease-in-out',
              }"
              @click="toggleVideoPlayback"
            >
              <source :src="videoSrc" type="video/mp4" />
              Váš prehliadač nepodporuje video tag.
            </video>
          </div>

          <div
            class="row no-wrap justify-center items-center"
            style="width: 100%; padding: 8px; background: white"
          >
            <q-btn
              icon="stop"
              color="black"
              flat
              class="q-mr-xl q-pa-xs"
              size="xl"
              @click="stopVideo"
            />
            <q-btn
              :icon="isZoomedIn ? 'zoom_out' : 'zoom_in'"
              color="black"
              flat
              class="q-mr-xl q-pa-xs"
              size="xl"
              @click="toggleZoom"
            />
            <q-btn
              icon="fast_forward"
              color="black"
              flat
              class="q-mr-xl q-pa-xs"
              size="xl"
              @click="jumpToImportantMoment"
            />
          </div>
        </div>
      </q-dialog>
    </div>

    <div class="q-pa-md add-utill-btn">

      <q-fab
        v-model="fabOpen"
        direction="up"
        :icon="fabOpen ? 'close' : 'menu'"
        active-icon="close"
        :hide-label="!fabOpen"
        color="primary"
        square
        push
      >
        <q-fab-action
        @mousedown.stop.prevent="saveMyUtill()"

        >
            Save
        </q-fab-action>

        <q-fab-action
          @mousedown.stop.prevent="createDraggableIcon('molotov')"
        >
          <img
            src="../assets/icons/molotov-cocktail.png"
            width="83"
            height="83"
            alt="Molotov Icon"
          />
        </q-fab-action>

        <q-fab-action
          @mousedown.stop.prevent="createDraggableIcon('flashbang')"
        >
          <img
            src="../assets/icons/flashbang-grenade.png"
            width="83"
            height="83"
            alt="Flashbang Icon"
          />
        </q-fab-action>


        <q-fab-action
          @mousedown.stop.prevent="createDraggableIcon('grenade')"
        >
          <img
            src="../assets/icons/grenade.png"
            width="83"
            height="83"
            alt="Grenade Icon"
          />
        </q-fab-action>

        <q-fab-action
          @mousedown.stop.prevent="createDraggableIcon('smoke')"
        >
          <img
            src="../assets/icons/smoke-grenade.png"
            width="83"
            height="83"
            alt="Smoke Icon"
          />
        </q-fab-action>
      </q-fab>
    </div>

    <!-- Samostatne zobrazené "draggable" ikony, ktoré vzniknú po kliknutí na Q-FAB Action. -->
    <div v-for="(icon, index) in draggableIcons" :key="index">
      <div
        class="draggable-icon"
        :style="{
          position: 'absolute',
          top: icon.y + 'px',
          left: icon.x + 'px',
          cursor: icon.isDragging ? 'grabbing' : 'grab',
          zIndex: 9999
        }"
        @mousedown="startIconDrag($event, index)"
      >
        <img
          :src="icon.src"
          width="50"
          height="50"
          :alt="icon.type + ' Icon'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import molotovIcon from '../assets/icons/molotov-cocktail.png'
import flashbangIcon from '../assets/icons/flashbang-grenade.png'
import grenadeIcon from '../assets/icons/grenade.png'
import smokeIcon from '../assets/icons/smoke-grenade.png'
import markerIcon from '../assets/icons/marker.png'
import { api } from 'src/boot/axios';


export default {
  name: 'DynamicMapComponent',
  props: {
    mapSrc: {
      type: String,
      required: true,
    },
    mapData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      // Pre video
      isZoomedIn: false,
      videoScale: 1,

      // Map a spots
      smokes: [],
      tempSpots: [],
      selectedSpot: {},
      imageWidth: 0,
      imageHeight: 0,
      scale: 1,
      translateX: 0,
      translateY: 0,
      isDragging: false,
      startX: 0,
      startY: 0,
      maxTranslateX: 300,
      maxTranslateY: 300,
      selectedPositions: [],
      isProcedureVisible: false,
      selectedProcedure: {},

      // Info o procedure
      postionName: '',
      videoSrc: '',
      mapName: '',
      importantTime: 0,

      // Filtre
      areSmokesShowed:
        JSON.parse(localStorage.getItem('areSmokesShowed')) ?? true,
      areFlashbangsShowed:
        JSON.parse(localStorage.getItem('areFlashbangsShowed')) ?? false,
      areGrenadesShowed:
        JSON.parse(localStorage.getItem('areGrenadesShowed')) ?? false,
      areMolotovsShowed:
        JSON.parse(localStorage.getItem('areMolotovsShowed')) ?? false,
      isMoreShowed: JSON.parse(localStorage.getItem('isMoreShowed')) ?? false,
      wantAddUtil: false,

      // Drag jedného markeru (demo)
      clickPositionX: 0,
      clickPositionY: 0,
      isDraggingUtil: false,
      utilStartX: 0,
      utilStartY: 0,
      offsetX: 0,
      offsetY: 0,

      // Q-FAB
      fabOpen: false,

      // Zoznam "ikoniek" na mape, ktoré sú samostatne ťahateľné
      draggableIcons: [],
      currentDraggedIndex: null,

      iconsMap: {
      molotov: molotovIcon,
      flashbang: flashbangIcon,
      grenade: grenadeIcon,
      smoke: smokeIcon,
      marker: markerIcon
      },
    };
  },
  computed: {
    limitedTranslateX() {
      return Math.min(
        this.maxTranslateX,
        Math.max(-this.maxTranslateX, this.translateX)
      );
    },
    limitedTranslateY() {
      return Math.min(
        this.maxTranslateY,
        Math.max(-this.maxTranslateY, this.translateY)
      );
    },
    mapTransformStyle() {
      return {
        transform: `scale(${this.scale}) translate(${this.limitedTranslateX}px, ${this.limitedTranslateY}px)`,
      };
    },
  },
  watch: {
    mapData: {
      handler(newData) {
        this.smokes = newData;
        try {
          this.mapName = newData[0]?.map?.name || '';
        } catch (error) {
          console.log('Error', error);
        }
      },
      deep: true,
      immediate: true,
    },
    mapSrc() {
      this.$nextTick(() => {
        this.getImageSize();
      });
    },
  },
  mounted() {
    this.getImageSize();
    window.addEventListener('resize', this.getImageSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.getImageSize);
    // Pre istotu odoberieme prípadné listenery pri unmount
    document.removeEventListener('mousemove', this.handleIconDrag);
    document.removeEventListener('mouseup', this.stopIconDrag);
  },
  methods: {
    // Ovládanie viditeľnosti granátov
    showProcedureGrenades(type) {
      this.draggableIcons = []

      if (type === 'smokes') {
        this.areSmokesShowed = !this.areSmokesShowed;
        localStorage.setItem('areSmokesShowed', JSON.stringify(this.areSmokesShowed));
      } else if (type === 'flashbangs') {
        this.areFlashbangsShowed = !this.areFlashbangsShowed;
        localStorage.setItem('areFlashbangsShowed', JSON.stringify(this.areFlashbangsShowed));
      } else if (type === 'grenades') {
        this.areGrenadesShowed = !this.areGrenadesShowed;
        localStorage.setItem('areGrenadesShowed', JSON.stringify(this.areGrenadesShowed));
      } else if (type === 'molotovs') {
        this.areMolotovsShowed = !this.areMolotovsShowed;
        localStorage.setItem('areMolotovsShowed', JSON.stringify(this.areMolotovsShowed));
      } else if (type === 'more') {
        this.isMoreShowed = !this.isMoreShowed;
        localStorage.setItem('isMoreShowed', JSON.stringify(this.isMoreShowed));
      }
      if (this.tempSpots.length > 0) {
        this.selectedSpot = {};
        this.selectedPositions = [];
        this.smokes = this.tempSpots;
        this.tempSpots = [];
      }
    },

    // Zoom mapy
    zoomMap(event) {
      if (this.wantAddUtil) return;
      const zoomSpeed = 0.1;
      this.scale += event.deltaY > 0 ? -zoomSpeed : zoomSpeed;
      this.scale = Math.min(Math.max(this.scale, 1), 3);
      if (this.scale === 1) {
        this.translateX = 0;
        this.translateY = 0;
      }
      this.getImageSize();
    },

    // Prepínanie priblíženia videa
    toggleZoom() {
      if (this.wantAddUtil) return;
      this.isZoomedIn = !this.isZoomedIn;
      this.videoScale = this.isZoomedIn ? 3 : 1;
    },

    // Posun videa na dôležitú časť
    jumpToImportantMoment() {
      if (this.wantAddUtil) return;
      const videoEl = this.$refs.videoPlayer;
      if (videoEl) {
        videoEl.currentTime = this.importantTime;
        videoEl.pause();
      }
    },

    // Klik na spot -> zobrazenie jeho polôh
    showPositions(spot) {
      if (this.selectedSpot.id === spot.id) {
        this.selectedSpot = {};
        this.selectedPositions = [];
        this.smokes = this.tempSpots;
        this.tempSpots = [];
        return;
      }
      this.selectedSpot = spot;
      this.selectedPositions = spot.positions;
      this.tempSpots = this.smokes;
      this.smokes = [spot];
    },

    // Klik na pozíciu -> zobrazenie postupu v dialógu
    showProcedure(position) {
      this.videoSrc = `http://localhost:3333/video/${this.mapName}/${position.source}`;
      this.importantTime = position.keyTime;
      this.postionName = position.name;
      this.selectedProcedure = position;
      this.isProcedureVisible = true;
    },

    // Play/Pause videa
    toggleVideoPlayback() {
      const videoEl = this.$refs.videoPlayer;
      if (videoEl.paused) {
        videoEl.play();
      } else {
        videoEl.pause();
      }
    },

    // Stop videa
    stopVideo() {
      const videoEl = this.$refs.videoPlayer;
      videoEl.pause();
      videoEl.currentTime = 0;
    },

    // Drag mapy
    startDrag(event) {
      if (this.scale > 1) {
        this.isDragging = true;
        this.startX = event.clientX - this.translateX;
        this.startY = event.clientY - this.translateY;
      }
    },
    dragMap(event) {
      if (this.wantAddUtil) return;
      if (!this.isDragging || this.scale === 1) return;
      this.translateX = event.clientX - this.startX;
      this.translateY = event.clientY - this.startY;
    },
    endDrag() {
      if (this.wantAddUtil) return;
      this.isDragging = false;
    },
    onDialogClose() {
      this.isZoomedIn = false;
      this.videoScale = 1;
    },
    getGrenadeIconImageSource(grenadeId) {
      const icons = {
        1: 'src/assets/icons/smoke.png',
        2: 'src/assets/icons/flash.png',
        3: 'src/assets/icons/grenade.png',
        4: 'src/assets/icons/molotov.png',
        5: 'src/assets/icons/more.png',
      };
      return icons[grenadeId] || '';
    },
    getImageSize() {
      this.$nextTick(() => {
        if (this.$refs.mapImage && this.$refs.mapImage.$el) {
          this.imageWidth = this.$refs.mapImage.$el.offsetWidth;
          this.imageHeight = this.$refs.mapImage.$el.offsetHeight;
        }
      });
    },
    addUtil() {
      this.areSmokesShowed = false;
      this.areFlashbangsShowed = false;
      this.areGrenadesShowed = false;
      this.areMolotovsShowed = false;
      this.isMoreShowed = false;
      this.wantAddUtil = !this.wantAddUtil;
    },

    // Drag jedného markeru (demo kód hore)
    startDragUtil(event) {
      this.isDraggingUtil = true;
      this.utilStartX = event.clientX;
      this.utilStartY = event.clientY;
      this.offsetX = event.clientX - this.clickPositionX;
      this.offsetY = event.clientY - this.clickPositionY;

      document.addEventListener('mousemove', this.dragUtil);
      document.addEventListener('mouseup', this.stopDragUtil);
    },
    dragUtil(event) {
      if (!this.isDraggingUtil) return;
      this.clickPositionX = event.clientX - this.offsetX;
      this.clickPositionY = event.clientY - this.offsetY;
    },
    stopDragUtil() {
      this.isDraggingUtil = false;
      document.removeEventListener('mousemove', this.dragUtil);
      document.removeEventListener('mouseup', this.stopDragUtil);
    },

    createDraggableIcon(type) {
      this.addUtil()
      const iconSrc = this.iconsMap[type] || '';

      this.draggableIcons = []

      this.draggableIcons.push({
        type,
        src: iconSrc,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          width: '14px',
          height: '14px'
        }
      });

      this.draggableIcons.push({
        type,
        src: this.iconsMap['marker'],
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        style: {
          width: '30px',
          height: '30px'
        }
      });
    },

    startIconDrag(event, index) {
      this.currentDraggedIndex = index;
      const icon = this.draggableIcons[index];
      icon.isDragging = true;

      icon.offsetX = event.clientX - icon.x;
      icon.offsetY = event.clientY - icon.y;

      document.addEventListener('mousemove', this.handleIconDrag);
      document.addEventListener('mouseup', this.stopIconDrag);
    },

    handleIconDrag(event) {
      if (this.currentDraggedIndex === null) return;
      const icon = this.draggableIcons[this.currentDraggedIndex];
      if (!icon.isDragging) return;

      icon.x = event.clientX - icon.offsetX;
      icon.y = event.clientY - icon.offsetY;
    },

    stopIconDrag() {
      if (this.currentDraggedIndex === null) return;
      const icon = this.draggableIcons[this.currentDraggedIndex];
      icon.isDragging = false;
      this.currentDraggedIndex = null;

      document.removeEventListener('mousemove', this.handleIconDrag);
      document.removeEventListener('mouseup', this.stopIconDrag);
    },
    async saveMyUtill() {
    console.log(this.draggableIcons);

    if (!this.draggableIcons[0] || !this.draggableIcons[1]) {
      console.error('Chýbajú údaje v draggableIcons');
      return;
    }

    try {
      const response = await api.post('/add-util', {
        x: this.draggableIcons[0].x,
        y: this.draggableIcons[1].y,
      });

      console.log('Saved:', response.data);
    } catch (error) {
      console.error('Not saved:', error);
    }
  }

  },
};
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  overflow: hidden;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0c0c0c;
}

.add-util-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #0c0c0c;
}

.container:active {
  cursor: grabbing;
}

.map-wrapper {
  position: relative;
  transition: transform 0.2s ease-out;
  max-width: 1000px;
  width: 80%;
}

.mirage-image {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  padding: 0px;
  margin: 0px;
}

.marker:hover {
  background-color: transparent !important;
  box-shadow: none !important;
}

.no-hover:hover {
  background-color: transparent !important;
  box-shadow: none !important;
}

.radioBtn:hover {
  background-color: transparent !important;
  padding: 0;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.video-player {
  transform-origin: center center;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.toolBar {
  background-color: transparent;
  width: 80%;
  min-height: 0px;
  border-radius: 50px;
  padding-top: 20px;
  padding-bottom: 20px;
  min-height: 100px;
}

.tool-bar-btn {
  font-size: 25px;
  color: black;
  width: 20%;
  background: white;
  border-radius: 0;
  border: 1px solid #0c0c0c;
  cursor: pointer;
  min-height: 0;
  transition: font-size 0.3s ease-in-out, color 0.3s ease-in-out,
    border 0.3s ease-in-out;
}

.leftCornerBtn {
  border-radius: 50px 0px 0px 50px;
}

.right-corner-btn {
  border-radius: 0px 50px 50px 0px;
}

.tool-bar-btn::before {
  box-shadow: none;
}

.clicked-tool-bar-btn {
  font-size: 30px;
  color: white;
  width: 20%;
  background-color: #ff0000;
  min-height: 0;
  border: 3px solid #0c0c0c;
  transition: font-size 0.3s ease-in, color 0.3s ease-in, border 0.3s ease-in;
}

.video-tile {
  font-size: 60px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
}

.rating-section {
  width: 80%;
  text-align: center;
  border-bottom: 3px solid #0c0c0c;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.video-description {
  font-size: 20px;
  padding-bottom: 20px;
}

.add-utill-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
}

.draggable-icon {
  /* Môžeš pridať nejaké extra orámovanie atď. */
}

.q-mt-lg {
  margin-top: 1rem;
}
</style>
