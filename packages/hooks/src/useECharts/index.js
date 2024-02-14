import { unref, nextTick } from "vue";
import echarts from "./echarts.lib";
import { SVGRenderer, CanvasRenderer } from "echarts/renderers";
import { tryOnMounted, tryOnUnmounted, useEventListener } from "@vueuse/core";

const RENDER_TYPE = {
  SVGRenderer: "SVGRenderer",
  CanvasRenderer: "SVGRenderer",
};

const THEME_TYPE = {
  Light: "light",
  Dark: "dark",
  Default: "default",
};

export default function useECharts(elRef, option) {
  const { render, theme, autoChartSize, animation } = option || {
    render: RENDER_TYPE.SVGRenderer,
    autoChartSize: false,
    animation: {},
    theme: THEME_TYPE.Default,
  };

  // 渲染模式
  echarts.use(
    render === RENDER_TYPE.SVGRenderer ? SVGRenderer : CanvasRenderer
  );
  // echart 实例
  let chartInstance = null;

  /**
   * 初始化 echart
   */
  const initCharts = () => {
    const el = unref(elRef);
    if (!el || !unref(el)) {
      throw console.error("useECharts 当前没有提供 ref ");
    }
    //如果是多个dom，取第一个dom。
    chartInstance = echarts.init(Array.isArray(el) ? el[0] : el, theme);
  };

  /**
   * 设置/更新 echarts 配置
   * @param {*} option
   * @param {*} opts
   * @param {*} lazyUpdate
   */
  const setOption = (option, opts = false, lazyUpdate = false) => {
    nextTick(() => {
      if (!chartInstance) {
        initCharts();
        if (!chartInstance) return;
      }
      if (typeof opts === "boolean") {
        chartInstance.setOption(option, opts, lazyUpdate);
      } else if (typeof opts === "object") {
        chartInstance.setOption(option, opts);
      }
      hideLoading();
    });
  };

  /** 显示加载状态 */
  const showLoading = () => {
    if (!chartInstance) {
      initCharts();
    }
    chartInstance?.showLoading();
  };

  /** 隐藏加载状态 */
  const hideLoading = () => {
    if (!chartInstance) {
      initCharts();
    }
    chartInstance?.hideLoading();
  };

  /** 更新大小 */
  function resize() {
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: "quadraticIn",
      },
    });
  }

  /** 监听元素大小 */
  const watchEl = () => {
    // 给元素添加过渡
    if (animation?.enable) {
      let styles = animation?.styles ?? {};
      for (let key in styles) {
        elRef.value.style[key] = styles[key];
      }
    }
    const resizeObserver = new ResizeObserver((entries) => resize());
    resizeObserver.observe(elRef.value);
  };

  tryOnMounted(() => {
    useEventListener(window, "resize", (evt) => {
      resize();
    });
    if (autoChartSize) watchEl();
  });

  tryOnUnmounted(() => {
    if (!chartInstance) return;
    chartInstance.dispose();
    chartInstance = null;
    useEventListener(window, "resize", (evt) => {
      resize();
    });
  });

  /** 获取echart 实例 */
  function getInstance() {
    if (!chartInstance) {
      initCharts();
    }
    return chartInstance;
  }

  return {
    setOption,
    getInstance,
    echarts,
    showLoading,
    hideLoading,
  };
}
