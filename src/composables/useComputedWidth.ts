import {elRect} from "../utils/element";
import {computed, onMounted, readonly, ref, Ref} from "vue";

export function useComputedWidth(elementID: string, parentElementID: string | number, threshold?: number) {

    const Status = {
        FULL: 'full',
        AVAILABLE: 'available',
    }

    const status = ref(Status.AVAILABLE)
    const limitReached = computed(() => status.value === Status.FULL)
    const limitNumber: Ref<number> = ref(0)

    onMounted(() => {
        const containerRow = document.getElementById(elementID)
        const parentElement = document.getElementById(elementID).parentElement

        const observer = new MutationObserver(callback)
        observer.observe(containerRow, {
            childList: true,
        })

        function callback(mutations) {

            const reducer = (acc, currValue) => {
                acc += Math.round(elRect(currValue).width)
                return acc
            }

            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    const childNodes = mutation.target.childNodes
                    const isDivNode = (node) => node.nodeName === 'DIV'
                    const childElements = Array.prototype.filter.call(childNodes, isDivNode)
                    const currentUsedWith = childElements.reduce(reducer, 0)
                    const parentContainer = document.getElementById(parentElement.id)
                    const parentContainerWidth = elRect(parentContainer).width
                    const maxAllowedWidth = Math.round(parentContainerWidth - threshold)
                    if (currentUsedWith > maxAllowedWidth) {
                        status.value = Status.FULL
                        limitNumber.value = childElements.length
                    } else {
                        status.value = Status.AVAILABLE
                    }
                }
            }
        }
    })

    return {
        status: readonly(status),
        limitReached: readonly(limitReached),
        limitNumber: readonly(limitNumber),
    }
}