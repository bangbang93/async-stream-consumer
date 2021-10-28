import {Sema} from 'async-sema'
import {Readable} from 'stream'

type Consumer<T> = (item: T) => Promise<void>

export function asyncStreamConsumer<T>(stream: Readable, nr: number, fn: Consumer<T>): Sema {
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

  return sema
}
