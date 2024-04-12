import { useEffect, useState, useRef } from 'react'
import { Assets, Sprite } from 'pixi.js'
import { Designer } from './designer'
import './App.css'

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
      const app = designer.current?.app!
      // 绘制一个 Sprite
      Assets.load('vite.svg').then((texture) => {
        const bunny = new Sprite(texture)
        bunny.x = app.renderer.width / 2
        bunny.y = app.renderer.height / 2
        bunny.anchor.x = 0.5
        bunny.anchor.y = 0.5

        app.stage.addChild(bunny)
        app.ticker.add(() => {
          bunny.rotation += 0.01
        })
      })
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
    </>
  )
}

export default App
