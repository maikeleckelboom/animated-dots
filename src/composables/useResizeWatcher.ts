import {useMediaQuery} from "@vueuse/core";
import {onMounted} from "vue";
import {debounce} from "lodash";

const isTinyScreen = useMediaQuery('(min-width: 0px)')
const isMobileScreen = useMediaQuery('(min-width: 360px)')
const isSmartphoneScreen = useMediaQuery('(min-width: 480px)')
const isPhabletScreen = useMediaQuery('(min-width: 768px)')
const isTabletScreen = useMediaQuery('(min-width: 960px)')
const isLaptopScreen = useMediaQuery('(min-width: 1024px)')
const isDesktopScreen = useMediaQuery('(min-width: 1200px)')

onMounted(() => {
    (function observeWindowResize() {
        const DEBOUNCED_RESIZE_TIME = 0
        const paginationContainer = document.getElementById('data-table-pagination-content')
        const observer = new ResizeObserver(() => debounce(onresizeCallback, DEBOUNCED_RESIZE_TIME)())
        const onresizeCallback = () => {
            const {maxLinks, width, height, ratio} = getPaginationContainerRect(paginationContainer)
        }
        observer.observe(paginationContainer)
    })()
})


const getPaginationContainerRect = (containerElement) => {
    const paginationContainerWidth = containerElement.offsetWidth
    const paginationContainerHeight = containerElement.offsetHeight
    const paginationContainerRatio = paginationContainerWidth / paginationContainerHeight
    const paginationLinksLimit = Boolean(paginationContainerRatio > 1)
        ? Math.floor(paginationContainerWidth / 100)
        : Math.floor(paginationContainerHeight / 100)
    return {
        maxLinks: paginationLinksLimit,
        width: paginationContainerWidth,
        height: paginationContainerHeight,
        ratio: paginationContainerRatio
    }
}
