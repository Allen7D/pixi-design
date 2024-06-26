import { useEffect, useState, useRef } from 'react'
import { Assets, Sprite, Graphics } from 'pixi.js'
import { Designer } from './designer'
import IconFont from '@/components/IconFont'
import './App.css'

// 绘制一个 Sprite
function createSprite(designer: Designer) {
  const app = designer.app
  Assets.load('vite.svg').then((texture) => {
    const sprite = new Sprite(texture)
    sprite.position.set(
      app.renderer.width * Math.random(),
      app.renderer.height * Math.random(),
    )
    sprite.anchor.set(0.5) // 设置锚点为中心

    sprite.eventMode = 'static'
    sprite.cursor = 'pointer'

    sprite.on('pointerdown', designer.onDragStart, designer)

    app.stage.addChild(sprite)
    app.ticker.add(() => {
      sprite.rotation += 0.01
    })
  })
}

function createRect(designer: Designer) {
  const rect = new Graphics().rect(0, 0, 100, 100).fill('red')
  // 先设置 pivot（确定中心点），再设置 position
  rect.pivot.set(rect.width / 2, rect.height / 2)
  rect.position.set(100, 100)
  rect.eventMode = 'static'
  rect.cursor = 'pointer'

  rect.on('pointerdown', designer.onDragStart, designer)
  console.log('rect', rect)
  designer.app.stage.addChild(rect)
}

function App() {
  const designer = useRef<Designer | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const container: HTMLElement = document.querySelector('.container')!
    designer.current = new Designer()
    designer.current.init(container).then(() => {
      console.log('Pixi 应用初始化完成')
      setIsReady(true)
    })

    return () => {
      designer.current?.destroy()
      setIsReady(false)
    }
  }, [])

  useEffect(() => {
    if (isReady) {
      console.log('createSprite', isReady)
      createSprite(designer.current!)
      createRect(designer.current!)
    }
  }, [isReady])

  return (
    <>
      <h1>Pixi.js + Vite + React</h1>
      <div className="header">
        <IconFont
          name="rectangle"
          onClick={() => {
            console.log('rectangle')
          }}
        />
        <IconFont name="circle" />
        <IconFont name="triangle" />
        <IconFont name="text" />
      </div>
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
          createSprite(designer.current!)
        }}
      >
        绘制 Sprite
      </button>
    </>
  )
}

export default App
