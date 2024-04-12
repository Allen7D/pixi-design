import { useEffect, useState, useRef } from 'react'
import { Application, Assets, Sprite } from 'pixi.js'
import { Designer } from './designer'
import './App.css'

// 绘制一个 Sprite
function createSprite(app: Application) {
  Assets.load('vite.svg').then((texture) => {
    const sprite = new Sprite(texture)
    sprite.x = app.renderer.width * Math.random()
    sprite.y = app.renderer.height * Math.random()
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.5

    sprite.interactive = true
    let dragging = false

    // 当鼠标按下时开始拖拽
    sprite.on('pointerdown', () => {
      sprite.alpha = 0.5
      dragging = true
    })

    // 当鼠标抬起时停止拖拽
    sprite.on('pointerup', () => {
      sprite.alpha = 1
      dragging = false
    })

    // 当鼠标在精灵外部抬起时也停止拖拽
    sprite.on('pointerupoutside', () => {
      sprite.alpha = 1
      dragging = false
    })

    // 当鼠标移动时更新精灵的位置
    sprite.on('pointermove', (event) => {
      if (dragging) {
        let newPosition = event.getLocalPosition(sprite.parent)
        sprite.x = newPosition.x
        sprite.y = newPosition.y
      }
    })

    app.stage.addChild(sprite)
    app.ticker.add(() => {
      sprite.rotation += 0.01
    })
  })
}

function App() {
  const designer = useRef<Designer | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const container: HTMLElement = document.querySelector('.container')!
    designer.current = new Designer()
    designer.current.init(container).then(() => {
      setIsReady(true)
    })

    return () => {
      designer.current?.destroy()
      setIsReady(false)
    }
  }, [])

  useEffect(() => {
    if (isReady) {
      createSprite(designer.current?.app!)
    }
  }, [isReady])

  return (
    <>
      <h1>Pixi.js + Vite + React</h1>
      <div className="container"></div>
      <button
        onClick={() => {
          designer.current?.destroy()
        }}
      >
        销毁 Pixi 应用
      </button>
      <button
        onClick={() => {
          designer.current?.clearCanvas()
        }}
      >
        清空 Pixi 画布
      </button>
      <button
        onClick={() => {
          createSprite(designer.current?.app!)
        }}
      >
        绘制 Sprite
      </button>
    </>
  )
}

export default App
