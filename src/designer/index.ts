import { Application, FederatedPointerEvent, Sprite } from 'pixi.js'

let dragTarget: Sprite | null

export class Designer {
  public app: Application

  constructor() {
    this.app = new Application()
  }

  public async init(container: HTMLElement) {
    await this.app.init()
    container.appendChild(this.app.canvas)
    this.app.stage.eventMode = 'static'
    this.app.stage.hitArea = this.app.screen // 设置点击区域为整个画布（screen 为 Rectangle 类型）
    // this.app.stage.on('pointerdown', this.onDragStart, this)
    this.app.stage.on('pointerup', this.onDragEnd, this)
    this.app.stage.on('pointeroutside', this.onDragEnd, this)
  }

  public destroy() {
    this.app.destroy({ removeView: true })
  }

  public clearCanvas() {
    this.app.stage.removeChildren()
  }

  public onDragMove(event: FederatedPointerEvent) {
    if (dragTarget) {
      // 也可以用 this.app.stage.toLocal，但要注意 this 的指向处理
      dragTarget.parent.toLocal(event.global, undefined, dragTarget.position)
    }
  }
  // 记录激活的当前拖拽元素
  public onDragStart(event: FederatedPointerEvent) {
    dragTarget = event.target as Sprite
    dragTarget.alpha = 0.5
    this.app.stage.on('pointermove', this.onDragMove)
  }

  public onDragEnd() {
    if (dragTarget) {
      this.app.stage.off('pointermove', this.onDragMove)
      dragTarget.alpha = 1
      dragTarget = null
    }
  }
}
