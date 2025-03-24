
# Async Stream Consumer

This project provides a utility function to consume asynchronous streams with concurrency control.

## Features

- Consume asynchronous streams with a specified concurrency level.
- Supports both `Readable` streams and `AsyncIterable` objects.
- Uses the `async-sema` library for concurrency control.

## Usage

### asyncStreamConsumer

The `asyncStreamConsumer` function consumes items from a stream or an async iterable with a specified concurrency level.

#### Parameters

- `input` (`Readable | AsyncIterable<T>`): The input stream or async iterable to consume.
- `nr` (`number`): The number of concurrent operations.
- `fn` (`Consumer<T>`): The function to process each item.

#### Example

```typescript
import { asyncStreamConsumer } from './src/index';
import { Readable } from 'stream';

const stream = Readable.from([1, 2, 3, 4, 5]);

async function processItem(item: number): Promise<void> {
  console.log(`Processing item: ${item}`);
}

asyncStreamConsumer(stream, 2, processItem)
  .then(() => console.log('All items processed'))
  .catch((err) => console.error('Error processing items:', err));
```
