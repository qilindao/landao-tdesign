# useECharts


## 🤖 Usage

```javascript

// template

<!-- width height must be provided for element -->

<div ref="chartEl" style="height:200px;width:200px;"><div>


// script setup
import useEChart from "@/landao/hooks"
//  provide a element
const chartEl = ref(null)

const {
    setOption,
    showLoading,
} = useChart(chartEl)

onMounted(() => {
    onMounted(() => {
    nextTick(() => {
        // turn on chart loading ~
        showLoading()
        // setOption
        setOption({
            /* set data ... */
        })
    })
})
}),
```

## 🛠️ Argument

| Name    | Description       | Type                  | required |
| ------- | ----------------- | --------------------- | -------- |
| elRef   | echart dom        | `Ref<HTMLDivElement>` | `true`     |
| Options | see options below | `OptionsType`         | `false`    |

### OptionsType
| Name          | Description               | Type                                               | required | Default                  |
| ------------- | ------------------------- | -------------------------------------------------- | -------- | ------------------------ |
| render        | echart render mode        | `RenderType.SVGRenderer/RenderType.CanvasRenderer` | `false`  | `RenderType.SVGRenderer` |
| autoChartSize | watch chart size changes  | `boolean`                                          | `false`  | `false`                    |
| animation     | Define transition effects | `AnimationType`                                    | `false`  | `{}`                       |
| theme         | echart theme              | `ThemeType.Light/ThemeType.Dark/ThemeType.Default` | `false`  | `ThemeType.Default`        |

### AnimationType
| Name   | Description                                                 | Type    | required | Default |
| ------ | ----------------------------------------------------------- | ------- | -------- | ------- |
| enable | set to false to prevent the transition effects from showing | `boolean` | `false`   |         |
| styles | styles object                                               | `Object`  | `false`   |         |