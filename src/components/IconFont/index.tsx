interface IconFontProps {
  name: string
  onClick?: () => void
}

const IconFont = (props: IconFontProps) => {
  const { name, onClick } = props
  return (
    <span onClick={onClick}>
      <i className={`iconfont icon-${name}`} />
    </span>
  )
}

export default IconFont
