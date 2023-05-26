const template = await $loadTemplate("views/home/index.html", "views/home/index.css", "viewHome", ["core/echarts.5.4.2.min.js"]);

export default {
  template,
  setup() {
    const userInfo = computed(() => inject("userStore").getUserInfo);
    const dynamicTo = inject("dynamicTo");
    const refCharts = ref(null);
    const loading = ref(true);
    const { t } = useI18n();

    const dynamicRoute = () => {
      const name = `dynamicRoute${+new Date()}`
      dynamicTo({
        path: `/${name}`,
        name,
        component: "views/app/index.js",
        meta: {
          title: `动态路由${+new Date()}`
        },
        query: {
          sex: 1,
          age: 12
        }
      })
    }

    onMounted(async () => {
      await nextTick();
      setTimeout(async () => {
        const chartDom = refCharts.value;
        const myChart = echarts.init(chartDom);
        const option = {
          title: {
            text: t("system.viewHome.echart.title")
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [
              t("system.viewHome.echart.email"),
              t("system.viewHome.echart.unionAds"),
              t("system.viewHome.echart.videoAds"),
              t("system.viewHome.echart.direct"),
              t("system.viewHome.echart.searchEngine")
            ]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [
              t("system.viewHome.echart.mon"),
              t("system.viewHome.echart.tue"),
              t("system.viewHome.echart.wed"),
              t("system.viewHome.echart.thu"),
              t("system.viewHome.echart.fri"),
              t("system.viewHome.echart.sat"),
              t("system.viewHome.echart.sun")
            ]
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: t("system.viewHome.echart.email"),
              type: 'line',
              stack: 'Total',
              data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
              name: t("system.viewHome.echart.unionAds"),
              type: 'line',
              stack: 'Total',
              data: [220, 182, 191, 234, 290, 330, 310]
            },
            {
              name: t("system.viewHome.echart.videoAds"),
              type: 'line',
              stack: 'Total',
              data: [150, 232, 201, 154, 190, 330, 410]
            },
            {
              name: t("system.viewHome.echart.direct"),
              type: 'line',
              stack: 'Total',
              data: [320, 332, 301, 334, 390, 330, 320]
            },
            {
              name: t("system.viewHome.echart.searchEngine"),
              type: 'line',
              stack: 'Total',
              data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
          ]
        };

        option && myChart.setOption(option);
      }, 1000)
    });
    return {
      userInfo,
      dynamicRoute,
      refCharts,
      loading,
      t
    }
  }
};