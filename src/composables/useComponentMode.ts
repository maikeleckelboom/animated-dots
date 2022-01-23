import {readonly, Ref, ref} from "vue";
import {useResizeObserver} from "@vueuse/core";

interface componentMode {
    name: string
    min: number
    max: number
}

type Modes = Ref<Array<componentMode>>

const modes: Modes = ref([
    {
        name: 'minimal',
        min: 200,
        max: 400
    },
    {
        name: 'normal',
        min: 400,
        max: 600
    },
    {
        name: 'full',
        min: 600,
        max: Infinity
    }
]);

export function useComponentMode(element: Ref<HTMLElement>) {

    const mode = ref<componentMode>(modes.value[0])

    const observer = useResizeObserver(element, (entries) => {
        const [entry] = entries
        const {width} = entry.contentRect
        const currentMode = modes.value.find(mode => mode.min <= width && mode.max >= width)
        mode.value = Boolean(currentMode)
            ? currentMode
            : modes.value.find(mode => mode.name === 'minimal')
    })

    return {
        observer: readonly(observer),
        mode: readonly(mode),
        modes
    }
}