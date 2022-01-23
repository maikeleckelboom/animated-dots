/**
 * Gets the containerText of the slot children.
 * @param children
 */
export const getSlotChildrenText = (children) => children.map(node => {
    if (!node.children || typeof node.children === 'string') return node.children || ''
    else if (Array.isArray(node.children)) return getSlotChildrenText(node.children)
    else if (node.children.default) return getSlotChildrenText(node.children.default())
})


/**
 * Gets the containerText of the slot children.
 * WARNING: does not work with slot props!
 * @param slots
 * @param name
 */
export const getSlotRowText = (slots, name) => {
    if (slots?.[name]) {
        const slot = slots?.[name]()
        const slotInnerText = getSlotChildrenText(slot)
        return slotInnerText.join('>><<').split('>><<')
    }
}

// const slots = useSlots()
//
// const getSlotText = (slots, name) =>
//     slots?.[name] ? getSlotChildrenText(slots.columns()) : ''
//
// onMounted(() => {
//   const slotColumnsText = getSlotText(slots, 'columns')
//   console.log(slotColumnsText)
// })