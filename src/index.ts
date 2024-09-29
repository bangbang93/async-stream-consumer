import {Sema} from 'async-sema'
import {Readable} from 'stream'
import {once} from 'events'

type Consumer<T> = (item: T) => Promise<void>

export async function asyncStreamConsumer<T>(stream: Readable, nr: number, fn: Consumer<T>): Promise<void> {
  const sema = new Sema(nr, {
    pauseFn: () => stream.pause(),
    resumeFn: () => stream.resume(),
    capacity: nr,
  })
  stream.on('data', async (item) => {
    const token = await sema.acquire()
    try {
      await fn(item)
    } finally {
      sema.release(token)
    }
  })

  async function onEnd() {
    await once(stream, 'end')
    await sema.drain()
  }

  async function onError() {
    throw await once(stream, 'error')
  }

  await Promise.race([onEnd(), onError()])
}
