const template = await $loadTemplate("components/layout/nav/index.html", "components/layout/nav/index.css");
import { useNavStore } from "../../../store/nav.js";

export default {
  name: 'layoutNav',
  template,
  setup() {
    const route = useRoute();
    const router = useRouter();
    const navStore = useNavStore();
    const navs = computed(() => navStore.navInfo.navs);
    const currentNav = computed(() => navStore.navInfo.lastNav);
    const refScrollBar = ref(null);
    const refNavs = ref([]);

    //导航
    const navigateTo = async (nav) => {
      router.push(nav);
    }

    //删除页签
    const removeNav = (nav) => {
      const lastNav = navStore.removeNav(nav);
      navigateTo(lastNav);
    }

    //鼠标滚动
    const onScrollbarWheel = (e) => {
      refScrollBar.value.$refs.wrapRef.scrollLeft += e.wheelDelta / 4;
    }

    //横向滚动
    const moveToCurrentNav = async (nav) => {
      await nextTick();
      let navIndex = navs.value.findIndex(f => f.path === nav.path);
      let navDom = refNavs.value[navIndex];
      let navLength = refNavs.value.length;
      let navFirst = refNavs.value[0];
      let navLast = refNavs.value[refNavs.value.length - 1];
      // 当前滚动条的值
      let scrollRefs = refScrollBar.value.$refs.wrapRef;
      // 当前滚动条滚动宽度
      let scrollS = scrollRefs.scrollWidth;
      // 当前滚动条偏移宽度
      let offsetW = scrollRefs.offsetWidth;
      // 当前滚动条偏移距离
      let scrollL = scrollRefs.scrollLeft;
      // 上一个nav
      let navPrevTag = refNavs.value[navIndex - 1];
      // 下一个nav
      let navNextTag = refNavs.value[navIndex + 1];
      // 上一个nav的偏移距离
      let beforePrevL = 0;
      // 下一个nav的偏移距离
      let afterNextL = 0;
      if (navDom === navFirst) {
        // 头部
        scrollRefs.scrollLeft = 0;
      } else if (navDom === navLast) {
        // 尾部
        scrollRefs.scrollLeft = scrollS - offsetW;
      } else {
        // 非头/尾部
        if (navIndex === 0) beforePrevL = navFirst.offsetLeft - 5;
        else beforePrevL = navPrevTag?.offsetLeft - 5;

        if (navIndex === navLength) afterNextL = navLast.offsetLeft + navLast.offsetWidth + 5;
        else afterNextL = navNextTag.offsetLeft + navNextTag.offsetWidth + 5;

        if (afterNextL > scrollL + offsetW) {
          scrollRefs.scrollLeft = afterNextL - offsetW;
        } else if (beforePrevL < scrollL) {
          scrollRefs.scrollLeft = beforePrevL;
        }
      }
      // 更新滚动条，防止不出现
      refScrollBar.value.update();
    }

    const onDropdownClick = (command) => {
      if (command === 'refresh') {
        navStore.refreshRouterView(currentNav.value.path)
      } else if (command === 'closeOther') {
        navStore.closeOtherNav();
      } else if (command === 'closeAll') {
        navStore.closeAllNav();
        navigateTo("/home");
      }
    }

    watch(() => route, (val) => {
      navStore.addNav(val);
      moveToCurrentNav(val);
    }, {
      immediate: true,
      deep: true
    })

    return {
      navs,
      route,
      navigateTo,
      removeNav,
      onScrollbarWheel,
      refScrollBar,
      refNavs,
      currentNav,
      onDropdownClick
    }
  }
}