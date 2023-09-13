import { h } from "vue"

const renderIcon = (icon: string) => {
  return () => h("i", { class: icon })
}

export { renderIcon }
