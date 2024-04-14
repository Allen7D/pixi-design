import * as PIXI from 'pixi.js'
import { Designer } from '../index'

class Rect extends PIXI.Graphics {
  constructor(x: number, y: number, width: number, height: number) {
    super()
    this.rect(x, y, width, height)
    this.fill('#FFFFFF')
  }
}

export class RectTool {
  private app: PIXI.Application
  private startPoint: PIXI.Point | null = null
  private target: Rect | null = null

  constructor(private designer: Designer) {
    this.app = designer.app

    this.app.stage.on('pointerdown', this.onPointerDown, this)
    this.app.stage.on('pointerup', this.onPointerUp, this)
    this.app.stage.on('pointeroutside', this.onPointerUp, this)
  }

  private onPointerMove(event: PIXI.FederatedPointerEvent) {
    if (!this.startPoint) {
      return
    }
    const endPoint = event.global
    const width = endPoint.x - this.startPoint.x
    const height = endPoint.y - this.startPoint.y

    this.target?.setSize(width * 2, height * 2)
  }

  private onPointerDown(event: PIXI.FederatedPointerEvent) {
    if (!event.shiftKey) return
    this.target = new Rect(0, 0, 10, 10)
    this.target.pivot.set(this.target.width / 2, this.target.height / 2)
    this.startPoint = event.getLocalPosition(this.app.stage) as PIXI.Point
    this.target.position.set(this.startPoint.x, this.startPoint.y)

    this.target.eventMode = 'static'
    this.target.cursor = 'pointer'

    this.target.on('pointerdown', this.designer.onDragStart, this.designer)

    this.app.stage.addChild(this.target)
    this.app.stage.on('pointermove', this.onPointerMove, this)
  }

  private onPointerUp() {
    if (!this.startPoint) {
      return
    }
    this.app.stage.off('pointermove', this.onPointerMove)
    this.startPoint = null
  }
}
