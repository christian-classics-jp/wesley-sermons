#!/usr/bin/env node
/**
 * Create jp.md from both.md
 */
const fs = require('fs')
const { join } = require('path')

const target = process.argv[2]
if (!target) {
  console.log(`
Usage: build.js <target dir>
`)
  process.exit()
}

build(target)

function build (target) {
  const srcPath = join(target, 'both.md')
  const destPath = join(target, 'jp.md')

  if (!fs.existsSync(srcPath)) {
    console.error(`${srcPath} not found`)
    return
  }
  let text = fs.readFileSync(srcPath).toString()
  let texts = text.split('\n').map(str => str.trim())
  if (texts.length < 3) {
    console.log(`Content of ${srcPath} is too short`)
    return
  }
  let jaSentences = texts.filter(
    // 先頭が英語の行を削除
    (text, i) => !/^[a-zA-Z0-9"“—]/.test(text)
  ).map(
    (text) => {
      if (text === '') {
        return '\n\n'
      }
      if (/^[1-9+*->#]/.test(text)) {
        return text + '\n'
      }
      return text
    }
  )
  let ja = jaSentences.join('')
  fs.writeFileSync(destPath, ja)
}
