const { Android, Ios } = require("uri-scheme")
const { execSync } = require("child_process")
const { exit, exitCode } = require("process")
const dashify = require("dashify")
const template = require("colon-template")

const pages = require("./pages.js")
const variables = require("./variables")

DEFAULT_PLATFORM = "ios"
DEFAULT_ENV = "staging"

const createVariables = (variables, args) => {
  const customVariables = args
    .filter(e => e.includes(":"))
    .map(e => e.split(":"))
    .reduce((acc, [x, y]) => {
      acc[x] = y
      return acc
    }, {})

  return { ...variables, ...customVariables }
}
const openUri = (uri, platform) => {
  if (platform === "android") {
    console.log(`Open "${uri}" on Android`)
    Android.openAsync({ uri })
  } else if (platform === "ios") {
    console.log(`Open "${uri}" on iOS`)
    Ios.openAsync({ uri })
  } else {
    console.log(`Open "${uri}" on Web`)
    execSync(`open ${uri}`)
  }
}

const removeTrailingSlash = path => path.replace(/^\//, "")

const baseUrls = {
  production: "https://artsy.net",
  prod: "https://artsy.net",
  staging: "https://staging.artsy.net",
  local: "http://localhost:3000",
}

const getPath = (page, defaults) => {
  const templatePath = removeTrailingSlash(pages[dashify(page)] || page)

  return template(templatePath, defaults)
}

const getURL = path => {
  if (path.includes("://")) return path

  return `${baseUrls[env]}/${path}`
}

const findAndRemove = (input, funk) => {
  const index = input.findIndex(funk)
  const element = input[index]
  if (index > -1) {
    input.splice(index, 1)
  }

  return element
}

const args = process.argv.slice(2)

if (args[0] === "list") {
  console.log(
    Object.entries(pages)
      .sort()
      .map(([x, y]) => `${x} -> ${y}`)
      .join("\n  "),
  )
  exit()
}

if (!args[0] || args[0] === "help") {
  console.log(`Usage:`)
  console.log(` artsy-open path [android|ios|web] [staging|prod|local] artistID:banksy`)
  console.log(` artsy-open list\n`)
  console.log(`Examples:`)
  console.log(` artsy-open artwork`)
  console.log(` artsy-open artwork android prod`)
  console.log(` artsy-open artwork web local artistID:andy-warhol`)

  exit()
}

const platform = findAndRemove(args, e => ["android", "ios", "web"].includes(e)) || DEFAULT_PLATFORM
const env =
  findAndRemove(args, e => ["prod", "production", "staging", "local"].includes(e)) || DEFAULT_ENV

page = args[0]

const path = getPath(page, createVariables(variables, args))
const uri = getURL(path)

openUri(uri, platform)
