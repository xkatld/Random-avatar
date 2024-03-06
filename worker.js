// 自动导入 images 目录下的所有 webp 文件
const modules = {}
const images = []

// 使用 globbing patterns 匹配所有 .webp 文件
const imageModules = Object.fromEntries(
  Object.entries(
    Object.fromEntries(
      import.meta.glob('/images/*.{webp,png}', { eager: true })
    )
  ).map(([path, module]) => [
    path.replace(/^\/images\/.+\/(.+)\.\w+$/, '$1'),
    module.default
  ])
)

// 将所有图片添加到 images 数组中
for (let [, image] of Object.entries(imageModules)) {
  images.push(image)
}

// Workers 入口函数
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

// 处理请求并返回随机 webp 图片
async function handleRequest(request) {
  // 获取随机 webp 图片
  const randomImage = images[Math.floor(Math.random() * images.length)]

  // 设置响应头
  const headers = {
    'Content-Type': 'image/webp', // 指定 webp 类型
    'Cache-Control': 'max-age=600' // 10分钟缓存
  }

  // 返回随机 webp 图片作为响应体
  return new Response(randomImage.body, { headers })
}