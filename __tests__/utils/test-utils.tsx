import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Add custom render function if needed for providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data helpers
export const createMockMovie = (overrides?: Partial<Movie>): Movie => ({
  id: 'test-movie-id',
  title: 'Test Movie',
  director: 'Test Director',
  genre: 'Test Genre',
  rating: '8.5',
  description: 'Test description',
  coverColor: '#000000',
  coverUrl: '/test-cover.jpg',
  summary: 'Test summary',
  createdAt: new Date('2024-01-01'),
  ...overrides,
})

export const createMockMovies = (count: number): Movie[] => {
  return Array.from({ length: count }, (_, i) => 
    createMockMovie({
      id: `movie-${i}`,
      title: `Movie ${i + 1}`,
      director: `Director ${i + 1}`,
    })
  )
}