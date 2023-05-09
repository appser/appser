import { pathToColumn } from 'core/db/helpers/pathToColumn'

test('should work', () => {
  expect(pathToColumn('a')).toBe('a')
  expect(pathToColumn('a.b')).toBe('a->>b')
  expect(pathToColumn('a.b.c.d')).toBe('a->b->c->>d')
  expect(pathToColumn('foo.bar.baz.qux')).toBe('foo->bar->baz->>qux')
})
