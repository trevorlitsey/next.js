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

jest.setTimeout(1000 * 60 * 2)

function runTrailingSlashTests() {
  it('should keep trailing slash on when navigating to index page with hash when __NEXT_TRAILING_SLASH is true', async () => {
    const browser = await webdriver(appPort, '/page1')

    await browser.elementByCss('a').click()

    expect(await browser.waitForElementByCss('#page-text').text()).toBe(
      'hello from index'
    )

    expect(await browser.eval('window.location.href')).toContain(
      '/#hash-content'
    )
  })
}

describe('Router index hash route handling with trailing slash', () => {
  describe('dev mode', () => {
    beforeAll(async () => {
      appPort = await findPort()
      app = await launchApp(appDir, appPort, {
        env: {
          __NEXT_TRAILING_SLASH: false,
          __NEXT_ROUTER_BASEPATH: 'some/base/path',
          FOO: 'bar',
        },
      })
    })
    afterAll(() => killApp(app))

    runTrailingSlashTests()
  })

  // describe('production mode', () => {
  //   beforeAll(async () => {
  //     await nextBuild(appDir)
  //     appPort = await findPort()
  //     app = await nextStart(appDir, appPort, {
  //       env: {
  //         __NEXT_TRAILING_SLASH: false,
  //         __NEXT_ROUTER_BASEPATH: 'some/base/path',
  //       },
  //     })
  //   })
  //   afterAll(() => killApp(app))

  //   runTrailingSlashTests()
  // })
})

// function runNonTrailingSlashTests() {
//   it('should keep trailing slash on when navigating to index page with hash when __NEXT_TRAILING_SLASH is false', async () => {
//     const browser = await webdriver(appPort, '/page1')

//     await browser.elementByCss('a').click()

//     expect(await browser.waitForElementByCss('#page-text').text()).toBe(
//       'hello from index'
//     )
//     // http://localhost:{port}#hash
//     expect(await browser.eval('window.location.href')).toContain(
//       /\d+#hash-content/
//     )
//   })
// }

// describe('Router index hash route handling without trailing slash', () => {
//   describe('dev mode', () => {
//     beforeAll(async () => {
//       appPort = await findPort()
//       app = await launchApp(appDir, appPort, {
//         env: { __NEXT_TRAILING_SLASH: false },
//       })
//     })
//     afterAll(() => killApp(app))

//     runNonTrailingSlashTests()
//   })

//   describe('production mode', () => {
//     beforeAll(async () => {
//       await nextBuild(appDir)
//       appPort = await findPort()
//       app = await nextStart(appDir, appPort, {
//         env: { __NEXT_TRAILING_SLASH: false },
//       })
//     })
//     afterAll(() => killApp(app))

//     runNonTrailingSlashTests()
//   })
// })
