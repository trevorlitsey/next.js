/* eslint-env jest */

import webdriver from 'next-webdriver'
import { join } from 'path'
import {
  nextBuild,
  nextStart,
  findPort,
  launchApp,
  killApp,
} from 'next-test-utils'

let app
let appPort
const appDir = join(__dirname, '../')

function runTests() {
  it('should keep trailing slash on when navigating to index page with hash', async () => {
    const browser = await webdriver(appPort, '/page1')

    await browser.elementByCss('a').click()

    expect(await browser.elementByCss('#page-text').text()).toBe(
      'hello from index'
    )
    expect(await browser.eval('window.location.href')).toContain('/#link-1')
  })
}

describe('Router index hash route handling', () => {
  describe('dev mode', () => {
    beforeAll(async () => {
      appPort = await findPort()
      app = await launchApp(appDir, appPort, {
        env: { __NEXT_TRAILING_SLASH: true },
      })
    })
    afterAll(() => killApp(app))

    runTests()
  })

  describe('production mode', () => {
    beforeAll(async () => {
      await nextBuild(appDir)
      appPort = await findPort()
      app = await nextStart(appDir, appPort, {
        env: { __NEXT_TRAILING_SLASH: true },
      })
    })
    afterAll(() => killApp(app))

    runTests()
  })
})
