export const validate2And3TypeArrayRequiresItems = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const { type, items } = schemaObj || {}
        if(type === "array" && typeof items === "undefined") {
          acc.push({
            message: "Schemas with 'type: array', require a sibling 'items: ' field",
            path: node.path,
            level: "error",
          })
        } else if(type === "array" && (typeof items !== "object" || Array.isArray(items))) {
          acc.push({
            message: "`items` must be an object",
            path: [...node.path, "items"],
            level: "error",
          })
        }
        return acc
      }, [])
    })
}

export const validate2And3DefaultValuesAreWithinEnum = () => (system) => {
  return system.validateSelectors
    .allSchemas()
    .then(nodes => {
      return nodes.reduce((acc, node) => {
        const schemaObj = node.node
        const { type, items } = schemaObj || {}
        const enumeration = schemaObj.enum
        const defaultValue = schemaObj.default
        if (type === "string" && typeof items === "undefined" && enumeration != null && defaultValue != null) {
          if (!enumeration.includes(defaultValue)) {
            acc.push({
              message: "`default` values should be part of the `enum`",
              path: node.path,
              level: "error",
            })
          }
        } 
        return acc
      }, [])
    })
}
