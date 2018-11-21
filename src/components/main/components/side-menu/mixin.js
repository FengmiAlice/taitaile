// import CommonIcon from '_c/common-icon'
export default {
  // components: {
  //   CommonIcon
  // },
  methods: {
      showTitle (item) {
          return  ((item.meta && item.meta.title) || item.name)
      },
    showChildren (item) {
      return item.children && (item.children.length > 0 || (item.meta && item.meta.showAlways))
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
    }
  }
}
