import { describe, it, expect } from 'vitest';
import { get_listen_params } from './listen.js';

describe('get_listen_params', () => {
  it('single', () => {
    const modifiers = ['preventDefault'];
    const { add_modifiers, option } = get_listen_params(modifiers, () => {});
    expect(add_modifiers).toBe('(handler) => prevent_default(handler)');
    expect(option).toEqual({});
  });
  it('multiple', () => {
    const modifiers = ['preventDefault', 'stopPropagation'];
    const { add_modifiers, option } = get_listen_params(modifiers, () => {});
    expect(add_modifiers).toBe(
      '(handler) => prevent_default(stop_propagation(handler))',
    );
    expect(option).toEqual({});
  });
  it('config', () => {
    const modifiers = ['passive'];
    const { add_modifiers, option } = get_listen_params(modifiers, () => {});
    expect(add_modifiers).toBe('(handler) => handler');
    expect(option).toEqual({ passive: true });
  });
  it('mix', () => {
    const modifiers = ['preventDefault', 'passive'];
    const { add_modifiers, option } = get_listen_params(modifiers, () => {});
    expect(add_modifiers).toBe('(handler) => prevent_default(handler)');
    expect(option).toEqual({ passive: true });
  });
});
