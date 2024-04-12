import { Application } from 'pixi.js'

export class Designer {
  public app: Application

  constructor() {
    this.app = new Application()
  }

  public async init(container: HTMLElement) {
    await this.app.init()
    container.appendChild(this.app.canvas)
  }

  public destroy() {
    this.app.destroy({ removeView: true })
  }

  public clearCanvas() {
    this.app.stage.removeChildren()
  }
}
