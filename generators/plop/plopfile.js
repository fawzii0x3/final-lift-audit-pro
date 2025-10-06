function pascalCase(str) {
  return str
    .split(/[\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
}
export default function (plop) {
  plop.setHelper("storeNameCC", (text) => {
    if (!text || typeof text !== "string") return "";
    return pascalCase(text) + "Store";
  });
  plop.setGenerator("zustand-store", {
    description: "Generate a new Zustand store",
    prompts: [
      {
        type: "input",
        name: "storeName",
        message:
          "What should the store be called? (e.g., user, cart, settings)",
        validate: (value) => {
          if (!value) return "Store name is required";
          if (!/^[a-zA-Z-]+$/.test(value))
            return "Store name should only contain letters and hyphens";
          return true;
        },
      },
      {
        type: "input",
        name: "stateProperties",
        message:
          'List the state properties (comma separated, e.g., "count, name, isActive")',
        filter: (input) => {
          return input
            .split(",")
            .map((item) => item.trim().replace(/[^a-zA-Z0-9]/g, ""))
            .filter((item) => item);
        },
        validate: (input) => {
          if (!input.length) return "At least one state property is required";
          return true;
        },
      },
      {
        type: "confirm",
        name: "needsPersist",
        message: "Should this store be persisted?",
        default: true,
      },
      {
        type: "input",
        name: "directory",
        message: "Which subdirectory to create it in? (relative to src/)",
        default: "stores",
        validate: (value) => {
          if (!value) return "Directory is required";
          return true;
        },
      },
    ],
    actions: (_) => {
      return [
        {
          type: "add",
          path: "../../src/{{directory}}/{{camelCase storeName}}-store.ts",
          templateFile: "./store.hbs",
        },
      ];
    },
  });
}
