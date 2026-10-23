import { expect, test } from '@playwright/test'

import { launchTestApp } from './fixtures'

test('a resized panel keeps its width after a relaunch', async () => {
  const first = await launchTestApp()
  let second: Awaited<ReturnType<typeof launchTestApp>> | undefined
  try {
    const page = await first.app.firstWindow()
    const panel = page.locator('#window-left-panel')
    await expect(panel).toBeVisible()

    // Hover before measuring: it waits for the handle to settle, so both boxes
    // describe the final layout instead of a mid-startup frame.
    const handle = page.locator('[aria-label="Resize left panel"]')
    await handle.hover()
    const before = (await panel.boundingBox())!.width
    const box = (await handle.boundingBox())!
    const y = box.y + box.height / 2
    const x = box.x + box.width / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 50, y, { steps: 8 })
    // Let the last pointer position settle before releasing: a busy renderer can
    // coalesce moves into one frame, and the release then commits a stale width.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              resolve()
            })
          })
        }),
    )
    await page.mouse.up()

    await expect.poll(async () => (await panel.boundingBox())!.width).toBeGreaterThan(before + 30)
    const resized = (await panel.boundingBox())!.width

    await first.dispose({ keepProfile: true })
    second = await launchTestApp({ profile: first.profile })
    const relaunched = await second.app.firstWindow()
    const restored = relaunched.locator('#window-left-panel')
    await expect(restored).toBeVisible()
    await expect
      .poll(async () => Math.abs((await restored.boundingBox())!.width - resized))
      .toBeLessThan(4)
  } finally {
    try {
      await second?.dispose()
    } finally {
      await first.dispose()
    }
  }
})
