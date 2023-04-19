const path = require("path")

module.exports = {
  core: {
    builder: "@storybook/builder-vite",
    disableTelemetry: true, 
  },
  "stories": [
    "../packages/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-storysource",
    "storybook-dark-mode"
  ],
}
