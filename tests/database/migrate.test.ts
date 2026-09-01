import { describe, expect, it } from 'vitest';

import { parseMigrationCommand } from '../../src/database/migrate.js';

describe('parseMigrationCommand', () => {
  it.each([
    [undefined, 'up'],
    ['up', 'up'],
    ['down', 'down'],
    ['status', 'status'],
  ] as const)('parses %s as %s', (input, expected) => {
    expect(parseMigrationCommand(input)).toBe(expected);
  });

  it('rejects unsupported commands', () => {
    expect(() => parseMigrationCommand('reset')).toThrow(
      'Unsupported migration command "reset". Expected one of: up, down, status.',
    );
  });
});
