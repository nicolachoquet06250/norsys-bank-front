<template>
<q-layout view="lHh lpr lFf" scroll="" container style="height: 100vh" class="shadow-2">
    <q-header elevated>
        <q-toolbar>
            <q-btn  flat round dense
                    icon="menu"
                    class="q-mr-sm"
                    @click="toggleLeftDrawer" />

            <q-avatar>
                <q-img :src="logo" alt="logo Norsys" />
            </q-avatar>

            <q-toolbar-title>
                Norsys Bank
            </q-toolbar-title>
        </q-toolbar>

        <q-tabs :align="'left'" v-model="tab" v-if="!ios">
            <q-tab name="images" label="Images" @click="handleChangePage('images')" />
            <q-tab name="videos" label="Videos" @click="handleChangePage('videos')" />
            <q-tab name="articles" label="Articles" @click="handleChangePage('articles')" />
        </q-tabs>
    </q-header>

    <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        bordered
    >
        <q-list>
            <q-item-label header>
                Essential Links
            </q-item-label>

            <EssentialLink
                v-for="link in essentialLinks"
                :key="link.title"
                v-bind="link"
            />
        </q-list>
    </q-drawer>

    <q-tab-panels v-model="tab" class="q-gutters-none">
        <q-tab-panel :name="tab" class="q-gutters-none">
            <q-page-container :style="{ paddingTop: 0 }">
                <router-view />
            </q-page-container>
        </q-tab-panel>
    </q-tab-panels>

    <q-tab-panels
        v-model="tab"
        animated swipeable vertical
        transition-prev="jump-up"
        transition-next="jump-up"
    >
        <q-page class="q-pa-md">
            <q-tab-panel name="images">
                <p v-for="n in 15" :key="n">
                    1 Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci,
                    dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
                </p>
            </q-tab-panel>
        </q-page>

        <q-page class="q-pa-md">
            <q-tab-panel name="videos">
                <p v-for="n in 15" :key="n">
                    2 Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci,
                    dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
                </p>
            </q-tab-panel>
        </q-page>

        <q-page class="q-pa-md">
            <q-tab-panel name="articles">
                <p v-for="n in 15" :key="n">
                    3 Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci,
                    dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
                </p>
            </q-tab-panel>
        </q-page>
    </q-tab-panels>

    <q-footer v-if="ios">
        <q-tabs
          v-model="tab"
          class="bg-grey-3"
          :align="'justify'"
          narrow-indicator
        >
            <q-tab name="images" label="Images" />
            <q-tab name="videos" label="Videos" />
            <q-tab name="articles" label="Articles" />
        </q-tabs>
    </q-footer>
</q-layout>
</template>

<script setup>
import { ref } from 'vue'
import logo from 'assets/norsys.png'
import { essentialLinks } from 'src/boot/menu'
import EssentialLink from 'src/components/EssentialLink.vue'
// import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { ios } from 'platform-detect/os.mjs'

// const $q = useQuasar()

const $router = useRouter()

const tab = ref($router.currentRoute.value.name ?? 'images')
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleChangePage = pageName => {
  $router.push({ name: pageName })
}
</script>
